import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Clock,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  UrgentDeadlineAlert,
  requestBrowserNotificationPermission,
  triggerBrowserNotification,
} from '../utils/deadlineNotification';

interface DeadlineNotificationBellProps {
  alerts: UrgentDeadlineAlert[];
  onSelectApplication: (recordId: string) => void;
  onFilterAllUrgent: () => void;
}

export const DeadlineNotificationBell: React.FC<DeadlineNotificationBellProps> = ({
  alerts,
  onSelectApplication,
  onFilterAllUrgent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<string>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'denied';
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEnableBrowserNotifications = async () => {
    const perm = await requestBrowserNotificationPermission();
    setBrowserPermission(perm);
    if (perm === 'granted') {
      if (alerts.length > 0) {
        triggerBrowserNotification('Smart Internship Tracker', {
          body: `${alerts[0].record.companyName} deadline is ${alerts[0].countdownLabel.toLowerCase()} (${alerts[0].formattedDate})!`,
        });
      } else {
        triggerBrowserNotification('Smart Internship Tracker', {
          body: 'Browser deadline notifications enabled successfully!',
        });
      }
    }
  };

  const count = alerts.length;

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Trigger Button */}
      <button
        id="dashboard-notification-bell-btn"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Deadline notifications (${count} urgent)`}
        aria-expanded={isOpen}
        className={`relative p-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
          count > 0
            ? 'border-amber-300 bg-amber-50/80 text-amber-800 hover:bg-amber-100'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Bell className="w-4 h-4" />

        {count > 0 && (
          <span
            id="notification-badge-count"
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs"
          >
            {count}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          id="deadline-notification-dropdown"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-gray-900">
                Deadline Alerts (Next 3 Days)
              </h4>
            </div>

            {count > 0 && (
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                {count} {count === 1 ? 'Action Required' : 'Actions Required'}
              </span>
            )}
          </div>

          {/* List of alerts */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {count === 0 ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-800">All Clear!</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  No internship deadlines fall within the next 3 days.
                </p>
              </div>
            ) : (
              alerts.map(({ record, countdownLabel, daysRemaining, formattedDate }) => (
                <div
                  key={record.id}
                  onClick={() => {
                    onSelectApplication(record.id);
                    setIsOpen(false);
                  }}
                  className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`p-1.5 rounded-md mt-0.5 shrink-0 ${
                        daysRemaining === 0
                          ? 'bg-red-100 text-red-700'
                          : daysRemaining === 1
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900 group-hover:text-blue-600 transition-colors">
                          {record.companyName}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {record.id}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-600 mt-0.5">
                        {record.jobRole} · {record.location}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                        <span
                          className={`font-semibold ${
                            daysRemaining === 0
                              ? 'text-red-700 bg-red-50 border border-red-200'
                              : daysRemaining === 1
                              ? 'text-amber-800 bg-amber-50 border border-amber-200'
                              : 'text-amber-700 bg-amber-50 border border-amber-200'
                          } px-1.5 py-0.5 rounded text-[10px]`}
                        >
                          {countdownLabel}
                        </span>
                        <span className="text-gray-500 font-mono">Due: {formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0 mt-2" />
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-3.5 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-2 text-xs">
            {count > 0 ? (
              <button
                type="button"
                onClick={() => {
                  onFilterAllUrgent();
                  setIsOpen(false);
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] cursor-pointer"
              >
                Filter table to these applications →
              </button>
            ) : (
              <span className="text-[11px] text-gray-500">Auto-tracking active</span>
            )}

            {browserPermission !== 'granted' && typeof window !== 'undefined' && 'Notification' in window && (
              <button
                type="button"
                onClick={handleEnableBrowserNotifications}
                className="text-[11px] text-gray-600 hover:text-gray-900 underline cursor-pointer"
              >
                Enable Desktop Alerts
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
