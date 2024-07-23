package com.dan.service;

import com.dan.model.FlightData;
import com.dan.model.FlightInfoResponse;
import com.dan.model.FlightResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FlightService {
    public Page<FlightInfoResponse> getFlightDataResponse(Pageable pageable, String keyword);
    public double getDistanceBetweenTwoAirport(String iataCode1, String icaoCode1, String iataCode2, String icaoCode2);
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2);
    public double getDistanceBetweenAirportAndFlight(String iataCode, String icaoCode, double lat, double lon);
    public Page<FlightData> getFlightInfoResponseByStatus(Pageable pageable, String keyword);
    public FlightInfoResponse getFlightInfo(String flight_number, String status);
    public Page<FlightInfoResponse> getFlightDataResponseForActive(Pageable pageable, String keyword);
}
