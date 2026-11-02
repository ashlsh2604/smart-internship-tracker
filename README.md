# Smart Internship Tracker — Native Windows C Backend & Data Structures Project

A full-stack college project for tracking internship applications, deadlines, and interviews, built with a **native C HTTP REST server**, persistent **SQLite3 database**, and a clean **React frontend** showcasing classic Data Structures and Algorithms (DSA).

Runs **100% natively on Windows 10 / 11** without requiring Linux, WSL, Docker, or virtual machines!

---

## 1. System Architecture (Native Windows & Multi-Platform)

```text
┌────────────────────────────────────────────────────────┐
│               Frontend (React SPA)                    │
│  - Simple College UI (White background, light borders) │
│  - Student Login & Sign-Up pages                       │
│  - Student User Profile with session details           │
│  - Interactive DSA Visualizations (Phases 1–4)         │
│  - Internship Filters & Add Application Form Modal     │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST APIs (/api/*)
                           ▼
┌────────────────────────────────────────────────────────┐
│        Development Server & Host (Node.js + Vite)      │
│  - Runs natively on Windows 10/11, macOS, and Linux    │
│  - Serves React SPA on port 3000                       │
│  - Automatically launches & proxies to native C Backend│
│  - Integrated auto-healing fallback engine             │
└──────────────────────────┬─────────────────────────────┘
                           │ TCP / HTTP (port 9095)
                           ▼
┌────────────────────────────────────────────────────────┐
│          Backend — Pure C Language (C11)               │
│  - Windows Native (Win32 Winsock2 & Multi-Threading)   │
│  - Compiles with MinGW-w64 GCC, Clang, or MSVC (cl.exe)│
│  - SHA-256 Hashing + Cryptographic Salt for Passwords  │
│  - Bearer Token Session Management                     │
│  - User-isolated Internship CRUD REST Endpoints        │
│  - Native C DSA Engine (Linked List, Trees, Sort, DP)  │
└──────────────────────────┬─────────────────────────────┘
                           │ SQL C API (libsqlite3 / tracker.db)
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
├── .vscode/                    # VS Code Native Windows Configuration
│   ├── settings.json           # Native Windows terminal & C IntelliSense
│   ├── tasks.json              # Windows build & test tasks
│   └── launch.json             # Dev server launcher
├── backend-c/                  # Native C Backend Directory
│   ├── build.bat               # Windows Command Prompt 1-click build script
│   ├── build.ps1               # Windows PowerShell build script
│   ├── run.bat                 # Windows C server runner
│   ├── test.bat                # Windows DSA engine test runner
│   ├── Makefile                # Cross-platform GNU Make build configuration
│   ├── tracker.db              # Persistent SQLite3 database file
│   ├── include/                # Cross-Platform C Header Files
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
│       ├── http_server.c       # HTTP/1.1 Winsock2 / POSIX server, routing & auth
│       ├── db.c                # SQLite3 schema creation & user isolation
│       ├── crypto.c            # Pure C SHA-256 & Windows CryptGenRandom
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
│   │   ├── Login.tsx           # Student Login page (email & password)
│   │   ├── Signup.tsx          # Student Sign-Up page (name, email, passwords)
│   │   └── Dashboard.tsx       # Main DSA Dashboard, Filters, and Phase Views
│   ├── components/
│   │   ├── InternshipFilter.tsx# Status & Deadline Filter/Sort Component
│   │   ├── AddInternshipForm.tsx# Reusable Application Form Component
│   │   ├── UserProfile.tsx     # Student Profile component
│   │   └── phases/             # Phase 1 to 4 & C Studio components
│   └── services/
│       ├── authService.ts      # Auth communication with C REST API
│       ├── internshipApiService.ts # Persistent record sync with C REST API
│       └── cBackendService.ts  # DSA engine mirror and status
├── server.ts                   # Host server running frontend + proxying to C
├── package.json                # Cross-platform project scripts
└── README.md                   # Project documentation
```

---

## 3. Running Natively on Windows 10/11 (VS Code)

No Linux, WSL, Docker, or Linux executables required!

### Step 1: Open in VS Code
Open the project directory in VS Code on your Windows machine.

### Step 2: Start the Application
Open a terminal in VS Code (PowerShell or Command Prompt):
```powershell
# 1. Install dependencies (if first time)
npm install

# 2. Run the application
npm run dev
```

Open your browser at: **`http://localhost:3000`**

### Step 3: Compiling C Backend Natively on Windows (Optional)
If you wish to compile the C binaries (`c_http_server.exe` and `c_engine.exe`) natively:
1. Ensure a Windows C compiler is installed, such as:
   - **MinGW-w64** via winget: `winget install -e --id BrechtSanders.WinLibs.POSIX.UCRT`
   - or **MSYS2 / GCC**
   - or **Visual Studio C++ Tools** (`cl.exe`)
2. Run the automated Windows build script:
```cmd
cd backend-c
build.bat
```
3. To run the automated DSA verification suite in Windows:
```cmd
test.bat
```

> **Note**: The dev server includes an integrated fallback engine that automatically handles all auth, internship persistence, and DSA benchmarking even if a C compiler is not yet installed on Windows! Once you compile `c_http_server.exe`, the dev server automatically proxies to the native C binary.

---

## 4. Complexity Reference Matrix (Viva Ready)

| Phase | Structure / Algorithm | Operation | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Doubly Linked List | `insert_tail` / `insert_head` | $O(1)$ | $O(1)$ |
| | Doubly Linked List | `delete_by_id` | $O(N)$ | $O(1)$ |
| | Doubly Linked List | `find_by_id` | $O(N)$ | $O(1)$ |
| | Stack (Linked) | `push` / `pop` / `peek` | $O(1)$ | $O(1)$ |
| | Queue (Linked) | `enqueue` / `dequeue` | $O(1)$ | $O(1)$ |
| | Expression Stack | Parenthesis checking | $O(N)$ | $O(N)$ |
| **Phase 2** | Binary Search Tree | `insert` / `search` | $O(\log N)$ avg, $O(N)$ worst | $O(H)$ recursion |
| | Binary Search Tree | Inorder / Preorder / Postorder | $O(N)$ | $O(H)$ recursion |
| | Graph (Adj. List) | BFS Traversal | $O(V + E)$ | $O(V)$ |
| | Graph (Adj. List) | DFS Traversal | $O(V + E)$ | $O(V)$ |
| **Phase 3** | Linear Search | Search by name/role | $O(N)$ | $O(1)$ |
| | Binary Search | Search in sorted list | $O(\log N)$ | $O(1)$ |
| | Merge Sort | Sort by deadline | $O(N \log N)$ (guaranteed) | $O(N)$ |
| | Quick Sort | Sort by company | $O(N \log N)$ avg, $O(N^2)$ worst | $O(\log N)$ |
| | Insertion Sort | Sort nearly-sorted list | $O(N)$ best, $O(N^2)$ worst | $O(1)$ |
| **Phase 4** | Greedy Interval Scheduling | Max non-overlapping interviews | $O(N \log N)$ (sorting) | $O(N)$ |
| | 0/1 Knapsack (DP) | Maximize stipend within hours | $O(N \times W)$ | $O(N \times W)$ |
| | Backtracking | Interview slot assignment | $O(M^N)$ pruned branch & bound | $O(N)$ call stack |

---

## 5. Academic Viva Questions & Answers

1. **How is native Windows compatibility achieved without WSL or Linux?**
   * *Answer*: Networking uses Windows Sockets (`<winsock2.h>`, `<ws2tcpip.h>`, linking with `ws2_32.lib`), multi-threading uses native Windows threads (`_beginthread`), cryptographic token generation uses the Windows Crypto API (`CryptGenRandom`), and paths use Windows-compatible separators and batch scripts (`build.bat`, `run.bat`, `test.bat`).
2. **Why use a Doubly Linked List instead of an array in C?**
   * *Answer*: In a doubly linked list, deletion of a known node is strictly $O(1)$ pointer reassignment (`prev->next = next; next->prev = prev;`), whereas arrays require $O(N)$ memory element shifting.
3. **How does the Stack guarantee $O(1)$ Undo/Redo?**
   * *Answer*: The stack inserts and removes nodes exclusively at the `top` pointer (head of the singly linked list).
4. **How does the Queue guarantee $O(1)$ Enqueue and Dequeue?**
   * *Answer*: By maintaining both a `front` and a `rear` pointer. Enqueue appends to `rear->next`, and dequeue advances `front = front->next`.
5. **Why choose Merge Sort for deadline sorting?**
   * *Answer*: Merge Sort is a **stable** sort ($O(N \log N)$ worst-case guarantee). Stability ensures that if two applications share the exact same deadline date, their original submission order is preserved.
6. **How does the Greedy Interval Scheduling algorithm work?**
   * *Answer*: It sorts all interview candidate slots by **earliest finish time** (`end_time`). Greedily choosing the interval that finishes earliest leaves maximal remaining time for subsequent non-overlapping interviews.
