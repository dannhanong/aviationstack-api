import { FlightData } from "./FlightData";

export interface FlightInfo {
    flight: FlightData;
    far: number;
    dflownFraction: number;
    dflownNumber: number;
    dtoGoNumber: number;
} 