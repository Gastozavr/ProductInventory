package ru.productinventory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Product {
    private long id;
    private String name;
    private Coordinates coordinates;
    private java.util.Date creationDate;
    private UnitOfMeasure unitOfMeasure;
    private Organization manufacturer;
    private long price;
    private int manufactureCost;
    private long rating;
    private String partNumber;
    private Person owner;
}
