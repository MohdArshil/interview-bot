package com.example.interviewbot.service;

import com.example.interviewbot.ai.InterviewAIClient;
import com.example.interviewbot.model.InterviewSession;
import com.example.interviewbot.model.QnA;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewAIClient interviewAIClient;

    @Autowired
    public InterviewService(InterviewAIClient interviewAIClient) {
        this.interviewAIClient = interviewAIClient;
    }

    private final Map<String, InterviewSession> sessions = new HashMap<>();

    public InterviewSession startInterview(String jobRole) {
        if (jobRole == null || jobRole.trim().isEmpty()) {
            throw new IllegalArgumentException("jobRole is required");
        }
        InterviewSession session = new InterviewSession();
        session.setSessionId(UUID.randomUUID().toString());
        session.setJobRole(jobRole);
        session.setCurrentQuestion(
            interviewAIClient.generateNextQuestion(
                jobRole,
                session.getConversation().stream().map(QnA::getQuestion).collect(Collectors.toList()),
                session.getQuestionCount() + 1
            )
        );
        sessions.put(session.getSessionId(), session);
        return session;
    }

    public InterviewSession submitAnswer(String sessionId, String answer) {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            throw new IllegalArgumentException("sessionId is required");
        }
        if (answer == null || answer.trim().isEmpty()) {
            throw new IllegalArgumentException("answer is required");
        }
        InterviewSession session = sessions.get(sessionId);
        if (session == null) {
            throw new RuntimeException("Session not found");
        }

        // Generate feedback for the answer
        String feedback = interviewAIClient.generateFeedback(session.getCurrentQuestion(), answer, session.getJobRole());
        
        // Store the Q&A
        QnA qna = new QnA();
        qna.setQuestion(session.getCurrentQuestion());
        qna.setAnswer(answer);
        qna.setFeedback(feedback);
        session.getConversation().add(qna);
        
        session.setQuestionCount(session.getQuestionCount() + 1);
        
        // Generate next question if not complete
        if (session.getQuestionCount() < 5) {
            session.setCurrentQuestion(
                interviewAIClient.generateNextQuestion(
                    session.getJobRole(),
                    session.getConversation().stream().map(QnA::getQuestion).collect(Collectors.toList()),
                    session.getQuestionCount() + 1
                )
            );
        } else {
            session.setComplete(true);
            session.setCurrentQuestion(null);
        }
        
        return session;
    }
}