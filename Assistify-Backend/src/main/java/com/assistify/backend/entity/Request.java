package com.assistify.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "requests")
@Data
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;

    @Enumerated(EnumType.STRING)
    private Status previousStatus;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Priority priority;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "raised_by_id", nullable = false)
    private User raisedBy;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "escalated_by_id")
    private User escalatedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;
    private LocalDateTime resolutionDueAt;

    @Column(length = 2000)
    private String resolutionSummary;

    @Column(length = 2000)
    private String reopenReason;

    @Column(length = 2000)
    private String additionalDetails;

    private String contactPreference;

    private String phoneNumber;

    @Column(length = 2000)
    private String moreInfoRequest;

    @Column(length = 2000)
    private String moreInfoResponse;

    @Column(nullable = false)
    private boolean slaAtRiskNotified = false;

    @Column(nullable = false)
    private boolean slaBreachedNotified = false;

    @OneToMany(
            mappedBy = "request",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RequestAttachment> attachments = new ArrayList<>();

    @JsonProperty("assignedToId")
    public Long getAssignedToId() {
        return assignedTo != null ? assignedTo.getId() : null;
    }

    @JsonProperty("assignedToName")
    public String getAssignedToName() {
        return assignedTo != null ? assignedTo.getFullName() : null;
    }

    @JsonProperty("assignedToRole")
    public String getAssignedToRole() {
        return assignedTo != null ? assignedTo.getRole().name() : null;
    }

    @JsonProperty("raisedByName")
    public String getRaisedByName() {
        return raisedBy != null ? raisedBy.getFullName() : null;
    }

    @JsonProperty("raisedByLocation")
    public String getRaisedByLocation() {
        return raisedBy != null ? raisedBy.getLocation() : null;
    }

    @JsonProperty("raisedByEmail")
    public String getRaisedByEmail() {
        return raisedBy != null ? raisedBy.getEmail() : null;
    }

    @JsonProperty("raisedByDepartment")
    public String getRaisedByDepartment() {
        return raisedBy != null ? raisedBy.getDepartment() : null;
    }

    @JsonProperty("escalatedById")
    public Long getEscalatedById() {
        return escalatedBy != null ? escalatedBy.getId() : null;
    }

    @JsonProperty("escalatedByName")
    public String getEscalatedByName() {
        return escalatedBy != null ? escalatedBy.getFullName() : null;
    }

    public enum Status {
        OPEN,
        ASSIGNED,
        IN_PROGRESS,
        NEED_MORE_INFO,
        RESOLVED,
        PENDING_USER_CONFIRMATION,
        CLOSED,
        REOPENED
    }

    public enum Category {
        NETWORK, EMAIL, HARDWARE, SOFTWARE, ACCESS_ACCOUNTS, OTHER
    }

    public enum Priority {
        LOW, MEDIUM, HIGH
    }
}