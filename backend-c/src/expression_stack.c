/**
 * ============================================================================
 * Source: expression_stack.c
 * Phase 1: Expression Stack Implementation
 * ============================================================================
 */

#include "../include/expression_stack.h"

CharStack* char_stack_create(void) {
    CharStack* stack = (CharStack*)malloc(sizeof(CharStack));
    if (!stack) return NULL;
    stack->top = NULL;
    stack->size = 0;
    return stack;
}

void char_stack_destroy(CharStack* stack) {
    if (!stack) return;
    while (stack->top) {
        CharStackNode* temp = stack->top;
        stack->top = temp->next;
        free(temp);
    }
    free(stack);
}

void char_stack_push(CharStack* stack, char ch, int position) {
    if (!stack) return;
    CharStackNode* node = (CharStackNode*)malloc(sizeof(CharStackNode));
    if (!node) return;
    node->ch = ch;
    node->position = position;
    node->next = stack->top;
    stack->top = node;
    stack->size++;
}

int char_stack_pop(CharStack* stack, char* out_ch, int* out_pos) {
    if (!stack || !stack->top) return 0;
    CharStackNode* temp = stack->top;
    if (out_ch) *out_ch = temp->ch;
    if (out_pos) *out_pos = temp->position;
    stack->top = temp->next;
    free(temp);
    stack->size--;
    return 1;
}

int char_stack_is_empty(const CharStack* stack) {
    return (!stack || stack->top == NULL);
}

static int is_matching_pair(char open, char close) {
    if (open == '(' && close == ')') return 1;
    if (open == '[' && close == ']') return 1;
    if (open == '{' && close == '}') return 1;
    return 0;
}

ExpressionValidationResult validate_balanced_expression(const char* expr) {
    ExpressionValidationResult res;
    res.is_valid = 1;
    res.error_position = -1;
    res.matched_pairs_count = 0;
    strcpy(res.message, "Expression syntax has balanced parentheses.");

    if (!expr) {
        res.is_valid = 0;
        strcpy(res.message, "Expression is null.");
        return res;
    }

    CharStack* stack = char_stack_create();
    int len = (int)strlen(expr);

    for (int i = 0; i < len; i++) {
        char ch = expr[i];
        if (ch == '(' || ch == '[' || ch == '{') {
            char_stack_push(stack, ch, i);
        } else if (ch == ')' || ch == ']' || ch == '}') {
            if (char_stack_is_empty(stack)) {
                res.is_valid = 0;
                res.error_position = i;
                snprintf(res.message, sizeof(res.message),
                         "Unmatched closing bracket '%c' at position %d.", ch, i);
                char_stack_destroy(stack);
                return res;
            }

            char open_ch;
            int open_pos;
            char_stack_pop(stack, &open_ch, &open_pos);

            if (!is_matching_pair(open_ch, ch)) {
                res.is_valid = 0;
                res.error_position = i;
                snprintf(res.message, sizeof(res.message),
                         "Mismatched bracket: opened with '%c' at %d but closed with '%c' at %d.",
                         open_ch, open_pos, ch, i);
                char_stack_destroy(stack);
                return res;
            }
            res.matched_pairs_count++;
        }
    }

    if (!char_stack_is_empty(stack)) {
        char unclosed;
        int unclosed_pos;
        char_stack_pop(stack, &unclosed, &unclosed_pos);
        res.is_valid = 0;
        res.error_position = unclosed_pos;
        snprintf(res.message, sizeof(res.message),
                 "Unclosed opening bracket '%c' at position %d.", unclosed, unclosed_pos);
    }

    char_stack_destroy(stack);
    return res;
}
