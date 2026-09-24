import ast
import os
import pickle
import re
from datetime import datetime

import joblib
import numpy as np
import pandas as pd

from services.preprocessing import get_processed_traffic_data


# ---------------------------------------------------------
# PATHS
# ---------------------------------------------------------

SERVICES_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SERVICES_DIR)
PROJECT_ROOT = os.path.dirname(os.path.dirname(BASE_DIR))

TRAINED_MODELS_DIR = os.path.join(
    BASE_DIR, "models", "trained_models"
)

PKL_MODEL_PATH = os.path.join(
    TRAINED_MODELS_DIR,
    "traffic_congestion_model.pkl"
)
PKL_FEATURES_PATH = os.path.join(
    TRAINED_MODELS_DIR,
    "traffic_feature_names.pkl"
)

_cached_model_data = None

CLASS_INDEX = {
    "Low": 0.125,
    "Moderate": 0.375,
    "High": 0.625,
    "Very High": 0.875,
}

# Trained-model feature names -> CSV / API aliases.
# Exact trained names are also accepted as-is.
FEATURE_ALIASES = {
    "Vehicle Count": [
        "vehicle_count",
        "vehicleCount",
    ],
    "Avg Speed (km/h)": [
        "avg_speed",
        "avg_speed_km_h",
        "averageSpeed",
        "avgSpeed",
    ],
    "Vehicle Density (%)": [
        "vehicle_density",
        "vehicleDensity",
        "density",
    ],
    "Saturation Flow Rate(veh/hr/lane)": [
        "saturation_flow_rate",
        "saturation_flow_rate_veh_hr_lane",
        "saturationFlowRate",
    ],
    "Volume to  Saturation Lane Traffic ratio(%)": [
        "Volume to Saturation Lane Traffic ratio(%)",
        "volume_to_saturation_ratio",
        "volume_to_saturation_lane_traffic_ratio",
        "volumeToSaturationRatio",
    ],
    "FreeFlowSpeed (km/h)": [
        "free_flow_speed",
        "free_flow_speed_km_h",
        "freeflowspeed_km_h",
        "freeFlowSpeed",
    ],
    "TSR": ["tsr"],
    "VLSR": ["vlsr"],
    "Speed Factor": ["speed_factor", "speedFactor"],
    "CI": ["ci", "congestion_index", "congestionIndex"],
    "Hour": ["hour"],
    "Minute": ["minute"],
    "Time_Minutes": ["time_minutes", "timeMinutes"],
    "IR_Lane_1": ["ir_lane_1", "irLane1"],
    "IR_Lane_2": ["ir_lane_2", "irLane2"],
    "IR_Lane_3": ["ir_lane_3", "irLane3"],
    "IR_Lane_4": ["ir_lane_4", "irLane4"],
}


def _normalize_key(name):
    return re.sub(r"[^a-z0-9]+", "_", str(name).strip().lower()).strip("_")


def _lookup_value(source, feature_name):
    if source is None:
        return None

    keys_to_try = [feature_name] + FEATURE_ALIASES.get(feature_name, [])
    normalized_source = {
        _normalize_key(key): value
        for key, value in source.items()
        if value is not None
    }

    for key in keys_to_try:
        if key in source and source[key] is not None:
            return source[key]
        normalized = _normalize_key(key)
        if normalized in normalized_source:
            return normalized_source[normalized]

    return None


def _to_float(value, default=0.0):
    try:
        if value is None or (isinstance(value, float) and np.isnan(value)):
            return float(default)
        return float(value)
    except (TypeError, ValueError):
        return float(default)


def _parse_timestamp(source):
    if source is None:
        return None

    raw = None
    for key in ("timestamp", "Timestamp", "time"):
        if key in source and source[key] is not None:
            raw = source[key]
            break

    if raw is None:
        return None

    parsed = pd.to_datetime(raw, errors="coerce")
    if pd.isna(parsed):
        try:
            parsed = datetime.strptime(str(raw).strip(), "%H:%M:%S")
        except ValueError:
            return None

    return parsed


def _parse_ir_lanes(source):
    if source is None:
        return None

    for key in (
        "irPresence",
        "ir_presence",
        "IR Presence (Lane 1-4)",
        "ir_presence_lane_1_4",
    ):
        if key not in source or source[key] is None:
            continue
        value = source[key]
        lanes = [None, None, None, None]
        if isinstance(value, dict):
            lanes = [
                value.get("lane1"),
                value.get("lane2"),
                value.get("lane3"),
                value.get("lane4"),
            ]
        elif isinstance(value, (list, tuple)):
            for index in range(min(4, len(value))):
                lanes[index] = value[index]
        else:
            try:
                parsed = ast.literal_eval(str(value).strip())
            except (ValueError, SyntaxError):
                continue
            if isinstance(parsed, (list, tuple)):
                for index in range(min(4, len(parsed))):
                    lanes[index] = parsed[index]
        return lanes

    return None


def _load_feature_names():
    if not os.path.exists(PKL_FEATURES_PATH):
        raise FileNotFoundError(
            f"Feature names file not found: {PKL_FEATURES_PATH}"
        )

    with open(PKL_FEATURES_PATH, "rb") as handle:
        feature_names = pickle.load(handle)

    if not isinstance(feature_names, (list, tuple, np.ndarray)):
        feature_names = list(feature_names)

    return [str(name) for name in feature_names]


def _load_sklearn_model():
    """
    Load the existing trained model file.
    joblib.load is tried first (more reliable across sklearn versions).
    pickle.load is used as a fallback. Nothing is trained.
    """
    if not os.path.exists(PKL_MODEL_PATH):
        raise FileNotFoundError(
            f"Trained model file not found: {PKL_MODEL_PATH}"
        )

    loader = "joblib"
    try:
        model = joblib.load(PKL_MODEL_PATH)
    except Exception:
        with open(PKL_MODEL_PATH, "rb") as handle:
            model = pickle.load(handle)
        loader = "pickle"

    if isinstance(model, dict) and "model" in model:
        model = model["model"]

    return model, loader


def load_prediction_model():
    """
    Loads the existing trained pickle model and feature names.
    Does not train, fit, or write a new model.
    """
    global _cached_model_data

    if _cached_model_data is not None:
        return _cached_model_data

    model, loader = _load_sklearn_model()
    features = _load_feature_names()

    model_name = type(model).__name__
    n_estimators = int(getattr(model, "n_estimators", 0) or 0)
    classes = [
        str(item)
        for item in getattr(model, "classes_", [])
    ]

    _cached_model_data = {
        "model": model,
        "features": features,
        "name": model_name,
        "n_estimators": n_estimators,
        "classes": classes,
        "source": PKL_MODEL_PATH,
        "loader": loader,
        "retrained": False,
    }

    return _cached_model_data


def get_congestion_level(congestion_index):
    if congestion_index <= 1:
        score = congestion_index * 100
    else:
        score = congestion_index

    if score < 25:
        return "Low"
    if score < 50:
        return "Moderate"
    if score < 75:
        return "High"
    return "Very High"


def _index_from_class(predicted_class, probabilities=None, classes=None):
    if probabilities is not None and classes:
        total = 0.0
        for label, probability in zip(classes, probabilities):
            total += CLASS_INDEX.get(str(label), 0.5) * float(probability)
        return total

    return CLASS_INDEX.get(str(predicted_class), 0.5)


def _dataset_defaults(feature_columns):
    defaults = {column: 0.0 for column in feature_columns}

    try:
        df = get_processed_traffic_data()
    except Exception:
        return defaults

    for column in feature_columns:
        series = None
        if column in df.columns:
            series = df[column]
        else:
            for alias in FEATURE_ALIASES.get(column, []):
                if alias in df.columns:
                    series = df[alias]
                    break
            if series is None:
                normalized_column = _normalize_key(column)
                for df_column in df.columns:
                    if _normalize_key(df_column) == normalized_column:
                        series = df[df_column]
                        break

        if series is not None:
            median_value = pd.to_numeric(series, errors="coerce").median()
            if pd.notna(median_value):
                defaults[column] = float(median_value)

    return defaults


def _apply_derived_features(source, values):
    parsed_time = _parse_timestamp(source)
    if parsed_time is not None:
        if _lookup_value(source, "Hour") is None:
            values["Hour"] = float(parsed_time.hour)
        if _lookup_value(source, "Minute") is None:
            values["Minute"] = float(parsed_time.minute)
        if _lookup_value(source, "Time_Minutes") is None:
            values["Time_Minutes"] = float(
                parsed_time.hour * 60 + parsed_time.minute
            )

    ir_lanes = _parse_ir_lanes(source)
    if ir_lanes is not None:
        lane_names = ["IR_Lane_1", "IR_Lane_2", "IR_Lane_3", "IR_Lane_4"]
        for index, name in enumerate(lane_names):
            if _lookup_value(source, name) is None and ir_lanes[index] is not None:
                values[name] = _to_float(ir_lanes[index], values.get(name, 0.0))

    return values


def predict_traffic(
    junction_id,
    vehicle_count,
    traffic_features=None
):
    """
    Predicts congestion using the existing trained classifier.
    """
    model_data = load_prediction_model()
    model = model_data["model"]
    feature_columns = model_data["features"]

    values = _dataset_defaults(feature_columns)

    combined = dict(traffic_features or {})
    if vehicle_count is not None and _lookup_value(combined, "Vehicle Count") is None:
        combined["Vehicle Count"] = vehicle_count

    for column in feature_columns:
        looked_up = _lookup_value(combined, column)
        if looked_up is not None:
            values[column] = _to_float(looked_up, values[column])

    values = _apply_derived_features(combined, values)

    input_data = pd.DataFrame(
        [[values[column] for column in feature_columns]],
        columns=feature_columns
    )

    predicted_class = str(model.predict(input_data)[0])

    probabilities = None
    if hasattr(model, "predict_proba"):
        probabilities = [
            float(item)
            for item in model.predict_proba(input_data)[0]
        ]

    predicted_index = _index_from_class(
        predicted_class,
        probabilities,
        model_data.get("classes")
    )
    predicted_index = max(0.0, min(predicted_index, 1.0))

    return {
        "junctionId": junction_id,
        "predictedCongestionIndex": round(predicted_index, 4),
        "predictedCongestionScore": round(predicted_index * 100, 2),
        "congestionLevel": predicted_class,
        "predictedClass": predicted_class,
        "classProbabilities": (
            {
                str(label): round(prob, 4)
                for label, prob in zip(
                    model_data.get("classes", []),
                    probabilities or []
                )
            }
            if probabilities is not None
            else None
        ),
        "featuresUsed": {
            column: round(values[column], 6)
            for column in feature_columns
        },
        "model": {
            "name": model_data["name"],
            "type": "classifier",
            "nEstimators": model_data["n_estimators"],
            "classes": model_data.get("classes", []),
            "featureCount": len(feature_columns),
            "featureOrder": feature_columns,
            "source": "traffic_congestion_model.pkl",
            "loader": model_data.get("loader"),
            "retrained": False,
        }
    }


if __name__ == "__main__":
    loaded = load_prediction_model()
    print("Loaded existing model:", loaded["name"])
    print("Loader:", loaded["loader"])
    print("Features:", loaded["features"])

    result = predict_traffic(
        junction_id="J-TEST",
        vehicle_count=180,
        traffic_features={
            "Avg Speed (km/h)": 24.7,
            "Vehicle Density (%)": 90,
            "Saturation Flow Rate(veh/hr/lane)": 1800,
            "Volume to  Saturation Lane Traffic ratio(%)": 2.5,
            "FreeFlowSpeed (km/h)": 50,
            "TSR": 0.506,
            "VLSR": 0.025,
            "Speed Factor": 0.494,
            "CI": 0.4712,
            "Hour": 8,
            "Minute": 4,
            "Time_Minutes": 484,
            "IR_Lane_1": 1,
            "IR_Lane_2": 0,
            "IR_Lane_3": 0,
            "IR_Lane_4": 0,
        }
    )
    print(result)
