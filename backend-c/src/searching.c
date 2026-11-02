/**
 * ============================================================================
 * Source: searching.c
 * Phase 3: Linear & Binary Search Implementations with Benchmark Metrics
 * ============================================================================
 */

#include "../include/searching.h"
#include <time.h>
#include <ctype.h>
#ifndef _WIN32
#include <strings.h>
#endif

SearchResult search_linear(const InternshipRecord arr[], int size, const char* query) {
    SearchResult res;
    res.found_index = -1;
    res.comparisons = 0;
    res.complexity = "O(N)";
    res.steps_trace[0] = '\0';

    clock_t start = clock();

    char trace_buf[256];
    for (int i = 0; i < size; i++) {
        res.comparisons++;
        if (strcasecmp(arr[i].company_name, query) == 0 ||
            strcasecmp(arr[i].id, query) == 0 ||
            (arr[i].job_role[0] != '\0' && strcasestr(arr[i].job_role, query) != NULL)) {
            res.found_index = i;
            snprintf(trace_buf, sizeof(trace_buf), "Match found at index %d ('%s') after %d comparisons.",
                     i, arr[i].company_name, res.comparisons);
            strncat(res.steps_trace, trace_buf, sizeof(res.steps_trace) - strlen(res.steps_trace) - 1);
            break;
        }
    }

    if (res.found_index == -1) {
        snprintf(trace_buf, sizeof(trace_buf), "Scanned entire list of %d records without match (%d comparisons).",
                 size, res.comparisons);
        strncat(res.steps_trace, trace_buf, sizeof(res.steps_trace) - strlen(res.steps_trace) - 1);
    }

    clock_t end = clock();
    res.time_microseconds = (long)((double)(end - start) / CLOCKS_PER_SEC * 1000000.0);
    return res;
}

SearchResult search_binary(const InternshipRecord arr[], int size, const char* query) {
    SearchResult res;
    res.found_index = -1;
    res.comparisons = 0;
    res.complexity = "O(log N)";
    res.steps_trace[0] = '\0';

    clock_t start = clock();

    int low = 0;
    int high = size - 1;
    char trace_buf[256];

    while (low <= high) {
        res.comparisons++;
        int mid = low + (high - low) / 2;
        int cmp = strcasecmp(query, arr[mid].company_name);

        snprintf(trace_buf, sizeof(trace_buf), "[Low: %d, Mid: %d ('%s'), High: %d] -> ",
                 low, mid, arr[mid].company_name, high);
        strncat(res.steps_trace, trace_buf, sizeof(res.steps_trace) - strlen(res.steps_trace) - 1);

        if (cmp == 0) {
            res.found_index = mid;
            snprintf(trace_buf, sizeof(trace_buf), "Match found at mid %d!", mid);
            strncat(res.steps_trace, trace_buf, sizeof(res.steps_trace) - strlen(res.steps_trace) - 1);
            break;
        } else if (cmp < 0) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    if (res.found_index == -1) {
        strncat(res.steps_trace, "Search interval exhausted without match.",
                sizeof(res.steps_trace) - strlen(res.steps_trace) - 1);
    }

    clock_t end = clock();
    res.time_microseconds = (long)((double)(end - start) / CLOCKS_PER_SEC * 1000000.0);
    return res;
}

SearchBenchmark search_benchmark(const InternshipRecord arr[], int size, const char* query) {
    SearchBenchmark b;
    b.linear_result = search_linear(arr, size, query);
    b.binary_result = search_binary(arr, size, query);

    if (b.linear_result.comparisons > 0) {
        b.efficiency_gain_percent = ((b.linear_result.comparisons - b.binary_result.comparisons) * 100) /
                                    b.linear_result.comparisons;
        if (b.efficiency_gain_percent < 0) b.efficiency_gain_percent = 0;
    } else {
        b.efficiency_gain_percent = 0;
    }
    return b;
}
