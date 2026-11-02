import React from 'react';
import { AlertCircle, Clock, ArrowRight, X, Calendar, Building2 } from 'lucide-react';
import { UrgentDeadlineAlert } from '../utils/deadlineNotification';

interface DeadlineNotificationBannerProps {
  alerts: UrgentDeadlineAlert[];
  onFilterToUrgent: () => void;
  onDismiss: () => void;
}

export const DeadlineNotificationBanner: React.FC<DeadlineNotificationBannerProps> = ({
  alerts,
  onFilterToUrgent,
  onDismiss,
}) => {
  if (!alerts || alerts.length === 0) return null;

  const count = alerts.length;
  const topAlert = alerts[0];

  return (
    <aside
      id="deadline-notification-banner"
      aria-label="Upcoming Internship Deadlines Alert"
      className="mb-6 rounded-xl border border-amber-300 bg-amber-50/90 p-4 shadow-xs text-amber-950 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Icon & Headline */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-amber-900">
                Deadline Alert ({count} {count === 1 ? 'Application' : 'Applications'} Due Soon)
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                Next 3 Days
              </span>
            </div>

            <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
              {count === 1 ? (
                <>
                  <strong className="text-amber-950">{topAlert.record.companyName}</strong> (
                  {topAlert.record.jobRole}) application deadline is{' '}
                  <strong className="text-amber-950 underline decoration-amber-500">
                    {topAlert.countdownLabel.toLowerCase()}
                  </strong>{' '}
                  on {topAlert.formattedDate}.
                </>
              ) : (
                <>
                  You have <strong className="text-amber-950">{count} internship applications</strong> closing
                  within the next 72 hours. Top priority:{' '}
                  <strong className="text-amber-950">{topAlert.record.companyName}</strong> (
                  {topAlert.countdownLabel.toLowerCase()}).
                </>
              )}
            </p>

            {/* List of upcoming companies */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {alerts.map(({ record, countdownLabel, formattedDate, daysRemaining }) => (
                <div
                  key={record.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/80 border border-amber-200 rounded-md text-xs text-slate-800 shadow-2xs font-medium"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-slate-900">{record.companyName}</span>
                  <span className="text-slate-400">·</span>
                  <span
                    className={`font-semibold ${
                      daysRemaining === 0
                        ? 'text-red-600'
                        : daysRemaining === 1
                        ? 'text-amber-700'
                        : 'text-amber-600'
                    }`}
                  >
                    {countdownLabel}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">({formattedDate})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={onFilterToUrgent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <span>View Urgent Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss alert"
            title="Dismiss alert"
            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-200/60 hover:text-amber-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
