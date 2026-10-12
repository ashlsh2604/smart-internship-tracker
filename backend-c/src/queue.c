/**
 * ============================================================================
 * Source: queue.c
 * Phase 1: Queue Implementation Using Linked List with O(1) front & rear
 * ============================================================================
 */

#include "../include/queue.h"

ApplicationQueue* queue_create(void) {
    ApplicationQueue* q = (ApplicationQueue*)malloc(sizeof(ApplicationQueue));
    if (!q) return NULL;
    q->front = NULL;
    q->rear = NULL;
    q->size = 0;
    return q;
}

void queue_destroy(ApplicationQueue* q) {
    if (!q) return;
    queue_clear(q);
    free(q);
}

int queue_enqueue(ApplicationQueue* q, InternshipRecord record) {
    if (!q) return 0;
    QueueNode* node = (QueueNode*)malloc(sizeof(QueueNode));
    if (!node) return 0;
    node->data = record;
    node->next = NULL;

    if (q->rear == NULL) {
        q->front = node;
        q->rear = node;
    } else {
        q->rear->next = node;
        q->rear = node;
    }
    q->size++;
    return 1;
}

int queue_dequeue(ApplicationQueue* q, InternshipRecord* out_record) {
    if (!q || q->front == NULL) return 0;
    QueueNode* temp = q->front;
    if (out_record) {
        *out_record = temp->data;
    }
    q->front = q->front->next;
    if (q->front == NULL) {
        q->rear = NULL;
    }
    free(temp);
    q->size--;
    return 1;
}

int queue_peek(const ApplicationQueue* q, InternshipRecord* out_record) {
    if (!q || q->front == NULL) return 0;
    if (out_record) {
        *out_record = q->front->data;
    }
    return 1;
}

int queue_is_empty(const ApplicationQueue* q) {
    return (!q || q->front == NULL);
}

int queue_size(const ApplicationQueue* q) {
    return q ? q->size : 0;
}

void queue_clear(ApplicationQueue* q) {
    if (!q) return;
    while (q->front) {
        QueueNode* temp = q->front;
        q->front = q->front->next;
        free(temp);
    }
    q->rear = NULL;
    q->size = 0;
}
