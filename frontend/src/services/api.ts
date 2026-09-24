import type { TrafficRecord } from "../types/traffic";
import type {
    LocationPoint,
    RouteOption,
} from "../types/route";

const API_BASE_URL =
    ((import.meta as any).env?.VITE_API_BASE_URL as string) ||
    "http://localhost:8080";

export async function getTrafficRecords(): Promise<
    TrafficRecord[]
> {
    const response = await fetch(
        `${API_BASE_URL}/api/traffic`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch traffic records"
        );
    }

    return response.json();
}

export async function predictTraffic(
    record: Partial<TrafficRecord>
) {
    const response = await fetch(
        `${API_BASE_URL}/api/predict`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(record),
        }
    );

    if (!response.ok) {
        throw new Error(
            "Traffic prediction request failed"
        );
    }

    return response.json();
}

export async function getRoutes(
    start: LocationPoint,
    destination: LocationPoint
): Promise<RouteOption[]> {
    const response = await fetch(
        `${API_BASE_URL}/api/routes`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                start,
                destination,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            "Route request failed"
        );
    }

    return response.json();
}

export async function getBottlenecks() {
    const response = await fetch(
        `${API_BASE_URL}/api/bottlenecks`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch bottlenecks"
        );
    }

    return response.json();
}

export async function getSignalRecommendations() {
    const response = await fetch(
        `${API_BASE_URL}/api/signal-optimization`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch signal recommendations"
        );
    }

    return response.json();
}

export async function getSustainabilityMetrics() {
    const response = await fetch(
        `${API_BASE_URL}/api/sustainability`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch sustainability metrics"
        );
    }

    return response.json();
}