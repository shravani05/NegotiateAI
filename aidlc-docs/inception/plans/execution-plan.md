# Execution Plan — NegotiateAI

## Detailed Analysis Summary

### Change Impact Assessment
- **User-facing changes**: Yes — entirely new user-facing application
- **Structural changes**: Yes — new React SPA + Node.js API server architecture
- **Data model changes**: Minimal — session state only (in-memory, no persistence)
- **API changes**: Yes — new REST API between frontend and backend
- **NFR impact**: Yes — AWS Bedrock streaming, AWS SDK configuration, response latency
- **Application layer**: Full build from scratch
- **Infrastructure layer**: Local only — no cloud infrastructure
- **Operations layer**: Not applicable (local-only, no deployment)

### Risk Assessment
- **Risk Level**: Medium
- **Rationale**: Multiple components, AI integration with external service (AWS Bedrock), streaming responses, multi-step user workflow. No rollback complexity (greenfield). Main risk is Bedrock API integration and prompt engineering quality.

---

## Workflow Visualization

```
START
  |
  v
+--INCEPTION PHASE---------------------------+
| [x] Workspace Detection      COMPLETED     |
| [ ] Reverse Engineering      SKIPPED       |
| [x] Requirements Analysis    COMPLETED     |
| [x] User Stories             COMPLETED     |
| [x] Workflow Planning        IN PROGRESS   |
| [ ] Application Design       EXECUTE       |
| [ ] Units Generation         EXECUTE       |
+--------------------------------------------+
  |
  v
+--CONSTRUCTION PHASE (per unit)-------------+
| Unit 1: Frontend (React)                   |
|   [ ] Functional Design      EXECUTE       |
|   [ ] NFR Requirements       EXECUTE       |
|   [ ] NFR Design             EXECUTE       |
|   [ ] Infrastructure Design  SKIPPED       |
|   [ ] Code Generation        EXECUTE       |
|                                            |
| Unit 2: Backend (Node.js + Bedrock)        |
|   [ ] Functional Design      EXECUTE       |
|   [ ] NFR Requirements       EXECUTE       |
|   [ ] NFR Design             EXECUTE       |
|   [ ] Infrastructure Design  SKIPPED       |
|   [ ] Code Generation        EXECUTE       |
|                                            |
| [ ] Build and Test           EXECUTE       |
+--------------------------------------------+
  |
  v
+--OPERATIONS PHASE--------------------------+
| [ ] Operations               PLACEHOLDER  |
+--------------------------------------------+
  |
  v
END
```

---

## Stages to Execute

### INCEPTION PHASE

| Stage | Status | Rationale |
|---|---|---|
| Workspace Detection | COMPLETED | Greenfield confirmed |
| Reverse Engineering | SKIPPED | Greenfield — no existing code |
| Requirements Analysis | COMPLETED | Full requirements captured |
| User Stories | COMPLETED | 9 stories across 5 epics |
| Workflow Planning | IN PROGRESS | This document |
| Application Design | EXECUTE | New components needed: React SPA, Express API, Bedrock service, session manager |
| Units Generation | EXECUTE | Two distinct units: frontend and backend — need decomposition and story mapping |

### CONSTRUCTION PHASE (per unit)

| Stage | Unit 1: Frontend | Unit 2: Backend | Rationale |
|---|---|---|---|
| Functional Design | EXECUTE | EXECUTE | Complex UI state machine (intake → strategy → roleplay → coaching); complex AI prompt orchestration |
| NFR Requirements | EXECUTE | EXECUTE | Streaming UX, AWS SDK config, response latency, error handling |
| NFR Design | EXECUTE | EXECUTE | Follows NFR Requirements |
| Infrastructure Design | SKIPPED | SKIPPED | Local-only — no cloud infrastructure to design |
| Code Generation | EXECUTE | EXECUTE | Always executes |
| Build and Test | EXECUTE | — | Always executes after all units |

---

## Estimated Timeline

- **Total stages to execute**: 13 (including per-unit stages)
- **Stages skipped**: 3 (Reverse Engineering, Infrastructure Design x2)
- **Estimated interactions**: 10–14 approval checkpoints

---

## Success Criteria

- **Primary Goal**: Working local NegotiateAI application with all 4 core features functional
- **Key Deliverables**:
  - React frontend with scenario intake, strategy view, roleplay chat UI, and coaching feedback
  - Node.js backend with REST API endpoints for all AI features
  - AWS Bedrock integration using `anthropic.claude-opus-4-6-v1:0` for all AI calls
  - Streaming responses from backend to frontend
  - Session state management (in-memory)
- **Quality Gates**:
  - All 9 user story acceptance criteria met
  - Application runs with `npm start` (or equivalent) from workspace root
  - AWS Bedrock calls succeed with valid local credentials
