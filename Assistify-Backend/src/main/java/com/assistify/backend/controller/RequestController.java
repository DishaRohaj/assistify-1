package com.assistify.backend.controller;
import com.assistify.backend.dto.AssignRequestDTO;
import com.assistify.backend.dto.ClassifyRequestDTO;
import com.assistify.backend.dto.CreateRequestDTO;
import com.assistify.backend.dto.ProvideMoreInfoDTO;
import com.assistify.backend.dto.ReopenRequestDTO;
import com.assistify.backend.dto.RequestMoreInfoDTO;
import com.assistify.backend.entity.Request;
import com.assistify.backend.entity.User;
import com.assistify.backend.repository.UserRepository;
import com.assistify.backend.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.assistify.backend.dto.ResolveRequestDTO;
import com.assistify.backend.dto.EscalateRequestDTO;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.assistify.backend.entity.RequestAttachment;



@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Request> createRequest(@RequestBody CreateRequestDTO dto, @AuthenticationPrincipal User user) {
        Request created = requestService.createRequest(dto, user);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Request>> getMyRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(requestService.getRequestsForUser(user));
    }

    @GetMapping("/queue")
    @PreAuthorize("hasRole('SERVICE_DESK')")
    public ResponseEntity<List<Request>> getQueue() {
        return ResponseEntity.ok(requestService.getQueueForServiceDesk());
    }

    @PutMapping("/{id}/classify")
    @PreAuthorize("hasRole('SERVICE_DESK')")
    public ResponseEntity<Request> classify(@PathVariable Long id, @RequestBody ClassifyRequestDTO dto) {
        Request updated = requestService.classifyAndAssign(id, dto.getCategory(), dto.getPriority(), dto.getAssignedToUserId());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/agents")
    @PreAuthorize("hasRole('SERVICE_DESK') or hasRole('MANAGER')")
    public ResponseEntity<List<User>> getAgents() {
        return ResponseEntity.ok(userRepository.findByRoleIn(List.of(User.Role.L1_SUPPORT, User.Role.L2_SUPPORT)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Request> getOne(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(requestService.getByIdForUser(id, user));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('SERVICE_DESK') or hasRole('MANAGER')")
    public ResponseEntity<List<Request>> getAll() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }


    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('SERVICE_DESK')")
    public ResponseEntity<Request> assign (@PathVariable Long id, @RequestBody AssignRequestDTO dto){
        Request updated = requestService.assignAgent(id, dto.getAssignedToUserId());
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/my-assigned")
    @PreAuthorize("hasRole('L1_SUPPORT') or hasRole('L2_SUPPORT')")
    public ResponseEntity<List<Request>> getMyAssigned (@AuthenticationPrincipal User user){
        return ResponseEntity.ok(requestService.getTicketsForAgent(user));
    }

    @GetMapping("/escalated-by-me")
    @PreAuthorize("hasRole('L1_SUPPORT')")
    public ResponseEntity<List<Request>> getEscalatedByMe(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(requestService.getTicketsEscalatedByAgent(user));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('L1_SUPPORT') or hasRole('L2_SUPPORT')")
    public ResponseEntity<Request> resolve (@PathVariable Long id, @RequestBody ResolveRequestDTO dto){
        return ResponseEntity.ok(requestService.resolveTicket(id, dto.getResolutionSummary()));
    }

    @PutMapping("/{id}/escalate")
    @PreAuthorize("hasRole('L1_SUPPORT')")
    public ResponseEntity<Request> escalate (@PathVariable Long id, @RequestBody EscalateRequestDTO dto, @AuthenticationPrincipal User user){
        return ResponseEntity.ok(requestService.escalateToL2(id, dto.getL2AgentId(), user));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Request> confirm(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(requestService.confirmResolution(id, user));
    }

    @PutMapping("/{id}/reopen")
    public ResponseEntity<Request> reopen(@PathVariable Long id, @RequestBody ReopenRequestDTO dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(requestService.reopenTicket(id, user, dto.getReason()));
    }

    @PutMapping("/{id}/request-more-info")
    @PreAuthorize("hasRole('SERVICE_DESK') or hasRole('L1_SUPPORT') or hasRole('L2_SUPPORT')")
    public ResponseEntity<Request> requestMoreInfo(@PathVariable Long id, @RequestBody RequestMoreInfoDTO dto) {
        return ResponseEntity.ok(requestService.requestMoreInfo(id, dto.getMessage()));
    }

    @PutMapping("/{id}/provide-more-info")
    public ResponseEntity<Request> provideMoreInfo(@PathVariable Long id, @RequestBody ProvideMoreInfoDTO dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(requestService.provideMoreInfo(id, user, dto.getResponse()));
    }

    @PostMapping("/{id}/attachments")
    public ResponseEntity<RequestAttachment> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(
                requestService.addAttachment(id, file)
        );
    }
    @GetMapping("/{id}/attachments/{attachmentId}/download")
    public ResponseEntity<byte[]> downloadAttachment(
            @PathVariable Long id,
            @PathVariable Long attachmentId,
            @AuthenticationPrincipal User user
    ) {
        RequestAttachment attachment = requestService.getAttachmentForDownload(id, attachmentId, user);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName() + "\"")
                .contentType(attachment.getFileType() != null
                        ? org.springframework.http.MediaType.parseMediaType(attachment.getFileType())
                        : org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                .body(attachment.getFileData());
    }

}