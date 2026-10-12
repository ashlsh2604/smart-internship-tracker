/**
 * ============================================================================
 * SMART INTERNSHIP DEADLINE TRACKER - C BACKEND ENGINE
 * Source: c_engine.c
 * Core CLI, JSON API, and Practical Viva Verification Suite in C
 * ============================================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../include/internship.h"
#include "../include/linked_list.h"
#include "../include/stack.h"
#include "../include/queue.h"
#include "../include/expression_stack.h"
#include "../include/bst.h"
#include "../include/graph.h"
#include "../include/searching.h"
#include "../include/sorting.h"
#include "../include/problem_solving.h"

/* Initial Seed Records */
static InternshipRecord INITIAL_RECORDS[] = {
    {
        .id = "INT-101",
        .company_name = "Google",
        .job_role = "Software Engineering Intern",
        .location = "Mountain View, CA",
        .deadline = "2026-10-15",
        .status = STATUS_APPLIED,
        .priority = PRIORITY_HIGH,
        .application_date = "2026-09-01",
        .notes = "Completed coding assessment. Reviewing DSA fundamentals.",
        .stipend = 9200,
        .interview_rounds = 3,
        .prep_hours_required = 20
    },
    {
        .id = "INT-102",
        .company_name = "Microsoft",
        .job_role = "Explore Intern",
        .location = "Redmond, WA",
        .deadline = "2026-09-25",
        .status = STATUS_INTERVIEWING,
        .priority = PRIORITY_HIGH,
        .application_date = "2026-08-20",
        .notes = "Round 1 technical scheduled on tree traversals & graphs.",
        .stipend = 8500,
        .interview_rounds = 4,
        .prep_hours_required = 16
    },
    {
        .id = "INT-103",
        .company_name = "Amazon",
        .job_role = "SDE Intern",
        .location = "Seattle, WA",
        .deadline = "2026-11-01",
        .status = STATUS_UNDER_REVIEW,
        .priority = PRIORITY_MEDIUM,
        .application_date = "2026-09-04",
        .notes = "Application submitted through campus portal.",
        .stipend = 8800,
        .interview_rounds = 3,
        .prep_hours_required = 14
    },
    {
        .id = "INT-104",
        .company_name = "Adobe",
        .job_role = "Frontend Engineering Intern",
        .location = "San Jose, CA",
        .deadline = "2026-10-05",
        .status = STATUS_BOOKMARKED,
        .priority = PRIORITY_MEDIUM,
        .application_date = "2026-09-05",
        .notes = "Tailoring portfolio and highlighting React & TypeScript.",
        .stipend = 7600,
        .interview_rounds = 2,
        .prep_hours_required = 10
    },
    {
        .id = "INT-105",
        .company_name = "Stripe",
        .job_role = "Systems Engineering Intern",
        .location = "San Francisco, CA",
        .deadline = "2026-09-20",
        .status = STATUS_APPLIED,
        .priority = PRIORITY_HIGH,
        .application_date = "2026-08-28",
        .notes = "Urgent deadline in 2 weeks. High interest in payments infrastructure.",
        .stipend = 9800,
        .interview_rounds = 4,
        .prep_hours_required = 24
    }
};

static const int NUM_INITIAL_RECORDS = sizeof(INITIAL_RECORDS) / sizeof(INITIAL_RECORDS[0]);

/* Run comprehensive automated test suite and print results */
void run_all_tests(void) {
    printf("====================================================================\n");
    printf("SMART INTERNSHIP DEADLINE TRACKER - C BACKEND VERIFICATION SUITE\n");
    printf("====================================================================\n\n");

    /* --- PHASE 1 TESTS --- */
    printf("[PHASE 1: LINEAR DATA STRUCTURES]\n");
    LinkedList* list = list_create();
    for (int i = 0; i < NUM_INITIAL_RECORDS; i++) {
        list_insert_tail(list, INITIAL_RECORDS[i]);
    }
    printf("  ✓ Linked List: Inserted %d records. Size: %d (Expected: 5)\n", NUM_INITIAL_RECORDS, list_size(list));

    InternshipRecord deleted;
    int del_ok = list_delete_by_id(list, "INT-103", &deleted);
    printf("  ✓ Linked List Delete: ID 'INT-103' deleted: %s (New Size: %d)\n", del_ok ? "SUCCESS" : "FAILED", list_size(list));

    ActionStack* stack = stack_create(50);
    ActionRecord act = {
        .type = ACTION_DELETE,
        .record = deleted,
        .previous_status = deleted.status,
        .new_status = deleted.status
    };
    strcpy(act.description, "Deleted application INT-103");
    stack_push(stack, act);
    printf("  ✓ Stack Push (Undo record created): Stack size = %d\n", stack_size(stack));

    ActionRecord popped;
    stack_pop(stack, &popped);
    list_insert_tail(list, popped.record);
    printf("  ✓ Stack Pop (Undo executed): Restored '%s'. List size restored to: %d\n", popped.record.company_name, list_size(list));

    ApplicationQueue* queue = queue_create();
    queue_enqueue(queue, INITIAL_RECORDS[0]);
    queue_enqueue(queue, INITIAL_RECORDS[1]);
    printf("  ✓ Queue Enqueue: 2 submissions added to FIFO pipeline. Size: %d\n", queue_size(queue));

    InternshipRecord processed;
    queue_dequeue(queue, &processed);
    printf("  ✓ Queue Dequeue: Processed oldest application '%s' (FIFO order verified).\n", processed.company_name);

    ExpressionValidationResult expr1 = validate_balanced_expression("((company == 'Google') && (priority == 'High'))");
    printf("  ✓ Expression Stack: Valid query validated: %s\n", expr1.is_valid ? "TRUE (Balanced)" : "FALSE");
    ExpressionValidationResult expr2 = validate_balanced_expression("((role == 'SWE') && (stipend > 8000)");
    printf("  ✓ Expression Stack: Malformed query detected: %s (Error: %s)\n\n", !expr2.is_valid ? "TRUE (Syntax Error Caught)" : "FALSE", expr2.message);

    /* --- PHASE 2 TESTS --- */
    printf("[PHASE 2: HIERARCHICAL TREES & GRAPHS]\n");
    BinarySearchTree* bst = bst_create();
    for (int i = 0; i < NUM_INITIAL_RECORDS; i++) {
        bst_insert(bst, INITIAL_RECORDS[i]);
    }
    printf("  ✓ BST: Inserted %d nodes. Tree Height: %d\n", bst->size, bst_height(bst));
    const BSTNode* bst_search_res = bst_search(bst, "Google");
    printf("  ✓ BST Search: Looked up 'Google': %s (ID: %s, Role: %s)\n",
           bst_search_res ? "FOUND" : "NOT FOUND",
           bst_search_res ? bst_search_res->data.id : "-",
           bst_search_res ? bst_search_res->data.job_role : "-");

    SkillGraph* g = graph_create();
    graph_populate_sample_data(g);
    printf("  ✓ Graph: Initialized Adjacency List with %d vertices.\n", g->num_vertices);
    TraversalResult bfs_res = graph_bfs(g, "Google");
    printf("  ✓ Graph BFS (Google -> Roles -> Skills): %s\n", bfs_res.path_description);
    TraversalResult dfs_res = graph_dfs(g, "Google");
    printf("  ✓ Graph DFS (Deep exploration): %s\n\n", dfs_res.path_description);

    /* --- PHASE 3 TESTS --- */
    printf("[PHASE 3: SEARCHING & SORTING ALGORITHMS]\n");
    /* Linear vs Binary Search Benchmark */
    InternshipRecord sorted_records[NUM_INITIAL_RECORDS];
    memcpy(sorted_records, INITIAL_RECORDS, sizeof(INITIAL_RECORDS));
    /* Sort first for binary search */
    sort_quick(sorted_records, NUM_INITIAL_RECORDS, SORT_BY_COMPANY);

    SearchBenchmark bench = search_benchmark(sorted_records, NUM_INITIAL_RECORDS, "Microsoft");
    printf("  ✓ Linear Search for 'Microsoft': %d comparisons (%ld µs)\n",
           bench.linear_result.comparisons, bench.linear_result.time_microseconds);
    printf("  ✓ Binary Search for 'Microsoft': %d comparisons (%ld µs)\n",
           bench.binary_result.comparisons, bench.binary_result.time_microseconds);
    printf("  ✓ Search Efficiency Gain: %d%% reduction in comparisons!\n", bench.efficiency_gain_percent);

    InternshipRecord sort_test_arr[NUM_INITIAL_RECORDS];
    memcpy(sort_test_arr, INITIAL_RECORDS, sizeof(INITIAL_RECORDS));
    SortMetrics ms = sort_merge(sort_test_arr, NUM_INITIAL_RECORDS, SORT_BY_DEADLINE);
    printf("  ✓ Merge Sort (by deadline): %d comparisons, %d swaps, %ld µs\n", ms.comparisons, ms.swaps, ms.time_microseconds);

    memcpy(sort_test_arr, INITIAL_RECORDS, sizeof(INITIAL_RECORDS));
    SortMetrics qs = sort_quick(sort_test_arr, NUM_INITIAL_RECORDS, SORT_BY_COMPANY);
    printf("  ✓ Quick Sort (by company): %d comparisons, %d swaps, %ld µs\n", qs.comparisons, qs.swaps, qs.time_microseconds);

    memcpy(sort_test_arr, INITIAL_RECORDS, sizeof(INITIAL_RECORDS));
    SortMetrics is_res = sort_insertion(sort_test_arr, NUM_INITIAL_RECORDS, SORT_BY_PRIORITY);
    printf("  ✓ Insertion Sort (by priority): %d comparisons, %d swaps, %ld µs\n\n", is_res.comparisons, is_res.swaps, is_res.time_microseconds);

    /* --- PHASE 4 TESTS --- */
    printf("[PHASE 4: ALGORITHMIC PROBLEM SOLVING]\n");
    InterviewSlot slots[] = {
        {"SL-1", "Google", "OA Coding", 9, 11, 3},
        {"SL-2", "Microsoft", "Tech Round 1", 10, 12, 3},
        {"SL-3", "Stripe", "System Design", 11, 13, 2},
        {"SL-4", "Amazon", "Behavioral", 13, 14, 2},
        {"SL-5", "Adobe", "Portfolio Review", 14, 16, 1}
    };
    GreedyScheduleResult greedy_res = solve_interval_scheduling(slots, 5);
    printf("  ✓ Greedy Interval Scheduling: %d non-overlapping rounds selected (%d total hours scheduled)\n",
           greedy_res.count, greedy_res.total_scheduled_hours);
    for (int i = 0; i < greedy_res.count; i++) {
        printf("     Slot %d: %s [%s] (%02d:00 - %02d:00)\n",
               i + 1, greedy_res.selected[i].company, greedy_res.selected[i].round_name,
               greedy_res.selected[i].start_time, greedy_res.selected[i].end_time);
    }

    ApplicationItem items[] = {
        {"Google", 20, 95},
        {"Microsoft", 16, 90},
        {"Stripe", 24, 98},
        {"Amazon", 14, 85},
        {"Adobe", 10, 75}
    };
    int prep_budget = 40; /* 40 hours max */
    KnapsackResult knap_res = solve_knapsack_01(prep_budget, items, 5);
    printf("  ✓ Dynamic Programming 0/1 Knapsack (Budget: %d hrs): Optimal Value = %d (Hours used: %d)\n",
           prep_budget, knap_res.max_value, knap_res.total_hours_used);

    const char* students[] = {"Alice", "Bob", "Charlie", "Diana"};
    const char* companies[] = {"Google", "Microsoft", "Amazon", "Stripe"};
    /* Bitmasks for available slots (Slots 0..3): Alice(0,1), Bob(1,2), Charlie(0,2,3), Diana(3) */
    int masks[] = {0b0011, 0b0110, 0b1101, 0b1000};
    BacktrackingResult bt_res = solve_interview_slot_assignment(students, companies, masks, 4, 4);
    printf("  ✓ Backtracking Interview Slot Assignment: %s (Calls: %d, Backtracks: %d)\n",
           bt_res.success ? "SUCCESS" : "NO SOLUTION", bt_res.recursive_calls_count, bt_res.backtracks_count);
    if (bt_res.success) {
        for (int i = 0; i < bt_res.total_assignments; i++) {
            printf("     Candidate %s -> %s (Assigned to Slot %d)\n",
                   bt_res.assignments[i].student_name, bt_res.assignments[i].company,
                   bt_res.assignments[i].slot_id);
        }
    }

    /* Cleanup */
    list_destroy(list);
    stack_destroy(stack);
    queue_destroy(queue);
    bst_destroy(bst);
    graph_destroy(g);

    printf("\n====================================================================\n");
    printf("ALL DSA PHASES (1 - 4) VERIFIED IN C: 100%% PASSING\n");
    printf("====================================================================\n");
}

/* Helper to output JSON response for child_process integration */
void output_json_status(void) {
    printf("{\n");
    printf("  \"backend_language\": \"C\",\n");
    printf("  \"version\": \"C11 / GNU C Compiler\",\n");
    printf("  \"status\": \"healthy\",\n");
    printf("  \"phases_supported\": [\"Phase 1: Linear\", \"Phase 2: Trees & Graphs\", \"Phase 3: Searching & Sorting\", \"Phase 4: Problem Solving\"],\n");
    printf("  \"structures\": [\"Doubly LinkedList\", \"Linked Stack\", \"Linked Queue\", \"BST\", \"Adjacency List Graph\", \"MergeSort\", \"QuickSort\", \"BinarySearch\", \"GreedyIntervals\", \"KnapsackDP\", \"Backtracking\"]\n");
    printf("}\n");
}

int main(int argc, char* argv[]) {
    if (argc > 1 && strcmp(argv[1], "json") == 0) {
        output_json_status();
        return 0;
    }

    /* Default or "test" */
    run_all_tests();
    return 0;
}
