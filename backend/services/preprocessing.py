from typing import Dict, Any

def clean_traffic_data(record: Dict[str, Any]) -> Dict[str, Any]:
    """Clean and sanitize incoming traffic payload."""
    return {
        "junction_id": str(record.get("junction_id", "J-01")),
        "vehicle_count": max(0, int(record.get("vehicle_count", 0))),
        "average_speed_kmh": max(1.0, float(record.get("average_speed_kmh", 30.0))),
        "weather_condition": str(record.get("weather_condition", "Clear")),
        "is_holiday": bool(record.get("is_holiday", False)),
    }

def calculate_density(vehicle_count: int, lane_count: int = 4, segment_length_km: float = 1.0) -> float:
    """Calculate vehicle density in vehicles/km/lane."""
    return round(vehicle_count / (lane_count * segment_length_km), 2)
