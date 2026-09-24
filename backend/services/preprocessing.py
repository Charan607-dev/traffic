import ast
import os
import re
import pandas as pd
import numpy as np


# =========================================================
# PATH CONFIGURATION
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "data",
    "raw",
    "traffic_dataset.csv"
)


# =========================================================
# COLUMN NAME NORMALIZATION
# =========================================================

def normalize_column_name(column_name: str) -> str:
    """
    Converts dataset column names into a consistent format.

    Example:
        "Avg Speed (km/h)"
        ->
        "avg_speed_km_h"
    """

    column_name = str(column_name).strip().lower()

    column_name = re.sub(
        r"[^a-z0-9]+",
        "_",
        column_name
    )

    column_name = re.sub(
        r"_+",
        "_",
        column_name
    )

    return column_name.strip("_")


# =========================================================
# LOAD DATASET
# =========================================================

def load_traffic_dataset() -> pd.DataFrame:
    """
    Loads the real traffic CSV dataset.
    """

    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(
            f"Traffic dataset not found at: {DATASET_PATH}"
        )

    df = pd.read_csv(
        DATASET_PATH,
        sep="\t"
    )

    cleaned_columns = []
    for column in df.columns:
        column = str(column).replace("\n", " ").strip()
        cleaned_columns.append(column)
    df.columns = cleaned_columns

    # Normalize all column names
    df.columns = [
        normalize_column_name(column)
        for column in df.columns
    ]

    return df


# =========================================================
# PREPROCESS DATASET
# =========================================================

def preprocess_traffic_dataset(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Cleans and prepares the traffic dataset
    for machine learning.
    """

    df = df.copy()

    # -----------------------------------------------------
    # Remove completely empty rows
    # -----------------------------------------------------

    df = df.dropna(
        how="all"
    )

    # -----------------------------------------------------
    # Remove duplicate rows
    # -----------------------------------------------------

    df = df.drop_duplicates()

    # -----------------------------------------------------
    # Timestamp conversion
    # -----------------------------------------------------

    if "timestamp" in df.columns:

        parsed_timestamp = pd.to_datetime(
            df["timestamp"],
            errors="coerce"
        )

        if parsed_timestamp.notna().any():
            df["hour"] = parsed_timestamp.dt.hour
            df["minute"] = parsed_timestamp.dt.minute
            df["time_minutes"] = (
                df["hour"] * 60
                + df["minute"]
            )

    ir_source = "ir_presence_lane_1_4" if "ir_presence_lane_1_4" in df.columns else None

    if ir_source:
        def parse_ir_lanes(value):
            lanes = [0, 0, 0, 0]
            if value is None or (isinstance(value, float) and np.isnan(value)):
                return lanes
            try:
                parsed = ast.literal_eval(str(value).strip())
                if isinstance(parsed, (list, tuple)):
                    for index in range(min(4, len(parsed))):
                        lanes[index] = int(parsed[index])
            except (ValueError, SyntaxError):
                pass
            return lanes

        parsed_lanes = df[ir_source].apply(parse_ir_lanes)
        df["ir_lane_1"] = parsed_lanes.apply(lambda item: item[0])
        df["ir_lane_2"] = parsed_lanes.apply(lambda item: item[1])
        df["ir_lane_3"] = parsed_lanes.apply(lambda item: item[2])
        df["ir_lane_4"] = parsed_lanes.apply(lambda item: item[3])

    if (
        "volume_to_saturation_lane_traffic_ratio" in df.columns
        and "volume_to_saturation_ratio" not in df.columns
    ):
        df["volume_to_saturation_ratio"] = df[
            "volume_to_saturation_lane_traffic_ratio"
        ]

    if (
        "avg_speed_km_h" in df.columns
        and "avg_speed" not in df.columns
    ):
        df["avg_speed"] = df["avg_speed_km_h"]

    if (
        "freeflowspeed_km_h" in df.columns
        and "free_flow_speed_km_h" not in df.columns
    ):
        df["free_flow_speed_km_h"] = df["freeflowspeed_km_h"]

    # -----------------------------------------------------
    # Numeric columns from our REAL dataset
    # -----------------------------------------------------

    numeric_columns = [
        "vehicle_count",
        "avg_speed",
        "avg_speed_km_h",
        "vehicle_density",
        "saturation_flow_rate_veh_hr_lane",
        "volume_to_saturation_ratio",
        "volume_to_saturation_lane_traffic_ratio",
        "free_flow_speed_km_h",
        "freeflowspeed_km_h",
        "tsr",
        "vlsr",
        "speed_factor",
        "ci",
        "hour",
        "minute",
        "time_minutes",
        "ir_lane_1",
        "ir_lane_2",
        "ir_lane_3",
        "ir_lane_4",
    ]

    for column in numeric_columns:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    # -----------------------------------------------------
    # Replace infinity values
    # -----------------------------------------------------

    df = df.replace(
        [np.inf, -np.inf],
        np.nan
    )

    # -----------------------------------------------------
    # Fill numeric missing values
    # -----------------------------------------------------

    for column in numeric_columns:

        if column in df.columns:

            median_value = df[column].median()

            if pd.notna(median_value):

                df[column] = df[column].fillna(
                    median_value
                )

    # -----------------------------------------------------
    # Congestion level
    # -----------------------------------------------------

    if "congestion_level" in df.columns:

        df["congestion_level"] = (
            df["congestion_level"]
            .astype(str)
            .str.strip()
            .str.title()
        )

    # -----------------------------------------------------
    # Make sure CI stays between 0 and 1
    # -----------------------------------------------------

    if "ci" in df.columns:

        df["ci"] = df["ci"].clip(
            lower=0.0,
            upper=1.0
        )

    # -----------------------------------------------------
    # Reset index
    # -----------------------------------------------------

    df = df.reset_index(
        drop=True
    )

    return df


# =========================================================
# GET PROCESSED DATA
# =========================================================

def get_processed_traffic_data() -> pd.DataFrame:
    """
    Loads and preprocesses the real traffic dataset.
    """

    df = load_traffic_dataset()

    df = preprocess_traffic_dataset(
        df
    )

    return df


# =========================================================
# CLEAN API TRAFFIC DATA
# =========================================================

def clean_traffic_data(
    data: dict
) -> dict:
    """
    Converts frontend/API traffic data into the
    internal format used by backend services.
    """

    def get_value(
        *keys,
        default=None
    ):
        for key in keys:

            if key in data and data[key] is not None:
                return data[key]

        return default

    def to_float(value, default=0.0):
        try:
            if value is None:
                return float(default)
            return float(value)
        except (TypeError, ValueError):
            return float(default)

    vehicle_count = to_float(
        get_value("vehicleCount", "vehicle_count", default=0)
    )
    avg_speed = to_float(
        get_value(
            "averageSpeed",
            "avgSpeed",
            "avg_speed",
            "avg_speed_km_h",
            default=0
        )
    )
    vehicle_density = to_float(
        get_value(
            "density",
            "vehicleDensity",
            "vehicle_density",
            default=0
        )
    )
    congestion_index = to_float(
        get_value(
            "congestionIndex",
            "congestion_index",
            "ci",
            default=0
        )
    )
    saturation_flow_rate = to_float(
        get_value(
            "saturationFlowRate",
            "saturation_flow_rate",
            "saturation_flow_rate_veh_hr_lane",
            default=1800
        )
    )
    volume_to_saturation_ratio = to_float(
        get_value(
            "volumeToSaturationRatio",
            "volume_to_saturation_ratio",
            default=0
        )
    )
    free_flow_speed = to_float(
        get_value(
            "freeFlowSpeed",
            "free_flow_speed",
            "free_flow_speed_km_h",
            "freeflowspeed_km_h",
            default=50
        )
    )
    tsr = to_float(get_value("tsr", "TSR", default=0))
    vlsr = to_float(get_value("vlsr", "VLSR", default=0))
    speed_factor = to_float(
        get_value("speedFactor", "speed_factor", default=0)
    )

    timestamp = get_value("timestamp", "Timestamp", default=None)
    hour = get_value("hour", "Hour", default=None)
    minute = get_value("minute", "Minute", default=None)
    time_minutes = get_value(
        "timeMinutes",
        "time_minutes",
        "Time_Minutes",
        default=None
    )

    if timestamp is not None and (hour is None or minute is None):
        parsed = pd.to_datetime(timestamp, errors="coerce")
        if pd.notna(parsed):
            hour = parsed.hour
            minute = parsed.minute

    hour = to_float(hour, 0)
    minute = to_float(minute, 0)
    if time_minutes is None:
        time_minutes = hour * 60 + minute
    else:
        time_minutes = to_float(time_minutes, hour * 60 + minute)

    ir_presence = get_value(
        "irPresence",
        "ir_presence",
        "IR Presence (Lane 1-4)",
        default=None
    )
    ir_lanes = [0.0, 0.0, 0.0, 0.0]
    if isinstance(ir_presence, dict):
        ir_lanes = [
            to_float(ir_presence.get(key, 0), 0)
            for key in ("lane1", "lane2", "lane3", "lane4")
        ]
    elif ir_presence is not None:
        try:
            parsed_ir = ast.literal_eval(str(ir_presence).strip())
            if isinstance(parsed_ir, (list, tuple)):
                for index in range(min(4, len(parsed_ir))):
                    ir_lanes[index] = to_float(parsed_ir[index], 0)
        except (ValueError, SyntaxError):
            pass

    ir_lanes[0] = to_float(get_value("irLane1", "ir_lane_1", default=ir_lanes[0]))
    ir_lanes[1] = to_float(get_value("irLane2", "ir_lane_2", default=ir_lanes[1]))
    ir_lanes[2] = to_float(get_value("irLane3", "ir_lane_3", default=ir_lanes[2]))
    ir_lanes[3] = to_float(get_value("irLane4", "ir_lane_4", default=ir_lanes[3]))

    return {
        "junction_id": get_value(
            "junctionId",
            "junction_id",
            default="J-UNKNOWN"
        ),
        "junction_name": get_value(
            "junctionName",
            "junction_name",
            default="Unknown Junction"
        ),
        "vehicle_count": vehicle_count,
        "avg_speed": avg_speed,
        "vehicle_density": vehicle_density,
        "congestion_index": congestion_index,
        "ci": congestion_index,
        "saturation_flow_rate": saturation_flow_rate,
        "volume_to_saturation_ratio": volume_to_saturation_ratio,
        "free_flow_speed": free_flow_speed,
        "tsr": tsr,
        "vlsr": vlsr,
        "speed_factor": speed_factor,
        "hour": hour,
        "minute": minute,
        "time_minutes": time_minutes,
        "ir_lane_1": ir_lanes[0],
        "ir_lane_2": ir_lanes[1],
        "ir_lane_3": ir_lanes[2],
        "ir_lane_4": ir_lanes[3],
    }


# =========================================================
# ML FEATURE PREPARATION
# =========================================================

def prepare_ml_features(
    df: pd.DataFrame
):
    """
    Creates the feature matrix and target variable
    for the traffic prediction model.
    """

    feature_columns = [
        "vehicle_count",
        "avg_speed_km_h",
        "vehicle_density",
        "saturation_flow_rate_veh_hr_lane",
        "volume_to_saturation_ratio",
        "tsr",
        "vlsr",
        "speed_factor"
    ]

    target_column = "ci"

    missing_features = [
        column
        for column in feature_columns
        if column not in df.columns
    ]

    if missing_features:
        raise ValueError(
            "Missing ML feature columns: "
            + ", ".join(missing_features)
        )

    if target_column not in df.columns:
        raise ValueError(
            "Target column 'ci' not found."
        )

    X = df[
        feature_columns
    ].copy()

    y = df[
        target_column
    ].copy()

    return X, y


# =========================================================
# DATASET SUMMARY
# =========================================================

def get_dataset_summary() -> dict:
    """
    Returns basic information about the real dataset.
    """

    df = get_processed_traffic_data()

    summary = {
        "rows": int(
            len(df)
        ),

        "columns": int(
            len(df.columns)
        ),

        "columnNames": list(
            df.columns
        )
    }

    if "vehicle_count" in df.columns:

        summary["averageVehicleCount"] = round(
            float(
                df["vehicle_count"].mean()
            ),
            2
        )

    if "avg_speed_km_h" in df.columns:

        summary["averageSpeed"] = round(
            float(
                df["avg_speed_km_h"].mean()
            ),
            2
        )

    if "vehicle_density" in df.columns:

        summary["averageVehicleDensity"] = round(
            float(
                df["vehicle_density"].mean()
            ),
            2
        )

    if "ci" in df.columns:

        summary["averageCongestionIndex"] = round(
            float(
                df["ci"].mean()
            ),
            4
        )

    if "congestion_level" in df.columns:

        summary["congestionLevels"] = (
            df["congestion_level"]
            .value_counts()
            .to_dict()
        )

    return summary


# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":

    print("=" * 60)
    print("URBAN TRAFFIC AI - DATASET TEST")
    print("=" * 60)

    try:

        df = get_processed_traffic_data()

        print(
            f"\nRows: {len(df)}"
        )

        print(
            f"Columns: {len(df.columns)}"
        )

        print(
            "\nColumns:"
        )

        for column in df.columns:
            print(
                f"  - {column}"
            )

        print(
            "\nDataset Summary:"
        )

        summary = get_dataset_summary()

        for key, value in summary.items():
            print(
                f"{key}: {value}"
            )

        print(
            "\nML Features:"
        )

        X, y = prepare_ml_features(
            df
        )

        print(
            f"Feature shape: {X.shape}"
        )

        print(
            f"Target shape: {y.shape}"
        )

        print(
            "\nFirst 5 rows:"
        )

        print(
            df.head()
        )

        print(
            "\n✅ Dataset preprocessing successful!"
        )

    except Exception as error:

        print(
            "\n❌ Dataset preprocessing failed:"
        )

        print(error)