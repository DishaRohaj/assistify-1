package com.assistify.backend.dto;

import lombok.Data;

@Data
public class CreateArticleDTO {
    private String title;
    private String content;
    private String category;
}