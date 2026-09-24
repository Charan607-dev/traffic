// Sustainability metrics used throughout the application

export interface SustainabilityMetrics {
    fuelConsumption: number;
    fuelSaved: number;
    fuelSavingPercentage: number;

    co2Emissions: number;
    co2Reduced: number;
    co2ReductionPercentage: number;

    idleTime: number;
    idleTimeReduced: number;
    idleTimeReductionPercentage: number;

    noiseScore: number;
    noiseImpact: "Low" | "Moderate" | "High";
}

// Before and after optimization comparison

export interface ImpactComparison {
    before: SustainabilityMetrics;
    after: SustainabilityMetrics;
}

// Overall sustainability summary

export interface SustainabilitySummary {
    totalFuelSaved: number;
    totalCO2Reduced: number;
    totalIdleTimeReduced: number;

    averageNoiseScore: number;

    monitoredJunctions: number;
    optimizedJunctions: number;
}