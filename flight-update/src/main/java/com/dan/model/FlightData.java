package com.dan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightData {
    private String flight_date;
    private String flight_status;
    private Airport departure;
    private Airport arrival;
    private Airline airline;
    private Flight flight;
    private Aircraft aircraft;
    private Live live;
}
