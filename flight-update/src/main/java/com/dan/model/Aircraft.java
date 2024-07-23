package com.dan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aircraft {
    private String registration;
    private String iata;
    private String icao;
    private String icao24;
}
