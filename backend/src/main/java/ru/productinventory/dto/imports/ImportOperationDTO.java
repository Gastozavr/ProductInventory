package ru.productinventory.dto.imports;

import ru.productinventory.model.ImportOperation;

public record ImportOperationDTO(
        Long id,
        String status,
        Integer createdCount,
        String startedAt,
        String finishedAt
) {
    public static ImportOperationDTO from(ImportOperation o) {
        return new ImportOperationDTO(
                o.getId(),
                o.getStatus().name(),
                o.getCreatedCount(),
                o.getStartedAt() == null ? null : o.getStartedAt().toString(),
                o.getFinishedAt() == null ? null : o.getFinishedAt().toString()
        );
    }
}
