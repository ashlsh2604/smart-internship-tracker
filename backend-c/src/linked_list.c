/**
 * ============================================================================
 * Source: linked_list.c
 * Phase 1: Doubly Linked List Implementation
 * ============================================================================
 */

#include "../include/linked_list.h"

LinkedList* list_create(void) {
    LinkedList* list = (LinkedList*)malloc(sizeof(LinkedList));
    if (!list) return NULL;
    list->head = NULL;
    list->tail = NULL;
    list->size = 0;
    return list;
}

void list_destroy(LinkedList* list) {
    if (!list) return;
    ListNode* curr = list->head;
    while (curr) {
        ListNode* next = curr->next;
        free(curr);
        curr = next;
    }
    free(list);
}

int list_insert_tail(LinkedList* list, InternshipRecord record) {
    if (!list) return 0;
    ListNode* node = (ListNode*)malloc(sizeof(ListNode));
    if (!node) return 0;
    node->data = record;
    node->next = NULL;
    node->prev = list->tail;

    if (list->tail) {
        list->tail->next = node;
    } else {
        list->head = node;
    }
    list->tail = node;
    list->size++;
    return 1;
}

int list_insert_head(LinkedList* list, InternshipRecord record) {
    if (!list) return 0;
    ListNode* node = (ListNode*)malloc(sizeof(ListNode));
    if (!node) return 0;
    node->data = record;
    node->prev = NULL;
    node->next = list->head;

    if (list->head) {
        list->head->prev = node;
    } else {
        list->tail = node;
    }
    list->head = node;
    list->size++;
    return 1;
}

int list_insert_at(LinkedList* list, InternshipRecord record, int index) {
    if (!list || index < 0 || index > list->size) return 0;
    if (index == 0) return list_insert_head(list, record);
    if (index == list->size) return list_insert_tail(list, record);

    ListNode* curr = list->head;
    for (int i = 0; i < index; i++) {
        curr = curr->next;
    }

    ListNode* node = (ListNode*)malloc(sizeof(ListNode));
    if (!node) return 0;
    node->data = record;
    node->next = curr;
    node->prev = curr->prev;

    if (curr->prev) {
        curr->prev->next = node;
    }
    curr->prev = node;
    list->size++;
    return 1;
}

int list_delete_by_id(LinkedList* list, const char* id, InternshipRecord* out_deleted) {
    if (!list || !id || list->size == 0) return 0;

    ListNode* curr = list->head;
    while (curr) {
        if (strcmp(curr->data.id, id) == 0) {
            if (out_deleted) {
                *out_deleted = curr->data;
            }

            if (curr->prev) {
                curr->prev->next = curr->next;
            } else {
                list->head = curr->next;
            }

            if (curr->next) {
                curr->next->prev = curr->prev;
            } else {
                list->tail = curr->prev;
            }

            free(curr);
            list->size--;
            return 1;
        }
        curr = curr->next;
    }
    return 0;
}

ListNode* list_find_by_id(const LinkedList* list, const char* id) {
    if (!list || !id) return NULL;
    ListNode* curr = list->head;
    while (curr) {
        if (strcmp(curr->data.id, id) == 0) {
            return curr;
        }
        curr = curr->next;
    }
    return NULL;
}

int list_update_status(LinkedList* list, const char* id, ApplicationStatus new_status, ApplicationStatus* old_status) {
    ListNode* node = list_find_by_id(list, id);
    if (!node) return 0;
    if (old_status) {
        *old_status = node->data.status;
    }
    node->data.status = new_status;
    return 1;
}

int list_size(const LinkedList* list) {
    return list ? list->size : 0;
}

void list_print(const LinkedList* list) {
    if (!list) return;
    ListNode* curr = list->head;
    printf("=== LINKED LIST OF INTERNSHIPS (Size: %d) ===\n", list->size);
    while (curr) {
        printf("[%s] %s | %s | %s | %s | %s\n",
               curr->data.id, curr->data.company_name, curr->data.job_role,
               curr->data.deadline, status_to_string(curr->data.status),
               priority_to_string(curr->data.priority));
        curr = curr->next;
    }
}
