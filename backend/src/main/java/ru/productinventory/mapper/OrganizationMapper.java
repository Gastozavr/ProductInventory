package ru.productinventory.mapper;

import org.springframework.stereotype.Component;
import ru.productinventory.dto.organization.OrganizationCreateDTO;
import ru.productinventory.dto.organization.OrganizationViewDTO;
import ru.productinventory.dto.shared.AddressDTO;
import ru.productinventory.dto.shared.LocationDTO;
import ru.productinventory.model.Address;
import ru.productinventory.model.Location;
import ru.productinventory.model.Organization;

@Component
public class OrganizationMapper {

    public Organization toEntity(OrganizationCreateDTO dto) {
        Organization o = new Organization();
        o.setName(dto.getName());
        o.setAnnualTurnover(dto.getAnnualTurnover());
        o.setEmployeesCount(dto.getEmployeesCount());
        o.setFullName(dto.getFullName());
        o.setRating(dto.getRating());
        o.setOfficialAddress(toAddress(dto.getOfficialAddress()));
        o.setPostalAddress(toAddress(dto.getPostalAddress()));
        return o;
    }

    private Address toAddress(AddressDTO dto) {
        if (dto == null) return null;
        Address a = new Address();
        a.setZipCode(dto.getZipCode());
        LocationDTO t = dto.getTown();
        if (t != null) {
            Location loc = new Location();
            loc.setX(t.getX());
            loc.setY(t.getY());
            loc.setName(t.getName());
            a.setTown(loc);
        }
        return a;
    }

    public OrganizationViewDTO toView(Organization o) {
        if (o == null) return null;

        AddressDTO officialAddressDto = null;
        if (o.getOfficialAddress() != null) {
            var a = o.getOfficialAddress();
            LocationDTO townDto = null;
            if (a.getTown() != null) {
                var t = a.getTown();
                townDto = LocationDTO.builder()
                        .x(t.getX())
                        .y(t.getY())
                        .name(t.getName())
                        .build();
            }
            officialAddressDto = AddressDTO.builder()
                    .zipCode(a.getZipCode())
                    .town(townDto)
                    .build();
        }

        AddressDTO postalAddressDto = null;
        if (o.getPostalAddress() != null) {
            var a = o.getPostalAddress();
            LocationDTO townDto = null;
            if (a.getTown() != null) {
                var t = a.getTown();
                townDto = LocationDTO.builder()
                        .x(t.getX())
                        .y(t.getY())
                        .name(t.getName())
                        .build();
            }
            postalAddressDto = AddressDTO.builder()
                    .zipCode(a.getZipCode())
                    .town(townDto)
                    .build();
        }

        return OrganizationViewDTO.builder()
                .id(o.getId())
                .name(o.getName())
                .officialAddress(officialAddressDto)
                .postalAddress(postalAddressDto)
                .annualTurnover(o.getAnnualTurnover())
                .employeesCount(o.getEmployeesCount())
                .fullName(o.getFullName())
                .rating(o.getRating())
                .build();
    }
}
