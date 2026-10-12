import React, { useState } from 'react';
import {
  Cpu,
  Calendar,
  Briefcase,
  GitPullRequest,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { InternshipRecord } from '../../types/internship';
import {
  solveGreedyIntervalScheduling,
  solve01Knapsack,
  solveBacktrackingSlots,
  DEFAULT_INTERVIEW_SLOTS,
} from '../../services/cBackendService';
import { Button } from '../Button';

interface Phase4ProblemSolvingViewProps {
  records: InternshipRecord[];
}

export const Phase4ProblemSolvingView: React.FC<Phase4ProblemSolvingViewProps> = ({ records }) => {
  const [subTab, setSubTab] = useState<'greedy' | 'knapsack' | 'backtracking'>('greedy');

  // Greedy state
  const greedyResult = solveGreedyIntervalScheduling(DEFAULT_INTERVIEW_SLOTS);

  // DP Knapsack state
  const [hoursBudget, setHoursBudget] = useState(35);
  const knapsackResult = solve01Knapsack(hoursBudget, records);

  // Backtracking state
  const [backtrackResult, setBacktrackResult] = useState(() => solveBacktrackingSlots());

  const handleRerunBacktracking = () => {
    setBacktrackResult(solveBacktrackingSlots());
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab('greedy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'greedy'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Greedy Interval Scheduling
          </button>
          <button
            type="button"
            onClick={() => setSubTab('knapsack')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'knapsack'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            0/1 Knapsack (Dynamic Programming)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('backtracking')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'backtracking'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Backtracking Interview Matcher
          </button>
        </div>

        <div className="text-xs text-slate-500">
          <span>Optimization Paradigms in C: Greedy · DP · Backtracking</span>
        </div>
      </div>

      {/* SUB-TAB 1: GREEDY INTERVAL SCHEDULING */}
      {subTab === 'greedy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Greedy Activity Selection: Max Non-Overlapping Interviews
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              When multiple companies schedule overlapping technical assessments on the same day, this Greedy algorithm selects the maximum possible number of compatible interview rounds by sorting by <strong className="text-slate-700">earliest finish time ($O(N \log N)$)</strong>.
            </p>

            {/* Selected stats strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 block">
                  Rounds Selected
                </span>
                <span className="text-xl font-bold font-mono tabular-nums text-emerald-950 mt-0.5 block">
                  {greedyResult.selectedSlots.length} of {greedyResult.allSlots.length}
                </span>
                <span className="text-[11px] text-emerald-700 mt-0.5 block">
                  Maximizes attended rounds
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Total Scheduled Time
                </span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                  {greedyResult.totalScheduledHours} Hours
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Zero overlap conflicts
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Greedy Choice Property
                </span>
                <span className="text-xs font-bold text-slate-900 mt-1 block">
                  Sort by Earliest End Time
                </span>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  Proof: Induction & Matroids
                </span>
              </div>
            </div>

            {/* Visual Gantt timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Interview Slots Schedule (09:00 - 18:00 Timeline)
              </h4>

              <div className="space-y-2">
                {greedyResult.allSlots.map((slot) => {
                  const isSelected = greedyResult.selectedSlots.some((s) => s.id === slot.id);
                  const startPercent = ((slot.startTime - 9) / 9) * 100;
                  const widthPercent = ((slot.endTime - slot.startTime) / 9) * 100;

                  return (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-emerald-300 bg-emerald-50/40 text-slate-900'
                          : 'border-slate-200 bg-slate-50/50 opacity-60 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{slot.company}</span>
                          <span className="text-slate-400">·</span>
                          <span>{slot.roundName}</span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span>
                            {String(slot.startTime).padStart(2, '0')}:00 - {String(slot.endTime).padStart(2, '0')}:00
                          </span>
                          {isSelected ? (
                            <span className="font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                              SELECTED
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">CONFLICT SKIPPED</span>
                          )}
                        </div>
                      </div>

                      {/* Timeline Bar */}
                      <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isSelected ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                          style={{
                            marginLeft: `${startPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 0/1 KNAPSACK DYNAMIC PROGRAMMING */}
      {subTab === 'knapsack' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              0/1 Knapsack Optimization: Maximum Utility within Weekly Prep Budget
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Solves the classic 0/1 Knapsack problem using a 2D Dynamic Programming table ($O(N \times W)$). Each internship requires dedicated preparation hours (weight) and offers prospective stipend / career utility (value).
            </p>

            {/* Prep budget slider */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <label htmlFor="budget-slider" className="font-semibold text-slate-800">
                  Weekly Preparation Hours Budget (Capacity $W$):
                </label>
                <span className="font-bold font-mono text-indigo-700 text-sm">
                  {hoursBudget} Hours / Week
                </span>
              </div>
              <input
                id="budget-slider"
                type="range"
                min={15}
                max={50}
                step={5}
                value={hoursBudget}
                onChange={(e) => setHoursBudget(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>15h (Light Prep)</span>
                <span>35h (Standard)</span>
                <span>50h (Intensive Bootcamp)</span>
              </div>
            </div>

            {/* DP Result Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 block">
                  Optimal Career Utility
                </span>
                <span className="text-xl font-bold font-mono tabular-nums text-indigo-950 mt-0.5 block">
                  {knapsackResult.maxValue} Points
                </span>
                <span className="text-[11px] text-indigo-700 mt-0.5 block">
                  Global maximum from DP table
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Hours Utilized
                </span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                  {knapsackResult.totalHoursUsed} / {hoursBudget} Hours
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Zero hours wasted
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Applications Targeted
                </span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                  {knapsackResult.selectedItems.length} Companies
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Backtracked from DP state
                </span>
              </div>
            </div>

            {/* Selected subset breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Optimal Target Applications:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {knapsackResult.selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-indigo-200 bg-white shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-900">{item.company}</span>
                      <span className="font-mono text-indigo-600 font-semibold">{item.id}</span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1 mt-2">
                      <div className="flex justify-between">
                        <span>Prep Required:</span>
                        <span className="font-mono tabular-nums font-medium text-slate-800">{item.prepHoursCost} hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Stipend:</span>
                        <span className="font-mono tabular-nums font-medium text-emerald-700">${item.stipend.toLocaleString()}/mo</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BACKTRACKING INTERVIEW MATCHER */}
      {subTab === 'backtracking' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Constraint Satisfaction: Backtracking Interview Slot Allocator
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Allocates candidate students to company interview rooms without time slot collisions, pruning unfeasible subtrees via recursive backtracking.
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleRerunBacktracking}
                className="whitespace-nowrap shrink-0 text-xs"
              >
                Re-run Backtracking Solver
              </Button>
            </div>

            {/* Backtracking execution summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">
                  {backtrackResult.resolutionLog}
                </span>
                <span className="text-slate-500 mt-0.5 block">
                  Constraint graph: 4 students · 4 company slots · 0 collisions
                </span>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Explorations</span>
                  <span className="font-bold text-slate-900">{backtrackResult.recursiveCalls} calls</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Backtracks</span>
                  <span className="font-bold text-amber-700">{backtrackResult.backtracks} pruned</span>
                </div>
              </div>
            </div>

            {/* Assignments grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {backtrackResult.assignments.map((assign, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center">
                      S{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{assign.studentName}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Company: <strong className="text-slate-700">{assign.company}</strong></p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-medium text-indigo-600 block">
                      {assign.slotLabel}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      Conflict-Free
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
