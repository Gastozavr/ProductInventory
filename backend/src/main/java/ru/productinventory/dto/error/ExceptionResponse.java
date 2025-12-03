package ru.productinventory.dto.error;

import lombok.Builder;
import lombok.Data;
import lombok.Value;
import ru.productinventory.dto.imports.ValidationError;

import java.time.Instant;
import java.util.List;

@Value
@Builder
@Data
public class ExceptionResponse {

    int status;
    String error;
    String message;
    String path;
    Instant timestamp;
    List<ValidationError> details;
}
