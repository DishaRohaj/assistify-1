package com.assistify.backend.service;

import com.assistify.backend.dto.ChatResponseDTO;
import com.assistify.backend.entity.KnowledgeArticle;
import com.assistify.backend.repository.KnowledgeArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TaraService {

    private final KnowledgeArticleRepository repository;

    private static final Set<String> GREETING_WORDS =
            Set.of("hi", "hii", "hiii", "hello", "hey", "heyy", "hola", "yo");

    private static final Set<String> THANKS_WORDS =
            Set.of("thanks", "thank", "thankyou", "thx", "ty");

    private static final Set<String> GOODBYE_WORDS =
            Set.of("bye", "goodbye", "byee", "seeya");

    public ChatResponseDTO askTara(String userMessage) {

        if (userMessage == null || userMessage.trim().isEmpty()) {
            return new ChatResponseDTO(
                    "Please describe your IT problem so I can help you.",
                    false
            );
        }

        String normalizedMessage = normalize(userMessage);

        if (isSmallTalk(normalizedMessage, GREETING_WORDS)) {
            return new ChatResponseDTO(
                    "Hi there! I'm Tara, your IT support assistant. Tell me what problem you're facing and I'll try to find a solution from our Knowledge Base.",
                    true
            );
        }

        if (isSmallTalk(normalizedMessage, THANKS_WORDS)) {
            return new ChatResponseDTO(
                    "You're welcome! Let me know if there's anything else I can help you with.",
                    true
            );
        }

        if (isSmallTalk(normalizedMessage, GOODBYE_WORDS)) {
            return new ChatResponseDTO(
                    "Goodbye! Feel free to come back anytime you need IT support.",
                    true
            );
        }

        List<KnowledgeArticle> articles = repository.findAll();

        String[] userWords = normalize(userMessage).split("\\s+");

        KnowledgeArticle bestArticle = null;
        int bestScore = 0;

        for (KnowledgeArticle article : articles) {

            String title = normalize(article.getTitle());
            String content = normalize(article.getContent());

            int score = 0;

            for (String word : userWords) {

                if (word.length() < 3) {
                    continue;
                }

                // Title match is more important
                if (title.contains(word)) {
                    score += 3;
                }

                // Content match
                if (content.contains(word)) {
                    score += 1;
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestArticle = article;
            }
        }

        // No relevant article found
        if (bestArticle == null || bestScore < 3) {

            return new ChatResponseDTO(
                    "I couldn't find a matching solution in the Knowledge Base. " +
                            "Would you like to raise a support request with the Service Desk?",
                    false
            );
        }

        // Return the best matching article
        String response =
                "I found a solution that may help:\n\n" +
                        bestArticle.getTitle() +
                        "\n\n" +
                        bestArticle.getContent();

        return new ChatResponseDTO(
                response,
                true
        );
    }

    private boolean isSmallTalk(String normalizedMessage, Set<String> words) {
        String[] tokens = normalizedMessage.split("\\s+");
        if (tokens.length > 4) {
            return false; // longer messages are treated as real questions, not small talk
        }
        for (String token : tokens) {
            if (words.contains(token)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String text) {

        return text
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }
}