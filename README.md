# AI Interview Bot

End-to-end AI-powered interview simulator with a Spring Boot backend and a React (TypeScript) frontend. The backend uses Spring AI with the OpenAI provider. The frontend consumes a simple REST API.

## Prerequisites

- Java 17+
- Node.js 18+
- An OpenAI-compatible API key

## Project Structure

```
backend/   # Spring Boot app (REST API)
frontend/  # React app (CRA + TypeScript + MUI)
```

## Backend

### Configuration
- Set environment variables before running:
  - `OPENAI_API_KEY` (required)
  - `OPENAI_BASE_URL` (optional, default: https://api.openai.com)
  - `OPENAI_MODEL` (optional, default: gpt-4o-mini)

Configuration is wired in `backend/src/main/resources/application.properties` using placeholders.

### Run
```bash
cd backend
mvn spring-boot:run
```
Server: `http://localhost:8080`

## Frontend

### Configuration
Create `frontend/.env` if needed:
```
REACT_APP_API_BASE_URL=http://localhost:8080
```

### Run
```bash
cd frontend
npm install
npm start
```
App: `http://localhost:3000`

## Usage
- Open the app, enter a job role (e.g., "Java Developer").
- The app generates a question. Submit answers to receive structured feedback.
- After 5 questions, the session completes; start a new one as needed.

## Security Notes
- No API keys are stored in the repo. Use environment variables.
- CORS is configured server-side. Do not rely on controller-level annotations.

## Tech Stack
- Backend: Spring Boot, Spring AI (OpenAI), Java 17
- Frontend: React, TypeScript, MUI, Axios

## Deployment
1) Build backend JAR and deploy to your Java host/platform. Configure env vars.
2) Build frontend with `npm run build` and serve statically (e.g., Nginx) or via your platform.

## Development Principles Applied
- SOLID: AI logic behind `InterviewAIClient` interface; service depends on abstraction, not concrete provider.
- Separation of Concerns: CORS and exception handling centralized.
- Environment-driven config: All secrets via env vars.