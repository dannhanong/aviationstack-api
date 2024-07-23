package com.dan.controller;

import com.dan.model.Airport;
import com.dan.model.AirportDetail;
import com.dan.service.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/airports")
public class AirportController {
    @Autowired
    private AirportService airportService;

    @GetMapping
    public AirportDetail getAirport() {
        return airportService.getAirportByIataCode("AAA", "NTGA");
    }
}
