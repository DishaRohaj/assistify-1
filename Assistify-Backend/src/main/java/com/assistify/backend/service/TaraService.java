package com.assistify.backend.service;

import com.assistify.backend.dto.ChatResponseDTO;
import com.assistify.backend.entity.KnowledgeArticle;
import com.assistify.backend.repository.KnowledgeArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TaraService {

    private final KnowledgeArticleRepository repository;

    // ---------------------------------------------------------
    // Small-talk words
    // ---------------------------------------------------------

    private static final Set<String> GREETING_WORDS =
            Set.of(
                    "hi",
                    "hii",
                    "hiii",
                    "hello",
                    "hlo",
                    "hey",
                    "heyy",
                    "hola",
                    "yo"
            );

    private static final Set<String> THANKS_WORDS =
            Set.of(
                    "thanks",
                    "thank",
                    "thankyou",
                    "thx",
                    "ty"
            );

    private static final Set<String> GOODBYE_WORDS =
            Set.of(
                    "bye",
                    "goodbye",
                    "byee",
                    "seeya"
            );

    private static final Set<String> YES_WORDS =
            Set.of(
                    "yes",
                    "yeah",
                    "yep",
                    "yup",
                    "yess",
                    "sure",
                    "okay",
                    "ok",
                    "please"
            );

    private static final Set<String> NO_WORDS =
            Set.of(
                    "no",
                    "nope",
                    "nah"
            );


    // =========================================================
    // MAIN TARA METHOD
    // =========================================================

    public ChatResponseDTO askTara(String userMessage) {

        // -----------------------------------------------------
        // 1. Empty message
        // -----------------------------------------------------

        if (userMessage == null || userMessage.trim().isEmpty()) {

            return new ChatResponseDTO(
                    "Please describe your IT problem so I can help you.",
                    false
            );
        }


        // -----------------------------------------------------
        // 2. Normalize user message
        // -----------------------------------------------------

        String normalizedMessage = normalize(userMessage);


        // -----------------------------------------------------
        // 3. Greeting
        // -----------------------------------------------------

        if (isSmallTalk(normalizedMessage, GREETING_WORDS)) {

            return new ChatResponseDTO(
                    "Hi there! I'm Tara, your IT support assistant.\n" +
                            "Tell me what problem you're facing and I'll try to " +
                            "find a solution from our Knowledge Base.",
                    true
            );
        }


        // -----------------------------------------------------
        // 4. Thanks
        // -----------------------------------------------------

        if (isSmallTalk(normalizedMessage, THANKS_WORDS)) {

            return new ChatResponseDTO(
                    "You're welcome! Let me know if there's anything else I can help you with.",
                    true
            );
        }


        // -----------------------------------------------------
        // 5. Goodbye
        // -----------------------------------------------------

        if (isSmallTalk(normalizedMessage, GOODBYE_WORDS)) {

            return new ChatResponseDTO(
                    "Goodbye! Feel free to come back anytime you need IT support.",
                    true
            );
        }


        // -----------------------------------------------------
        // 6. YES response
        // -----------------------------------------------------

        if (isYes(normalizedMessage)) {

            return new ChatResponseDTO(
                    "Sure! Please go to the Raise Request section and " +
                            "submit a support request with the details of your issue.",
                    true
            );
        }


        // -----------------------------------------------------
        // 7. NO response
        // -----------------------------------------------------

        if (isNo(normalizedMessage)) {

            return new ChatResponseDTO(
                    "No problem. Please describe the issue in a little " +
                            "more detail and I'll try another Knowledge Base solution.",
                    true
            );
        }


        // -----------------------------------------------------
        // 8. Get Knowledge Base articles
        // -----------------------------------------------------

        List<KnowledgeArticle> articles = repository.findAll();


        // -----------------------------------------------------
        // 9. No articles available
        // -----------------------------------------------------

        if (articles.isEmpty()) {

            return new ChatResponseDTO(
                    "The Knowledge Base does not contain any articles yet.\n" +
                            "Would you like to raise a support request with the Service Desk?",
                    false
            );
        }


        // -----------------------------------------------------
        // 10. Prepare keywords
        // -----------------------------------------------------

        Set<String> userWords = expandKeywords(normalizedMessage);

        KnowledgeArticle bestArticle = null;

        int bestScore = 0;


        // =====================================================
        // 11. Search every Knowledge Base article
        // =====================================================

        for (KnowledgeArticle article : articles) {

            String title = normalize(article.getTitle());

            String content = normalize(article.getContent());


            Set<String> titleWords = expandKeywords(title);

            Set<String> contentWords = expandKeywords(content);


            int score = 0;


            // =================================================
            // PASSWORD / ACCOUNT
            // =================================================

            if (containsAnyPhrase(
                    normalizedMessage,

                    "forgot password",
                    "forgot my password",
                    "reset password",
                    "password reset",
                    "password not working",
                    "cannot login",
                    "cannot log in",
                    "cant login",
                    "cant log in",
                    "login not working",
                    "unable to login",
                    "unable to log in"
            )) {

                if (containsAnyKeyword(
                        title,
                        "password",
                        "reset",
                        "login",
                        "account"
                )) {
                    score += 8;
                }

                if (containsAnyKeyword(
                        content,
                        "password",
                        "reset",
                        "login",
                        "account"
                )) {
                    score += 4;
                }
            }


            // =================================================
            // COMPUTER SLOW / PERFORMANCE
            // =================================================

            if (containsAnyPhrase(
                    normalizedMessage,

                    "computer is slow",
                    "computer running slowly",
                    "computer is running slowly",
                    "pc is slow",
                    "laptop is slow",
                    "system is slow",
                    "computer slow",
                    "laptop slow",
                    "pc running slowly",
                    "computer freezing",
                    "computer freezes",
                    "system freezing"
            )) {

                if (containsAnyKeyword(
                        title,
                        "slow",
                        "performance",
                        "computer",
                        "system",
                        "laptop"
                )) {
                    score += 8;
                }

                if (containsAnyKeyword(
                        content,
                        "slow",
                        "performance",
                        "computer",
                        "system",
                        "laptop"
                )) {
                    score += 4;
                }
            }


            // =================================================
            // VPN
            // =================================================

            if (containsAnyPhrase(
                    normalizedMessage,

                    "vpn not working",
                    "vpn not connecting",
                    "vpn connection",
                    "vpn issue",
                    "vpn problem",
                    "cannot connect to vpn",
                    "cant connect to vpn",
                    "vpn is not connecting",
                    "vpn is not working"
            )) {

                if (containsAnyKeyword(
                        title,
                        "vpn",
                        "network",
                        "connection"
                )) {
                    score += 8;
                }

                if (containsAnyKeyword(
                        content,
                        "vpn",
                        "network",
                        "connection"
                )) {
                    score += 4;
                }
            }


            // =================================================
            // WI-FI / INTERNET
            // =================================================

            if (containsAnyPhrase(
                    normalizedMessage,

                    "wifi not working",
                    "wifi not connecting",
                    "cannot connect to wifi",
                    "cant connect to wifi",
                    "cannot connect wifi",
                    "cant connect wifi",
                    "wifi connection",
                    "wifi issue",
                    "wifi problem",
                    "wifi is not working",
                    "wifi is not connecting",
                    "internet not working",
                    "internet connection",
                    "internet issue",
                    "internet problem",
                    "cannot connect to internet",
                    "cant connect to internet"
            )) {

                if (containsAnyKeyword(
                        title,
                        "wifi",
                        "internet",
                        "network",
                        "connection"
                )) {
                    score += 8;
                }

                if (containsAnyKeyword(
                        content,
                        "wifi",
                        "internet",
                        "network",
                        "connection"
                )) {
                    score += 4;
                }
            }


            // =================================================
            // OUTLOOK / EMAIL
            // =================================================

            if (containsAnyPhrase(
                    normalizedMessage,

                    "outlook login",
                    "outlook not working",
                    "outlook issue",
                    "outlook problem",
                    "outlook login not working",
                    "outlook cannot login",
                    "outlook cant login",
                    "email not working",
                    "email login",
                    "email login not working",
                    "cannot access email",
                    "cant access email"
            )) {

                if (containsAnyKeyword(
                        title,
                        "outlook",
                        "email",
                        "mail",
                        "login"
                )) {
                    score += 8;
                }

                if (containsAnyKeyword(
                        content,
                        "outlook",
                        "email",
                        "mail",
                        "login"
                )) {
                    score += 4;
                }
            }


            // =================================================
            // PRINTER
            // =================================================

            if (containsAnyPhrase(
                    normalizedMessage,

                    "printer not working",
                    "printer problem",
                    "printer issue",
                    "printer is not working",
                    "cannot print",
                    "cant print",
                    "printing problem",
                    "printer offline",
                    "printer not printing"
            )) {

                if (containsAnyKeyword(
                        title,
                        "printer",
                        "printing",
                        "print"
                )) {
                    score += 8;
                }

                if (containsAnyKeyword(
                        content,
                        "printer",
                        "printing",
                        "print"
                )) {
                    score += 4;
                }
            }


            // =================================================
            // SOFTWARE INSTALLATION
            // =================================================

            if (containsAnyPhrase(
                    normalizedMessage,

                    "install software",
                    "software installation",
                    "install application",
                    "install an application",
                    "need software",
                    "need an application",
                    "software request",
                    "application request",
                    "cannot install software",
                    "cant install software"
            )) {

                if (containsAnyKeyword(
                        title,
                        "software",
                        "installation",
                        "application",
                        "install"
                )) {
                    score += 8;
                }

                if (containsAnyKeyword(
                        content,
                        "software",
                        "installation",
                        "application",
                        "install"
                )) {
                    score += 4;
                }
            }


            // =================================================
            // GENERIC WORD MATCHING
            // =================================================

            for (String word : userWords) {

                if (word.length() < 3) {
                    continue;
                }

                if (titleWords.contains(word)) {
                    score += 3;
                }

                if (contentWords.contains(word)) {
                    score += 1;
                }
            }


            // =================================================
            // Update best article
            // =================================================

            if (score > bestScore) {

                bestScore = score;

                bestArticle = article;
            }
        }


        // =====================================================
        // 12. No matching article
        // =====================================================

        if (bestArticle == null || bestScore < 3) {

            return new ChatResponseDTO(
                    "I couldn't find a matching solution in the Knowledge Base.\n" +
                            "Would you like to raise a support request with the Service Desk?",
                    false
            );
        }


        // =====================================================
        // 13. Return Knowledge Base solution
        // =====================================================

        String response =
                "I found a solution that may help:\n\n" +

                        bestArticle.getTitle() +

                        "\n\n" +

                        bestArticle.getContent() +

                        "\n\n" +

                        "If this doesn't resolve the issue, you can raise a " +
                        "support request with the Service Desk.";


        return new ChatResponseDTO(
                response,
                true
        );
    }


    // =========================================================
    // NORMALIZE TEXT
    // =========================================================

    private String normalize(String text) {

        if (text == null) {
            return "";
        }

        return text
                .toLowerCase()

                // Convert Wi-Fi / Wi Fi / wi-fi into wifi
                .replaceAll("wi[-\\s]?fi", "wifi")

                // Remove punctuation
                .replaceAll("[^a-z0-9\\s]", " ")

                // Remove extra spaces
                .replaceAll("\\s+", " ")

                .trim();
    }


    // =========================================================
    // SMALL TALK CHECK
    // =========================================================

    private boolean isSmallTalk(
            String normalizedMessage,
            Set<String> words
    ) {

        String[] tokens = normalizedMessage.split("\\s+");


        // Prevent messages such as:
        // "hi my Wi-Fi is not working"
        // from being treated only as a greeting.
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


    // =========================================================
    // YES CHECK
    // =========================================================

    private boolean isYes(String message) {

        if (YES_WORDS.contains(message)) {
            return true;
        }

        return message.contains("yes please");
    }


    // =========================================================
    // NO CHECK
    // =========================================================

    private boolean isNo(String message) {

        return NO_WORDS.contains(message);
    }


    // =========================================================
    // KEYWORD MATCH
    // =========================================================

    private boolean containsAnyKeyword(
            String text,
            String... keywords
    ) {

        for (String keyword : keywords) {

            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }


    // =========================================================
    // PHRASE MATCH
    // =========================================================

    private boolean containsAnyPhrase(
            String text,
            String... phrases
    ) {

        for (String phrase : phrases) {

            if (text.contains(phrase)) {
                return true;
            }
        }

        return false;
    }


    // =========================================================
    // EXPAND KEYWORDS
    // =========================================================

    private Set<String> expandKeywords(String text) {

        Set<String> words = new HashSet<>(
                Arrays.asList(text.split("\\s+"))
        );

        Set<String> expanded = new HashSet<>(words);


        // -----------------------------------------------------
        // Password
        // -----------------------------------------------------

        if (containsAnyKeyword(
                text,
                "forgot",
                "password",
                "credential",
                "credentials"
        )) {

            expanded.add("password");
            expanded.add("reset");
            expanded.add("login");
            expanded.add("account");
        }


        // -----------------------------------------------------
        // Computer performance
        // -----------------------------------------------------

        if (containsAnyKeyword(
                text,
                "slow",
                "slowly",
                "lag",
                "lagging",
                "freeze",
                "freezing",
                "performance"
        )) {

            expanded.add("computer");
            expanded.add("system");
            expanded.add("performance");
            expanded.add("slow");
        }


        // -----------------------------------------------------
        // VPN
        // -----------------------------------------------------

        if (containsAnyKeyword(
                text,
                "vpn"
        )) {

            expanded.add("vpn");
            expanded.add("network");
            expanded.add("connection");
        }


        // -----------------------------------------------------
        // Wi-Fi / Internet
        // -----------------------------------------------------

        if (containsAnyKeyword(
                text,
                "wifi",
                "internet",
                "network"
        )) {

            expanded.add("wifi");
            expanded.add("internet");
            expanded.add("network");
            expanded.add("connection");
        }


        // -----------------------------------------------------
        // Outlook / Email
        // -----------------------------------------------------

        if (containsAnyKeyword(
                text,
                "outlook",
                "email",
                "mail"
        )) {

            expanded.add("outlook");
            expanded.add("email");
            expanded.add("mail");
            expanded.add("login");
        }


        // -----------------------------------------------------
        // Printer
        // -----------------------------------------------------

        if (containsAnyKeyword(
                text,
                "printer",
                "printing",
                "print"
        )) {

            expanded.add("printer");
            expanded.add("printing");
            expanded.add("print");
        }


        // -----------------------------------------------------
        // Software
        // -----------------------------------------------------

        if (containsAnyKeyword(
                text,
                "software",
                "application",
                "install",
                "installation"
        )) {

            expanded.add("software");
            expanded.add("application");
            expanded.add("install");
            expanded.add("installation");
        }


        return expanded;
    }
}