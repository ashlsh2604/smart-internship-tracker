# Data Structures (Reserved for Phase 2)

This directory is strictly reserved for Phase 2 of the Smart Internship Deadline Tracker project.

## Planned Implementations for Phase 2:
1. **Hash Map (`HashMap.ts`)**:
   - For fast O(1) constant-time lookup of internship applications by their unique ID (`app_id`).
   - Resolving collisions using chaining (Singly Linked List) or open addressing.

2. **Doubly Linked List (`LinkedList.ts`)**:
   - For chronological ordering and smooth re-ordering/insertion/deletion of internship applications.

3. **Min Heap / Priority Queue (`PriorityQueue.ts` / `MinHeap.ts`)**:
   - Prioritizes internship applications based on the nearest deadline date.
   - Nearest deadline sits at root of min-heap (`peek()` in O(1), `insert()` in O(log N), `extractMin()` in O(log N)).

*Note: Per Phase 1 requirements, no fake or premature DSA functionality is implemented here during authentication.*
