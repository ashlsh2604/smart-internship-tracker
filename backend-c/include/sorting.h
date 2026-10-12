/**
 * ============================================================================
 * Header: sorting.h
 * Phase 3: Sorting Algorithms (Merge Sort, Quick Sort, Insertion Sort)
 * With comparison and swap instrumentation for Viva demonstration
 * ============================================================================
 */

#ifndef SORTING_H
#define SORTING_H

#include "internship.h"

typedef enum {
    SORT_BY_DEADLINE = 0,
    SORT_BY_COMPANY,
    SORT_BY_PRIORITY,
    SORT_BY_STIPEND
} SortCriteria;

typedef struct {
    int comparisons;
    int swaps;
    long time_microseconds;
    const char* algorithm_name;
    const char* time_complexity;
    const char* space_complexity;
    int is_stable;
} SortMetrics;

/* Operations */
SortMetrics sort_merge(InternshipRecord arr[], int size, SortCriteria criteria);
SortMetrics sort_quick(InternshipRecord arr[], int size, SortCriteria criteria);
SortMetrics sort_insertion(InternshipRecord arr[], int size, SortCriteria criteria);

/* Helper comparison function */
int compare_records(const InternshipRecord* a, const InternshipRecord* b, SortCriteria criteria);

#endif /* SORTING_H */
