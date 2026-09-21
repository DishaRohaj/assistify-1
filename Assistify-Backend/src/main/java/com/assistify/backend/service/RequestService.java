package com.assistify.backend.service;

import java.util.List;
import com.assistify.backend.dto.CreateRequestDTO;
import com.assistify.backend.entity.Request;
import com.assistify.backend.entity.User;
import com.assistify.backend.repository.RequestRepository;
import com.assistify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.assistify.backend.entity.RequestAttachment;
import com.assistify.backend.repository.RequestAttachmentRepository;



@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestAttachmentRepository attachmentRepository;

    @Autowired
    private NotificationService notificationService;

    public Request createRequest(CreateRequestDTO dto, User user) {
        Request request = new Request();
        request.setDescription(dto.getDescription());
        request.setRaisedBy(user);
        if (dto.getCategory() != null && !dto.getCategory().isBlank()) {
            request.setCategory(Request.Category.valueOf(dto.getCategory()));
        }
        return requestRepository.save(request);
    }

    public List<Request> getRequestsForUser(User user) {
        return requestRepository.findByRaisedByOrderByCreatedAtDesc(user);
    }

    public List<Request> getQueueForServiceDesk() {
        return requestRepository.findByStatusOrderByCreatedAtDesc(Request.Status.OPEN);
    }

    public List<Request> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc();
    }

    public Request classifyAndAssign(Long requestId, String category, String priority, Long assignedToUserId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        if (category != null && !category.isBlank()) {
            request.setCategory(Request.Category.valueOf(category));
        }
        if (priority != null && !priority.isBlank()) {
            Request.Priority p = Request.Priority.valueOf(priority);
            request.setPriority(p);
            long hours = switch (p) {
                case HIGH -> 4;
                case MEDIUM -> 8;
                case LOW -> 24;
            };
            request.setResolutionDueAt(request.getCreatedAt().plusHours(hours));
        }
        if (assignedToUserId != null) {
            User agent = userRepository.findById(assignedToUserId)
                    .orElseThrow(() -> new RuntimeException("Agent not found: " + assignedToUserId));
            request.setAssignedTo(agent);
        }
        request.setStatus(Request.Status.ASSIGNED);
        request.setUpdatedAt(java.time.LocalDateTime.now());

        Request saved = requestRepository.save(request);
        notificationService.notifyUser(
                saved.getRaisedBy(),
                "Your ticket #" + saved.getId() + " has been classified and assigned.",
                saved.getId()
        );
        return saved;
    }

    public Request getById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));
    }

    public Request getByIdForUser(Long id, User user) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));

        boolean isOwner = request.getRaisedBy().getId().equals(user.getId());
        boolean isStaff = user.getRole() == User.Role.SERVICE_DESK
                || user.getRole() == User.Role.L1_SUPPORT
                || user.getRole() == User.Role.L2_SUPPORT
                || user.getRole() == User.Role.MANAGER
                || user.getRole() == User.Role.ADMIN;

        if (!isOwner && !isStaff) {
            throw new RuntimeException("You are not allowed to view this request.");
        }

        return request;
    }

    public Request assignAgent(Long requestId, Long assignedToUserId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));
        User agent = userRepository.findById(assignedToUserId)
                .orElseThrow(() -> new RuntimeException("Agent not found: " + assignedToUserId));
        request.setAssignedTo(agent);
        request.setStatus(Request.Status.ASSIGNED);
        request.setUpdatedAt(java.time.LocalDateTime.now());

        Request saved = requestRepository.save(request);
        notificationService.notifyUser(
                saved.getRaisedBy(),
                "Your ticket #" + saved.getId() + " has been assigned to a support agent.",
                saved.getId()
        );
        return saved;
    }

    public List<Request> getTicketsForAgent(User agent) {
        return requestRepository.findByAssignedToOrderByCreatedAtDesc(agent);
    }

    public List<Request> getTicketsEscalatedByAgent(User agent) {
        return requestRepository.findByEscalatedByOrderByCreatedAtDesc(agent);
    }

    public Request resolveTicket(Long id, String resolutionSummary) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));
        request.setStatus(Request.Status.PENDING_USER_CONFIRMATION);
        request.setResolutionSummary(resolutionSummary);
        request.setReopenReason(null);
        request.setUpdatedAt(java.time.LocalDateTime.now());

        Request saved = requestRepository.save(request);
        notificationService.notifyUser(
                saved.getRaisedBy(),
                "Your ticket #" + saved.getId() + " has been resolved. Please confirm if the issue is fixed.",
                saved.getId()
        );
        return saved;
    }

    public Request escalateToL2(Long id, Long l2AgentId, User escalatedBy) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));
        if (l2AgentId != null) {
            User l2Agent = userRepository.findById(l2AgentId)
                    .orElseThrow(() -> new RuntimeException("Agent not found: " + l2AgentId));
            request.setAssignedTo(l2Agent);
        }
        request.setEscalatedBy(escalatedBy);
        request.setStatus(Request.Status.IN_PROGRESS);
        request.setUpdatedAt(java.time.LocalDateTime.now());

        Request saved = requestRepository.save(request);
        notificationService.notifyUser(
                saved.getRaisedBy(),
                "Your ticket #" + saved.getId() + " has been escalated to a specialist team.",
                saved.getId()
        );
        return saved;
    }

    public Request confirmResolution(Long id, User user) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));

        if (!request.getRaisedBy().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to confirm this request.");
        }
        if (request.getStatus() != Request.Status.PENDING_USER_CONFIRMATION) {
            throw new RuntimeException("Only a resolved ticket awaiting confirmation can be closed.");
        }

        request.setStatus(Request.Status.CLOSED);
        request.setUpdatedAt(java.time.LocalDateTime.now());
        Request saved = requestRepository.save(request);

        if (saved.getAssignedTo() != null) {
            notificationService.notifyUser(
                    saved.getAssignedTo(),
                    "Ticket #" + saved.getId() + " was confirmed as resolved by the requester.",
                    saved.getId()
            );
        }
        return saved;
    }

    public Request reopenTicket(Long id, User user, String reason) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found: " + id));

        if (!request.getRaisedBy().getId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to reopen this request.");
        }
        if (request.getStatus() != Request.Status.PENDING_USER_CONFIRMATION) {
            throw new RuntimeException("Only a resolved ticket awaiting confirmation can be reopened.");
        }

        request.setStatus(Request.Status.REOPENED);
        request.setReopenReason(reason);
        request.setUpdatedAt(java.time.LocalDateTime.now());
        Request saved = requestRepository.save(request);

        if (saved.getAssignedTo() != null) {
            notificationService.notifyUser(
                    saved.getAssignedTo(),
                    "Ticket #" + saved.getId() + " was reopened by the requester.",
                    saved.getId()
            );
        }
        return saved;
    }

    public RequestAttachment addAttachment(Long requestId, MultipartFile file) {

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        if (file.isEmpty()) {
            throw new RuntimeException("File cannot be empty");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size cannot exceed 10 MB");
        }

        try {
            RequestAttachment attachment = new RequestAttachment();

            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setFileData(file.getBytes());
            attachment.setRequest(request);

            return attachmentRepository.save(attachment);

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload attachment", e);
        }
    }

}