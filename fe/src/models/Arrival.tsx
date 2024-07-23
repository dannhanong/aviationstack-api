export interface Arrival {
    airport?: string;
    timezone?: string;
    iata?: string;
    icao?: string;
    terminal?: string;
    gate?: string;
    baggage?: string;
    delay?: number;
    scheduled?: string;
    estimated?: string;
    actual?: string;
    estimatedRunway?: string;
    actualRunway?: string;
    latitude?: number;
    longitude?: number;
}