package com.assistify.backend.repository;

import java.util.List;
import com.assistify.backend.entity.Request;
import com.assistify.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByRaisedByOrderByCreatedAtDesc(User raisedBy);
    List<Request> findByStatusOrderByCreatedAtDesc(Request.Status status);
    List<Request> findAllByOrderByCreatedAtDesc();
    List<Request> findByAssignedToOrderByCreatedAtDesc(User assignedTo);
    List<Request> findByEscalatedByOrderByCreatedAtDesc(User escalatedBy);
    List<Request> findByResolutionDueAtIsNotNullAndStatusNotIn(List<Request.Status> statuses);
}