import type { LocationPoint } from "../types/route";

declare global {
    interface Window {
        google?: any;
        gm_authFailure?: () => void;
    }
}

export const GOOGLE_MAPS_API_KEY =
    ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || "";

let googleMapsScriptPromise: Promise<void> | null = null;

/**
 * Dynamically loads the Google Maps JavaScript API script.
 */
export function loadGoogleMapsScript(apiKey: string = GOOGLE_MAPS_API_KEY): Promise<void> {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Window is not defined"));
    }

    if (window.google?.maps) {
        return Promise.resolve();
    }

    if (!apiKey) {
        return Promise.reject(new Error("No Google Maps API Key provided."));
    }

    if (googleMapsScriptPromise) {
        return googleMapsScriptPromise;
    }

    googleMapsScriptPromise = new Promise((resolve, reject) => {
        const existingScript = document.getElementById("google-maps-script");
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.type = "text/javascript";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
            apiKey
        )}&libraries=places,geometry`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            resolve();
        };

        script.onerror = (err) => {
            googleMapsScriptPromise = null;
            reject(new Error("Failed to load Google Maps script. Check your API key and network."));
        };

        document.head.appendChild(script);
    });

    return googleMapsScriptPromise;
}

export function createMapLocation(
    name: string,
    latitude: number,
    longitude: number
): LocationPoint {
    return {
        name,
        latitude,
        longitude,
    };
}

export function calculateApproxDistance(
    start: LocationPoint,
    destination: LocationPoint
): number {
    const earthRadiusKm = 6371;

    const latitudeDifference =
        toRadians(destination.latitude - start.latitude);

    const longitudeDifference =
        toRadians(destination.longitude - start.longitude);

    const startLatitude = toRadians(start.latitude);
    const destinationLatitude = toRadians(
        destination.latitude
    );

    const value =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(startLatitude) *
        Math.cos(destinationLatitude) *
        Math.sin(longitudeDifference / 2) ** 2;

    const angularDistance =
        2 * Math.atan2(
            Math.sqrt(value),
            Math.sqrt(1 - value)
        );

    return earthRadiusKm * angularDistance;
}

function toRadians(value: number): number {
    return value * (Math.PI / 180);
}