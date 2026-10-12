/**
 * ============================================================================
 * Header: stack.h
 * Phase 1: Stack Implemented Using Linked List
 * Used for Undo / Redo History of User Actions
 * ============================================================================
 */

#ifndef STACK_H
#define STACK_H

#include "internship.h"

typedef enum {
    ACTION_INSERT = 0,
    ACTION_DELETE,
    ACTION_STATUS_CHANGE
} ActionType;

typedef struct {
    ActionType type;
    InternshipRecord record;
    ApplicationStatus previous_status;
    ApplicationStatus new_status;
    char timestamp[32];
    char description[128];
} ActionRecord;

/* Stack Node */
typedef struct StackNode {
    ActionRecord action;
    struct StackNode* next;
} StackNode;

/* Stack Container */
typedef struct {
    StackNode* top;
    int size;
    int max_capacity;
} ActionStack;

/* Operations */
ActionStack* stack_create(int max_capacity);
void stack_destroy(ActionStack* stack);
int stack_push(ActionStack* stack, ActionRecord action);
int stack_pop(ActionStack* stack, ActionRecord* out_action);
int stack_peek(const ActionStack* stack, ActionRecord* out_action);
int stack_is_empty(const ActionStack* stack);
int stack_size(const ActionStack* stack);
void stack_clear(ActionStack* stack);

#endif /* STACK_H */
