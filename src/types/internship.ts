/**
 * Official Data Model: Internship Record & DSA Engine Types
 *
 * This represents the core entity that is stored, traversed, sorted,
 * and processed using custom C-equivalent Data Structures & Algorithms across Phases 1 - 4.
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
  /** Unique internship identifier (e.g. "INT-101") */
  id: string;

  /** Name of the company offering the internship */
  companyName: string;

  /** Position / role title */
  jobRole: string;

  /** Geographic or remote location */
  location: string;

  /** ISO date string (YYYY-MM-DD) for deadline */
  applicationDeadline: string;

  /** Current pipeline stage */
  applicationStatus: ApplicationStatus;

  /** Urgency / priority categorization */
  priority: ApplicationPriority;

  /** ISO date string when application was submitted or recorded */
  applicationDate: string;

  /** Optional student notes or interview preparation tips */
  notes?: string;

  /** Monthly stipend in USD */
  stipend?: string;
  stipendAmount?: number;

  /** Number of technical interview rounds */
  interviewRounds?: number;

  /** Weekly prep hours needed (for 0/1 Knapsack DP) */
  prepHoursRequired?: number;
}

/* ============================================================================
 * Phase 1: Linear Data Structure Types
 * ============================================================================ */

export interface DoublyLinkedListNode {
  data: InternshipRecord;
  memoryAddress: string;
  prevAddress: string | null;
  nextAddress: string | null;
}

export type ActionType = 'INSERT' | 'DELETE' | 'STATUS_CHANGE';

export interface ActionRecord {
  id: string;
  type: ActionType;
  record: InternshipRecord;
  previousStatus?: ApplicationStatus;
  newStatus?: ApplicationStatus;
  timestamp: string;
  description: string;
}

export interface ExpressionValidationResult {
  isValid: boolean;
  message: string;
  errorPosition: number;
  matchedPairsCount: number;
}

/* ============================================================================
 * Phase 2: Tree & Graph Types
 * ============================================================================ */

export interface BSTNode {
  data: InternshipRecord;
  left: BSTNode | null;
  right: BSTNode | null;
  depth: number;
}

export type TraversalType = 'inorder' | 'preorder' | 'postorder';

export interface TraversalStep {
  companyName: string;
  id: string;
  jobRole: string;
  deadline: string;
  depth: number;
}

export interface GraphEdge {
  target: string;
  relation: string;
  weight: number;
}

export interface GraphNode {
  name: string;
  type: 'company' | 'role' | 'skill';
  edges: GraphEdge[];
}

export interface GraphTraversalResult {
  startNode: string;
  visitedNodes: string[];
  pathDescription: string;
  algorithm: 'BFS' | 'DFS';
}

/* ============================================================================
 * Phase 3: Searching & Sorting Types
 * ============================================================================ */

export interface SearchResult {
  foundIndex: number;
  comparisons: number;
  timeMicroseconds: number;
  stepsTrace: string[];
  complexity: string;
}

export interface SearchBenchmark {
  query: string;
  linearResult: SearchResult;
  binaryResult: SearchResult;
  efficiencyGainPercent: number;
}

export type SortAlgorithm = 'merge' | 'quick' | 'insertion';
export type SortCriteria = 'deadline' | 'company' | 'priority' | 'stipend';

export interface SortMetrics {
  algorithmName: string;
  criteria: SortCriteria;
  comparisons: number;
  swaps: number;
  timeMicroseconds: number;
  timeComplexity: string;
  spaceComplexity: string;
  isStable: boolean;
  sortedRecords: InternshipRecord[];
}

/* ============================================================================
 * Phase 4: Algorithmic Problem Solving Types
 * ============================================================================ */

export interface InterviewSlot {
  id: string;
  company: string;
  roundName: string;
  startTime: number; // e.g. 9 for 09:00
  endTime: number;   // e.g. 11 for 11:00
  priority: number;
}

export interface GreedyScheduleResult {
  selectedSlots: InterviewSlot[];
  totalScheduledHours: number;
  allSlots: InterviewSlot[];
  explanation: string;
}

export interface ApplicationPrepItem {
  id: string;
  company: string;
  prepHoursCost: number; // Weight
  valueScore: number;    // Value / Utility
  stipend: number;
}

export interface KnapsackResult {
  hoursBudget: number;
  maxValue: number;
  selectedItems: ApplicationPrepItem[];
  totalHoursUsed: number;
  dpMatrix: number[][]; // [items+1][hours+1]
  explanation: string;
}

export interface BacktrackCandidate {
  name: string;
  company: string;
  availableSlotIds: number[];
}

export interface BacktrackingResult {
  success: boolean;
  assignments: { studentName: string; company: string; slotId: number; slotLabel: string }[];
  recursiveCalls: number;
  backtracks: number;
  resolutionLog: string;
}
