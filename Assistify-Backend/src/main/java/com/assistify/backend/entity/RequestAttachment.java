package com.assistify.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "request_attachments")
@Data
public class RequestAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    private String fileType;

    @Column(nullable = false)
    private Long fileSize;

    @JsonIgnore
    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] fileData;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private Request request;
}