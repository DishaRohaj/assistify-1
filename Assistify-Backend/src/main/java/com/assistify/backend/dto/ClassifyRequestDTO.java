package com.assistify.backend.dto;

import lombok.Data;

@Data
public class ClassifyRequestDTO {
    private String category;
    private String priority;
    private Long assignedToUserId;
}