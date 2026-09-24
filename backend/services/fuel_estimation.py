from typing import Dict, Any

def compute_fuel_metrics(distance_km: float, avg_speed_kmh: float, idle_time_mins: float) -> Dict[str, Any]:
    """Calculate fuel consumed and potential savings from smooth routing."""
    # Ideal speed ~60km/h: ~6.2L/100km
    speed_penalty = max(0.0, (50.0 - avg_speed_kmh) / 30.0)
    rate_per_100km = 6.2 * (1.0 + speed_penalty)
    driving_fuel = (distance_km / 100.0) * rate_per_100km
    idle_fuel = (idle_time_mins / 60.0) * 1.15
    total_fuel = driving_fuel + idle_fuel
    
    # Saved by adaptive routing & signal optimization (approx 18%)
    fuel_saved = round(total_fuel * 0.18, 2)
    
    return {
        "fuelConsumption": round(total_fuel, 2),
        "fuelSaved": fuel_saved,
        "fuelSavingPercentage": 18.0
    }
