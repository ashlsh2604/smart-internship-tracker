# Phase 1: Custom Queue Implementation (Reserved)

This directory is reserved for the custom **Queue implemented using a Linked List** in Phase 1.

## Planned Architecture:
- **Underlying Structure**: Linked List with both `head` (front) and `tail` (rear) pointers for guaranteed $O(1)$ enqueue and dequeue operations.
- **Operations**:
  - `enqueue(record: InternshipRecord)`: Append application to rear ($O(1)$).
  - `dequeue()`: Remove and return oldest application from front ($O(1)$).
  - `peek()`: View front element without removal.
  - `isEmpty()`: Return true if queue length is 0.
- **Applied Workflow**:
  - **Application Processing Pipeline**: FIFO queue simulating chronological review of pending student submissions.
  - **Follow-up Reminder Queue**: Queueing upcoming reminder alerts in sequential arrival order.

*Note: In accordance with Phase 1A boundaries, custom DSA code will be implemented in the subsequent step.*
