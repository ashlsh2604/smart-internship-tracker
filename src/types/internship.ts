/**
 * Official Data Model: Internship Record
 *
 * This represents the core entity that will be stored, traversed, sorted,
 * and processed using custom Data Structures & Algorithms across Phases 1 - 4.
 */

export type ApplicationStatus =
  | 'Bookmarked'
  | 'Applied'
  | 'Under Review'
  | 'Interviewing'
  | 'Offered'
  | 'Rejected';

export type ApplicationPriority = 'High' | 'Medium' | 'Low';

export interface InternshipRecord {
  /** Unique internship identifier (used for Hash Map / BST / Search key) */
  id: string;

  /** Name of the company offering the internship */
  companyName: string;

  /** Position / role title (e.g. "Software Engineer Intern", "Data Analyst") */
  jobRole: string;

  /** Geographic or remote location (e.g. "San Francisco, CA", "Remote") */
  location: string;

  /** ISO date string (YYYY-MM-DD) for deadline countdown and priority queues */
  applicationDeadline: string;

  /** Current pipeline stage */
  applicationStatus: ApplicationStatus;

  /** Urgency / priority categorization based on student preference or deadline */
  priority: ApplicationPriority;

  /** ISO date string when application was submitted or recorded */
  applicationDate: string;

  /** Optional student notes or interview preparation tips */
  notes?: string;

  /** Optional salary or stipend information */
  stipend?: string;
}
