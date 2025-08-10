package com.example.interviewbot.model;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class InterviewSession {
    private String sessionId;
    private String jobRole;
    private List<QnA> conversation = new ArrayList<>();
    private String currentQuestion;
    private int questionCount = 0;
    private boolean isComplete = false;
} 