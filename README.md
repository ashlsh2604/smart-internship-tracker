# Smart Internship Tracker — C Backend & Data Structures Project

A full-stack college project for tracking internship applications, deadlines, and interviews, built with a **native C HTTP REST server**, persistent **SQLite3 database**, and a clean **React frontend** showcasing classic Data Structures and Algorithms (DSA).

---

## 1. System Architecture

```text
┌────────────────────────────────────────────────────────┐
│               Frontend (React SPA)                    │
│  - Simple College UI (White background, light borders) │
│  - Student Login & Sign-Up pages                       │
│  - Student User Profile with session details           │
│  - Interactive DSA Visualizations (Phases 1–4)         │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST APIs (/api/*)
                           ▼
┌────────────────────────────────────────────────────────┐
│               Node Development Proxy                   │
│  - Serves React SPA on port 3000                       │
│  - Automatically launches & proxies to C Backend       │
└──────────────────────────┬─────────────────────────────┘
                           │ TCP / HTTP (port 8080)
                           ▼
┌────────────────────────────────────────────────────────┐
│          Backend — Pure C Language (C11)               │
│  - Multi-threaded POSIX Socket HTTP Server             │
│  - SHA-256 Hashing + Cryptographic Salt for Passwords  │
│  - Bearer Token Session Management                     │
│  - User-isolated Internship CRUD REST Endpoints        │
│  - Native C DSA Engine (Linked List, Trees, Sort, DP)  │
└──────────────────────────┬─────────────────────────────┘
                           │ SQL C API (libsqlite3)
                           ▼
┌────────────────────────────────────────────────────────┐
│           Database — SQLite3 (tracker.db)              │
│  - users: id, name, email, password_hash, salt, etc.   │
│  - sessions: token, user_id, expires_at                │
│  - internships: id, user_id, company, deadline, etc.   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```text
.
├── backend-c/                  # Native C Backend Directory
│   ├── Makefile                # Build configuration for GCC
│   ├── tracker.db              # Persistent SQLite3 database file
│   ├── include/                # C Header Files
│   │   ├── internship.h        # Internship structs, enums, constants
│   │   ├── db.h                # SQLite operations & user isolation headers
│   │   ├── crypto.h            # SHA-256 and token generation headers
│   │   ├── http_server.h       # HTTP REST server declaration
│   │   ├── linked_list.h       # Phase 1: Doubly Linked List
│   │   ├── stack.h             # Phase 1: Stack for Undo/Redo
│   │   ├── queue.h             # Phase 1: Queue for Review Pipeline
│   │   ├── expression_stack.h  # Phase 1: Expression checking
│   │   ├── bst.h               # Phase 2: Binary Search Tree
│   │   ├── graph.h             # Phase 2: Adjacency List Graph
│   │   ├── searching.h         # Phase 3: Linear & Binary Search
│   │   ├── sorting.h           # Phase 3: Merge, Quick & Insertion Sort
│   │   └── problem_solving.h   # Phase 4: Greedy, Knapsack, Backtracking
│   └── src/                    # C Source Implementations
│       ├── c_server_main.c     # C HTTP REST Server entry point
│       ├── http_server.c       # HTTP/1.1 socket server, routing & auth
│       ├── db.c                # SQLite3 schema creation & user isolation
│       ├── crypto.c            # Pure C SHA-256 & random salt generator
│       ├── c_engine.c          # Standalone DSA test harness CLI
│       ├── linked_list.c       # Doubly Linked List logic
│       ├── stack.c             # Stack push/pop logic
│       ├── queue.c             # Queue enqueue/dequeue logic
│       ├── expression_stack.c  # Expression parsing logic
│       ├── bst.c               # BST insert & traversals
│       ├── graph.c             # Graph BFS & DFS logic
│       ├── searching.c         # Search implementations
│       ├── sorting.c           # Sorting implementations
│       └── problem_solving.c   # Greedy, DP & Backtracking logic
├── src/                        # Frontend React SPA
│   ├── pages/
│   │   ├── Login.tsx           # Simple Login page (email & password)
│   │   ├── Signup.tsx          # Simple Sign-Up page (name, email, passwords)
│   │   └── Dashboard.tsx       # Main DSA Dashboard & Phases
│   ├── components/
│   │   ├── UserProfile.tsx     # Student Profile component from session
│   │   └── phases/             # Phase 1 to 4 & C Studio components
│   └── services/
│       ├── authService.ts      # Auth communication with C REST API
│       ├── internshipApiService.ts # Persistent record sync with C REST API
│       └── cBackendService.ts  # DSA engine mirror and status
├── server.ts                   # Host server running frontend + proxying to C
├── package.json                # Frontend package configuration
└── README.md                   # Project documentation
```

---

## 3. Prerequisites & Installation

### Required C Compiler & Libraries
- **GCC**: `gcc` (version 9+ or clang)
- **Make**: `make`
- **SQLite3 Library & Development Headers**: `libsqlite3-dev` and `sqlite3`
- **Node.js**: Node 18+ (for serving the React SPA)

On Ubuntu / Debian:
```bash
sudo apt-get update
sudo apt-get install -y gcc make libsqlite3-dev sqlite3
```

---

## 4. How to Compile and Run

### Option A: Complete Full-Stack Run (Recommended)
This runs the application with the C backend server automatically compiled and proxied.

```bash
# 1. Install frontend packages (if not already installed)
npm install

# 2. Build the C binaries
make -C backend-c all

# 3. Start the application
npm run dev
```
Open your browser at: **`http://localhost:3000`**

### Option B: Running the C Backend Standalone
You can also run the C HTTP REST Server directly in its own terminal:

```bash
cd backend-c
make clean && make all
./c_http_server --port 8080 --db tracker.db
```
The C backend will start listening on `http://127.0.0.1:8080`.

### Option C: Running the Standalone C DSA Engine Test Harness
To verify that all C data structures, sorting algorithms, and problem-solving modules pass all test cases:

```bash
cd backend-c
./c_engine
```

---

## 5. Security & Authentication Implementation

- **Password Storage**: Passwords are **never stored in plaintext**. The C backend generates a 32-character random cryptographic salt and hashes the password using pure C **SHA-256**.
- **Session Tokens**: On successful registration or login, the C backend issues a 64-character random hex token saved to the SQLite `sessions` table.
- **User Record Isolation**: Every internship record in SQLite is tagged with `user_id`. When querying (`GET /api/internships`), modifying (`PUT /api/internships/:id`), or deleting (`DELETE /api/internships/:id`), the C backend authenticates the token and enforces that students only access their own records.
- **Session Persistence**: The authenticated session is preserved across page refreshes via client storage synced with the C backend (`GET /api/auth/me`).

---

## 6. Default Demo Credentials

For quick evaluation during college presentations:
- **Email:** `student@college.edu`
- **Password:** `password123`

You can also create a new student account using the **Sign-Up** page.

---

## 7. Features & DSA Curriculum Verification

| Feature / Phase | Implementation Language | Status |
| :--- | :--- | :--- |
| Student Registration (`POST /api/auth/register`) | Pure C + SQLite3 + SHA-256 | Verified |
| Student Login (`POST /api/auth/login`) | Pure C + SQLite3 + SHA-256 | Verified |
| Student Logout (`POST /api/auth/logout`) | Pure C + SQLite3 | Verified |
| Record Isolation (`/api/internships`) | Pure C + SQLite3 (`WHERE user_id = ?`) | Verified |
| Phase 1: Doubly Linked List & Head/Tail Insertion | C (`linked_list.c`) + React View | Verified |
| Phase 1: Stack (Undo/Redo) & Queue (FIFO Review) | C (`stack.c`, `queue.c`) + React View | Verified |
| Phase 1: Expression Stack (Parentheses check) | C (`expression_stack.c`) + React View | Verified |
| Phase 2: Trees (BST) & Traversals | C (`bst.c`) + React View | Verified |
| Phase 2: Graphs (BFS & DFS) | C (`graph.c`) + React View | Verified |
| Phase 3: Searching & Sorting (Merge, Quick, Insertion) | C (`sorting.c`, `searching.c`) + React View | Verified |
| Phase 4: Greedy Scheduling, Knapsack DP, Backtracking | C (`problem_solving.c`) + React View | Verified |
| C Backend Studio | C File Inspector & CLI Engine | Verified |
