// Route information between the user's start and destination

export interface LocationPoint {
    name: string;
    latitude: number;
    longitude: number;
}

// Traffic condition predicted for a particular route

export interface RouteTraffic {
    congestionLevel: "Low" | "Moderate" | "High" | "Very High";
    averageSpeed: number;
    vehicleDensity: number;
    estimatedDelay: number;
}

// Sustainability metrics for a route

export interface RouteSustainability {
    estimatedFuel: number;
    estimatedFuelSaved: number;

    estimatedCO2: number;
    estimatedCO2Saved: number;

    noiseImpact: "Low" | "Moderate" | "High";

    noiseScore: number;
}

// Complete route returned by the routing system

export interface RouteOption {
    id: string;

    name: string;

    start: LocationPoint;
    destination: LocationPoint;

    distance: number;
    estimatedTravelTime: number;

    traffic: RouteTraffic;

    sustainability: RouteSustainability;

    isRecommended: boolean;
}

// Route planning request

export interface RouteRequest {
    start: LocationPoint;
    destination: LocationPoint;
}

// User's route preference

export type RoutePreference =
    | "fastest"
    | "fuel-efficient"
    | "low-carbon"
    | "low-noise"
    | "balanced";