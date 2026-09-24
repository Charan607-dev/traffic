from typing import Dict, Any

def compute_noise_metrics(vehicle_count: int, avg_speed_kmh: float) -> Dict[str, Any]:
    """Calculate noise pollution dB and acoustic score."""
    # Empirical traffic noise index: 50dB base + 10*log10(flow)
    base_db = 55.0
    flow_factor = min(25.0, (vehicle_count / 10.0))
    speed_factor = min(10.0, (avg_speed_kmh / 10.0))
    noise_score = round(base_db + flow_factor + speed_factor, 1)
    
    impact = "High" if noise_score > 78 else ("Moderate" if noise_score > 68 else "Low")
    
    return {
        "noiseScore": noise_score,
        "noiseImpact": impact
    }
