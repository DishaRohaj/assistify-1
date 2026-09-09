package com.assistify.backend.controller;

import com.assistify.backend.dto.CreateRequestDTO;
import com.assistify.backend.entity.Request;
import com.assistify.backend.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    public ResponseEntity<Request> createRequest(@RequestBody CreateRequestDTO dto) {
        Request created = requestService.createRequest(dto);
        return ResponseEntity.ok(created);
    }
}