package ru.productinventory.dto.imports;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import ru.productinventory.dto.shared.LocationDTO;

@Data
public class PersonImportDTO {
    @NotBlank
    private String name;

    @NotNull
    private String nationality;

    @NotNull
    private String eyeColor;

    @NotNull
    private String hairColor;

    @Positive
    private Double height;

    @Valid
    private LocationDTO location;
}
