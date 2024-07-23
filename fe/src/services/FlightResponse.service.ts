import axios from "axios";
import { FlightResponse } from "../models/FlightResponse";
import { FlightDataResponse } from "../models/response/FlightDataResponse";
import { FlightInfo } from "../models/FlightInfo";

export async function getAllFlightsByStatus(page: number, size: number, keyword: string): Promise<FlightDataResponse> {
    const baseUrl: string = process.env.REACT_APP_BASE_URL || "";

    try{
        const response = await axios.get<FlightDataResponse>(baseUrl + `/flights/status?page=${page}&size=${size}&keyword=${keyword}`);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}

export async function getFlightDetail(flight_number: string, flight_status: string): Promise<FlightInfo> {
    const baseUrl: string = process.env.REACT_APP_BASE_URL || "";
    try {
        const response = await axios.get<FlightInfo>(baseUrl + `/flights/show/${flight_number}/${flight_status}`);
        return response.data;
    }catch(error){
        console.error(error);
        throw error;
    }
}