package ru.productinventory.dto.organization;

import lombok.*;
import ru.productinventory.dto.shared.AddressDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationCreateDTO {
    private String name;
    private Double annualTurnover;
    private Integer employeesCount;
    private String fullName;
    private Integer rating;
    private AddressDTO officialAddress;
    private AddressDTO postalAddress;
}
