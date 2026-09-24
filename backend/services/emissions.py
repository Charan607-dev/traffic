from typing import Any


# ---------------------------------------------------------
# EMISSION MODEL CONFIGURATION
# ---------------------------------------------------------

# Approximate CO2 emitted per litre of petrol consumed.
# This is an estimation value for the prototype.
CO2_PER_LITRE = 2.31


# ---------------------------------------------------------
# CO2 CALCULATION
# ---------------------------------------------------------

def calculate_co2_emissions(
    fuel_consumption: float
) -> float:
    """
    Calculates estimated CO2 emissions from fuel consumed.

    Formula:
        CO2 = Fuel Consumption × CO2 per litre
    """

    if fuel_consumption <= 0:
        return 0.0

    return fuel_consumption * CO2_PER_LITRE


# ---------------------------------------------------------
# CO2 REDUCTION
# ---------------------------------------------------------

def calculate_co2_reduction(
    fuel_before: float,
    fuel_after: float
) -> dict[str, float]:
    """
    Calculates CO2 reduction between before and after
    traffic optimization.
    """

    fuel_saved = max(
        0.0,
        fuel_before - fuel_after
    )

    co2_before = calculate_co2_emissions(
        fuel_before
    )

    co2_after = calculate_co2_emissions(
        fuel_after
    )

    co2_reduced = max(
        0.0,
        co2_before - co2_after
    )

    if co2_before > 0:
        reduction_percentage = (
            co2_reduced / co2_before
        ) * 100
    else:
        reduction_percentage = 0.0

    return {
        "fuelSaved": round(fuel_saved, 3),
        "co2Before": round(co2_before, 3),
        "co2After": round(co2_after, 3),
        "co2Reduced": round(co2_reduced, 3),
        "co2ReductionPercentage": round(
            reduction_percentage,
            2
        )
    }


# ---------------------------------------------------------
# MAIN EMISSIONS FUNCTION
# ---------------------------------------------------------

def compute_emissions_metrics(
    fuel_consumption: float,
    fuel_after_optimization: float | None = None
) -> dict[str, Any]:
    """
    Calculates estimated CO2 emissions.

    If fuel_after_optimization is provided,
    before/after CO2 reduction is also calculated.
    """

    fuel_consumption = max(
        0.0,
        float(fuel_consumption)
    )

    co2_emissions = calculate_co2_emissions(
        fuel_consumption
    )

    result = {
        "co2Emissions": round(
            co2_emissions,
            3
        ),

        "co2PerLitre": CO2_PER_LITRE,

        "fuelConsumption": round(
            fuel_consumption,
            3
        )
    }

    if fuel_after_optimization is not None:

        fuel_after_optimization = max(
            0.0,
            float(fuel_after_optimization)
        )

        reduction = calculate_co2_reduction(
            fuel_before=fuel_consumption,
            fuel_after=fuel_after_optimization
        )

        result.update(reduction)

    else:
        result.update({
            "co2Reduced": 0.0,
            "co2ReductionPercentage": 0.0
        })

    return result


# ---------------------------------------------------------
# OPTIMIZATION EMISSION COMPARISON
# ---------------------------------------------------------

def compare_emissions(
    fuel_before: float,
    fuel_after: float
) -> dict[str, Any]:
    """
    Compares emissions before and after traffic
    optimization.
    """

    fuel_before = max(
        0.0,
        float(fuel_before)
    )

    fuel_after = max(
        0.0,
        float(fuel_after)
    )

    co2_before = calculate_co2_emissions(
        fuel_before
    )

    co2_after = calculate_co2_emissions(
        fuel_after
    )

    co2_reduced = max(
        0.0,
        co2_before - co2_after
    )

    if co2_before > 0:
        reduction_percentage = (
            co2_reduced / co2_before
        ) * 100
    else:
        reduction_percentage = 0.0

    return {
        "before": {
            "fuelConsumption": round(
                fuel_before,
                3
            ),
            "co2Emissions": round(
                co2_before,
                3
            )
        },

        "after": {
            "fuelConsumption": round(
                fuel_after,
                3
            ),
            "co2Emissions": round(
                co2_after,
                3
            )
        },

        "fuelSaved": round(
            fuel_before - fuel_after,
            3
        ),

        "co2Reduced": round(
            co2_reduced,
            3
        ),

        "co2ReductionPercentage": round(
            reduction_percentage,
            2
        )
    }


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    print("Emissions Estimation Test\n")

    result = compute_emissions_metrics(
        fuel_consumption=5.0,
        fuel_after_optimization=4.0
    )

    print("Emission metrics:")
    print(result)

    print("\nBefore vs After:")

    comparison = compare_emissions(
        fuel_before=5.0,
        fuel_after=4.0
    )

    print(comparison)