package com.dan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Live {
    private String updated;
    private Double latitude;
    private Double longitude;
    private Double altitude;
    private Double direction;
    private Double speed_horizontal;
    private Double speed_vertical;
    private Boolean is_ground;
}
