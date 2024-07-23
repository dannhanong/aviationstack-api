package com.dan.service;

import com.dan.model.Airport;
import com.dan.model.AirportDetail;

public interface AirportService {
    public AirportDetail getAirportByIataCode(String iataCode, String icaoCode);
}
