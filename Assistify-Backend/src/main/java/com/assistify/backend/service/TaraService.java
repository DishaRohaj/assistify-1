package com.assistify.backend.service;

import com.assistify.backend.dto.ChatResponseDTO;
import com.assistify.backend.entity.KnowledgeArticle;
import com.assistify.backend.repository.KnowledgeArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class TaraService {

    private final KnowledgeArticleRepository repository;
    private final KnowledgeBaseSearchService searchService;

    private static final Set<String> GREETING_WORDS =
            Set.of("hi", "hii", "hiii", "hello", "hlo", "hey", "heyy", "hola", "yo");

    private static final Set<String> THANKS_WORDS =
            Set.of("thanks", "thank", "thankyou", "thx", "ty");

    private static final Set<String> GOODBYE_WORDS =
            Set.of("bye", "goodbye", "byee", "seeya");

    private static final Set<String> YES_WORDS =
            Set.of("yes", "yeah", "yep", "yup", "yess", "sure", "okay", "ok", "please");

    private static final Set<String> NO_WORDS =
            Set.of("no", "nope", "nah");

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
                    "Hi there! I'm Tara, your IT support assistant.\n" +
                            "Tell me what problem you're facing and I'll try to " +
                            "find a solution from our Knowledge Base.",
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

        if (isYes(normalizedMessage)) {
            return new ChatResponseDTO(
                    "Sure! Please go to the Raise Request section and " +
                            "submit a support request with the details of your issue.",
                    true
            );
        }

        if (isNo(normalizedMessage)) {
            return new ChatResponseDTO(
                    "No problem. Please describe the issue in a little " +
                            "more detail and I'll try another Knowledge Base solution.",
                    true
            );
        }

        if (repository.count() == 0) {
            return new ChatResponseDTO(
                    "The Knowledge Base does not contain any articles yet.\n" +
                            "Would you like to raise a support request with the Service Desk?",
                    false
            );
        }

        KnowledgeBaseSearchService.SearchResult result = searchService.findBestMatch(userMessage);

        if (result == null) {
            return new ChatResponseDTO(
                    "I couldn't find a matching solution in the Knowledge Base.\n" +
                            "Would you like to raise a support request with the Service Desk?",
                    false
            );
        }

        KnowledgeArticle bestArticle = result.article;

        String response =
                "I found a solution that may help:\n\n" +
                        bestArticle.getTitle() +
                        "\n\n" +
                        bestArticle.getContent() +
                        "\n\n" +
                        "If this doesn't resolve the issue, you can raise a " +
                        "support request with the Service Desk.";

        return new ChatResponseDTO(response, true);
    }

    private String normalize(String text) {
        if (text == null) {
            return "";
        }
        return text
                .toLowerCase()
                .replaceAll("wi[-\\s]?fi", "wifi")
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private boolean isSmallTalk(String normalizedMessage, Set<String> words) {
        String[] tokens = normalizedMessage.split("\\s+");
        if (tokens.length > 4) {
            return false;
        }
        for (String token : tokens) {
            if (words.contains(token)) {
                return true;
            }
        }
        return false;
    }

    private boolean isYes(String message) {
        if (YES_WORDS.contains(message)) {
            return true;
        }
        return message.contains("yes please");
    }

    private boolean isNo(String message) {
        return NO_WORDS.contains(message);
    }
}