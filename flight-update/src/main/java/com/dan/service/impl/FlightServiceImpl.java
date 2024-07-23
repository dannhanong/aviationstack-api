package com.dan.service.impl;

import com.dan.model.AirportDetail;
import com.dan.model.FlightData;
import com.dan.model.FlightInfoResponse;
import com.dan.model.FlightResponse;
import com.dan.service.AirportService;
import com.dan.service.FlightService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FlightServiceImpl implements FlightService {
    @Value("${aviationstack.api.key}")
    private String apiKey;
    @Value("${aviationstack.api.url}")
    private String apiUrl;

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private AirportService airportService;

    @Override
    public Page<FlightInfoResponse> getFlightDataResponse(Pageable pageable, String keyword) {
        int limit = pageable.getPageSize();
        int offset = (int) pageable.getOffset();

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("access_key", apiKey)
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .queryParam("flight_status", keyword);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            FlightResponse flightResponse = objectMapper.readValue(response.getBody(), FlightResponse.class);

            List<FlightData> flights = flightResponse.getData();
            List<FlightInfoResponse> flightInfoResponses = new ArrayList<>();
            int total = flightResponse.getPagination().getTotal();

            for (FlightData flight : flights) {
                FlightInfoResponse flightInfoResponse = new FlightInfoResponse();
                flightInfoResponse.setFlightData(flight);

                if (flight.getLive() != null) {
                    double distanceFlightToAirport = getDistanceBetweenAirportAndFlight(flight.getArrival().getIata(), flight.getArrival().getIcao(), flight.getLive().getLatitude(), flight.getLive().getLongitude());
                    double distanceFlightToDeparture = getDistanceBetweenAirportAndFlight(flight.getDeparture().getIata(), flight.getDeparture().getIcao(), flight.getLive().getLatitude(), flight.getLive().getLongitude());
                    double distance2Airport = distanceFlightToAirport + distanceFlightToDeparture;
                    double dFlown = distance2Airport - distanceFlightToAirport;

                    flightInfoResponse.setFar(distance2Airport);
                    flightInfoResponse.setDFlownFraction(dFlown / distance2Airport);
                    flightInfoResponse.setDFlownNumber(dFlown);
                    flightInfoResponse.setDToGoNumber(distanceFlightToAirport);
                }

                flightInfoResponses.add(flightInfoResponse);
            }

            return new PageImpl<>(flightInfoResponses, pageable, total);

        } catch (HttpClientErrorException e) {
            log.error("HTTP Status Code: " + e.getStatusCode());
            log.error("HTTP Response Body: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            log.error("Error parsing response: " + e.getMessage(), e);
            throw new RuntimeException("Error parsing response", e);
        }
    }

    @Override
    public Page<FlightInfoResponse> getFlightDataResponseForActive(Pageable pageable, String keyword) {
        int limit = 100;
        int offset = (int) pageable.getOffset();

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("access_key", apiKey)
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .queryParam("flight_status", keyword);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            FlightResponse flightResponse = objectMapper.readValue(response.getBody(), FlightResponse.class);

            List<FlightData> flights = flightResponse.getData();
            List<FlightInfoResponse> flightInfoResponses = new ArrayList<>();
            int total = flightResponse.getPagination().getTotal();

            for (FlightData flight : flights) {
                FlightInfoResponse flightInfoResponse = new FlightInfoResponse();
                flightInfoResponse.setFlightData(flight);

                if (flight.getLive() != null) {
                    double distanceFlightToAirport = getDistanceBetweenAirportAndFlight(flight.getArrival().getIata(), flight.getArrival().getIcao(), flight.getLive().getLatitude(), flight.getLive().getLongitude());
                    double distanceFlightToDeparture = getDistanceBetweenAirportAndFlight(flight.getDeparture().getIata(), flight.getDeparture().getIcao(), flight.getLive().getLatitude(), flight.getLive().getLongitude());
                    double distance2Airport = distanceFlightToAirport + distanceFlightToDeparture;
                    double dFlown = distance2Airport - distanceFlightToAirport;

                    flightInfoResponse.setFar(distance2Airport);
                    flightInfoResponse.setDFlownFraction(dFlown / distance2Airport);
                    flightInfoResponse.setDFlownNumber(dFlown);
                    flightInfoResponse.setDToGoNumber(distanceFlightToAirport);
                }

                if (flightInfoResponses.size() <= 10){
                    flightInfoResponses.add(flightInfoResponse);
                }
                else {
                    break;
                }
            }

            return new PageImpl<>(flightInfoResponses, pageable, total);

        } catch (HttpClientErrorException e) {
            log.error("HTTP Status Code: " + e.getStatusCode());
            log.error("HTTP Response Body: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            log.error("Error parsing response: " + e.getMessage(), e);
            throw new RuntimeException("Error parsing response", e);
        }
    }

    @Override
    public double getDistanceBetweenTwoAirport(String iataCode1, String icaoCode1, String iataCode2, String icaoCode2) {
        AirportDetail airport1 = airportService.getAirportByIataCode(iataCode1, icaoCode1);
        AirportDetail airport2 = airportService.getAirportByIataCode(iataCode2, icaoCode2);
        return calculateDistance(Double.parseDouble(airport1.getLatitude()), Double.parseDouble(airport1.getLongitude()),
                Double.parseDouble(airport2.getLatitude()), Double.parseDouble(airport2.getLongitude()));
    }

    @Override
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final double EARTH_RADIUS_KM = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                + Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    @Override
    public double getDistanceBetweenAirportAndFlight(String iataCode, String icaoCode, double lat, double lon) {
        AirportDetail airport = airportService.getAirportByIataCode(iataCode, icaoCode);
        if (airport == null) {
            return -1;
        }
        return calculateDistance(Double.parseDouble(airport.getLatitude()), Double.parseDouble(airport.getLongitude()), lat, lon);
    }

    @Override
    public Page<FlightData> getFlightInfoResponseByStatus(Pageable pageable, String keyword) {
        if(!keyword.equals("active")){
            int limit = pageable.getPageSize();
            int offset = (int) pageable.getOffset();

            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("access_key", apiKey)
                    .queryParam("limit", limit)
                    .queryParam("offset", offset)
                    .queryParam("flight_status", keyword);

            try {
                ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
                ObjectMapper objectMapper = new ObjectMapper();
                FlightResponse flightResponse = objectMapper.readValue(response.getBody(), FlightResponse.class);

                List<FlightData> flights = flightResponse.getData();
                if (flights == null) {
                    flights = new ArrayList<>();
                }

                int total = flightResponse.getPagination() != null ? flightResponse.getPagination().getTotal() : flights.size();
                return new PageImpl<>(flights, pageable, total);

            } catch (HttpClientErrorException e) {
                log.error("HTTP Status Code: " + e.getStatusCode());
                log.error("HTTP Response Body: " + e.getResponseBodyAsString());
                throw e;
            } catch (Exception e) {
                log.error("Error parsing response: " + e.getMessage(), e);
                throw new RuntimeException("Error parsing response", e);
            }
        }
        else {
            int limit = 100;
            int offset = (int) pageable.getOffset();

            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("access_key", apiKey)
                    .queryParam("limit", limit)
                    .queryParam("offset", offset)
                    .queryParam("flight_status", "active");

            try {
                ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
                ObjectMapper objectMapper = new ObjectMapper();
                FlightResponse flightResponse = objectMapper.readValue(response.getBody(), FlightResponse.class);

                List<FlightData> flights = flightResponse.getData();
                if (flights == null) {
                    flights = new ArrayList<>();
                }

                List<FlightData> activeFlights = flights.stream()
                        .filter(flight -> flight.getLive() != null)
                        .collect(Collectors.toList());
                return new PageImpl<>(activeFlights, pageable, activeFlights.size());

            } catch (HttpClientErrorException e) {
                log.error("HTTP Status Code: " + e.getStatusCode());
                log.error("HTTP Response Body: " + e.getResponseBodyAsString());
                throw e;
            } catch (Exception e) {
                log.error("Error parsing response: " + e.getMessage(), e);
                throw new RuntimeException("Error parsing response", e);
            }
        }
    }

    @Override
    public FlightInfoResponse getFlightInfo(String flight_number, String status) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("access_key", apiKey)
                .queryParam("flight_status", status);
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            FlightResponse flightResponse = objectMapper.readValue(response.getBody(), FlightResponse.class);

            List<FlightData> flights = flightResponse.getData();

            FlightData flightData = flights.stream()
                    .filter(fD -> flight_number.equals(fD.getFlight().getNumber()))
                    .findFirst()
                    .orElse(null);

            FlightInfoResponse flightInfoResponse = new FlightInfoResponse();
            flightInfoResponse.setFlightData(flightData);

            double distanceFlightToAirport = getDistanceBetweenAirportAndFlight(flightData.getArrival().getIata(), flightData.getArrival().getIcao(), flightData.getLive().getLatitude(), flightData.getLive().getLongitude());
            double dFlown = getDistanceBetweenAirportAndFlight(flightData.getDeparture().getIata(), flightData.getDeparture().getIcao(), flightData.getLive().getLatitude(), flightData.getLive().getLongitude());
            double distance2Airport = Math.abs(distanceFlightToAirport) + Math.abs(dFlown);

            if(distance2Airport < distanceFlightToAirport)
                flightInfoResponse.setDToGoNumber(0);
            else
                flightInfoResponse.setDFlownNumber(Math.abs(dFlown));

            flightInfoResponse.setFar(Math.abs(distance2Airport));
            flightInfoResponse.setDFlownFraction(dFlown / distance2Airport);
            flightInfoResponse.setDToGoNumber(Math.abs(distanceFlightToAirport));

            return flightInfoResponse;

        } catch (HttpClientErrorException e) {
            log.error("HTTP Status Code: " + e.getStatusCode());
            log.error("HTTP Response Body: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            log.error("Error parsing response: " + e.getMessage(), e);
            throw new RuntimeException("Error parsing response", e);
        }
    }

}

