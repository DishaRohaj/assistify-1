package com.assistify.backend.controller;

import com.assistify.backend.dto.ChatRequestDTO;
import com.assistify.backend.dto.ChatResponseDTO;
import com.assistify.backend.service.TaraService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tara")
@RequiredArgsConstructor
public class TaraController {

    private final TaraService taraService;

    @PostMapping("/ask")
    public ChatResponseDTO ask(@RequestBody ChatRequestDTO request) {
        return taraService.askTara(request.getMessage());
    }
}