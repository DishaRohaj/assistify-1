package com.assistify.backend.service;

import com.assistify.backend.entity.KnowledgeArticle;
import com.assistify.backend.repository.KnowledgeArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class KnowledgeBaseSearchService {

    private final KnowledgeArticleRepository repository;

    // Similarity below this is treated as "no confident match".
    // Tune this after testing against your real Knowledge Base content.
    private static final double SIMILARITY_THRESHOLD = 0.12;

    private static final Set<String> STOPWORDS = Set.of(
            "the", "and", "for", "are", "not", "but", "can", "you", "your", "with",
            "this", "that", "have", "has", "was", "were", "from", "into", "about",
            "how", "what", "when", "where", "why", "who", "its", "im"
    );

    public static class SearchResult {
        public final KnowledgeArticle article;
        public final double score;

        public SearchResult(KnowledgeArticle article, double score) {
            this.article = article;
            this.score = score;
        }
    }

    public SearchResult findBestMatch(String query) {
        List<KnowledgeArticle> articles = repository.findAll();
        if (articles.isEmpty()) {
            return null;
        }

        List<String> queryTokens = tokenize(query);
        if (queryTokens.isEmpty()) {
            return null;
        }

        // Tokenize every article. Title is repeated so its words carry more
        // weight in the term-frequency calculation than body words.
        List<List<String>> corpusTokens = new ArrayList<>();
        for (KnowledgeArticle article : articles) {
            String combined = article.getTitle() + " " + article.getTitle() + " " + article.getContent();
            corpusTokens.add(tokenize(combined));
        }

        Map<String, Double> idf = computeIdf(corpusTokens);
        Map<String, Double> queryVector = tfIdfVector(queryTokens, idf);

        double bestScore = 0.0;
        KnowledgeArticle bestArticle = null;

        for (int i = 0; i < articles.size(); i++) {
            Map<String, Double> docVector = tfIdfVector(corpusTokens.get(i), idf);
            double similarity = cosineSimilarity(queryVector, docVector);

            if (similarity > bestScore) {
                bestScore = similarity;
                bestArticle = articles.get(i);
            }
        }

        if (bestArticle == null || bestScore < SIMILARITY_THRESHOLD) {
            return null;
        }

        return new SearchResult(bestArticle, bestScore);
    }

    // -------------------------------------------------------
    // Tokenize: lowercase, normalize, strip punctuation/stopwords/short words
    // -------------------------------------------------------
    private List<String> tokenize(String text) {
        if (text == null) {
            return List.of();
        }

        String normalized = text
                .toLowerCase()
                .replaceAll("wi[-\\s]?fi", "wifi")
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();

        if (normalized.isEmpty()) {
            return List.of();
        }

        List<String> tokens = new ArrayList<>();
        for (String word : normalized.split(" ")) {
            if (word.length() >= 3 && !STOPWORDS.contains(word)) {
                tokens.add(word);
            }
        }
        return tokens;
    }

    // -------------------------------------------------------
    // IDF: rare words across the corpus get a higher weight.
    // Uses smoothed IDF (same formula scikit-learn's default uses)
    // so a word appearing in every article still gets a small non-zero weight.
    // -------------------------------------------------------
    private Map<String, Double> computeIdf(List<List<String>> corpusTokens) {
        Map<String, Integer> documentFrequency = new HashMap<>();

        for (List<String> doc : corpusTokens) {
            Set<String> uniqueTerms = new HashSet<>(doc);
            for (String term : uniqueTerms) {
                documentFrequency.merge(term, 1, Integer::sum);
            }
        }

        int totalDocs = corpusTokens.size();
        Map<String, Double> idf = new HashMap<>();

        for (Map.Entry<String, Integer> entry : documentFrequency.entrySet()) {
            double value = Math.log((double) (totalDocs + 1) / (entry.getValue() + 1)) + 1.0;
            idf.put(entry.getKey(), value);
        }

        return idf;
    }

    // -------------------------------------------------------
    // TF-IDF vector for one document (or the query), using the corpus's IDF.
    // Words never seen in the Knowledge Base are skipped — they can't
    // contribute to matching an existing article anyway.
    // -------------------------------------------------------
    private Map<String, Double> tfIdfVector(List<String> tokens, Map<String, Double> idf) {
        if (tokens.isEmpty()) {
            return Map.of();
        }

        Map<String, Integer> termCount = new HashMap<>();
        for (String token : tokens) {
            termCount.merge(token, 1, Integer::sum);
        }

        Map<String, Double> vector = new HashMap<>();
        int totalTerms = tokens.size();

        for (Map.Entry<String, Integer> entry : termCount.entrySet()) {
            Double idfValue = idf.get(entry.getKey());
            if (idfValue == null) {
                continue;
            }
            double tf = (double) entry.getValue() / totalTerms;
            vector.put(entry.getKey(), tf * idfValue);
        }

        return vector;
    }

    // -------------------------------------------------------
    // Cosine similarity: dot product of the two vectors, divided by
    // the product of their magnitudes. Result ranges 0 (unrelated) to 1 (identical topic).
    // -------------------------------------------------------
    private double cosineSimilarity(Map<String, Double> v1, Map<String, Double> v2) {
        Set<String> sharedTerms = new HashSet<>(v1.keySet());
        sharedTerms.retainAll(v2.keySet());

        double dotProduct = 0;
        for (String term : sharedTerms) {
            dotProduct += v1.get(term) * v2.get(term);
        }

        double norm1 = 0;
        for (double value : v1.values()) {
            norm1 += value * value;
        }
        norm1 = Math.sqrt(norm1);

        double norm2 = 0;
        for (double value : v2.values()) {
            norm2 += value * value;
        }
        norm2 = Math.sqrt(norm2);

        if (norm1 == 0 || norm2 == 0) {
            return 0;
        }

        return dotProduct / (norm1 * norm2);
    }
}