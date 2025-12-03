package ru.productinventory.dto.shared;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    private String zipCode;
    private LocationDTO town;
}
