import { FlightData } from "../FlightData";

export interface FlightDataResponse {
    totalElements: number,
    totalPages: number,
    size: number,
    content: FlightData[];
}