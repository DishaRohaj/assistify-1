package com.assistify.backend.dto;

import lombok.Data;

@Data
public class CreateRequestDTO {
    private String description;
    private Long raisedByUserId;
}
