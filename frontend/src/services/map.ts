import type { LocationPoint } from "../types/route";

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