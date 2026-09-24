from typing import Any


# ---------------------------------------------------------
# FUEL MODEL CONFIGURATION
# ---------------------------------------------------------

# Approximate baseline fuel efficiency.
# This is a configurable estimate for the prototype.
BASE_FUEL_EFFICIENCY = 15.0  # km per litre

# Additional fuel consumed during idling.
IDLE_FUEL_RATE = 0.012  # litres per minute

# Congestion-related fuel penalty.
MAX_CONGESTION_PENALTY = 0.30


# ---------------------------------------------------------
# CONGESTION NORMALIZATION
# ---------------------------------------------------------

def normalize_congestion(value: float) -> float:
    """
    Converts congestion index to a 0-1 range.

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
        value /= 100

    return max(0.0, min(value, 1.0))


# ---------------------------------------------------------
# BASE FUEL CONSUMPTION
# ---------------------------------------------------------

def calculate_base_fuel(
    distance_km: float,
    fuel_efficiency: float = BASE_FUEL_EFFICIENCY
) -> float:
    """
    Calculates fuel required without congestion effects.
    """

    if distance_km <= 0:
        return 0.0

    if fuel_efficiency <= 0:
        fuel_efficiency = BASE_FUEL_EFFICIENCY

    return distance_km / fuel_efficiency


# ---------------------------------------------------------
# CONGESTION PENALTY
# ---------------------------------------------------------

def calculate_congestion_penalty(
    congestion_index: float
) -> float:
    """
    Estimates additional fuel consumption caused by
    congestion and stop-and-go traffic.
    """

    congestion = normalize_congestion(
        congestion_index
    )

    return congestion * MAX_CONGESTION_PENALTY


# ---------------------------------------------------------
# IDLE FUEL
# ---------------------------------------------------------

def calculate_idle_fuel(
    idle_time_mins: float
) -> float:
    """
    Estimates fuel consumed while vehicles are idling.
    """

    if idle_time_mins <= 0:
        return 0.0

    return idle_time_mins * IDLE_FUEL_RATE


# ---------------------------------------------------------
# MAIN FUEL CALCULATION
# ---------------------------------------------------------

def compute_fuel_metrics(
    distance_km: float,
    avg_speed_kmh: float,
    idle_time_mins: float,
    congestion_index: float = 0.0
) -> dict[str, Any]:
    """
    Calculates estimated fuel consumption and potential
    fuel savings.

    Parameters:
        distance_km
        avg_speed_kmh
        idle_time_mins
        congestion_index

    Returns:
        Fuel consumption and saving metrics.
    """

    distance_km = max(
        0.0,
        float(distance_km)
    )

    avg_speed_kmh = max(
        0.0,
        float(avg_speed_kmh)
    )

    idle_time_mins = max(
        0.0,
        float(idle_time_mins)
    )

    congestion = normalize_congestion(
        congestion_index
    )

    # -----------------------------------------------------
    # Base fuel
    # -----------------------------------------------------

    base_fuel = calculate_base_fuel(
        distance_km
    )

    # -----------------------------------------------------
    # Congestion penalty
    # -----------------------------------------------------

    congestion_penalty = calculate_congestion_penalty(
        congestion
    )

    congestion_fuel = (
        base_fuel * congestion_penalty
    )

    # -----------------------------------------------------
    # Idle fuel
    # -----------------------------------------------------

    idle_fuel = calculate_idle_fuel(
        idle_time_mins
    )

    # -----------------------------------------------------
    # Total estimated fuel
    # -----------------------------------------------------

    total_fuel = (
        base_fuel
        + congestion_fuel
        + idle_fuel
    )

    # -----------------------------------------------------
    # Potential saving
    # -----------------------------------------------------

    potential_saving = (
        congestion_fuel
        + idle_fuel
    )

    if total_fuel > 0:
        saving_percentage = (
            potential_saving
            / total_fuel
        ) * 100
    else:
        saving_percentage = 0.0

    return {
        "fuelConsumption": round(
            total_fuel,
            3
        ),

        "fuelSaved": round(
            potential_saving,
            3
        ),

        "fuelSavingPercentage": round(
            min(saving_percentage, 100.0),
            2
        ),

        "baseFuelConsumption": round(
            base_fuel,
            3
        ),

        "congestionFuel": round(
            congestion_fuel,
            3
        ),

        "idleFuel": round(
            idle_fuel,
            3
        ),

        "distanceKm": round(
            distance_km,
            2
        ),

        "averageSpeedKmh": round(
            avg_speed_kmh,
            2
        ),

        "idleTimeMinutes": round(
            idle_time_mins,
            2
        ),

        "congestionIndex": round(
            congestion,
            4
        )
    }


# ---------------------------------------------------------
# FUEL SAVING AFTER OPTIMIZATION
# ---------------------------------------------------------

def estimate_fuel_after_optimization(
    distance_km: float,
    avg_speed_kmh: float,
    current_idle_time: float,
    optimized_idle_time: float,
    congestion_index: float = 0.0
) -> dict[str, Any]:
    """
    Compares fuel consumption before and after traffic
    optimization.
    """

    before = compute_fuel_metrics(
        distance_km=distance_km,
        avg_speed_kmh=avg_speed_kmh,
        idle_time_mins=current_idle_time,
        congestion_index=congestion_index
    )

    after = compute_fuel_metrics(
        distance_km=distance_km,
        avg_speed_kmh=avg_speed_kmh,
        idle_time_mins=optimized_idle_time,
        congestion_index=congestion_index
    )

    fuel_saved = max(
        0.0,
        before["fuelConsumption"]
        - after["fuelConsumption"]
    )

    if before["fuelConsumption"] > 0:
        saving_percentage = (
            fuel_saved
            / before["fuelConsumption"]
        ) * 100
    else:
        saving_percentage = 0.0

    return {
        "before": before,

        "after": after,

        "fuelSaved": round(
            fuel_saved,
            3
        ),

        "fuelSavingPercentage": round(
            saving_percentage,
            2
        )
    }


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    print("Fuel Estimation Test\n")

    result = compute_fuel_metrics(
        distance_km=25.0,
        avg_speed_kmh=28.0,
        idle_time_mins=18.0,
        congestion_index=0.70
    )

    print("Current traffic:")
    print(result)

    print("\nOptimization comparison:")

    comparison = estimate_fuel_after_optimization(
        distance_km=25.0,
        avg_speed_kmh=28.0,
        current_idle_time=18.0,
        optimized_idle_time=11.0,
        congestion_index=0.70
    )

    print(comparison)