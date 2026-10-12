/**
 * ============================================================================
 * Source: problem_solving.c
 * Phase 4: Greedy Interval Scheduling, 0/1 Knapsack DP, & Backtracking Solver
 * ============================================================================
 */

#include "../include/problem_solving.h"

/* ============================================================================
 * 1. GREEDY INTERVAL SCHEDULING
 * Strategy: Sort by earliest finish time (end_time ascending), greedily select
 * ============================================================================
 */

static int compare_slots_by_finish(const void* a, const void* b) {
    const InterviewSlot* sa = (const InterviewSlot*)a;
    const InterviewSlot* sb = (const InterviewSlot*)b;
    if (sa->end_time != sb->end_time) {
        return sa->end_time - sb->end_time;
    }
    return sa->start_time - sb->start_time;
}

GreedyScheduleResult solve_interval_scheduling(InterviewSlot slots[], int n) {
    GreedyScheduleResult res;
    res.count = 0;
    res.total_scheduled_hours = 0;
    res.explanation[0] = '\0';

    if (n <= 0) {
        strcpy(res.explanation, "No interview slots provided.");
        return res;
    }

    /* Make copy and sort by finish time */
    InterviewSlot sorted[MAX_INTERVALS];
    int count = n < MAX_INTERVALS ? n : MAX_INTERVALS;
    for (int i = 0; i < count; i++) {
        sorted[i] = slots[i];
    }
    qsort(sorted, count, sizeof(InterviewSlot), compare_slots_by_finish);

    /* First interval with earliest finish time is always selected */
    res.selected[res.count++] = sorted[0];
    res.total_scheduled_hours += (sorted[0].end_time - sorted[0].start_time);
    int last_finish = sorted[0].end_time;

    for (int i = 1; i < count; i++) {
        if (sorted[i].start_time >= last_finish) {
            res.selected[res.count++] = sorted[i];
            res.total_scheduled_hours += (sorted[i].end_time - sorted[i].start_time);
            last_finish = sorted[i].end_time;
        }
    }

    snprintf(res.explanation, sizeof(res.explanation),
             "Greedy Activity Selection: Evaluated %d candidate intervals. Selected %d non-conflicting rounds maximizing attendance, totaling %d hours.",
             count, res.count, res.total_scheduled_hours);
    return res;
}

/* ============================================================================
 * 2. 0/1 KNAPSACK DYNAMIC PROGRAMMING
 * State: dp[i][w] = maximum value achieved using subset of first i items with budget w
 * Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w - cost[i]] + val[i])
 * ============================================================================
 */

KnapsackResult solve_knapsack_01(int hours_budget, ApplicationItem items[], int n) {
    KnapsackResult res;
    res.max_value = 0;
    res.selected_count = 0;
    res.total_hours_used = 0;
    res.dp_table_rows = n + 1;
    res.dp_table_cols = hours_budget + 1;
    res.strategy_summary[0] = '\0';

    if (n <= 0 || hours_budget <= 0) {
        strcpy(res.strategy_summary, "Empty budget or items.");
        return res;
    }

    int W = hours_budget;
    /* Allocate 2D DP table */
    int** dp = (int**)malloc((n + 1) * sizeof(int*));
    for (int i = 0; i <= n; i++) {
        dp[i] = (int*)calloc(W + 1, sizeof(int));
    }

    /* Build DP table */
    for (int i = 1; i <= n; i++) {
        int wt = items[i - 1].prep_hours_cost;
        int val = items[i - 1].value_score;

        for (int w = 0; w <= W; w++) {
            if (wt <= w) {
                int incl = dp[i - 1][w - wt] + val;
                int excl = dp[i - 1][w];
                dp[i][w] = incl > excl ? incl : excl;
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    res.max_value = dp[n][W];

    /* Backtrack to find optimal subset of items */
    int w = W;
    for (int i = n; i > 0 && res.max_value > 0; i--) {
        if (dp[i][w] != dp[i - 1][w]) {
            /* item i-1 was included */
            res.selected_indices[res.selected_count++] = i - 1;
            res.total_hours_used += items[i - 1].prep_hours_cost;
            w -= items[i - 1].prep_hours_cost;
        }
    }

    snprintf(res.strategy_summary, sizeof(res.strategy_summary),
             "Dynamic Programming 0/1 Knapsack: Optimal utility %d achieved using %d of %d available weekly preparation hours across %d selected internships.",
             res.max_value, res.total_hours_used, hours_budget, res.selected_count);

    /* Free DP table */
    for (int i = 0; i <= n; i++) {
        free(dp[i]);
    }
    free(dp);

    return res;
}

/* ============================================================================
 * 3. BACKTRACKING INTERVIEW SLOT ASSIGNMENT
 * Constraint Satisfaction: Each candidate gets unique compatible slot
 * ============================================================================
 */

typedef struct {
    int recursive_calls;
    int backtracks;
    int slot_assigned_to[MAX_SLOTS];
} BacktrackState;

static int backtrack_assign(
    int student_idx,
    int num_students,
    int num_slots,
    int student_avail_mask[],
    int student_assignment[],
    BacktrackState* state
) {
    state->recursive_calls++;

    /* Base case: all students assigned successfully */
    if (student_idx == num_students) {
        return 1;
    }

    /* Try every slot for current student */
    for (int slot = 0; slot < num_slots; slot++) {
        /* Check if student is available at slot AND slot is not already taken */
        int is_available = (student_avail_mask[student_idx] & (1 << slot)) != 0;
        int is_slot_free = (state->slot_assigned_to[slot] == -1);

        if (is_available && is_slot_free) {
            /* Choose */
            student_assignment[student_idx] = slot;
            state->slot_assigned_to[slot] = student_idx;

            /* Explore */
            if (backtrack_assign(student_idx + 1, num_students, num_slots,
                                 student_avail_mask, student_assignment, state)) {
                return 1;
            }

            /* Un-choose (Backtrack) */
            state->backtracks++;
            student_assignment[student_idx] = -1;
            state->slot_assigned_to[slot] = -1;
        }
    }

    return 0;
}

BacktrackingResult solve_interview_slot_assignment(
    const char* student_names[],
    const char* company_preferences[],
    int student_avail_mask[],
    int num_students,
    int num_slots
) {
    BacktrackingResult res;
    res.success = 0;
    res.total_assignments = 0;
    res.recursive_calls_count = 0;
    res.backtracks_count = 0;
    res.resolution_log[0] = '\0';

    if (num_students > MAX_CANDIDATES || num_slots > MAX_SLOTS) {
        strcpy(res.resolution_log, "Candidate or slot limit exceeded.");
        return res;
    }

    BacktrackState state;
    state.recursive_calls = 0;
    state.backtracks = 0;
    for (int i = 0; i < MAX_SLOTS; i++) {
        state.slot_assigned_to[i] = -1;
    }

    int student_assignment[MAX_CANDIDATES];
    for (int i = 0; i < MAX_CANDIDATES; i++) {
        student_assignment[i] = -1;
    }

    int found = backtrack_assign(0, num_students, num_slots, student_avail_mask, student_assignment, &state);

    res.success = found;
    res.recursive_calls_count = state.recursive_calls;
    res.backtracks_count = state.backtracks;

    if (found) {
        res.total_assignments = num_students;
        for (int i = 0; i < num_students; i++) {
            strncpy(res.assignments[i].student_name, student_names[i], 63);
            strncpy(res.assignments[i].company, company_preferences[i], 63);
            res.assignments[i].slot_id = student_assignment[i];
        }
        snprintf(res.resolution_log, sizeof(res.resolution_log),
                 "Backtracking Success: Assigned all %d candidate interviews without collision after %d recursive explorations and %d backtracks.",
                 num_students, state.recursive_calls, state.backtracks);
    } else {
        snprintf(res.resolution_log, sizeof(res.resolution_log),
                 "Backtracking Result: No collision-free slot schedule exists with current candidate availability constraints (%d explorations, %d backtracks).",
                 state.recursive_calls, state.backtracks);
    }

    return res;
}
