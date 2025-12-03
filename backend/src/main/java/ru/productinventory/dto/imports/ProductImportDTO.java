package ru.productinventory.dto.imports;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import ru.productinventory.dto.shared.CoordinatesDTO;

@Data
public class ProductImportDTO {
    @NotBlank
    private String name;

    @Valid
    @NotNull
    private CoordinatesDTO coordinates;

    @NotNull
    private String unitOfMeasure;

    @Valid
    @NotNull
    private OrganizationImportDTO manufacturer;

    @Positive
    private Integer price;

    @Positive
    private Integer manufactureCost;

    @Positive
    private Integer rating;

    @NotBlank
    private String partNumber;

    @Valid
    private PersonImportDTO owner;
}
