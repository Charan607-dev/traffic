// Traffic data coming from our dataset

export interface TrafficRecord {
    timestamp: string;

    vehicleCount: number;
    avgSpeed: number;
    vehicleDensity: number;

    saturationFlowRate: number;
    volumeToSaturationRatio: number;

    tsr: number;
    vlsr: number;
    speedFactor: number;
    congestionIndex: number;

    congestionLevel: "Low" | "Moderate" | "High" | "Very High";

    irPresence: {
        lane1: boolean;
        lane2: boolean;
        lane3: boolean;
        lane4: boolean;
    };

    vehicleTypesDetected: string[];
}

// Current traffic condition shown in the dashboard

export interface TrafficCondition {
    junctionId: string;
    junctionName: string;

    vehicleCount: number;
    averageSpeed: number;
    density: number;

    congestionLevel: "Low" | "Moderate" | "High" | "Very High";

    congestionIndex: number;

    estimatedIdleTime: number;
}

export interface TrafficPrediction {
    junctionId?: string;
    predictedCongestionIndex: number;
    predictedCongestionScore: number;
    congestionLevel: "Low" | "Moderate" | "High" | "Very High" | string;
    predictedClass: string;
    classProbabilities: Record<string, number> | null;
    featuresUsed?: Record<string, number>;
    model?: {
        name: string;
        type: string;
        nEstimators: number;
        classes?: string[];
        featureCount: number;
        featureOrder?: string[];
        source: string;
        loader?: string;
        retrained: boolean;
    };
}

// Bottleneck detected by the AI system

export interface Bottleneck {
    id: string;
    junctionId: string;
    junctionName: string;

    severity: "Low" | "Medium" | "High" | "Critical";

    vehicleCount: number;
    averageSpeed: number;
    congestionIndex: number;

    estimatedQueueLength: number;

    detectedAt: string;
}

// AI signal optimization recommendation

export interface SignalRecommendation {
    junctionId: string;
    junctionName: string;

    currentGreenTime: number;
    recommendedGreenTime: number;

    currentRedTime: number;
    recommendedRedTime: number;

    expectedIdleTimeReduction: number;
    expectedCO2Reduction: number;

    confidence: number;
}