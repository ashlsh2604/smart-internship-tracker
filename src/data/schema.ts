import { InternshipRecord } from '../types/internship';

/**
 * Blueprint Seed Data for Future Phase 1 Data Structures Testing.
 * These records represent realistic student internship applications that
 * will populate the custom Linked List, Stack, and Queue structures in Phase 1.
 */
export const SAMPLE_INTERNSHIP_BLUEPRINT: InternshipRecord[] = [
  {
    id: 'INT-101',
    companyName: 'Google',
    jobRole: 'Software Engineering Intern (Summer 2027)',
    location: 'Mountain View, CA (Hybrid)',
    applicationDeadline: '2026-10-15',
    applicationStatus: 'Applied',
    priority: 'High',
    applicationDate: '2026-09-01',
    notes: 'Completed technical coding assessment. Reviewing DSA fundamentals.',
  },
  {
    id: 'INT-102',
    companyName: 'Microsoft',
    jobRole: 'Explore Intern (Engineering & PM)',
    location: 'Redmond, WA (On-site)',
    applicationDeadline: '2026-09-25',
    applicationStatus: 'Interviewing',
    priority: 'High',
    applicationDate: '2026-08-20',
    notes: 'Round 1 technical interview scheduled on graph traversal and recursion.',
  },
  {
    id: 'INT-103',
    companyName: 'Amazon',
    jobRole: 'SDE Intern',
    location: 'Seattle, WA',
    applicationDeadline: '2026-11-01',
    applicationStatus: 'Under Review',
    priority: 'Medium',
    applicationDate: '2026-09-04',
    notes: 'Application submitted through campus portal.',
  },
  {
    id: 'INT-104',
    companyName: 'Adobe',
    jobRole: 'Frontend Engineering Intern',
    location: 'San Jose, CA (Remote Friendly)',
    applicationDeadline: '2026-10-05',
    applicationStatus: 'Bookmarked',
    priority: 'Medium',
    applicationDate: '2026-09-05',
    notes: 'Need to tailor portfolio and highlight React/TypeScript projects.',
  },
  {
    id: 'INT-105',
    companyName: 'Stripe',
    jobRole: 'Software Engineer Intern - Core Systems',
    location: 'San Francisco, CA',
    applicationDeadline: '2026-09-20',
    applicationStatus: 'Applied',
    priority: 'High',
    applicationDate: '2026-08-28',
    notes: 'Urgent deadline in 2 weeks. High interest in payments infrastructure.',
  },
];
