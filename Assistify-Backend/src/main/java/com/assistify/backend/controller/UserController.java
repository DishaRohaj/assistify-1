package com.assistify.backend.controller;

import com.assistify.backend.dto.UpdateProfileDTO;
import com.assistify.backend.entity.User;
import com.assistify.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/me")
    public ResponseEntity<User> updateMyProfile(
            @RequestBody UpdateProfileDTO dto,
            @AuthenticationPrincipal User user
    ) {
        User updated = userService.updateProfile(user, dto);
        return ResponseEntity.ok(updated);
    }
}