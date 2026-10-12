import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  GraduationCap,
  LogOut,
  Layers,
  GitBranch,
  ArrowUpDown,
  Cpu,
  Terminal,
  LogIn,
  UserPlus,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../components/UserProfile';
import { InternshipFilter } from '../components/InternshipFilter';
import { InternshipApplicationForm } from '../components/InternshipApplicationForm';
import {
  filterAndSortInternships,
  getStatusCounts,
  SortField,
  SortDirection,
} from '../utils/internshipFilter';
import { SAMPLE_INTERNSHIP_BLUEPRINT } from '../data/schema';
import { InternshipRecord, ApplicationStatus, ActionRecord } from '../types/internship';
import { internshipApiService } from '../services/internshipApiService';
import { Phase1LinearView } from '../components/phases/Phase1LinearView';
import { Phase2TreesGraphsView } from '../components/phases/Phase2TreesGraphsView';
import { Phase3SearchSortView } from '../components/phases/Phase3SearchSortView';
import { Phase4ProblemSolvingView } from '../components/phases/Phase4ProblemSolvingView';
import { CBackendStudioView } from '../components/phases/CBackendStudioView';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Welcome notice banner
  const [welcomeAlert, setWelcomeAlert] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && (location.state as { message?: string }).message) {
      setWelcomeAlert((location.state as { message: string }).message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Navigation tab for the 4 DSA Phases + C Backend Studio
  const [activePhase, setActivePhase] = useState<
    'phase1' | 'phase2' | 'phase3' | 'phase4' | 'c_backend'
  >('phase1');

  // Shared state across the application
  const [records, setRecords] = useState<InternshipRecord[]>(SAMPLE_INTERNSHIP_BLUEPRINT);
  const [undoStack, setUndoStack] = useState<ActionRecord[]>([]);
  const [reviewQueue, setReviewQueue] = useState<InternshipRecord[]>(() => [
    SAMPLE_INTERNSHIP_BLUEPRINT[0],
    SAMPLE_INTERNSHIP_BLUEPRINT[1],
  ]);

  // Filter & sorting state for internship applications on dashboard
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('deadline');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add application form toggle
  const [showAddForm, setShowAddForm] = useState(false);

  // Status counts for quick filter buttons
  const statusCounts = useMemo(() => getStatusCounts(records), [records]);

  // Filtered and sorted internship applications
  const filteredRecords = useMemo(
    () =>
      filterAndSortInternships(
        records,
        statusFilter,
        sortField,
        sortDirection,
        searchQuery
      ),
    [records, statusFilter, sortField, sortDirection, searchQuery]
  );

  const isFiltered =
    statusFilter !== 'ALL' ||
    searchQuery.trim() !== '' ||
    sortField !== 'deadline' ||
    sortDirection !== 'asc';

  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setSortField('deadline');
    setSortDirection('asc');
    setSearchQuery('');
  };

  const handleToggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Load user records from persistent C SQLite backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetched = await internshipApiService.fetchInternships();
        if (fetched && fetched.length > 0) {
          setRecords(fetched);
          setReviewQueue([fetched[0], fetched[1] || fetched[0]]);
        } else {
          // If no records exist in C database yet, use blueprint and persist them
          setRecords(SAMPLE_INTERNSHIP_BLUEPRINT);
          setReviewQueue([
            SAMPLE_INTERNSHIP_BLUEPRINT[0],
            SAMPLE_INTERNSHIP_BLUEPRINT[1],
          ]);
          // Sync blueprint records to user's database
          for (const item of SAMPLE_INTERNSHIP_BLUEPRINT) {
            internshipApiService.addInternship(item);
          }
        }
      } catch (e) {
        console.warn('Could not sync records with C backend, using memory state:', e);
      }
    };

    if (user) {
      loadData();
    }
  }, [user?.id]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Add record
  const handleAddRecord = (record: InternshipRecord, atHead: boolean) => {
    setRecords((prev) => (atHead ? [record, ...prev] : [...prev, record]));
    // Persist to C backend SQLite
    internshipApiService.addInternship(record);

    // If active filter would hide the new record, reset status filter so user sees it
    if (statusFilter !== 'ALL') {
      const normStatus = statusFilter.toLowerCase();
      const normRec = record.applicationStatus.toLowerCase();
      const matches =
        (normStatus === 'pending' && (normRec === 'bookmarked' || normRec === 'under review')) ||
        (normStatus === 'interview' && normRec === 'interviewing') ||
        normStatus === normRec;
      if (!matches) {
        setStatusFilter('ALL');
      }
    }

    const action: ActionRecord = {
      id: `ACT-${Date.now()}`,
      type: 'INSERT',
      record,
      timestamp: new Date().toLocaleTimeString(),
      description: `Inserted application '${record.companyName}' (${atHead ? 'Head' : 'Tail'})`,
    };
    setUndoStack((prev) => [action, ...prev]);
  };

  // Delete record
  const handleDeleteRecord = (id: string) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;

    setRecords((prev) => prev.filter((r) => r.id !== id));
    // Remove from C backend SQLite
    internshipApiService.deleteInternship(id);

    const action: ActionRecord = {
      id: `ACT-${Date.now()}`,
      type: 'DELETE',
      record: target,
      timestamp: new Date().toLocaleTimeString(),
      description: `Deleted application '${target.companyName}' (${target.id})`,
    };
    setUndoStack((prev) => [action, ...prev]);
  };

  // Update status
  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    const target = records.find((r) => r.id === id);
    if (!target) return;
    const oldStatus = target.applicationStatus;

    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, applicationStatus: newStatus } : r))
    );
    // Update on C backend SQLite
    internshipApiService.updateInternship(id, { applicationStatus: newStatus });

    const action: ActionRecord = {
      id: `ACT-${Date.now()}`,
      type: 'STATUS_CHANGE',
      record: { ...target, applicationStatus: newStatus },
      previousStatus: oldStatus,
      newStatus,
      timestamp: new Date().toLocaleTimeString(),
      description: `Updated '${target.companyName}' status from ${oldStatus} to ${newStatus}`,
    };
    setUndoStack((prev) => [action, ...prev]);
  };

  // Stack Undo (O(1) Pop)
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const [lastAction, ...remainingStack] = undoStack;
    setUndoStack(remainingStack);

    if (lastAction.type === 'INSERT') {
      setRecords((prev) => prev.filter((r) => r.id !== lastAction.record.id));
      internshipApiService.deleteInternship(lastAction.record.id);
    } else if (lastAction.type === 'DELETE') {
      setRecords((prev) => [...prev, lastAction.record]);
      internshipApiService.addInternship(lastAction.record);
    } else if (lastAction.type === 'STATUS_CHANGE' && lastAction.previousStatus) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === lastAction.record.id
            ? { ...r, applicationStatus: lastAction.previousStatus! }
            : r
        )
      );
      internshipApiService.updateInternship(lastAction.record.id, {
        applicationStatus: lastAction.previousStatus,
      });
    }
  };

  // Queue Enqueue (O(1))
  const handleEnqueue = (record: InternshipRecord) => {
    setReviewQueue((prev) => [...prev, record]);
  };

  // Queue Dequeue (O(1))
  const handleDequeue = () => {
    if (reviewQueue.length === 0) return;
    setReviewQueue((prev) => prev.slice(1));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Navbar: Basic white background with light grey border */}
      <header
        id="dashboard-navbar"
        className="bg-white border-b border-gray-200 sticky top-0 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900 text-base">
              Smart Internship Tracker
            </span>
          </div>

          {/* Navigation Links for DSA Phases */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-gray-700">
            <button
              type="button"
              onClick={() => setActivePhase('phase1')}
              className={`hover:text-blue-600 cursor-pointer ${
                activePhase === 'phase1' ? 'text-blue-600 font-bold underline' : ''
              }`}
            >
              Phase 1: Linear
            </button>
            <button
              type="button"
              onClick={() => setActivePhase('phase2')}
              className={`hover:text-blue-600 cursor-pointer ${
                activePhase === 'phase2' ? 'text-blue-600 font-bold underline' : ''
              }`}
            >
              Phase 2: Trees & Graphs
            </button>
            <button
              type="button"
              onClick={() => setActivePhase('phase3')}
              className={`hover:text-blue-600 cursor-pointer ${
                activePhase === 'phase3' ? 'text-blue-600 font-bold underline' : ''
              }`}
            >
              Phase 3: Search & Sort
            </button>
            <button
              type="button"
              onClick={() => setActivePhase('phase4')}
              className={`hover:text-blue-600 cursor-pointer ${
                activePhase === 'phase4' ? 'text-blue-600 font-bold underline' : ''
              }`}
            >
              Phase 4: Problem Solving
            </button>
            <button
              type="button"
              onClick={() => setActivePhase('c_backend')}
              className={`hover:text-blue-600 cursor-pointer flex items-center gap-1 ${
                activePhase === 'c_backend' ? 'text-blue-600 font-bold underline' : ''
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>C Backend Studio</span>
            </button>
          </nav>

          {/* User Profile & Logout Button */}
          <div className="flex items-center gap-2">
            <UserProfile variant="header-menu" />
            <button
              id="dashboard-logout-button"
              type="button"
              onClick={handleLogout}
              className="border border-gray-300 hover:bg-red-50 text-red-600 font-medium py-1 px-3 rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Welcome Alert */}
        {welcomeAlert && (
          <div
            id="dashboard-welcome-alert"
            className="mb-4 p-3 bg-green-50 border border-green-300 rounded text-xs text-green-800 flex justify-between items-center"
          >
            <span>{welcomeAlert}</span>
            <button
              type="button"
              onClick={() => setWelcomeAlert(null)}
              className="text-green-700 hover:text-green-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* User Profile Component - Displays user details from session */}
        <UserProfile
          variant="banner"
          stats={{
            totalApplications: records.length,
            queueCount: reviewQueue.length,
            historyCount: undoStack.length,
          }}
        />

        {/* Phase Selection Tabs: Simple buttons */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-50 border border-gray-300 rounded">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActivePhase('phase1')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
                activePhase === 'phase1'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Phase 1: Linear DSA
            </button>

            <button
              type="button"
              onClick={() => setActivePhase('phase2')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
                activePhase === 'phase2'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Phase 2: Trees & Graphs
            </button>

            <button
              type="button"
              onClick={() => setActivePhase('phase3')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
                activePhase === 'phase3'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Phase 3: Search & Sort
            </button>

            <button
              type="button"
              onClick={() => setActivePhase('phase4')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
                activePhase === 'phase4'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Phase 4: Problem Solving
            </button>

            <button
              type="button"
              onClick={() => setActivePhase('c_backend')}
              className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer flex items-center gap-1 ${
                activePhase === 'c_backend'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>C Backend Studio</span>
            </button>
          </div>

          <div className="text-xs text-gray-600 pr-2">
            Records: <strong className="text-gray-900">{records.length}</strong> | Undo Actions:{' '}
            <strong className="text-gray-900">{undoStack.length}</strong>
          </div>
        </div>

        {/* Phase Views - Preserved DSA implementations */}
        {activePhase === 'phase1' && (
          <div className="space-y-6">
            {/* Dashboard Applications Header & Add Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Internship Applications
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Track pipeline stages, sort deadlines, and explore linear data structures persisted with C & SQLite.
                </p>
              </div>

              <button
                id="dashboard-add-application-toggle-btn"
                type="button"
                onClick={() => setShowAddForm((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Close Add Form' : 'Add New Application'}</span>
              </button>
            </div>

            {/* Reusable Form Component for Adding New Internship Applications */}
            {showAddForm && (
              <div className="animate-in fade-in duration-150">
                <InternshipApplicationForm
                  onSubmit={(record, atHead) => {
                    handleAddRecord(record, atHead);
                    setShowAddForm(false);
                  }}
                  onCancel={() => setShowAddForm(false)}
                  title="Add New Internship Application"
                  description="Enter company name, role, status, and deadline date. The record will be persisted to SQLite and added to the Doubly Linked List."
                />
              </div>
            )}

            {/* Filter component for internship applications on dashboard */}
            <InternshipFilter
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortField={sortField}
              onSortFieldChange={setSortField}
              sortDirection={sortDirection}
              onSortDirectionToggle={handleToggleSortDirection}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              totalCount={records.length}
              filteredCount={filteredRecords.length}
              statusCounts={statusCounts}
              onReset={handleResetFilters}
            />

            <Phase1LinearView
              records={filteredRecords}
              allRecordsCount={records.length}
              isFiltered={isFiltered}
              onResetFilters={handleResetFilters}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onUpdateStatus={handleUpdateStatus}
              undoStack={undoStack}
              onUndo={handleUndo}
              reviewQueue={reviewQueue}
              onEnqueue={handleEnqueue}
              onDequeue={handleDequeue}
            />
          </div>
        )}

        {activePhase === 'phase2' && <Phase2TreesGraphsView records={records} />}

        {activePhase === 'phase3' && <Phase3SearchSortView records={records} />}

        {activePhase === 'phase4' && <Phase4ProblemSolvingView records={records} />}

        {activePhase === 'c_backend' && <CBackendStudioView />}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500 mt-10">
        <p>Smart Internship Tracker • C Language POSIX Backend + SQLite3 Persistence • DSA Phases 1–4</p>
      </footer>
    </div>
  );
};
