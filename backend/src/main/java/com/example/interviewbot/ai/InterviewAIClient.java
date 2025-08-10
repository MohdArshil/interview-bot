package com.example.interviewbot.ai;

import java.util.List;

/**
 * Abstraction for generating interview questions and feedback.
 * Enables dependency inversion so core domain logic doesn't depend on a specific AI provider.
 */
public interface InterviewAIClient {

    String generateNextQuestion(String jobRole, List<String> previousQuestions, int questionNumber);

    String generateFeedback(String question, String answer, String jobRole);
}


