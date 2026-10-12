/**
 * ============================================================================
 * Header: linked_list.h
 * Phase 1: Singly / Doubly Linked List for Internship Records
 * ============================================================================
 */

#ifndef LINKED_LIST_H
#define LINKED_LIST_H

#include "internship.h"

/* Doubly Linked List Node */
typedef struct ListNode {
    InternshipRecord data;
    struct ListNode* next;
    struct ListNode* prev;
} ListNode;

/* Linked List Container */
typedef struct {
    ListNode* head;
    ListNode* tail;
    int size;
} LinkedList;

/* Operations */
LinkedList* list_create(void);
void list_destroy(LinkedList* list);
int list_insert_tail(LinkedList* list, InternshipRecord record);
int list_insert_head(LinkedList* list, InternshipRecord record);
int list_insert_at(LinkedList* list, InternshipRecord record, int index);
int list_delete_by_id(LinkedList* list, const char* id, InternshipRecord* out_deleted);
ListNode* list_find_by_id(const LinkedList* list, const char* id);
int list_update_status(LinkedList* list, const char* id, ApplicationStatus new_status, ApplicationStatus* old_status);
void list_print(const LinkedList* list);
int list_size(const LinkedList* list);

#endif /* LINKED_LIST_H */
