from typing import Dict, Any

def compute_emissions_metrics(fuel_consumed_liters: float) -> Dict[str, Any]:
    """Calculate CO2 and NOx pollution emissions."""
    co2_kg = fuel_consumed_liters * 2.31
    co2_reduced = round(co2_kg * 0.20, 2)
    
    return {
        "co2Emissions": round(co2_kg, 2),
        "co2Reduced": co2_reduced,
        "co2ReductionPercentage": 20.0
    }
