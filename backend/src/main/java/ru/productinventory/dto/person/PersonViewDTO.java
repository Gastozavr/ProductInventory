package ru.productinventory.dto.person;

import lombok.Builder;
import lombok.Data;
import lombok.Value;
import ru.productinventory.model.Color;
import ru.productinventory.model.Country;

@Value
@Builder
@Data
public class PersonViewDTO {
    private Long id;
    private String name;
    private Color eyeColor;
    private Color hairColor;

    private String locationName;
    private Long locationX;
    private Long locationY;

    private Double height;
    private Country nationality;
}
