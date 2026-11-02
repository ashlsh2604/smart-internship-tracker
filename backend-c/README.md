# Smart Internship Deadline Tracker — C Language Backend

This directory contains the **complete, modular C language backend** for the Smart Internship Deadline Tracker, implementing all **Phases 1 through 4** of the college Data Structures & Algorithms (DSA) curriculum.

---

## Architecture & Directory Structure

```text
backend-c/
├── include/
│   ├── internship.h           # Core InternshipRecord struct & enums
│   ├── linked_list.h          # Phase 1: Doubly Linked List storage
│   ├── stack.h                # Phase 1: Linked Stack (Undo / Redo operations)
│   ├── queue.h                # Phase 1: Linked Queue (FIFO Review Pipeline)
│   ├── expression_stack.h     # Phase 1: Balanced Parentheses & Query Validator
│   ├── bst.h                  # Phase 2: Binary Search Tree & Traversals
│   ├── graph.h                # Phase 2: Adjacency List Graph (BFS & DFS)
│   ├── searching.h            # Phase 3: Linear & Binary Search with metrics
│   ├── sorting.h              # Phase 3: Merge Sort, Quick Sort, Insertion Sort
│   └── problem_solving.h      # Phase 4: Greedy, Dynamic Programming, Backtracking
├── src/
│   ├── linked_list.c          # Linked List implementation
│   ├── stack.c                # Stack implementation
│   ├── queue.c                # Queue implementation
│   ├── expression_stack.c     # Expression parser
│   ├── bst.c                  # Binary Search Tree implementation
│   ├── graph.c                # Graph implementation
│   ├── searching.c            # Search algorithms implementation
│   ├── sorting.c              # Sorting algorithms implementation
│   ├── problem_solving.c      # Greedy, DP, and Backtracking algorithms
│   └── c_engine.c             # CLI engine & automated verification test harness
├── Makefile                   # GNU Make build configuration
└── README.md                  # Complete documentation & Viva study guide
```

---

## Compilation & Execution

### On Windows 10/11 (Native, No Linux / WSL):
To compile using the automated Windows batch script (supports MinGW-w64, Clang, or MSVC):
```cmd
cd backend-c
build.bat
```

To run the standalone C HTTP REST Server on Windows:
```cmd
run.bat
```

To run the automated verification suite across all 4 phases on Windows:
```cmd
test.bat
```

---

### On POSIX / Linux / macOS:
```bash
cd backend-c
make
./c_engine # or make test
make clean
```

---

## Complexity Reference Matrix (Viva Ready)

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

## Academic Viva Questions & Answers

1. **Why use a Doubly Linked List instead of a standard dynamic array in C?**
   * *Answer*: In a doubly linked list, deletion of a known node is strictly $O(1)$ pointer reassignment (`prev->next = next; next->prev = prev;`), whereas arrays require $O(N)$ memory element shifting. It also avoids memory reallocation spikes.
2. **How does the Stack guarantee $O(1)$ Undo/Redo?**
   * *Answer*: The stack inserts and removes nodes exclusively at the `top` pointer (head of the singly linked list).
3. **How does the Queue guarantee $O(1)$ Enqueue and Dequeue?**
   * *Answer*: By maintaining both a `front` and a `rear` pointer. Enqueue appends to `rear->next`, and dequeue advances `front = front->next`.
4. **Why choose Merge Sort for deadline sorting?**
   * *Answer*: Merge Sort is a **stable** sort ($O(N \log N)$ worst-case guarantee). Stability ensures that if two applications share the exact same deadline date, their original chronological submission order is preserved.
5. **How does the Greedy Interval Scheduling algorithm work?**
   * *Answer*: It sorts all interview candidate slots by **earliest finish time** (`end_time`). Greedily choosing the interval that finishes earliest leaves maximal remaining time for subsequent non-overlapping interviews.
