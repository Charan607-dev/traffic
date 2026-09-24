from typing import Any


# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------

CONGESTION_THRESHOLDS = {
    "low": 0.25,
    "moderate": 0.50,
    "high": 0.75,
}

QUEUE_FACTOR = 0.16


# ---------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------

def get_congestion_score(item: dict[str, Any]) -> float:
    """
    Returns congestion as a 0-1 score.

    Supports both:
        0.0 - 1.0
    and:
        0 - 100
    """

    value = item.get(
        "congestionIndex",
        item.get("ci", 0)
    )

    try:
        value = float(value)
    except (TypeError, ValueError):
        return 0.0

    if value > 1:
        value = value / 100

    return max(0.0, min(value, 1.0))


def get_vehicle_count(item: dict[str, Any]) -> int:
    """
    Safely extracts vehicle count.
    """

    value = item.get(
        "vehicleCount",
        item.get("vehicle_count", 0)
    )

    try:
        return max(0, int(float(value)))
    except (TypeError, ValueError):
        return 0


def get_average_speed(item: dict[str, Any]) -> float:
    """
    Safely extracts average speed.
    """

    value = item.get(
        "averageSpeed",
        item.get("avg_speed", 0)
    )

    try:
        return max(0.0, float(value))
    except (TypeError, ValueError):
        return 0.0


# ---------------------------------------------------------
# SEVERITY
# ---------------------------------------------------------

def calculate_severity(
    congestion_score: float,
    vehicle_count: int,
    average_speed: float
) -> str:
    """
    Determines bottleneck severity using:
    - congestion
    - vehicle count
    - average speed
    """

    if (
        congestion_score >= 0.85
        or (
            congestion_score >= 0.75
            and vehicle_count >= 150
            and average_speed < 20
        )
    ):
        return "Critical"

    if (
        congestion_score >= 0.70
        or (
            congestion_score >= 0.60
            and vehicle_count >= 100
        )
    ):
        return "High"

    if (
        congestion_score >= 0.45
        or (
            congestion_score >= 0.35
            and vehicle_count >= 80
        )
    ):
        return "Medium"

    return "Low"


# ---------------------------------------------------------
# QUEUE ESTIMATION
# ---------------------------------------------------------

def estimate_queue_length(
    vehicle_count: int,
    congestion_score: float
) -> int:
    """
    Estimates queue length using traffic volume
    and congestion severity.

    This is an estimation, not direct sensor measurement.
    """

    estimated_queue = (
        vehicle_count
        * congestion_score
        * QUEUE_FACTOR
    )

    return max(
        0,
        round(estimated_queue)
    )


# ---------------------------------------------------------
# BOTTLENECK DETECTION
# ---------------------------------------------------------

def identify_bottlenecks(
    traffic_data: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """
    Identifies bottlenecks from traffic records.

    A junction becomes a bottleneck when its traffic
    conditions indicate significant congestion.
    """

    bottlenecks = []

    for index, item in enumerate(traffic_data):

        congestion_score = get_congestion_score(item)

        vehicle_count = get_vehicle_count(item)

        average_speed = get_average_speed(item)

        severity = calculate_severity(
            congestion_score,
            vehicle_count,
            average_speed
        )

        queue_length = estimate_queue_length(
            vehicle_count,
            congestion_score
        )

        # -------------------------------------------------
        # Only report meaningful bottlenecks
        # -------------------------------------------------

        if severity == "Low":
            continue

        junction_id = item.get(
            "junctionId",
            item.get(
                "junction_id",
                f"J-{index + 1:03d}"
            )
        )

        junction_name = item.get(
            "junctionName",
            item.get(
                "junction_name",
                "Unknown Junction"
            )
        )

        detected_at = item.get(
            "timestamp",
            ""
        )

        bottlenecks.append(
            {
                "id": f"B-{len(bottlenecks) + 1:03d}",

                "junctionId": junction_id,

                "junctionName": junction_name,

                "severity": severity,

                "vehicleCount": vehicle_count,

                "averageSpeed": round(
                    average_speed,
                    2
                ),

                "congestionIndex": round(
                    congestion_score * 100,
                    2
                ),

                "estimatedQueueLength": queue_length,

                "detectedAt": detected_at,
            }
        )

    # Highest congestion first
    bottlenecks.sort(
        key=lambda item: item["congestionIndex"],
        reverse=True
    )

    return bottlenecks


# ---------------------------------------------------------
# SINGLE JUNCTION ANALYSIS
# ---------------------------------------------------------

def analyze_junction(
    traffic_item: dict[str, Any]
) -> dict[str, Any]:
    """
    Analyzes one junction.

    Useful later when the AI prediction engine sends
    a predicted traffic condition for a single junction.
    """

    congestion_score = get_congestion_score(
        traffic_item
    )

    vehicle_count = get_vehicle_count(
        traffic_item
    )

    average_speed = get_average_speed(
        traffic_item
    )

    severity = calculate_severity(
        congestion_score,
        vehicle_count,
        average_speed
    )

    queue_length = estimate_queue_length(
        vehicle_count,
        congestion_score
    )

    return {
        "junctionId": traffic_item.get(
            "junctionId",
            traffic_item.get(
                "junction_id",
                "UNKNOWN"
            )
        ),

        "junctionName": traffic_item.get(
            "junctionName",
            traffic_item.get(
                "junction_name",
                "Unknown Junction"
            )
        ),

        "severity": severity,

        "congestionIndex": round(
            congestion_score * 100,
            2
        ),

        "vehicleCount": vehicle_count,

        "averageSpeed": round(
            average_speed,
            2
        ),

        "estimatedQueueLength": queue_length,

        "isBottleneck": severity != "Low",
    }


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    sample_data = [
        {
            "junctionId": "J-01",
            "junctionName": "Central Plaza",
            "vehicleCount": 142,
            "averageSpeed": 18.5,
            "congestionIndex": 0.78,
            "timestamp": "2026-09-24 10:00:00",
        },
        {
            "junctionId": "J-02",
            "junctionName": "Tech Park Cross",
            "vehicleCount": 89,
            "averageSpeed": 32.4,
            "congestionIndex": 0.49,
            "timestamp": "2026-09-24 10:00:00",
        },
        {
            "junctionId": "J-03",
            "junctionName": "Metro Interchange",
            "vehicleCount": 178,
            "averageSpeed": 11.2,
            "congestionIndex": 0.92,
            "timestamp": "2026-09-24 10:00:00",
        },
    ]

    results = identify_bottlenecks(
        sample_data
    )

    print("Detected bottlenecks:")

    for result in results:
        print(result)