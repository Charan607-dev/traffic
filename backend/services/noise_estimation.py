from typing import Any


# ---------------------------------------------------------
# NOISE ESTIMATION CONFIGURATION
# ---------------------------------------------------------

BASE_NOISE_DB = 50.0

VEHICLE_NOISE_FACTOR = 0.025
SPEED_NOISE_FACTOR = 0.12
HEAVY_TRAFFIC_FACTOR = 8.0


# ---------------------------------------------------------
# NOISE LEVEL CLASSIFICATION
# ---------------------------------------------------------

def classify_noise_level(noise_score: float) -> str:
    """
    Converts estimated noise score into a simple category.
    """

    if noise_score < 55:
        return "Low"

    if noise_score < 65:
        return "Moderate"

    if noise_score < 75:
        return "High"

    return "Very High"


# ---------------------------------------------------------
# NOISE ESTIMATION
# ---------------------------------------------------------

def calculate_noise_score(
    vehicle_count: int,
    avg_speed_kmh: float,
    congestion_index: float = 0.0
) -> float:
    """
    Estimates traffic-related noise impact.

    This is a proxy model, not an actual sound measurement.
    """

    try:
        vehicle_count = max(
            0,
            int(vehicle_count)
        )
    except (TypeError, ValueError):
        vehicle_count = 0

    try:
        avg_speed_kmh = max(
            0.0,
            float(avg_speed_kmh)
        )
    except (TypeError, ValueError):
        avg_speed_kmh = 0.0

    try:
        congestion_index = float(
            congestion_index
        )
    except (TypeError, ValueError):
        congestion_index = 0.0

    # Support both 0-1 and 0-100 congestion values.
    if congestion_index > 1:
        congestion_index /= 100

    congestion_index = max(
        0.0,
        min(congestion_index, 1.0)
    )

    vehicle_component = (
        vehicle_count * VEHICLE_NOISE_FACTOR
    )

    speed_component = (
        avg_speed_kmh * SPEED_NOISE_FACTOR
    )

    congestion_component = (
        congestion_index * HEAVY_TRAFFIC_FACTOR
    )

    noise_score = (
        BASE_NOISE_DB
        + vehicle_component
        + speed_component
        + congestion_component
    )

    return round(
        max(40.0, min(noise_score, 100.0)),
        1
    )


# ---------------------------------------------------------
# MAIN NOISE FUNCTION
# ---------------------------------------------------------

def compute_noise_metrics(
    vehicle_count: int,
    avg_speed_kmh: float,
    congestion_index: float = 0.0
) -> dict[str, Any]:
    """
    Calculates estimated traffic noise impact.
    """

    noise_score = calculate_noise_score(
        vehicle_count=vehicle_count,
        avg_speed_kmh=avg_speed_kmh,
        congestion_index=congestion_index
    )

    noise_impact = classify_noise_level(
        noise_score
    )

    return {
        "noiseScore": noise_score,
        "noiseImpact": noise_impact,
        "vehicleCount": vehicle_count,
        "averageSpeed": round(
            float(avg_speed_kmh),
            2
        ),
        "congestionIndex": round(
            float(congestion_index),
            4
        ),
        "measurementType": "Estimated traffic noise impact"
    }


# ---------------------------------------------------------
# NOISE REDUCTION ESTIMATION
# ---------------------------------------------------------

def estimate_noise_reduction(
    vehicle_count_before: int,
    vehicle_count_after: int,
    avg_speed_before: float,
    avg_speed_after: float,
    congestion_before: float = 0.0,
    congestion_after: float = 0.0
) -> dict[str, Any]:
    """
    Compares estimated noise before and after
    traffic optimization.
    """

    before = compute_noise_metrics(
        vehicle_count=vehicle_count_before,
        avg_speed_kmh=avg_speed_before,
        congestion_index=congestion_before
    )

    after = compute_noise_metrics(
        vehicle_count=vehicle_count_after,
        avg_speed_kmh=avg_speed_after,
        congestion_index=congestion_after
    )

    reduction = max(
        0.0,
        before["noiseScore"]
        - after["noiseScore"]
    )

    return {
        "before": before,
        "after": after,
        "noiseReduction": round(
            reduction,
            1
        ),
        "noiseReductionPercentage": round(
            (
                reduction
                / before["noiseScore"]
                * 100
            )
            if before["noiseScore"] > 0
            else 0.0,
            2
        )
    }


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    print("Noise Estimation Test\n")

    result = compute_noise_metrics(
        vehicle_count=150,
        avg_speed_kmh=22.0,
        congestion_index=0.75
    )

    print("Current traffic:")
    print(result)

    print("\nBefore vs After optimization:")

    comparison = estimate_noise_reduction(
        vehicle_count_before=150,
        vehicle_count_after=110,
        avg_speed_before=22.0,
        avg_speed_after=30.0,
        congestion_before=0.75,
        congestion_after=0.35
    )

    print(comparison)