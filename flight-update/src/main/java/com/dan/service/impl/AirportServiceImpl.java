package com.dan.service.impl;

import com.dan.model.AirportDetail;
import com.dan.model.AirportResponse;
import com.dan.service.AirportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AirportServiceImpl implements AirportService {
    @Value("${aviationstack.api.key}")
    private String apiKey;
    @Value("${aviationstack.apiAirport.url}")
    private String apiUrl;
    @Autowired
    private RestTemplate restTemplate;

    private final Map<String, AirportDetail> iataCache = new ConcurrentHashMap<>();
    private final Map<String, AirportDetail> icaoCache = new ConcurrentHashMap<>();

    @Override
    public AirportDetail getAirportByIataCode(String iataCode, String icaoCode) {
        if (iataCode != null && iataCache.containsKey(iataCode)) {
            return iataCache.get(iataCode);
        }
        if (icaoCode != null && icaoCache.containsKey(icaoCode)) {
            return icaoCache.get(icaoCode);
        }

        int offset = 0;
        int limit = 100000;
        boolean moreData = true;

//        while (moreData) {
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("access_key", apiKey)
                    .queryParam("limit", limit)
                    .queryParam("offset", offset);

            try {
                ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
                ObjectMapper objectMapper = new ObjectMapper();
                AirportResponse airportResponse = objectMapper.readValue(response.getBody(), AirportResponse.class);

                List<AirportDetail> airports = airportResponse.getData();

                if (airports != null && !airports.isEmpty()) {
                    iataCache.putAll(
                            airports.stream().collect(Collectors.toMap(AirportDetail::getIata_code, airport -> airport))
                    );
                    icaoCache.putAll(
                            airports.stream().collect(Collectors.toMap(AirportDetail::getIcao_code, airport -> airport))
                    );

                    for (AirportDetail airport : airports) {
                        if (iataCode != null && iataCode.equals(airport.getIata_code())) {
                            return airport;
                        }
                        if (icaoCode != null && icaoCode.equals(airport.getIcao_code())) {
                            return airport;
                        }
                    }

                    offset += limit;
                } else {
                    moreData = false;
                }
            } catch (HttpClientErrorException e) {
                System.out.println("HTTP Client Error: " + e.getStatusCode());
                System.out.println("Response Body: " + e.getResponseBodyAsString());
                throw e;
            } catch (HttpServerErrorException e) {
                System.out.println("HTTP Server Error: " + e.getStatusCode());
                System.out.println("Response Body: " + e.getResponseBodyAsString());
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException interruptedException) {
                    interruptedException.printStackTrace();
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Error message: " + e.getMessage());
                moreData = false;
            }
//        }

        return null;
    }
}
