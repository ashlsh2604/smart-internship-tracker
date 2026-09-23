# Phase 1: Custom Stack Implementation (Reserved)

This directory is reserved for the custom **Stack implemented using a Linked List** in Phase 1.

## Planned Architecture:
- **Underlying Structure**: Linked List where operations occur at the `head` pointer for guaranteed $O(1)$ constant time complexity.
- **Operations**:
  - `push(action: UserAction)`: Add latest operation or internship state to top of stack.
  - `pop()`: Remove and return topmost action.
  - `peek()`: Inspect topmost element without mutating stack.
  - `isEmpty()`: Check if stack has 0 elements.
- **Applied Workflow**:
  - **Undo / Redo System**: Undo recent internship operations (e.g. undoing accidental deletions or status updates).
  - **Expression Stack**: Demonstrating simple educational expression evaluation or matching (e.g., balanced parentheses in query filters).

*Note: In accordance with Phase 1A boundaries, custom DSA code will be implemented in the subsequent step.*
