package com.example.interviewbot.controller;

import com.example.interviewbot.model.InterviewSession;
import com.example.interviewbot.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PostMapping("/start")
    public ResponseEntity<InterviewSession> startInterview(@RequestParam String jobRole) {
        return ResponseEntity.ok(interviewService.startInterview(jobRole));
    }

    @PostMapping("/{sessionId}/answer")
    public ResponseEntity<InterviewSession> submitAnswer(
            @PathVariable String sessionId,
            @RequestBody String answer) {
        return ResponseEntity.ok(interviewService.submitAnswer(sessionId, answer));
    }
} 