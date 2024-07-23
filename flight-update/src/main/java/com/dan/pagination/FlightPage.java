package com.dan.pagination;

import com.dan.model.FlightData;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class FlightPage extends PageImpl<FlightData> {
    public FlightPage(List<FlightData> content, Pageable pageable, long total) {
        super(content, pageable, total);
    }
}
