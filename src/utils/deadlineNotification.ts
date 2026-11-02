import { InternshipRecord } from '../types/internship';

/**
 * Calculates the integer difference in days between the reference date (default: today)
 * and the target deadline date formatted as YYYY-MM-DD.
 */
export function getDaysUntilDeadline(
  deadlineStr: string,
  referenceDate: Date = new Date()
): number {
  if (!deadlineStr) return 999;
  const parts = deadlineStr.split('-');
  if (parts.length < 3) return 999;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return 999;

  const deadlineDate = new Date(year, month, day, 0, 0, 0, 0);
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    0,
    0,
    0,
    0
  );

  const diffMs = deadlineDate.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Checks if an application deadline is within the specified number of days (default: 3 days).
 */
export function isDeadlineWithinDays(
  deadlineStr: string,
  daysThreshold: number = 3,
  referenceDate: Date = new Date()
): boolean {
  const days = getDaysUntilDeadline(deadlineStr, referenceDate);
  return days >= 0 && days <= daysThreshold;
}

/**
 * Returns human-readable countdown label for display in alerts and table cells.
 */
export function formatDeadlineCountdown(
  deadlineStr: string,
  referenceDate: Date = new Date()
): string {
  const days = getDaysUntilDeadline(deadlineStr, referenceDate);
  if (days < 0) {
    const absDays = Math.abs(days);
    return absDays === 1 ? 'Overdue by 1 day' : `Overdue by ${absDays} days`;
  }
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days === 2) return 'Due in 2 days';
  if (days === 3) return 'Due in 3 days';
  return `Due in ${days} days`;
}

export interface UrgentDeadlineAlert {
  record: InternshipRecord;
  daysRemaining: number;
  countdownLabel: string;
  urgencyLevel: 'today' | 'tomorrow' | 'urgent' | 'overdue';
  formattedDate: string;
}

/**
 * Extracts and sorts all internship applications whose deadlines fall within the next 3 days.
 * Excludes already resolved applications ('Offered' or 'Rejected').
 */
export function getUrgentDeadlineApplications(
  records: InternshipRecord[],
  daysThreshold: number = 3,
  referenceDate: Date = new Date()
): UrgentDeadlineAlert[] {
  const alerts: UrgentDeadlineAlert[] = [];

  for (const record of records) {
    // Exclude resolved applications
    if (
      record.applicationStatus === 'Offered' ||
      record.applicationStatus === 'Rejected'
    ) {
      continue;
    }

    const days = getDaysUntilDeadline(record.applicationDeadline, referenceDate);
    if (days >= 0 && days <= daysThreshold) {
      let urgencyLevel: UrgentDeadlineAlert['urgencyLevel'] = 'urgent';
      if (days === 0) urgencyLevel = 'today';
      else if (days === 1) urgencyLevel = 'tomorrow';

      alerts.push({
        record,
        daysRemaining: days,
        countdownLabel: formatDeadlineCountdown(record.applicationDeadline, referenceDate),
        urgencyLevel,
        formattedDate: record.applicationDeadline,
      });
    }
  }

  // Sort by most urgent first (ascending days remaining)
  alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
  return alerts;
}

/**
 * Request native web notification permissions
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      return await Notification.requestPermission();
    } catch {
      return 'denied';
    }
  }
  return 'denied';
}

/**
 * Trigger native browser notification if permission has been granted
 */
export function triggerBrowserNotification(title: string, options?: NotificationOptions) {
  if (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'granted'
  ) {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        ...options,
      });
    } catch (e) {
      console.warn('Browser notification error:', e);
    }
  }
}
