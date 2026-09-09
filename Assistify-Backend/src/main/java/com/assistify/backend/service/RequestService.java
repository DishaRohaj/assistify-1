package com.assistify.backend.service;

import com.assistify.backend.dto.CreateRequestDTO;
import com.assistify.backend.entity.Request;
import com.assistify.backend.entity.User;
import com.assistify.backend.repository.RequestRepository;
import com.assistify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    public Request createRequest(CreateRequestDTO dto) {
        User user = userRepository.findById(dto.getRaisedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getRaisedByUserId()));

        Request request = new Request();
        request.setDescription(dto.getDescription());
        request.setRaisedBy(user);
        // status defaults to OPEN automatically — set in the entity itself

        return requestRepository.save(request);
    }
}