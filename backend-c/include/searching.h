/**
 * ============================================================================
 * Header: searching.h
 * Phase 3: Searching Algorithms (Linear Search & Binary Search)
 * Includes step-by-step performance metrics and comparison analytics
 * ============================================================================
 */

#ifndef SEARCHING_H
#define SEARCHING_H

#include "internship.h"

typedef struct {
    int found_index;
    int comparisons;
    long time_microseconds;
    char steps_trace[512];
    const char* complexity;
} SearchResult;

typedef struct {
    SearchResult linear_result;
    SearchResult binary_result;
    int efficiency_gain_percent;
} SearchBenchmark;

/* Operations */
SearchResult search_linear(const InternshipRecord arr[], int size, const char* query);
SearchResult search_binary(const InternshipRecord arr[], int size, const char* query);
SearchBenchmark search_benchmark(const InternshipRecord arr[], int size, const char* query);

#endif /* SEARCHING_H */
