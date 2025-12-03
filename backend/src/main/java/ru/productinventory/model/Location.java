package ru.productinventory.model;

import lombok.Data;

@Data
public class Location {
    private long id;
    private Long x;
    private Long y;
    private String name;
}