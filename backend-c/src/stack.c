/**
 * ============================================================================
 * Source: stack.c
 * Phase 1: Stack Implementation Using Linked List
 * ============================================================================
 */

#include "../include/stack.h"

ActionStack* stack_create(int max_capacity) {
    ActionStack* stack = (ActionStack*)malloc(sizeof(ActionStack));
    if (!stack) return NULL;
    stack->top = NULL;
    stack->size = 0;
    stack->max_capacity = max_capacity > 0 ? max_capacity : 100;
    return stack;
}

void stack_destroy(ActionStack* stack) {
    if (!stack) return;
    stack_clear(stack);
    free(stack);
}

int stack_push(ActionStack* stack, ActionRecord action) {
    if (!stack) return 0;
    
    /* If at capacity, drop oldest if needed, or simply reject */
    if (stack->size >= stack->max_capacity) {
        /* Drop oldest at bottom */
        StackNode* curr = stack->top;
        if (!curr) return 0;
        if (!curr->next) {
            free(curr);
            stack->top = NULL;
            stack->size = 0;
        } else {
            while (curr->next && curr->next->next) {
                curr = curr->next;
            }
            free(curr->next);
            curr->next = NULL;
            stack->size--;
        }
    }

    StackNode* node = (StackNode*)malloc(sizeof(StackNode));
    if (!node) return 0;
    node->action = action;
    node->next = stack->top;
    stack->top = node;
    stack->size++;
    return 1;
}

int stack_pop(ActionStack* stack, ActionRecord* out_action) {
    if (!stack || !stack->top) return 0;
    StackNode* temp = stack->top;
    if (out_action) {
        *out_action = temp->action;
    }
    stack->top = temp->next;
    free(temp);
    stack->size--;
    return 1;
}

int stack_peek(const ActionStack* stack, ActionRecord* out_action) {
    if (!stack || !stack->top) return 0;
    if (out_action) {
        *out_action = stack->top->action;
    }
    return 1;
}

int stack_is_empty(const ActionStack* stack) {
    return (!stack || stack->top == NULL);
}

int stack_size(const ActionStack* stack) {
    return stack ? stack->size : 0;
}

void stack_clear(ActionStack* stack) {
    if (!stack) return;
    while (stack->top) {
        StackNode* temp = stack->top;
        stack->top = temp->next;
        free(temp);
    }
    stack->size = 0;
}
