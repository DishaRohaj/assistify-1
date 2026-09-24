package com.assistify.backend.service;

import com.assistify.backend.entity.User;
import com.assistify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAllByOrderByIdAsc();
    }

    public User updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setRole(User.Role.valueOf(role));
        return userRepository.save(user);
    }

    public User setUserActive(Long userId, boolean active, User currentAdmin) {
        if (userId.equals(currentAdmin.getId())) {
            throw new RuntimeException("You cannot deactivate your own account.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        user.setActive(active);
        return userRepository.save(user);
    }
}