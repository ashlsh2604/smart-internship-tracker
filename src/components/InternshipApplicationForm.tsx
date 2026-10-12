import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Calendar,
  Layers,
  MapPin,
  DollarSign,
  FileText,
  AlertCircle,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  InternshipRecord,
  ApplicationStatus,
  ApplicationPriority,
} from '../types/internship';

export interface InternshipFormData {
  companyName: string;
  jobRole: string;
  applicationStatus: ApplicationStatus;
  applicationDeadline: string;
  location?: string;
  priority?: ApplicationPriority;
  stipend?: string;
  notes?: string;
  insertAtHead?: boolean;
}

export interface InternshipApplicationFormProps {
  onSubmit: (record: InternshipRecord, insertAtHead: boolean) => void;
  onCancel?: () => void;
  initialData?: Partial<InternshipFormData>;
  title?: string;
  description?: string;
  isModal?: boolean;
  className?: string;
}

export const InternshipApplicationForm: React.FC<InternshipApplicationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  title = 'Add Internship Application',
  description = 'Enter company and application details to store and track across DSA stages.',
  isModal = false,
  className = '',
}) => {
  // Required fields
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [jobRole, setJobRole] = useState(initialData?.jobRole || '');
  const [status, setStatus] = useState<ApplicationStatus>(
    initialData?.applicationStatus || 'Applied'
  );
  const [deadline, setDeadline] = useState(
    initialData?.applicationDeadline ||
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Optional / supporting fields
  const [location, setLocation] = useState(initialData?.location || 'Remote');
  const [priority, setPriority] = useState<ApplicationPriority>(
    initialData?.priority || 'High'
  );
  const [stipend, setStipend] = useState(initialData?.stipend || '8000');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [insertAtHead, setInsertAtHead] = useState(
    initialData?.insertAtHead || false
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<{
    companyName?: string;
    jobRole?: string;
    deadline?: string;
  }>({});
  const [touched, setTouched] = useState<{
    companyName?: boolean;
    jobRole?: boolean;
    deadline?: boolean;
  }>({});

  const validate = (): boolean => {
    const newErrors: {
      companyName?: string;
      jobRole?: string;
      deadline?: string;
    } = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    }

    if (!jobRole.trim()) {
      newErrors.jobRole = 'Role title is required';
    } else if (jobRole.trim().length < 2) {
      newErrors.jobRole = 'Role title must be at least 2 characters';
    }

    if (!deadline) {
      newErrors.deadline = 'Application deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ companyName: true, jobRole: true, deadline: true });

    if (!validate()) {
      return;
    }

    const numericStipend = Number(stipend.replace(/[^0-9]/g, '')) || 7500;
    const newRecord: InternshipRecord = {
      id: `INT-${Math.floor(100 + Math.random() * 900)}`,
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      location: location.trim() || 'Remote',
      applicationDeadline: deadline,
      applicationStatus: status,
      priority,
      applicationDate: new Date().toISOString().split('T')[0],
      stipend: `$${numericStipend.toLocaleString()}/mo`,
      stipendAmount: numericStipend,
      interviewRounds: 3,
      prepHoursRequired: 16,
      notes: notes.trim() || 'Created via Internship Application Form.',
    };

    onSubmit(newRecord, insertAtHead);
  };

  const formContent = (
    <div
      id="internship-application-form-wrapper"
      className={`bg-white rounded-xl border border-gray-200 p-5 shadow-xs ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close form"
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        {/* Core required fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Company Name */}
          <div>
            <label
              htmlFor="app-form-company"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="app-form-company"
                type="text"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (errors.companyName) {
                    setErrors((prev) => ({ ...prev, companyName: undefined }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, companyName: true }));
                  validate();
                }}
                placeholder="e.g. Google, Microsoft, OpenAI"
                aria-invalid={Boolean(errors.companyName && touched.companyName)}
                aria-describedby={errors.companyName ? 'app-form-company-error' : undefined}
                className={`w-full bg-white border rounded-lg pl-8.5 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-hidden focus:ring-1 ${
                  errors.companyName && touched.companyName
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.companyName && touched.companyName && (
              <p
                id="app-form-company-error"
                role="alert"
                className="text-[11px] text-red-600 mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.companyName}</span>
              </p>
            )}
          </div>

          {/* Role Title */}
          <div>
            <label
              htmlFor="app-form-role"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Role / Position <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="app-form-role"
                type="text"
                value={jobRole}
                onChange={(e) => {
                  setJobRole(e.target.value);
                  if (errors.jobRole) {
                    setErrors((prev) => ({ ...prev, jobRole: undefined }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, jobRole: true }));
                  validate();
                }}
                placeholder="e.g. Software Engineer Intern"
                aria-invalid={Boolean(errors.jobRole && touched.jobRole)}
                aria-describedby={errors.jobRole ? 'app-form-role-error' : undefined}
                className={`w-full bg-white border rounded-lg pl-8.5 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-hidden focus:ring-1 ${
                  errors.jobRole && touched.jobRole
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.jobRole && touched.jobRole && (
              <p
                id="app-form-role-error"
                role="alert"
                className="text-[11px] text-red-600 mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.jobRole}</span>
              </p>
            )}
          </div>
        </div>

        {/* Status & Deadline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label
              htmlFor="app-form-status"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Application Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Layers className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                id="app-form-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full bg-white border border-gray-300 rounded-lg pl-8.5 pr-3 py-2 text-xs text-gray-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Applied">Applied (In Pipeline)</option>
                <option value="Interviewing">Interviewing (Technical / HR)</option>
                <option value="Under Review">Under Review (Pending Decision)</option>
                <option value="Bookmarked">Bookmarked (Saved / Pending)</option>
                <option value="Offered">Offered (Accepted / Pending)</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Deadline Date */}
          <div>
            <label
              htmlFor="app-form-deadline"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Deadline Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                id="app-form-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) {
                    setErrors((prev) => ({ ...prev, deadline: undefined }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, deadline: true }));
                  validate();
                }}
                aria-invalid={Boolean(errors.deadline && touched.deadline)}
                aria-describedby={errors.deadline ? 'app-form-deadline-error' : undefined}
                className={`w-full bg-white border rounded-lg pl-8.5 pr-3 py-2 text-xs text-gray-900 font-mono transition-colors focus:outline-hidden focus:ring-1 ${
                  errors.deadline && touched.deadline
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.deadline && touched.deadline && (
              <p
                id="app-form-deadline-error"
                role="alert"
                className="text-[11px] text-red-600 mt-1 flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.deadline}</span>
              </p>
            )}
          </div>
        </div>

        {/* Toggle optional/advanced fields */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer underline flex items-center gap-1"
          >
            <span>{showAdvanced ? 'Hide additional fields' : '+ Add Location, Priority, Stipend & Notes'}</span>
          </button>
        </div>

        {/* Collapsible details */}
        {showAdvanced && (
          <div className="pt-2 border-t border-gray-100 space-y-3 animate-in fade-in duration-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Location */}
              <div>
                <label
                  htmlFor="app-form-location"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="app-form-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote, Seattle, NY"
                    className="w-full bg-white border border-gray-300 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="app-form-priority"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Priority
                </label>
                <select
                  id="app-form-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ApplicationPriority)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              {/* Monthly Stipend */}
              <div>
                <label
                  htmlFor="app-form-stipend"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Monthly Stipend ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="app-form-stipend"
                    type="number"
                    min="0"
                    step="500"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    placeholder="8000"
                    className="w-full bg-white border border-gray-300 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-gray-900 font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="app-form-notes"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Notes & Interview Preparation
              </label>
              <textarea
                id="app-form-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key technical topics (e.g. Graphs, DP), referral contact, or application link..."
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Linked List Position checkbox */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <input
            type="checkbox"
            id="app-form-insert-head"
            checked={insertAtHead}
            onChange={(e) => setInsertAtHead(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor="app-form-insert-head"
            className="text-xs text-gray-600 cursor-pointer select-none"
          >
            Insert at Head (prepend $O(1)$) instead of Tail (append $O(1)$)
          </label>
        </div>

        {/* Submit / Cancel Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            id="app-form-submit-button"
            type="submit"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div
        id="internship-form-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      >
        <div className="max-w-xl w-full">{formContent}</div>
      </div>
    );
  }

  return formContent;
};
