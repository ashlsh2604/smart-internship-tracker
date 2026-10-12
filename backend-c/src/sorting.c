/**
 * ============================================================================
 * Source: sorting.c
 * Phase 3: Sorting Implementations (Merge Sort, Quick Sort, Insertion Sort)
 * ============================================================================
 */

#include "../include/sorting.h"
#include <time.h>

int compare_records(const InternshipRecord* a, const InternshipRecord* b, SortCriteria criteria) {
    switch (criteria) {
        case SORT_BY_DEADLINE:
            return strcmp(a->deadline, b->deadline);
        case SORT_BY_COMPANY:
            return strcasecmp(a->company_name, b->company_name);
        case SORT_BY_PRIORITY:
            /* High > Medium > Low */
            return b->priority - a->priority;
        case SORT_BY_STIPEND:
            return b->stipend - a->stipend;
        default:
            return strcmp(a->deadline, b->deadline);
    }
}

/* ============================================================================
 * 1. MERGE SORT (Stable, O(N log N))
 * ============================================================================
 */

static void merge(InternshipRecord arr[], int l, int m, int r,
                  SortCriteria criteria, SortMetrics* metrics) {
    int n1 = m - l + 1;
    int n2 = r - m;

    InternshipRecord* L = (InternshipRecord*)malloc(n1 * sizeof(InternshipRecord));
    InternshipRecord* R = (InternshipRecord*)malloc(n2 * sizeof(InternshipRecord));

    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        metrics->comparisons++;
        if (compare_records(&L[i], &R[j], criteria) <= 0) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        metrics->swaps++; /* Record placement */
        k++;
    }

    while (i < n1) {
        arr[k++] = L[i++];
        metrics->swaps++;
    }
    while (j < n2) {
        arr[k++] = R[j++];
        metrics->swaps++;
    }

    free(L);
    free(R);
}

static void merge_sort_recur(InternshipRecord arr[], int l, int r,
                             SortCriteria criteria, SortMetrics* metrics) {
    if (l < r) {
        int m = l + (r - l) / 2;
        merge_sort_recur(arr, l, m, criteria, metrics);
        merge_sort_recur(arr, m + 1, r, criteria, metrics);
        merge(arr, l, m, r, criteria, metrics);
    }
}

SortMetrics sort_merge(InternshipRecord arr[], int size, SortCriteria criteria) {
    SortMetrics m;
    m.comparisons = 0;
    m.swaps = 0;
    m.algorithm_name = "Merge Sort";
    m.time_complexity = "O(N log N)";
    m.space_complexity = "O(N)";
    m.is_stable = 1;

    clock_t start = clock();
    if (size > 1) {
        merge_sort_recur(arr, 0, size - 1, criteria, &m);
    }
    clock_t end = clock();
    m.time_microseconds = (long)((double)(end - start) / CLOCKS_PER_SEC * 1000000.0);
    return m;
}

/* ============================================================================
 * 2. QUICK SORT (In-place, Average O(N log N))
 * ============================================================================
 */

static void swap(InternshipRecord* a, InternshipRecord* b) {
    InternshipRecord temp = *a;
    *a = *b;
    *b = temp;
}

static int partition(InternshipRecord arr[], int low, int high,
                     SortCriteria criteria, SortMetrics* metrics) {
    InternshipRecord pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        metrics->comparisons++;
        if (compare_records(&arr[j], &pivot, criteria) < 0) {
            i++;
            swap(&arr[i], &arr[j]);
            metrics->swaps++;
        }
    }
    swap(&arr[i + 1], &arr[high]);
    metrics->swaps++;
    return (i + 1);
}

static void quick_sort_recur(InternshipRecord arr[], int low, int high,
                             SortCriteria criteria, SortMetrics* metrics) {
    if (low < high) {
        int pi = partition(arr, low, high, criteria, metrics);
        quick_sort_recur(arr, low, pi - 1, criteria, metrics);
        quick_sort_recur(arr, pi + 1, high, criteria, metrics);
    }
}

SortMetrics sort_quick(InternshipRecord arr[], int size, SortCriteria criteria) {
    SortMetrics m;
    m.comparisons = 0;
    m.swaps = 0;
    m.algorithm_name = "Quick Sort";
    m.time_complexity = "O(N log N) avg / O(N^2) worst";
    m.space_complexity = "O(log N)";
    m.is_stable = 0;

    clock_t start = clock();
    if (size > 1) {
        quick_sort_recur(arr, 0, size - 1, criteria, &m);
    }
    clock_t end = clock();
    m.time_microseconds = (long)((double)(end - start) / CLOCKS_PER_SEC * 1000000.0);
    return m;
}

/* ============================================================================
 * 3. INSERTION SORT (Adaptive, Best O(N))
 * ============================================================================
 */

SortMetrics sort_insertion(InternshipRecord arr[], int size, SortCriteria criteria) {
    SortMetrics m;
    m.comparisons = 0;
    m.swaps = 0;
    m.algorithm_name = "Insertion Sort";
    m.time_complexity = "O(N) best / O(N^2) worst";
    m.space_complexity = "O(1)";
    m.is_stable = 1;

    clock_t start = clock();
    for (int i = 1; i < size; i++) {
        InternshipRecord key = arr[i];
        int j = i - 1;

        while (j >= 0) {
            m.comparisons++;
            if (compare_records(&arr[j], &key, criteria) > 0) {
                arr[j + 1] = arr[j];
                m.swaps++;
                j--;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
    }
    clock_t end = clock();
    m.time_microseconds = (long)((double)(end - start) / CLOCKS_PER_SEC * 1000000.0);
    return m;
}
