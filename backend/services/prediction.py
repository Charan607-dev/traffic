from typing import Dict, Any

def predict_traffic(junction_id: str, current_count: int, hour: int = 12) -> Dict[str, Any]:
    """Predict expected vehicle flow and velocity given junction context."""
    is_rush = 8 <= hour <= 10 or 17 <= hour <= 19
    factor = 1.35 if is_rush else 0.85
    
    predicted_count = int(current_count * factor)
    free_speed = 52.0
    speed_drop = min(36.0, (predicted_count / 8.0))
    predicted_speed = round(max(10.0, free_speed - speed_drop), 1)
    
    congestion_ratio = min(1.0, predicted_count / 180.0)
    level = "Very High" if congestion_ratio > 0.8 else ("High" if congestion_ratio > 0.6 else ("Moderate" if congestion_ratio > 0.35 else "Low"))
    
    return {
        "junction_id": junction_id,
        "predicted_vehicle_count": predicted_count,
        "predicted_average_speed": predicted_speed,
        "congestion_index": round(congestion_ratio, 2),
        "congestion_level": level,
        "confidence": 0.91
    }
