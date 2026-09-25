package com.assistify.backend.service;

import com.assistify.backend.entity.Request;
import com.assistify.backend.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlaAlertService {

    private final RequestRepository requestRepository;
    private final NotificationService notificationService;

    private static final List<Request.Status> EXCLUDED_STATUSES = List.of(
            Request.Status.RESOLVED,
            Request.Status.CLOSED,
            Request.Status.PENDING_USER_CONFIRMATION,
            Request.Status.NEED_MORE_INFO
    );

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void checkSlaBreaches() {
        List<Request> trackedRequests =
                requestRepository.findByResolutionDueAtIsNotNullAndStatusNotIn(EXCLUDED_STATUSES);

        LocalDateTime now = LocalDateTime.now();

        for (Request request : trackedRequests) {

            if (request.getAssignedTo() == null) {
                continue;
            }

            long minutesRemaining = ChronoUnit.MINUTES.between(now, request.getResolutionDueAt());

            boolean isBreached = minutesRemaining < 0;
            boolean isAtRisk = !isBreached && minutesRemaining < 60;

            if (isBreached && !request.isSlaBreachedNotified()) {

                notificationService.notifyUser(
                        request.getAssignedTo(),
                        "Ticket #" + request.getId() + " has breached its SLA and needs immediate attention.",
                        request.getId()
                );
                request.setSlaBreachedNotified(true);
                requestRepository.save(request);

            } else if (isAtRisk && !request.isSlaAtRiskNotified()) {

                notificationService.notifyUser(
                        request.getAssignedTo(),
                        "Ticket #" + request.getId() + " is at risk of breaching its SLA (under 1 hour remaining).",
                        request.getId()
                );
                request.setSlaAtRiskNotified(true);
                requestRepository.save(request);
            }
        }
    }
}