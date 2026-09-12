# AGENTS.md

This file defines the development rules and repository conventions for AI coding agents working on this project.

Read this file before modifying code.

---

## 1. Repository Scope

This repository contains the web frontend only.

Primary stack:

```text
Next.js
React
TypeScript
Tailwind CSS
```

The backend is maintained separately and communicates with this frontend through HTTP APIs.

Do not implement backend infrastructure in this repository unless the user explicitly changes the architecture.

Do not add:

```text
AI inference models
PyTorch services
GPU workers
Celery
Redis
PostgreSQL
MinIO
backend authentication services
backend business logic
```

Do not turn this repository into a monorepo unless explicitly requested.

---

## 2. Product Scope

The application supports three detection modalities:

```text
AI text detection
AI image detection
AI video detection
```

The frontend is responsible for:

```text
user input
file selection
file upload
API communication
task status display
result rendering
loading states
error states
responsive UX
accessibility
```

The frontend is not responsible for:

```text
AI inference
model loading
GPU execution
file security validation
database persistence
task scheduling
rate limiting
backend authorization
```

---

## 3. Architecture

Follow this dependency direction:

```text
Page
  ↓
Feature / UI Components
  ↓
Hooks
  ↓
API Client
  ↓
External Backend
```

Keep backend-specific details out of page components.

All backend API access should be centralized under:

```text
lib/api/
```

Shared API and detection types should live under:

```text
lib/types/
```

Reusable detection UI should live under:

```text
components/detection/
```

Reusable upload UI should live under:

```text
components/upload/
```

Generic visual primitives should live under:

```text
components/ui/
```

---

## 4. Preferred Directory Structure

Prefer the following structure unless the existing repository already uses another consistent structure:

```text
app/
├── page.tsx
├── layout.tsx
├── text/
├── image/
└── video/

components/
├── detection/
├── upload/
└── ui/

hooks/

lib/
├── api/
├── types/
├── constants.ts
└── utils.ts

public/
```

Avoid introducing unnecessary architectural layers such as:

```text
repositories/
controllers/
managers/
domain/
core/
providers/
```

unless they solve a real project need.

Do not over-engineer small features.

---

## 5. Next.js Conventions

Use the App Router.

Do not introduce the legacy `pages/` router unless the repository already uses it.

Prefer Server Components by default.

Use:

```ts
"use client";
```

only when required for client-side behavior such as:

```text
useState
useEffect
event handlers
file inputs
drag and drop
browser APIs
interactive controls
```

Do not convert large parts of the component tree into Client Components for convenience.

Keep client boundaries as small as practical.

---

## 6. React Conventions

Prefer small, focused, composable components.

Avoid very large page components containing:

```text
API calls
upload logic
polling logic
result formatting
error handling
UI rendering
```

all in one file.

Extract reusable behavior into hooks when it improves clarity.

Do not create trivial abstractions that add indirection without reducing complexity.

Prefer composition over deeply configurable components.

---

## 7. TypeScript Conventions

Use TypeScript for all application code.

Avoid `any`.

If `any` is unavoidable, keep its scope narrow and document why.

Prefer explicit types for:

```text
API responses
API requests
component props
hook return values
task state
detection result state
```

Recommended shared types:

```ts
export type DetectionModality =
  | "text"
  | "image"
  | "video";

export type DetectionStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type DetectionLabel =
  | "ai_generated"
  | "human_generated"
  | "uncertain";
```

Do not bypass the type system with patterns such as:

```ts
value as any
```

unless there is a strong reason.

---

## 8. Backend API Configuration

Use:

```text
NEXT_PUBLIC_API_BASE_URL
```

for the browser-visible backend base URL unless the existing project uses a different established configuration.

Never hard-code backend addresses such as:

```text
http://localhost:8000
```

inside pages or feature components.

Do not put secrets in `NEXT_PUBLIC_*` variables.

All `NEXT_PUBLIC_*` values are considered public.

---

## 9. API Layer

All backend requests must go through the API layer.

Preferred location:

```text
lib/api/
```

Recommended files:

```text
client.ts
text.ts
image.ts
video.ts
tasks.ts
```

Recommended domain functions:

```ts
detectText()
detectImage()
createVideoDetection()
getDetectionTask()
```

Do not scatter raw `fetch()` calls across components.

A shared API client should handle common concerns such as:

```text
base URL construction
HTTP status validation
JSON parsing
common error conversion
```

Do not silently swallow network or backend errors.

---

## 10. API Contract

The recommended API prefix is:

```text
/api/v1
```

Recommended endpoints:

```text
POST /api/v1/detections/text
POST /api/v1/detections/image
POST /api/v1/detections/video
GET  /api/v1/tasks/:id
```

An optional endpoint may exist for direct object-storage uploads:

```text
POST /api/v1/uploads
```

Treat these as frontend contract defaults, not immutable backend facts.

If the actual backend differs, adapt the API layer first.

Do not spread backend field names throughout UI components.

---

## 11. Internal Response Model

Prefer a stable internal frontend model such as:

```ts
interface DetectionResponse {
  id: string;
  modality: "text" | "image" | "video";
  status:
    | "queued"
    | "processing"
    | "completed"
    | "failed";
  progress?: number;
  result?: {
    label:
      | "ai_generated"
      | "human_generated"
      | "uncertain";
    ai_probability: number;
    human_probability: number;
    confidence?: "low" | "medium" | "high";
  };
  model?: {
    name: string;
    version: string;
  };
  error?: {
    code?: string;
    message: string;
  };
}
```

If the backend payload differs, map it into the internal model in the API layer.

UI components should depend on the internal model whenever possible.

---

## 12. Text Detection

Treat text detection as synchronous unless the backend contract says otherwise.

Expected frontend states:

```text
idle
submitting
completed
failed
```

Validate empty input before submitting.

Disable or guard against duplicate submissions while a request is active.

Do not invent backend confidence thresholds in the frontend.

---

## 13. Image Detection

Use `FormData` for image uploads unless the backend explicitly requires another format.

Do not convert images to Base64 JSON by default.

Do not manually set the multipart `Content-Type` header when using `FormData`; the browser must generate the boundary.

Client-side validation may check:

```text
MIME type
file extension
file size
```

for user experience only.

Do not treat client-side validation as a security boundary.

If `URL.createObjectURL()` is used, always release stale object URLs with:

```ts
URL.revokeObjectURL()
```

when the file changes or the component unmounts.

---

## 14. Video Detection

Treat video detection as asynchronous by default.

Expected flow:

```text
create task
receive task ID
poll task status
render final result
```

Prefer polling for the initial implementation.

A reasonable default polling interval is approximately:

```text
2000 ms
```

Polling must stop when:

```text
the task completes
the task fails
the user cancels
the task is replaced
the component unmounts
```

Do not create unbounded intervals without cleanup.

Prefer cancellable polling logic.

Do not fabricate processing percentages when the backend does not provide real progress.

---

## 15. Upload UX

Upload components should support the relevant subset of:

```text
click to upload
drag and drop
file name display
file size display
replace file
remove file
validation feedback
preview
upload status
```

Keep upload behavior reusable.

Do not duplicate nearly identical upload code between image and video pages if a shared abstraction is appropriate.

---

## 16. UI State Model

Distinguish meaningful states.

Preferred state vocabulary:

```text
idle
uploading
queued
processing
completed
failed
```

Do not reduce every asynchronous stage to one generic boolean such as:

```ts
isLoading
```

when multiple states matter to the user experience.

Use precise state names.

---

## 17. Detection Result UI

Text, image, and video detection should reuse common result components where possible.

Preferred components:

```text
DetectionResult
DetectionStatus
ProbabilityBar
```

Do not create separate result implementations for each modality unless the UX is genuinely different.

Probability values are expected to be in the range:

```text
0.0 to 1.0
```

Convert them to percentages only for presentation.

Handle invalid values safely.

Do not present detection output as certainty unless the backend explicitly defines that semantic.

Prefer wording such as:

```text
Likely AI-generated
Likely human-generated
Uncertain
```

Avoid wording such as:

```text
Definitely AI-generated
Guaranteed human
100% AI
```

---

## 18. Error Handling

Every asynchronous feature must have explicit error handling.

Handle at least:

```text
invalid input
unsupported file type
file too large
network error
4xx response
5xx response
task failure
timeout
```

Do not expose:

```text
stack traces
database errors
internal exception messages
raw HTML error responses
```

to end users.

More technical details may be logged in development when useful.

---

## 19. Accessibility

Use semantic HTML.

Prefer:

```html
<button>
<label>
<input>
<nav>
<main>
<section>
```

Do not use clickable `div` elements when a semantic control exists.

Interactive controls must be keyboard accessible.

Provide meaningful labels for inputs.

Provide appropriate alternative text for preview images.

Ensure loading and error states are perceivable to assistive technology when practical.

---

## 20. Responsive Design

Support:

```text
mobile
tablet
desktop
```

Do not build desktop-only interfaces.

Upload areas must remain usable on small screens.

Use sensible content width constraints.

Avoid fixed dimensions that break narrow layouts unless there is a specific reason.

---

## 21. Styling

Use Tailwind CSS unless the existing project establishes another styling system.

Avoid:

```text
large amounts of inline style
duplicated CSS
unnecessary CSS-in-JS dependencies
magic-number-heavy layout code
```

Prefer reusable design tokens and existing shared components.

Do not introduce a second styling framework without an explicit requirement.

---

## 22. State Management

Prefer local and framework-native state management first:

```text
useState
useReducer
Context
URL state
Server Components
```

Do not introduce:

```text
Redux
MobX
Zustand
```

unless the feature clearly requires shared state that is difficult to manage otherwise.

If the repository already uses a state library, follow the existing architecture.

---

## 23. Dependencies

Do not add dependencies without a clear need.

Before installing a package, check whether the requirement can be satisfied using:

```text
browser APIs
React
Next.js
existing dependencies
small local utilities
```

Avoid large packages for small features.

Do not replace the package manager.

If the repository uses npm, pnpm, yarn, or bun, keep using the existing tool.

---

## 24. Security

Never expose secrets in client code.

Do not store:

```text
backend private keys
database passwords
object-storage secret keys
JWT signing secrets
private third-party API keys
```

in browser-visible configuration.

Treat user input and backend-provided strings as untrusted.

Avoid `dangerouslySetInnerHTML` for untrusted content.

Do not assume frontend file validation provides security.

---

## 25. Backend Separation

Remember:

```text
The backend is external.
```

Do not add:

```text
FastAPI
Flask
Express backend services
Python inference code
database schemas
Redis workers
Celery workers
```

to this repository.

Next.js Route Handlers under:

```text
app/api/
```

should not be used to recreate the backend.

Only introduce a Route Handler when there is a specific frontend/BFF reason, such as:

```text
same-origin proxying
server-only token handling
a thin request adapter
```

and the change is explicitly justified.

---

## 26. Mocking

Mocks are allowed when the backend is unavailable.

Mocks must:

```text
use the real frontend types
match the expected API shape
be isolated from production logic
be easy to remove
```

Prefer locations such as:

```text
lib/mocks/
test fixtures
test files
```

Never use `Math.random()` to generate production detection results.

Do not let mock behavior silently leak into production paths.

---

## 27. Testing

When modifying core behavior, test the relevant areas.

Important targets include:

```text
API response parsing
error states
file validation
polling cleanup
task transitions
percentage formatting
```

Use the repository's existing test framework.

Do not replace the test framework for an unrelated feature.

---

## 28. Code Quality

Prefer code that is:

```text
readable
typed
small
composable
predictable
```

Avoid:

```text
very large components
duplicated API logic
duplicated result UI
deep prop drilling
hidden side effects
unnecessary abstractions
```

Refactor when it clearly improves maintainability.

Do not refactor unrelated areas while completing a focused task.

---

## 29. Naming Conventions

React components:

```text
PascalCase
```

Examples:

```text
DetectionResult.tsx
FileDropzone.tsx
```

Hooks:

```text
useSomething
```

Example:

```text
useDetectionTask
```

Functions and variables:

```text
camelCase
```

Constants:

```text
UPPER_SNAKE_CASE
```

If the existing repository consistently follows another naming convention, preserve the existing style.

---

## 30. Comments

Do not add comments that merely restate the code.

Avoid:

```ts
// Set loading to true
setLoading(true);
```

Useful comments should explain:

```text
why
trade-offs
API assumptions
non-obvious edge cases
cleanup requirements
```

Prefer self-explanatory code over excessive comments.

---

## 31. Do Not Invent Backend Behavior

Do not assume backend behavior that has not been defined.

In particular, do not invent:

```text
authentication schemes
rate-limit formats
object-storage providers
history APIs
user account APIs
model names
confidence thresholds
video progress algorithms
```

Keep the API layer easy to adapt when the real backend contract becomes available.

---

## 32. Preserve Existing Work

Unless explicitly requested:

```text
do not delete existing features
do not rewrite the entire project
do not replace the UI framework
do not replace the package manager
do not modify unrelated files
do not reformat the entire repository
```

Make the smallest coherent change that satisfies the task.

---

## 33. Agent Workflow

Before implementing a change:

```text
1. Read the user request.
2. Inspect the relevant existing files.
3. Identify existing components, types, hooks, and API utilities.
4. Reuse existing patterns where appropriate.
5. Make the smallest coherent change.
6. Run lint if available.
7. Run type checking if available.
8. Run relevant tests if available.
9. Report what changed and any checks that could not be run.
```

Do not perform large refactors before understanding the current codebase.

---

## 34. Commands

Use scripts defined by the repository's `package.json`.

Typical commands may include:

```bash
npm run dev
npm run build
npm run lint
npm run test
```

Do not assume these commands exist without checking `package.json`.

Use the repository's configured package manager.

---

## 35. Definition of Done

Before considering a development task complete, verify as many of the following as applicable:

```text
TypeScript is valid
lint passes
relevant tests pass
API access uses the shared API layer
loading states are handled
error states are handled
polling is cleaned up
responsive behavior is reasonable
accessibility is not regressed
no secrets are exposed
no fake production detection result is introduced
unrelated files were not changed
```

If a check cannot be performed, state that clearly in the final report.

---

## 36. Priority Rules

When instructions conflict, use this priority order:

```text
1. The user's latest explicit instruction
2. Existing repository architecture and established conventions
3. This AGENTS.md file
4. General implementation preference
```

When uncertain, prefer:

```text
minimal change
clear API boundaries
type safety
reusable UI
explicit state
no over-engineering
```
