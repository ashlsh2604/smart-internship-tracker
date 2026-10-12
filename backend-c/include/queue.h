/**
 * ============================================================================
 * Header: queue.h
 * Phase 1: FIFO Queue Implemented Using Linked List (Front & Rear pointers)
 * Used for Application Review Processing Pipeline
 * ============================================================================
 */

#ifndef QUEUE_H
#define QUEUE_H

#include "internship.h"

/* Queue Node */
typedef struct QueueNode {
    InternshipRecord data;
    struct QueueNode* next;
} QueueNode;

/* Queue Container */
typedef struct {
    QueueNode* front;
    QueueNode* rear;
    int size;
} ApplicationQueue;

/* Operations */
ApplicationQueue* queue_create(void);
void queue_destroy(ApplicationQueue* q);
int queue_enqueue(ApplicationQueue* q, InternshipRecord record);
int queue_dequeue(ApplicationQueue* q, InternshipRecord* out_record);
int queue_peek(const ApplicationQueue* q, InternshipRecord* out_record);
int queue_is_empty(const ApplicationQueue* q);
int queue_size(const ApplicationQueue* q);
void queue_clear(ApplicationQueue* q);

#endif /* QUEUE_H */
