package com.assistify.backend.controller;


import com.assistify.backend.dto.AuthResponseDTO;
import com.assistify.backend.dto.LoginRequestDTO;
import com.assistify.backend.dto.RegisterRequestDTO;
import com.assistify.backend.entity.User;
import com.assistify.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequestDTO dto) {
        User created = authService.register(dto);
        return ResponseEntity.ok(created);
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}