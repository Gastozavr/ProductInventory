package ru.productinventory.mapper;

import org.springframework.stereotype.Component;
import ru.productinventory.dto.person.PersonCreateDTO;
import ru.productinventory.dto.person.PersonViewDTO;
import ru.productinventory.dto.shared.LocationDTO;
import ru.productinventory.model.Location;
import ru.productinventory.model.Person;

@Component
public class PersonMapper {

    public Person toEntity(PersonCreateDTO dto) {
        Person p = new Person();
        p.setName(dto.getName());
        p.setEyeColor(dto.getEyeColor());
        p.setHairColor(dto.getHairColor());
        LocationDTO ld = dto.getLocation();
        if (ld != null) {
            Location l = new Location();
            l.setX(ld.getX());
            l.setY(ld.getY());
            l.setName(ld.getName());
            p.setLocation(l);
        }
        p.setHeight(dto.getHeight());
        p.setNationality(dto.getNationality());
        return p;
    }

    public PersonViewDTO toView(Person p) {
        return PersonViewDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .eyeColor(p.getEyeColor())
                .hairColor(p.getHairColor())
                .locationName(p.getLocation() != null ? p.getLocation().getName() : null)
                .locationX(p.getLocation() != null ? p.getLocation().getX() : null)
                .locationY(p.getLocation() != null ? p.getLocation().getY() : null)
                .height(p.getHeight())
                .nationality(p.getNationality())
                .build();
    }

}

