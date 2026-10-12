import React from 'react';
import {
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Search,
  X,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { SortField, SortDirection, StatusCounts } from '../utils/internshipFilter';

export interface InternshipFilterProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortDirection: SortDirection;
  onSortDirectionToggle: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
  statusCounts: StatusCounts;
  onReset: () => void;
}

export const InternshipFilter: React.FC<InternshipFilterProps> = ({
  statusFilter,
  onStatusFilterChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionToggle,
  searchQuery,
  onSearchQueryChange,
  totalCount,
  filteredCount,
  statusCounts,
  onReset,
}) => {
  const isFiltered =
    statusFilter !== 'ALL' ||
    searchQuery.trim() !== '' ||
    sortField !== 'deadline' ||
    sortDirection !== 'asc';

  const filterButtons: { label: string; value: string; count: number }[] = [
    { label: 'All', value: 'ALL', count: statusCounts.all },
    { label: 'Pending', value: 'Pending', count: statusCounts.pending },
    { label: 'Applied', value: 'Applied', count: statusCounts.applied },
    { label: 'Interview', value: 'Interview', count: statusCounts.interview },
    { label: 'Offered', value: 'Offered', count: statusCounts.offered },
    { label: 'Rejected', value: 'Rejected', count: statusCounts.rejected },
  ];

  return (
    <div
      id="internship-filter-container"
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3"
    >
      {/* Top row: Section title, showing count, and reset button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">
            Filter & Sort Applications
          </span>
          <span className="text-xs text-gray-500">
            (Showing <strong className="text-gray-900">{filteredCount}</strong> of{' '}
            <strong className="text-gray-900">{totalCount}</strong>)
          </span>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="self-start sm:self-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Middle row: Status Quick Filter Buttons (Segmented interactive buttons) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-gray-600 mr-1 flex items-center gap-1">
            <span>Status:</span>
          </span>
          {filterButtons.map((btn) => {
            const isActive =
              statusFilter.toLowerCase() === btn.value.toLowerCase() ||
              (btn.value === 'ALL' && statusFilter === 'ALL');
            return (
              <button
                key={btn.value}
                type="button"
                onClick={() => onStatusFilterChange(btn.value)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span>{btn.label}</span>
                <span
                  className={`text-[11px] tabular-nums font-mono ${
                    isActive ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {btn.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Status Dropdown for granular sub-statuses */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="status-dropdown-select" className="text-xs text-gray-500 whitespace-nowrap">
            Specific Status:
          </label>
          <select
            id="status-dropdown-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending (Bookmarked & Under Review)</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview (Interviewing)</option>
            <option value="Bookmarked">Bookmarked</option>
            <option value="Under Review">Under Review</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bottom row: Search and Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Search query input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            id="internship-search-filter"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search company, role, location..."
            className="w-full bg-white border border-gray-300 rounded pl-8 pr-7 py-1 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange('')}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 text-xs"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Sort by:</span>
          </span>

          <select
            id="internship-sort-field-select"
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="bg-white border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="deadline">Deadline Date</option>
            <option value="status">Status (Pipeline Order)</option>
            <option value="company">Company Name</option>
            <option value="priority">Priority</option>
            <option value="stipend">Stipend Amount</option>
          </select>

          {/* Sort direction toggle button */}
          <button
            type="button"
            id="internship-sort-direction-button"
            onClick={onSortDirectionToggle}
            className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 font-medium transition-colors cursor-pointer"
            title={`Toggle Sort Direction (Currently ${sortDirection === 'asc' ? 'Ascending' : 'Descending'})`}
          >
            {sortDirection === 'asc' ? (
              <>
                <ArrowUp className="w-3 h-3 text-blue-600" />
                <span>
                  {sortField === 'deadline'
                    ? 'Earliest'
                    : sortField === 'status'
                    ? 'Pipeline'
                    : 'Asc'}
                </span>
              </>
            ) : (
              <>
                <ArrowDown className="w-3 h-3 text-blue-600" />
                <span>
                  {sortField === 'deadline'
                    ? 'Latest'
                    : sortField === 'status'
                    ? 'Reverse'
                    : 'Desc'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
