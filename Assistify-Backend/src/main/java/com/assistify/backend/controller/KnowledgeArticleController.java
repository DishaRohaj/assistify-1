package com.assistify.backend.controller;

import com.assistify.backend.dto.CreateArticleDTO;
import com.assistify.backend.entity.KnowledgeArticle;
import com.assistify.backend.entity.User;
import com.assistify.backend.service.KnowledgeArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge-base")
public class KnowledgeArticleController {

    @Autowired
    private KnowledgeArticleService articleService;

    @GetMapping
    public ResponseEntity<List<KnowledgeArticle>> getAll() {
        return ResponseEntity.ok(articleService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('SERVICE_DESK') or hasRole('L1_SUPPORT') or hasRole('L2_SUPPORT') or hasRole('ADMIN')")
    public ResponseEntity<KnowledgeArticle> create(@RequestBody CreateArticleDTO dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(articleService.create(dto, user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SERVICE_DESK') or hasRole('L1_SUPPORT') or hasRole('L2_SUPPORT') or hasRole('ADMIN')")
    public ResponseEntity<KnowledgeArticle> update(@PathVariable Long id, @RequestBody CreateArticleDTO dto, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(articleService.update(id, dto, user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SERVICE_DESK') or hasRole('L1_SUPPORT') or hasRole('L2_SUPPORT') or hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        articleService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}