package ru.productinventory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Organization {
    private int id;
    private String name;
    private Address officialAddress;
    private Double annualTurnover;
    private int employeesCount;
    private String fullName;
    private int rating;
    private Address postalAddress;
}