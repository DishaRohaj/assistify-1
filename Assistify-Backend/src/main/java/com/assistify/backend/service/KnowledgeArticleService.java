package com.assistify.backend.service;

import com.assistify.backend.dto.CreateArticleDTO;
import com.assistify.backend.entity.KnowledgeArticle;
import com.assistify.backend.entity.Request;
import com.assistify.backend.entity.User;
import com.assistify.backend.repository.KnowledgeArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KnowledgeArticleService {

    @Autowired
    private KnowledgeArticleRepository articleRepository;

    public List<KnowledgeArticle> getAll() {
        return articleRepository.findAllByOrderByCreatedAtDesc();
    }

    public KnowledgeArticle create(CreateArticleDTO dto, User author) {
        KnowledgeArticle article = new KnowledgeArticle();
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        if (dto.getCategory() != null && !dto.getCategory().isBlank()) {
            article.setCategory(Request.Category.valueOf(dto.getCategory()));
        }
        article.setAuthor(author);
        return articleRepository.save(article);
    }

    public void delete(Long id, User currentUser) {
        KnowledgeArticle article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found: " + id));
        boolean isAuthor = article.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("You can only delete your own articles.");
        }
        articleRepository.deleteById(id);
    }

    public KnowledgeArticle update(Long id, CreateArticleDTO dto, User currentUser) {
        KnowledgeArticle article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found: " + id));
        boolean isAuthor = article.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("You can only edit your own articles.");
        }
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        if (dto.getCategory() != null && !dto.getCategory().isBlank()) {
            article.setCategory(Request.Category.valueOf(dto.getCategory()));
        } else {
            article.setCategory(null);
        }
        article.setUpdatedAt(java.time.LocalDateTime.now());
        return articleRepository.save(article);
    }
}