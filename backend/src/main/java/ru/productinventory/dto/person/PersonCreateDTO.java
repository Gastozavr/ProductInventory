package ru.productinventory.dto.person;

import lombok.*;
import ru.productinventory.dto.shared.LocationDTO;
import ru.productinventory.model.Color;
import ru.productinventory.model.Country;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonCreateDTO {
    private String name;
    private Color eyeColor;
    private Color hairColor;
    private LocationDTO location;
    private Double height;
    private Country nationality;
}
