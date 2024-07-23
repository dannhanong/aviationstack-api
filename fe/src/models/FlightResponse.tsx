import { FlightData } from "./FlightData";

export interface FlightResponse {
    totalPages: number;
    totalElements: number;
    size: number;
    content: FlightData[];
}