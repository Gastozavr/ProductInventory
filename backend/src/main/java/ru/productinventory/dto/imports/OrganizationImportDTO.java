package ru.productinventory.dto.imports;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import ru.productinventory.dto.shared.AddressDTO;

@Data
public class OrganizationImportDTO {
    @NotBlank
    private String name;

    private String fullName;

    @Positive
    private Double annualTurnover;

    @Positive
    private Long employeesCount;

    @Positive
    private Integer rating;

    @Valid
    @NotNull
    private AddressDTO officialAddress;

    @Valid
    @NotNull
    private AddressDTO postalAddress;
}
