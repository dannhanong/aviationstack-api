package com.dan.controller;

import com.dan.model.FlightData;
import com.dan.model.FlightInfoResponse;
import com.dan.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flights")
@CrossOrigin("*")
public class FlightController {
    @Autowired
    private FlightService flightService;

    @GetMapping("/detail")
    public Page<FlightInfoResponse> getFlightData(@RequestParam(value = "page", defaultValue = "0") int page,
                                          @RequestParam(value = "size", defaultValue = "1") int size,
                                          @RequestParam(value = "keyword", defaultValue = "active") String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        return flightService.getFlightDataResponse(pageable, keyword);
    }

    @GetMapping("/status")
    public Page<FlightData> getFlightByStatus(@RequestParam(value = "page", defaultValue = "0") int page,
                                              @RequestParam(value = "size", defaultValue = "10") int size,
                                              @RequestParam(value = "keyword", defaultValue = "active") String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        return flightService.getFlightInfoResponseByStatus(pageable, keyword);
    }

    @GetMapping("/show/{flight_number}/{status}")
    public FlightInfoResponse getFlightInfo(@PathVariable(value = "flight_number") String flight_number,
                                                  @PathVariable(value = "status") String status) {
        return flightService.getFlightInfo(flight_number, status);
    }
}