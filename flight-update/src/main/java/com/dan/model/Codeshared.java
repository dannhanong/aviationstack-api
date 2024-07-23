package com.dan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Codeshared {
    private String airline_name;
    private String airline_iata;
    private String airline_icao;
    private String flight_number;
    private String flight_iata;
    private String flight_icao;
}
