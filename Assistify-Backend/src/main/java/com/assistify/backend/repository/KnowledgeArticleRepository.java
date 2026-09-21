package com.assistify.backend.repository;

import com.assistify.backend.entity.KnowledgeArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, Long> {
    List<KnowledgeArticle> findAllByOrderByCreatedAtDesc();
}