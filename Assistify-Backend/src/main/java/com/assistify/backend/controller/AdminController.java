package com.assistify.backend.controller;

import com.assistify.backend.dto.SetUserActiveDTO;
import com.assistify.backend.dto.UpdateUserRoleDTO;
import com.assistify.backend.entity.User;
import com.assistify.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody UpdateUserRoleDTO dto) {
        return ResponseEntity.ok(adminService.updateUserRole(id, dto.getRole()));
    }

    @PutMapping("/users/{id}/active")
    public ResponseEntity<User> setUserActive(@PathVariable Long id, @RequestBody SetUserActiveDTO dto, @AuthenticationPrincipal User currentAdmin) {
        return ResponseEntity.ok(adminService.setUserActive(id, dto.isActive(), currentAdmin));
    }
}