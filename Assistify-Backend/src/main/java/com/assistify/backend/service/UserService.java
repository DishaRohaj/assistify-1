package com.assistify.backend.service;

import com.assistify.backend.dto.UpdateProfileDTO;
import com.assistify.backend.entity.User;
import com.assistify.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User updateProfile(User currentUser, UpdateProfileDTO dto) {
        currentUser.setDepartment(dto.getDepartment());
        return userRepository.save(currentUser);
    }
}