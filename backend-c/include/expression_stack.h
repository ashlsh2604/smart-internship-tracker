/**
 * ============================================================================
 * Header: expression_stack.h
 * Phase 1: Expression Stack for Syntax & Balanced Parentheses Evaluation
 * ============================================================================
 */

#ifndef EXPRESSION_STACK_H
#define EXPRESSION_STACK_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct CharStackNode {
    char ch;
    int position;
    struct CharStackNode* next;
} CharStackNode;

typedef struct {
    CharStackNode* top;
    int size;
} CharStack;

typedef struct {
    int is_valid;
    char message[256];
    int error_position;
    int matched_pairs_count;
} ExpressionValidationResult;

/* Operations */
CharStack* char_stack_create(void);
void char_stack_destroy(CharStack* stack);
void char_stack_push(CharStack* stack, char ch, int position);
int char_stack_pop(CharStack* stack, char* out_ch, int* out_pos);
int char_stack_is_empty(const CharStack* stack);

/* Practical Validator for query filters (e.g. "(role=SWE AND (company=Google OR company=Stripe))") */
ExpressionValidationResult validate_balanced_expression(const char* expr);

#endif /* EXPRESSION_STACK_H */
