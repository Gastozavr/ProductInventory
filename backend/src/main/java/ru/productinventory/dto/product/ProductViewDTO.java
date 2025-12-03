package ru.productinventory.dto.product;

import lombok.Builder;
import lombok.Data;
import lombok.Value;
import ru.productinventory.dto.organization.OrganizationViewDTO;
import ru.productinventory.dto.person.PersonViewDTO;
import ru.productinventory.dto.shared.CoordinatesDTO;
import ru.productinventory.model.UnitOfMeasure;

import java.util.Date;

@Value
@Builder
@Data
public class ProductViewDTO {
    private Long id;
    private String name;
    private CoordinatesDTO coordinates;
    private Date creationDate;
    private UnitOfMeasure unitOfMeasure;
    private OrganizationViewDTO manufacturer;
    private Long price;
    private Integer manufactureCost;
    private Long rating;
    private String partNumber;
    private PersonViewDTO owner;
}
