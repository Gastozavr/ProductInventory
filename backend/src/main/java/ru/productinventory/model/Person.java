package ru.productinventory.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Person {
    private long id;
    private String name;
    private Color eyeColor;
    private Color hairColor;
    private Location location;
    private double height;
    private Country nationality;
}