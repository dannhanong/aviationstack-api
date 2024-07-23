import { Aircraft } from "./Aircraft";
import { Airline } from "./Airline";
import { Arrival } from "./Arrival";
import { Departure } from "./Departure";
import { Flight } from "./Flight";
import { Live } from "./Live";

export interface FlightData{
    flight_date?: string;
    flight_status?: string;
    departure?: Departure;
    arrival?: Arrival;
    airline?: Airline;
    flight?: Flight;
    aircraft?: Aircraft;
    live?: Live;
}