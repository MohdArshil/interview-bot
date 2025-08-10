import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface QnA {
  question: string;
  answer: string;
  feedback: string;
}

interface InterviewSession {
  sessionId: string;
  jobRole: string;
  conversation: QnA[];
  currentQuestion: string;
  questionCount: number;
  complete: boolean;
}

const Interview: React.FC = () => {
  const [jobRole, setJobRole] = useState('');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

  const startInterview = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/interview/start?jobRole=${encodeURIComponent(jobRole)}`);
      setSession(response.data);
      setAnswer('');
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!session) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/interview/${session.sessionId}/answer`,
        answer,
        { headers: { 'Content-Type': 'text/plain' } }
      );
      setSession(response.data);
      setAnswer('');
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Interview Bot
        </Typography>

        {!session ? (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Enter the job role (e.g., 'React Developer', 'Java Engineer')"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={startInterview}
              disabled={!jobRole || loading}
            >
              Start Interview
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              {session.currentQuestion !== null ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Current Question:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <ReactMarkdown
                      components={{
                        code({node, className, children, ...props}, {inline = false}: {inline?: boolean} = {}) {
                          return !inline ? (
                            <Box
                              component="pre"
                              sx={{
                                background: '#f5f5f5',
                                p: 2,
                                borderRadius: 1,
                                overflowX: 'auto',
                                my: 1,
                              }}
                            >
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </Box>
                          ) : (
                            <code
                              style={{
                                background: '#eee',
                                borderRadius: 2,
                                padding: '0.2em 0.4em',
                                fontSize: '95%',
                              }}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {session.currentQuestion}
                    </ReactMarkdown>
                  </Box>
                </>
              ) : (
                <Typography paragraph>
                  Interview Complete!
                </Typography>
              )}

              {!session.complete && (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={submitAnswer}
                    disabled={!answer || loading}
                  >
                    Submit Answer
                  </Button>
                </>
              )}
            </Paper>

            <Typography variant="h6" gutterBottom>
              Interview Progress
            </Typography>
            <List>
              {session.conversation.map((qna, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={
                      <Box>
                        <strong>{`Q${index + 1}: `}</strong>
                        <ReactMarkdown
                          components={{
                            code({node, className, children, ...props}, {inline = false}: {inline?: boolean} = {}) {
                              return !inline ? (
                                <Box
                                  component="pre"
                                  sx={{
                                    background: '#f5f5f5',
                                    p: 2,
                                    borderRadius: 1,
                                    overflowX: 'auto',
                                    my: 1,
                                  }}
                                >
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </Box>
                              ) : (
                                <code
                                  style={{
                                    background: '#eee',
                                    borderRadius: 2,
                                    padding: '0.2em 0.4em',
                                    fontSize: '95%',
                                  }}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {qna.question}
                        </ReactMarkdown>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <strong>A: </strong>
                        <ReactMarkdown
                          components={{
                            code({node, className, children, ...props}, {inline = false}: {inline?: boolean} = {}) {
                              return !inline ? (
                                <Box
                                  component="pre"
                                  sx={{
                                    background: '#f5f5f5',
                                    p: 2,
                                    borderRadius: 1,
                                    overflowX: 'auto',
                                    my: 1,
                                  }}
                                >
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </Box>
                              ) : (
                                <code
                                  style={{
                                    background: '#eee',
                                    borderRadius: 2,
                                    padding: '0.2em 0.4em',
                                    fontSize: '95%',
                                  }}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {qna.answer}
                        </ReactMarkdown>
                      </Box>
                    }
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, fontStyle: 'italic' }}
                  >
                    Feedback: {qna.feedback}
                  </Typography>
                </ListItem>
              ))}
            </List>

            {session.complete && (
              <Button
                variant="outlined"
                onClick={() => setSession(null)}
                sx={{ mt: 2 }}
              >
                Start New Interview
              </Button>
            )}
          </Box>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Interview;