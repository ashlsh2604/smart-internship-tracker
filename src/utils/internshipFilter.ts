import { InternshipRecord } from '../types/internship';

export type StatusFilterOption =
  | 'ALL'
  | 'Pending'
  | 'Applied'
  | 'Interview'
  | 'Bookmarked'
  | 'Under Review'
  | 'Interviewing'
  | 'Offered'
  | 'Rejected';

export type SortField = 'deadline' | 'status' | 'company' | 'priority' | 'stipend';
export type SortDirection = 'asc' | 'desc';

export interface StatusCounts {
  all: number;
  pending: number;
  applied: number;
  interview: number;
  offered: number;
  rejected: number;
  bookmarked: number;
  underReview: number;
}

/**
 * Strips random timestamp numbers or underscores from IDs (e.g. "INT-105_3066" -> "INT-105")
 */
export function cleanId(id: string | undefined | null): string {
  if (!id) return '';
  return id.replace(/_.*$/, '').replace(/-\d{4,}$/, '');
}

/**
 * Pipeline logical rank for sorting by status:
 * 1: Bookmarked / Pending
 * 2: Under Review
 * 3: Applied
 * 4: Interviewing / Interview
 * 5: Offered
 * 6: Rejected
 */
export const STATUS_PIPELINE_ORDER: Record<string, number> = {
  'Bookmarked': 1,
  'Pending': 1,
  'Under Review': 2,
  'Applied': 3,
  'Interviewing': 4,
  'Interview': 4,
  'Offered': 5,
  'Rejected': 6,
};

export const PRIORITY_ORDER: Record<string, number> = {
  'High': 3,
  'Medium': 2,
  'Low': 1,
};

/**
 * Computes application counts per status category
 */
export function getStatusCounts(records: InternshipRecord[]): StatusCounts {
  const counts: StatusCounts = {
    all: records.length,
    pending: 0,
    applied: 0,
    interview: 0,
    offered: 0,
    rejected: 0,
    bookmarked: 0,
    underReview: 0,
  };

  for (const r of records) {
    const s = r.applicationStatus;
    if (s === 'Applied') {
      counts.applied++;
    } else if (s === 'Interviewing') {
      counts.interview++;
    } else if (s === 'Bookmarked') {
      counts.bookmarked++;
      counts.pending++;
    } else if (s === 'Under Review') {
      counts.underReview++;
      counts.pending++;
    } else if (s === 'Offered') {
      counts.offered++;
    } else if (s === 'Rejected') {
      counts.rejected++;
    }
  }

  return counts;
}

/**
 * Filters and sorts an array of InternshipRecords based on:
 * - status (e.g. Pending, Applied, Interview, Offered, Rejected)
 * - deadline date, status, company, priority, or stipend
 * - sort direction (asc / desc)
 * - optional search query keyword
 */
export function filterAndSortInternships(
  records: InternshipRecord[],
  statusFilter: string,
  sortField: SortField,
  sortDirection: SortDirection,
  searchQuery: string = ''
): InternshipRecord[] {
  let result = [...records];

  // 1. Status Filter
  if (statusFilter && statusFilter !== 'ALL') {
    const filterNorm = statusFilter.toLowerCase().trim();
    result = result.filter((rec) => {
      const recStatus = (rec.applicationStatus || '').toLowerCase().trim();
      if (filterNorm === 'pending') {
        // Pending encompasses Bookmarked and Under Review stages
        return recStatus === 'bookmarked' || recStatus === 'under review' || recStatus === 'pending';
      }
      if (filterNorm === 'interview' || filterNorm === 'interviewing') {
        return recStatus === 'interviewing' || recStatus === 'interview';
      }
      return recStatus === filterNorm;
    });
  }

  // 2. Search Query Filter (company, role, location, id, notes)
  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter((rec) => {
      return (
        rec.companyName.toLowerCase().includes(q) ||
        rec.jobRole.toLowerCase().includes(q) ||
        rec.location.toLowerCase().includes(q) ||
        rec.id.toLowerCase().includes(q) ||
        (rec.notes && rec.notes.toLowerCase().includes(q))
      );
    });
  }

  // 3. Sorting
  result.sort((a, b) => {
    let cmp = 0;

    if (sortField === 'deadline') {
      // ISO strings YYYY-MM-DD compare cleanly lexicographically
      const dateA = a.applicationDeadline || '';
      const dateB = b.applicationDeadline || '';
      cmp = dateA.localeCompare(dateB);
      // Secondary tie-breaker: company name
      if (cmp === 0) {
        cmp = a.companyName.localeCompare(b.companyName);
      }
    } else if (sortField === 'status') {
      // Sort by pipeline order
      const orderA = STATUS_PIPELINE_ORDER[a.applicationStatus] || 99;
      const orderB = STATUS_PIPELINE_ORDER[b.applicationStatus] || 99;
      cmp = orderA - orderB;
      // Secondary tie-breaker: deadline date
      if (cmp === 0) {
        cmp = (a.applicationDeadline || '').localeCompare(b.applicationDeadline || '');
      }
    } else if (sortField === 'company') {
      cmp = a.companyName.localeCompare(b.companyName);
      // Secondary tie-breaker: deadline
      if (cmp === 0) {
        cmp = (a.applicationDeadline || '').localeCompare(b.applicationDeadline || '');
      }
    } else if (sortField === 'priority') {
      const pA = PRIORITY_ORDER[a.priority] || 0;
      const pB = PRIORITY_ORDER[b.priority] || 0;
      cmp = pB - pA; // High priority first
      // Secondary tie-breaker: deadline
      if (cmp === 0) {
        cmp = (a.applicationDeadline || '').localeCompare(b.applicationDeadline || '');
      }
    } else if (sortField === 'stipend') {
      cmp = (a.stipendAmount || 0) - (b.stipendAmount || 0);
    }

    return sortDirection === 'desc' ? -cmp : cmp;
  });

  return result;
}
