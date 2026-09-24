import type {
    TrafficPrediction,
    TrafficRecord,
} from "../types/traffic";
import type {
    LocationPoint,
    RouteOption,
} from "../types/route";

const API_BASE_URL =
    ((import.meta as any).env?.VITE_API_BASE_URL as string) ||
    "http://localhost:8081";

type PredictableTraffic = Partial<TrafficRecord> & {
    junctionId?: string;
    junctionName?: string;
    averageSpeed?: number;
    density?: number;
};

function toCongestionIndex(value: unknown): number | undefined {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }

    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
        return undefined;
    }

    return numeric > 1 ? numeric / 100 : numeric;
}

function parseTimestampParts(timestamp?: string) {
    if (!timestamp) {
        return {};
    }

    const parsed = new Date(timestamp.replace(" ", "T"));
    if (Number.isNaN(parsed.getTime())) {
        const timeMatch = timestamp.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
        if (!timeMatch) {
            return { timestamp };
        }

        const hour = Number(timeMatch[1]);
        const minute = Number(timeMatch[2]);
        return {
            timestamp,
            hour,
            minute,
            timeMinutes: hour * 60 + minute,
        };
    }

    const hour = parsed.getHours();
    const minute = parsed.getMinutes();
    return {
        timestamp,
        hour,
        minute,
        timeMinutes: hour * 60 + minute,
    };
}

export function buildPredictionPayload(record: PredictableTraffic) {
    const vehicleCount = record.vehicleCount;
    const avgSpeed = record.avgSpeed ?? record.averageSpeed;
    const density = record.vehicleDensity ?? record.density;
    const congestionIndex = toCongestionIndex(record.congestionIndex);
    const timeParts = parseTimestampParts(record.timestamp);

    return {
        junctionId: record.junctionId,
        junctionName: record.junctionName,
        vehicleCount,
        averageSpeed: avgSpeed,
        density,
        saturationFlowRate: record.saturationFlowRate,
        volumeToSaturationRatio: record.volumeToSaturationRatio,
        tsr: record.tsr,
        vlsr: record.vlsr,
        speedFactor: record.speedFactor,
        congestionIndex,
        ci: congestionIndex,
        timestamp: timeParts.timestamp,
        hour: timeParts.hour,
        minute: timeParts.minute,
        timeMinutes: timeParts.timeMinutes,
        irPresence: record.irPresence,
        "Vehicle Count": vehicleCount,
        "Avg Speed (km/h)": avgSpeed,
        "Vehicle Density (%)": density,
        "Saturation Flow Rate(veh/hr/lane)": record.saturationFlowRate,
        "Volume to  Saturation Lane Traffic ratio(%)":
            record.volumeToSaturationRatio,
        TSR: record.tsr,
        VLSR: record.vlsr,
        "Speed Factor": record.speedFactor,
        CI: congestionIndex,
        Hour: timeParts.hour,
        Minute: timeParts.minute,
        Time_Minutes: timeParts.timeMinutes,
        IR_Lane_1: record.irPresence?.lane1 ? 1 : record.irPresence ? 0 : undefined,
        IR_Lane_2: record.irPresence?.lane2 ? 1 : record.irPresence ? 0 : undefined,
        IR_Lane_3: record.irPresence?.lane3 ? 1 : record.irPresence ? 0 : undefined,
        IR_Lane_4: record.irPresence?.lane4 ? 1 : record.irPresence ? 0 : undefined,
    };
}

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
    record: PredictableTraffic
): Promise<TrafficPrediction> {
    const response = await fetch(
        `${API_BASE_URL}/api/predict`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(buildPredictionPayload(record)),
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

export { API_BASE_URL };
