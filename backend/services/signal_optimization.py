from typing import Any


# ---------------------------------------------------------
# SIGNAL CONFIGURATION
# ---------------------------------------------------------

MIN_GREEN_TIME = 15
MAX_GREEN_TIME = 60

MIN_RED_TIME = 45
MAX_RED_TIME = 120

BASE_GREEN_TIME = 30
BASE_RED_TIME = 90


# ---------------------------------------------------------
# CONGESTION NORMALIZATION
# ---------------------------------------------------------

def normalize_congestion(value: float) -> float:
    """
    Converts congestion index into a 0-1 range.

    Supports:
        0.0 - 1.0
    and:
        0 - 100
    """

    try:
        value = float(value)
    except (TypeError, ValueError):
        return 0.0

    if value > 1:
        value = value / 100

    return max(0.0, min(value, 1.0))


# ---------------------------------------------------------
# GREEN TIME CALCULATION
# ---------------------------------------------------------

def calculate_green_time(
    vehicle_count: int,
    congestion_score: float
) -> int:
    """
    Calculates recommended green time.

    Higher traffic and congestion result in a longer
    green phase.
    """

    traffic_factor = min(
        vehicle_count / 250,
        1.0
    )

    congestion_factor = congestion_score

    combined_factor = (
        traffic_factor * 0.45
        + congestion_factor * 0.55
    )

    additional_green = round(
        combined_factor * 30
    )

    recommended_green = (
        BASE_GREEN_TIME
        + additional_green
    )

    return max(
        MIN_GREEN_TIME,
        min(
            recommended_green,
            MAX_GREEN_TIME
        )
    )


# ---------------------------------------------------------
# RED TIME CALCULATION
# ---------------------------------------------------------

def calculate_red_time(
    recommended_green_time: int
) -> int:
    """
    Calculates a corresponding red time.

    Longer green phases reduce the red phase while
    maintaining a reasonable signal cycle.
    """

    cycle_time = (
        BASE_GREEN_TIME
        + BASE_RED_TIME
    )

    recommended_red = (
        cycle_time
        - recommended_green_time
    )

    return max(
        MIN_RED_TIME,
        min(
            recommended_red,
            MAX_RED_TIME
        )
    )


# ---------------------------------------------------------
# IDLE TIME REDUCTION
# ---------------------------------------------------------

def estimate_idle_time_reduction(
    congestion_score: float,
    green_time_change: int
) -> float:
    """
    Estimates the percentage reduction in idle time.

    This is a model-based estimate and should be validated
    using real signal/controller data before deployment.
    """

    if green_time_change <= 0:
        return 0.0

    reduction = (
        congestion_score
        * green_time_change
        * 1.15
    )

    return round(
        min(reduction, 40.0),
        2
    )


# ---------------------------------------------------------
# CO2 REDUCTION
# ---------------------------------------------------------

def estimate_co2_reduction(
    idle_time_reduction: float
) -> float:
    """
    Estimates CO2 reduction from reduced vehicle idling.

    This is a relative estimate, not a direct emission
    measurement.
    """

    reduction = (
        idle_time_reduction
        * 0.82
    )

    return round(
        min(reduction, 35.0),
        2
    )


# ---------------------------------------------------------
# CONFIDENCE
# ---------------------------------------------------------

def calculate_confidence(
    vehicle_count: int,
    congestion_score: float
) -> float:
    """
    Calculates a simple confidence indicator based on
    traffic volume and congestion strength.
    """

    traffic_confidence = min(
        vehicle_count / 200,
        1.0
    )

    congestion_confidence = congestion_score

    confidence = (
        traffic_confidence * 0.4
        + congestion_confidence * 0.6
    )

    return round(
        60 + confidence * 35,
        2
    )


# ---------------------------------------------------------
# MAIN SIGNAL OPTIMIZATION
# ---------------------------------------------------------

def compute_adaptive_signal(
    junction_id: str,
    junction_name: str,
    vehicle_count: int,
    congestion_index: float = 0.0,
    average_speed: float = 0.0
) -> dict[str, Any]:
    """
    Generates an adaptive traffic signal recommendation.

    Parameters:
        junction_id
        junction_name
        vehicle_count
        congestion_index
        average_speed
    """

    congestion_score = normalize_congestion(
        congestion_index
    )

    # If congestion index wasn't supplied, estimate a
    # basic congestion score from traffic volume.
    if congestion_score == 0.0:

        congestion_score = min(
            float(vehicle_count) / 250,
            1.0
        )

    current_green = BASE_GREEN_TIME
    current_red = BASE_RED_TIME

    recommended_green = calculate_green_time(
        vehicle_count,
        congestion_score
    )

    recommended_red = calculate_red_time(
        recommended_green
    )

    green_time_change = (
        recommended_green
        - current_green
    )

    idle_reduction = estimate_idle_time_reduction(
        congestion_score,
        green_time_change
    )

    co2_reduction = estimate_co2_reduction(
        idle_reduction
    )

    confidence = calculate_confidence(
        vehicle_count,
        congestion_score
    )

    return {
        "junctionId": junction_id,

        "junctionName": junction_name,

        "currentGreenTime": current_green,

        "recommendedGreenTime": recommended_green,

        "currentRedTime": current_red,

        "recommendedRedTime": recommended_red,

        "greenTimeChange": green_time_change,

        "expectedIdleTimeReduction": idle_reduction,

        "expectedCO2Reduction": co2_reduction,

        "confidence": confidence,

        "averageSpeed": round(
            float(average_speed),
            2
        ),

        "method": "Adaptive traffic signal optimization"
    }


# ---------------------------------------------------------
# BATCH OPTIMIZATION
# ---------------------------------------------------------

def optimize_all_junctions(
    traffic_data: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """
    Generates signal recommendations for multiple
    junctions.
    """

    recommendations = []

    for item in traffic_data:

        junction_id = item.get(
            "junctionId",
            item.get(
                "junction_id",
                "UNKNOWN"
            )
        )

        junction_name = item.get(
            "junctionName",
            item.get(
                "junction_name",
                "Unknown Junction"
            )
        )

        vehicle_count = item.get(
            "vehicleCount",
            item.get(
                "vehicle_count",
                0
            )
        )

        congestion_index = item.get(
            "congestionIndex",
            item.get(
                "congestion_index",
                item.get("ci", 0)
            )
        )

        average_speed = item.get(
            "averageSpeed",
            item.get(
                "avg_speed",
                0
            )
        )

        recommendation = compute_adaptive_signal(
            junction_id=junction_id,
            junction_name=junction_name,
            vehicle_count=int(vehicle_count),
            congestion_index=float(
                congestion_index or 0
            ),
            average_speed=float(
                average_speed or 0
            )
        )

        recommendations.append(
            recommendation
        )

    return recommendations


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    sample_traffic = [
        {
            "junctionId": "J-001",
            "junctionName": "Central Junction",
            "vehicleCount": 264,
            "averageSpeed": 15,
            "congestionIndex": 0.86,
        },
        {
            "junctionId": "J-002",
            "junctionName": "Market Junction",
            "vehicleCount": 218,
            "averageSpeed": 22,
            "congestionIndex": 0.67,
        },
        {
            "junctionId": "J-003",
            "junctionName": "Residential Junction",
            "vehicleCount": 112,
            "averageSpeed": 41,
            "congestionIndex": 0.24,
        },
    ]

    recommendations = optimize_all_junctions(
        sample_traffic
    )

    print("\nSignal Optimization Results:\n")

    for recommendation in recommendations:
        print(recommendation)