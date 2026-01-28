# Smart To-Do List (Dependency-Aware Tasks)

This project is a **Front-End Engineer take-home assessment** that demonstrates building a task management UI with **dependency-aware state handling**, backed by a provided API service.

The focus of this solution is on **correct task lifecycle logic**, **clean state transitions**, and **clear separation of concerns**, rather than heavy UI frameworks or over-engineering.


## Features

* View all tasks from backend
* Create new tasks
* Start tasks (BACKLOG → IN_PROGRESS)
* Mark tasks as done (IN_PROGRESS → DONE)
* Delete tasks (with confirmation)
* Dependency-aware blocking
* Prevent invalid state transitions
* Pure business logic isolated from UI
* Responsive 2-column layout (mobile friendly)

## Task States & Lifecycle

Tasks follow a **controlled lifecycle**:

```
BACKLOG → IN_PROGRESS → DONE
```

### Derived State

* **BLOCKED** is a **derived UI state** (not stored in backend)
* A task is **BLOCKED** if **any of its blockers is not DONE**
* BLOCKED tasks:

  * Cannot be started
  * Cannot be completed
  * Are visually highlighted


## Dependency Rules
Dependency logic is implemented in a **pure logic layer**:

* A task is blocked if **any blocker is not DONE**
* When a blocker becomes DONE:

  * Dependent tasks automatically become actionable
* Dependency changes propagate recursively downstream
* No dependency logic exists inside UI components

All dependency rules live in:

```
src/logic/dependency.ts
```
## Project Structure

```text
src/
├─ components/
│  ├─ TaskItem.tsx       # Single task UI card
│  └─ FilterTabs.tsx     # Status filter UI
│
├─ logic/
│  └─ dependency.ts     # Pure dependency & state logic
│
├─ types/
│  └─ task.ts           # Task type definitions
│
├─ App.tsx               # Main application container
└─ main.tsx              # React entry point
```

### Design Principles
* UI components are **presentation-focused**
* Business logic is **framework-agnostic**
* No mutation of React state
* No global state libraries
* No unnecessary dependencies

## API Integration
The frontend communicates with the provided backend API.

### Endpoints Used

| Action            | Endpoint                         |
| ----------------- | -------------------------------- |
| List tasks        | `GET /tasks`                     |
| Create task       | `POST /tasks`                    |
| Update task state | `POST /tasks/{id}/state/{state}` |
| Delete task       | `DELETE /tasks/{id}`             |

## Running the Project

### Backend

Follow the instructions provided in the assessment email:

```bash
docker compose up
docker compose exec -it api uv run alembic upgrade head
```

Backend runs on:

```
http://localhost:8000
```

---

### Frontend

```bash
cd Frontend/smart-todo
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

## UX Decisions
* Actions are **only shown when valid**
* Invalid transitions are **prevented by design**
* Icons are used for clarity with hover tooltips
* Delete requires confirmation
* Empty state is handled gracefully
* UI kept intentionally minimal

## Assumptions
* `TODO` state is supported by backend but not required in UI
* Dependency management is handled on the frontend as per assessment scope
* Styling is secondary to logic correctness
* No authentication is required

## Notes
This solution prioritizes:
* Correctness
* Readability
* Maintainability
* Clear reasoning over visual complexity

## Author
**Nurul Alia Syahira Binti Mohd Taim**
Front-End Engineer Take-Home Assessment
Rooftop Energy Tech Sdn Bhd