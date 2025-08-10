package com.example.interviewbot.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OpenAIInterviewAIClient implements InterviewAIClient {

    private final ChatClient chatClient;

    public OpenAIInterviewAIClient(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @Override
    public String generateNextQuestion(String jobRole, List<String> previousQuestions, int questionNumber) {
        String promptText = """
            You are a technical interviewer for a %s position. Generate a specific technical interview question.

            Context:
            - Previous questions asked: %s
            - This is question number %d out of 5

            Requirements for the question:
            1. Must be specific to %s skills and technologies
            2. Should be challenging but clear
            3. Include a code snippet or specific scenario to analyze
            4. Focus on practical implementation or problem-solving
            5. Return ONLY the question text, no explanations or additional context

            Example format:
            "Write a function that [specific task]. Consider [specific constraints]."
            or
            "Analyze the following code snippet and explain [specific aspects to analyze]."
            """.formatted(jobRole, previousQuestions.toString(), questionNumber, jobRole);

        return chatClient.prompt()
            .user(promptText)
            .call()
            .content();
    }

    @Override
    public String generateFeedback(String question, String answer, String jobRole) {
        String promptText = """
            You are a technical interviewer evaluating a candidate's answer for a %s position.

            Question: %s
            Candidate's Answer: %s

            Instructions for feedback:
            1. If the answer is too short (less than 50 characters) or just "sorry", respond with:
               "Your answer is too brief. Please provide a more detailed explanation of your approach, including:
               - Your thought process
               - Any code or pseudocode if applicable
               - Trade-offs or considerations
               - Time and space complexity if relevant"

            2. For proper answers, provide feedback in this structure:
               - Technical Accuracy (1-5)
               - Key Strengths (2-3 points)
               - Areas for Improvement (2-3 points)
               - Specific Suggestions (1-2 actionable items)

            3. Keep the feedback concise (2-3 sentences per section)
            4. Focus on technical aspects relevant to %s
            5. Be constructive and specific

            Return the feedback in a clear, structured format.
            """.formatted(jobRole, question, answer, jobRole);

        return chatClient.prompt()
            .user(promptText)
            .call()
            .content();
    }
}


