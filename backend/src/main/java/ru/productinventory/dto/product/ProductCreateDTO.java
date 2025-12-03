package ru.productinventory.dto.product;

import lombok.*;
import ru.productinventory.dto.shared.CoordinatesDTO;
import ru.productinventory.dto.shared.OrganizationRefDTO;
import ru.productinventory.dto.shared.PersonRefDTO;
import ru.productinventory.model.UnitOfMeasure;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCreateDTO {
    private String name;
    private CoordinatesDTO coordinates;
    private UnitOfMeasure unitOfMeasure;
    private OrganizationRefDTO manufacturer;
    private Long price;
    private Integer manufactureCost;
    private Long rating;
    private String partNumber;
    private PersonRefDTO owner;
}
