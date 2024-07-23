package com.dan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightInfoResponse {
    private FlightData flightData;
    private double far;
    private double dFlownFraction;
    private double dFlownNumber;
    private double dToGoNumber;
//    private int minutesEarly;
}
