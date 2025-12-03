package ru.productinventory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Coordinates {
    private Long id;
    private Double x;
    private Long y;
}
