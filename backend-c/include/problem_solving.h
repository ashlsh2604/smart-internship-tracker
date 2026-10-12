/**
 * ============================================================================
 * Header: problem_solving.h
 * Phase 4: Algorithmic Problem Solving (Greedy, Dynamic Programming, Backtracking)
 * ============================================================================
 */

#ifndef PROBLEM_SOLVING_H
#define PROBLEM_SOLVING_H

#include "internship.h"

#define MAX_INTERVALS 32
#define MAX_CANDIDATES 16
#define MAX_SLOTS 16

/* 1. Greedy: Interval Scheduling for Interviews */
typedef struct {
    char id[32];
    char company[64];
    char round_name[64];
    int start_time;             /* e.g. 9 for 09:00, 14 for 14:00 */
    int end_time;               /* e.g. 11 for 11:00 */
    int priority;
} InterviewSlot;

typedef struct {
    InterviewSlot selected[MAX_INTERVALS];
    int count;
    int total_scheduled_hours;
    char explanation[512];
} GreedyScheduleResult;

/* 2. Dynamic Programming: 0/1 Knapsack for Preparation Optimization */
typedef struct {
    char company[64];
    int prep_hours_cost;        /* Weight */
    int value_score;            /* Value / Stipend or Priority score */
} ApplicationItem;

typedef struct {
    int max_value;
    int selected_indices[MAX_INTERVALS];
    int selected_count;
    int total_hours_used;
    int dp_table_rows;
    int dp_table_cols;
    char strategy_summary[512];
} KnapsackResult;

/* 3. Backtracking: Interview Slot Conflict Solver */
typedef struct {
    char student_name[64];
    char company[64];
    int slot_id;                /* Assigned slot ID (0 to num_slots - 1) */
} CandidateAssignment;

typedef struct {
    int success;
    int total_assignments;
    CandidateAssignment assignments[MAX_CANDIDATES];
    int recursive_calls_count;
    int backtracks_count;
    char resolution_log[1024];
} BacktrackingResult;

/* Operations */
GreedyScheduleResult solve_interval_scheduling(InterviewSlot slots[], int n);
KnapsackResult solve_knapsack_01(int hours_budget, ApplicationItem items[], int n);
BacktrackingResult solve_interview_slot_assignment(
    const char* student_names[],
    const char* company_preferences[],
    int student_avail_mask[],   /* Bitmask of available slots per student */
    int num_students,
    int num_slots
);

#endif /* PROBLEM_SOLVING_H */
