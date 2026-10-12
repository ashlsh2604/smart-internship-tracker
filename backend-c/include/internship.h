/**
 * ============================================================================
 * SMART INTERNSHIP DEADLINE TRACKER - C BACKEND
 * Header: internship.h
 * Description: Core Internship Record Data Model and Enums in C
 * ============================================================================
 */

#ifndef INTERNSHIP_H
#define INTERNSHIP_H

#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

#define MAX_ID_LEN 32
#define MAX_STR_LEN 128
#define MAX_NOTES_LEN 512
#define MAX_DATE_LEN 16

/* Status Enums */
typedef enum {
    STATUS_BOOKMARKED = 0,
    STATUS_APPLIED,
    STATUS_UNDER_REVIEW,
    STATUS_INTERVIEWING,
    STATUS_OFFERED,
    STATUS_REJECTED
} ApplicationStatus;

/* Priority Enums */
typedef enum {
    PRIORITY_LOW = 0,
    PRIORITY_MEDIUM,
    PRIORITY_HIGH
} PriorityLevel;

/* Core Internship Record Struct */
typedef struct {
    char id[MAX_ID_LEN];
    char company_name[MAX_STR_LEN];
    char job_role[MAX_STR_LEN];
    char location[MAX_STR_LEN];
    char deadline[MAX_DATE_LEN];        /* YYYY-MM-DD */
    ApplicationStatus status;
    PriorityLevel priority;
    char application_date[MAX_DATE_LEN];/* YYYY-MM-DD */
    char notes[MAX_NOTES_LEN];
    int stipend;                        /* Monthly stipend in USD or INR */
    int interview_rounds;               /* Number of interview rounds */
    int prep_hours_required;           /* Prep hours needed (for Knapsack DP) */
} InternshipRecord;

/* Helper functions for status & priority conversions */
static inline const char* status_to_string(ApplicationStatus s) {
    switch (s) {
        case STATUS_BOOKMARKED:   return "Bookmarked";
        case STATUS_APPLIED:      return "Applied";
        case STATUS_UNDER_REVIEW: return "Under Review";
        case STATUS_INTERVIEWING: return "Interviewing";
        case STATUS_OFFERED:      return "Offered";
        case STATUS_REJECTED:     return "Rejected";
        default:                  return "Unknown";
    }
}

static inline ApplicationStatus string_to_status(const char* str) {
    if (strcmp(str, "Bookmarked") == 0) return STATUS_BOOKMARKED;
    if (strcmp(str, "Applied") == 0) return STATUS_APPLIED;
    if (strcmp(str, "Under Review") == 0) return STATUS_UNDER_REVIEW;
    if (strcmp(str, "Interviewing") == 0) return STATUS_INTERVIEWING;
    if (strcmp(str, "Offered") == 0) return STATUS_OFFERED;
    if (strcmp(str, "Rejected") == 0) return STATUS_REJECTED;
    return STATUS_APPLIED;
}

static inline const char* priority_to_string(PriorityLevel p) {
    switch (p) {
        case PRIORITY_HIGH:   return "High";
        case PRIORITY_MEDIUM: return "Medium";
        case PRIORITY_LOW:    return "Low";
        default:              return "Medium";
    }
}

static inline PriorityLevel string_to_priority(const char* str) {
    if (strcmp(str, "High") == 0) return PRIORITY_HIGH;
    if (strcmp(str, "Medium") == 0) return PRIORITY_MEDIUM;
    if (strcmp(str, "Low") == 0) return PRIORITY_LOW;
    return PRIORITY_MEDIUM;
}

#endif /* INTERNSHIP_H */
