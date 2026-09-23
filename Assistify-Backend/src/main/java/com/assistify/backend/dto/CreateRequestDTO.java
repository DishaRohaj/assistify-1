package com.assistify.backend.dto;

import lombok.Data;

@Data
public class CreateRequestDTO {
    private String description;
    private String category;
    private String additionalDetails;
    private String contactPreference;
}