import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LogOut,
  Layers,
  GitBranch,
  ArrowUpDown,
  Search,
  Cpu,
  User as UserIcon,
  Sparkles,
  Calendar,
  MapPin,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { SAMPLE_INTERNSHIP_BLUEPRINT } from '../data/schema';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Official 4-Phase Roadmap according to the project blueprint
  const roadmapPhases = [
    {
      phaseNumber: 'Phase 1',
      title: 'Linear Data Structures',
      status: 'Next Development Step',
      statusColor: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      icon: Layers,
      accent: 'border-indigo-200 bg-indigo-50/50 text-indigo-700',
      description: 'Core custom data structures for storing and manipulating internship applications.',
      items: [
        'Internship Record Data Model (ID, Company, Role, Deadline, Status, Priority)',
        'Custom Linked List for primary storage with Insert, Delete & Traverse operations',
        'Stack using Linked List for undoing recent internship actions & status changes',
        'Queue using Linked List for chronological application review pipeline',
        'Expression Stack for educational query & expression parsing',
      ],
    },
    {
      phaseNumber: 'Phase 2',
      title: 'Trees & Graphs',
      status: 'Upcoming',
      statusColor: 'bg-slate-100 border-slate-200 text-slate-600',
      icon: GitBranch,
      accent: 'border-blue-200 bg-blue-50/50 text-blue-700',
      description: 'Hierarchical organization and relational mapping between companies, roles, and skills.',
      items: [
        'Binary Search Tree (BST) for fast structured storage indexed by company/date',
        'Inorder (sorted order), Preorder (serialization), & Postorder tree traversals',
        'Graph Adjacency List: Company → Available Roles & Required Skills → Opportunities',
        'Graph Traversals: Breadth-First Search (BFS) & Depth-First Search (DFS)',
      ],
    },
    {
      phaseNumber: 'Phase 3',
      title: 'Searching & Sorting',
      status: 'Upcoming',
      statusColor: 'bg-slate-100 border-slate-200 text-slate-600',
      icon: ArrowUpDown,
      accent: 'border-purple-200 bg-purple-50/50 text-purple-700',
      description: 'Algorithmic filtering and multi-attribute orderings on actual internship records.',
      items: [
        'Linear Search across company names, roles, and status tags',
        'Binary Search on sorted company indices with performance benchmarking',
        'Merge Sort: Stable sorting by upcoming deadline (earliest to latest)',
        'Quick Sort: In-place partitioning by company name or application date',
        'Insertion Sort: Adaptive sorting for nearly-ordered submissions',
      ],
    },
    {
      phaseNumber: 'Phase 4',
      title: 'Algorithmic Problem Solving',
      status: 'Upcoming',
      statusColor: 'bg-slate-100 border-slate-200 text-slate-600',
      icon: Cpu,
      accent: 'border-teal-200 bg-teal-50/50 text-teal-700',
      description: 'Advanced optimization algorithms solving practical student scheduling challenges.',
      items: [
        'Greedy Algorithm: Interval scheduling to maximize non-conflicting interview rounds',
        'Dynamic Programming: 0/1 Knapsack optimization for student stipend / time budget',
        'Backtracking: Constraint-satisfaction interview time slot assignment engine',
        'Final practical viva demonstration & algorithm performance analytics',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header
        id="dashboard-navbar"
        className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-base tracking-tight leading-tight">
                Smart Internship <span className="text-indigo-600">Tracker</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                College DSA Project • Phase 1
              </span>
            </div>
          </div>

          {/* User Profile Info & Logout Button */}
          <div className="flex items-center gap-3 sm:gap-5">
            {user && (
              <div
                id="user-profile-badge"
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 leading-none">
                    {user.name}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-0.5 leading-none">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            <Button
              id="dashboard-logout-button"
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut className="w-4 h-4 text-slate-500" />}
              className="text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Section */}
        <div
          id="welcome-banner"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden mb-8"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Phase 1A: Authentication Established</span>
            </div>

            <h1
              id="welcome-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
            >
              Welcome to Smart Internship Deadline Tracker
            </h1>

            <p
              id="welcome-subtitle"
              className="mt-2 text-base text-slate-600 font-normal leading-relaxed"
            >
              Your internship management system will be available in the next phase.
            </p>

            {/* Scope notification */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-900 font-medium">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>For now, only authentication is functional.</span>
            </div>

            {user && (
              <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-5 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Logged in as:</strong> {user.name} ({user.email})
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <strong>Storage:</strong> LocalStorage Student Auth Session
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Project Roadmap Section */}
        <section id="project-roadmap-section" aria-labelledby="roadmap-heading" className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2
                id="roadmap-heading"
                className="text-xl font-bold text-slate-900 tracking-tight"
              >
                Project Roadmap
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Official 4-Phase Data Structures & Algorithms Blueprint
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 self-start sm:self-auto">
              Phase 1A Active • Phase 1B/DSA Next
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmapPhases.map((phase) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.phaseNumber}
                  id={`roadmap-${phase.phaseNumber.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border ${phase.accent}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
                            {phase.phaseNumber}
                          </span>
                          <h3 className="text-base font-bold text-slate-900">
                            {phase.title}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${phase.statusColor}`}
                      >
                        {phase.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {phase.description}
                    </p>

                    <div className="space-y-2 border-t border-slate-100 pt-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Planned Capabilities:
                      </p>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {phase.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Future Data Model Preview: Internship Record */}
        <section
          id="data-model-preview-section"
          aria-labelledby="data-model-heading"
          className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs mb-8"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Official Blueprint Data Model
              </span>
            </div>
            <h3 id="data-model-heading" className="text-lg font-bold text-slate-900 mt-0.5">
              Internship Record Structure
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              The application architecture is structured around this exact data model. The Linked List, BST, and Sorting algorithms will operate directly on these entities in later phases.
            </p>
          </div>

          {/* Table displaying the Blueprint Fields */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Field</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">DSA Usage in Project</th>
                  <th className="py-2.5 px-3">Sample Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                <tr>
                  <td className="py-2 px-3 font-mono font-medium text-slate-900">id</td>
                  <td className="py-2 px-3 font-mono text-indigo-600">string</td>
                  <td className="py-2 px-3">Node key for Linked List traversal & BST index</td>
                  <td className="py-2 px-3 text-slate-700">"INT-101"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-medium text-slate-900">companyName</td>
                  <td className="py-2 px-3 font-mono text-indigo-600">string</td>
                  <td className="py-2 px-3">Graph source node & Quick Sort alphabetical key</td>
                  <td className="py-2 px-3 text-slate-700">"Google"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-medium text-slate-900">jobRole</td>
                  <td className="py-2 px-3 font-mono text-indigo-600">string</td>
                  <td className="py-2 px-3">Linear & Binary Search target field</td>
                  <td className="py-2 px-3 text-slate-700">"Software Engineer Intern"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-medium text-slate-900">location</td>
                  <td className="py-2 px-3 font-mono text-indigo-600">string</td>
                  <td className="py-2 px-3">Location filter criteria</td>
                  <td className="py-2 px-3 text-slate-700">"Mountain View, CA"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-medium text-slate-900">applicationDeadline</td>
                  <td className="py-2 px-3 font-mono text-indigo-600">string (YYYY-MM-DD)</td>
                  <td className="py-2 px-3 font-medium text-indigo-700">Merge Sort comparator & Urgency countdown</td>
                  <td className="py-2 px-3 text-slate-700">"2026-10-15"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-medium text-slate-900">applicationStatus</td>
                  <td className="py-2 px-3 font-mono text-indigo-600">enum Status</td>
                  <td className="py-2 px-3">Queue state transition (Applied → Review → Interview)</td>
                  <td className="py-2 px-3 text-slate-700">"Applied"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-medium text-slate-900">priority</td>
                  <td className="py-2 px-3 font-mono text-indigo-600">'High' | 'Medium' | 'Low'</td>
                  <td className="py-2 px-3">Priority ordering & Greedy interval selection</td>
                  <td className="py-2 px-3 text-slate-700">"High"</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-medium text-slate-900">applicationDate</td>
                  <td className="py-2 px-3 font-mono text-indigo-600">string (YYYY-MM-DD)</td>
                  <td className="py-2 px-3">Chronological Linked List insertion tracking</td>
                  <td className="py-2 px-3 text-slate-700">"2026-09-01"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Academic Architecture Viva Notes */}
        <div className="bg-slate-100/70 rounded-xl p-5 border border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm mb-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Academic Architecture & Viva Note</span>
          </div>
          <p className="leading-relaxed">
            In compliance with the official project rules:
            <strong> Authentication is cleanly decoupled from Data Structures.</strong> Login and Signup do not force artificial data structures. Instead, the folder structure (<code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-800">src/data-structures/LinkedList</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-800">src/data-structures/Stack</code>, and <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-800">src/data-structures/Queue</code>) and data models (<code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-800">InternshipRecord</code>) are primed so that Phase 1 linear structures can be implemented immediately in the next step.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>Smart Internship Deadline Tracker • College DSA Practical Project • Phase 1 Prototype</p>
      </footer>
    </div>
  );
};
