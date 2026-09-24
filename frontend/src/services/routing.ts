import type {
    LocationPoint,
    RouteOption,
    RoutePreference,
} from "../types/route";

export function generateDemoRoutes(
    start: LocationPoint,
    destination: LocationPoint
): RouteOption[] {
    return [
        {
            id: "R-001",
            name: "Eco Route",
            start,
            destination,
            distance: 9.8,
            estimatedTravelTime: 28,

            traffic: {
                congestionLevel: "Moderate",
                averageSpeed: 31,
                vehicleDensity: 48,
                estimatedDelay: 5,
            },

            sustainability: {
                estimatedFuel: 0.72,
                estimatedFuelSaved: 0.18,
                estimatedCO2: 1.68,
                estimatedCO2Saved: 0.42,
                noiseImpact: "Low",
                noiseScore: 32,
            },

            isRecommended: false,
        },

        {
            id: "R-002",
            name: "Fast Route",
            start,
            destination,
            distance: 8.6,
            estimatedTravelTime: 24,

            traffic: {
                congestionLevel: "High",
                averageSpeed: 25,
                vehicleDensity: 66,
                estimatedDelay: 7,
            },

            sustainability: {
                estimatedFuel: 0.91,
                estimatedFuelSaved: 0.05,
                estimatedCO2: 2.14,
                estimatedCO2Saved: 0.16,
                noiseImpact: "Moderate",
                noiseScore: 51,
            },

            isRecommended: false,
        },

        {
            id: "R-003",
            name: "Low Traffic Route",
            start,
            destination,
            distance: 11.2,
            estimatedTravelTime: 31,

            traffic: {
                congestionLevel: "Low",
                averageSpeed: 38,
                vehicleDensity: 34,
                estimatedDelay: 2,
            },

            sustainability: {
                estimatedFuel: 0.68,
                estimatedFuelSaved: 0.22,
                estimatedCO2: 1.54,
                estimatedCO2Saved: 0.51,
                noiseImpact: "Low",
                noiseScore: 27,
            },

            isRecommended: false,
        },
    ];
}

export function selectRecommendedRoute(
    routes: RouteOption[],
    preference: RoutePreference
): RouteOption[] {
    const sortedRoutes = [...routes].sort((a, b) => {
        switch (preference) {
            case "fastest":
                return (
                    a.estimatedTravelTime -
                    b.estimatedTravelTime
                );

            case "fuel-efficient":
                return (
                    a.sustainability.estimatedFuel -
                    b.sustainability.estimatedFuel
                );

            case "low-carbon":
                return (
                    a.sustainability.estimatedCO2 -
                    b.sustainability.estimatedCO2
                );

            case "low-noise":
                return (
                    a.sustainability.noiseScore -
                    b.sustainability.noiseScore
                );

            case "balanced":
            default:
                return calculateBalancedScore(a) -
                    calculateBalancedScore(b);
        }
    });

    return sortedRoutes.map((route, index) => ({
        ...route,
        isRecommended: index === 0,
    }));
}

function calculateBalancedScore(
    route: RouteOption
): number {
    const travelScore =
        route.estimatedTravelTime / 30;

    const fuelScore =
        route.sustainability.estimatedFuel;

    const co2Score =
        route.sustainability.estimatedCO2;

    const noiseScore =
        route.sustainability.noiseScore / 100;

    const congestionScore =
        route.traffic.vehicleDensity / 100;

    return (
        travelScore * 0.25 +
        fuelScore * 0.25 +
        co2Score * 0.25 +
        noiseScore * 0.1 +
        congestionScore * 0.15
    );
}