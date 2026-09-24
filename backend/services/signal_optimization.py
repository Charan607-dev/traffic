from typing import Dict, Any

def compute_adaptive_signal(junction_id: str, junction_name: str, vehicle_count: int) -> Dict[str, Any]:
    """Calculate recommended green/red light timings dynamically."""
    base_cycle = 90
    saturation = min(1.0, vehicle_count / 160.0)
    
    current_green = 35
    recommended_green = int(25 + (saturation * 45))  # between 25s and 70s
    recommended_red = base_cycle - recommended_green
    
    idle_reduction = max(5, int((recommended_green - current_green) * 0.8))
    co2_reduction = round(idle_reduction * 0.14, 1)
    
    return {
        "junctionId": junction_id,
        "junctionName": junction_name,
        "currentGreenTime": current_green,
        "recommendedGreenTime": recommended_green,
        "currentRedTime": base_cycle - current_green,
        "recommendedRedTime": recommended_red,
        "expectedIdleTimeReduction": idle_reduction,
        "expectedCO2Reduction": co2_reduction,
        "confidence": 0.89
    }
