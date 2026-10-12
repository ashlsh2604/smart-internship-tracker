import React, { useState } from 'react';
import {
  ArrowUpDown,
  Search,
  Sparkles,
  Zap,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { InternshipRecord, SortAlgorithm, SortCriteria } from '../../types/internship';
import { benchmarkSearch, executeSort } from '../../services/cBackendService';
import { Button } from '../Button';

interface Phase3SearchSortViewProps {
  records: InternshipRecord[];
}

export const Phase3SearchSortView: React.FC<Phase3SearchSortViewProps> = ({ records }) => {
  const [subTab, setSubTab] = useState<'search' | 'sort'>('search');

  // Search state
  const [searchQuery, setSearchQuery] = useState('Microsoft');
  const searchBenchmarkResult = benchmarkSearch(records, searchQuery);

  // Sorting state
  const [sortAlgo, setSortAlgo] = useState<SortAlgorithm>('merge');
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('deadline');
  const sortMetricsResult = executeSort(records, sortAlgo, sortCriteria);

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab('search')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'search'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Searching Benchmark (Linear vs Binary)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('sort')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'sort'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sorting Studio (Merge, Quick, Insertion)
          </button>
        </div>

        <div className="text-xs text-slate-500">
          <span>Active Dataset: <strong className="font-mono text-slate-800">{records.length} records</strong></span>
        </div>
      </div>

      {/* SUB-TAB 1: SEARCHING BENCHMARK */}
      {subTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Search Benchmark: Linear Scan vs Binary Search
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Empirical verification of search complexities on student internship records. Compares linear sequential scanning $O(N)$ against logarithmic interval halving $O(\log N)$.
            </p>

            {/* Search Input Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter company, role, or ID to benchmark search..."
                  className="w-full bg-white border border-slate-200 rounded-lg pl-3.5 pr-8 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSearchQuery('Microsoft')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap"
                >
                  "Microsoft"
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('Stripe')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap"
                >
                  "Stripe"
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('Apple')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap"
                >
                  "Apple"
                </button>
              </div>
            </div>

            {/* Side-by-Side Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Linear Search Card */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Linear Search</h4>
                    <span className="text-[11px] text-slate-500 font-mono">Sequential scan · O(N)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                      {searchBenchmarkResult.linearResult.comparisons}
                    </span>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Comparisons</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-200/60 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Execution Time:</span>
                    <span className="font-mono tabular-nums font-medium text-slate-900">
                      ~{searchBenchmarkResult.linearResult.timeMicroseconds} µs
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Target Status:</span>
                    <span className="font-medium text-slate-900">
                      {searchBenchmarkResult.linearResult.foundIndex >= 0
                        ? `Found at index ${searchBenchmarkResult.linearResult.foundIndex}`
                        : 'Not Found'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Trace Log:
                  </span>
                  <p className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                    {searchBenchmarkResult.linearResult.stepsTrace.join(' ')}
                  </p>
                </div>
              </div>

              {/* Binary Search Card */}
              <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-indigo-900 text-sm">Binary Search</h4>
                    <span className="text-[11px] text-indigo-600 font-mono">Interval halving · O(log N)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono tabular-nums text-indigo-700">
                      {searchBenchmarkResult.binaryResult.comparisons}
                    </span>
                    <span className="text-[10px] text-indigo-400 block uppercase font-mono">Comparisons</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-indigo-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Execution Time:</span>
                    <span className="font-mono tabular-nums font-medium text-indigo-900">
                      ~{searchBenchmarkResult.binaryResult.timeMicroseconds} µs
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Target Status:</span>
                    <span className="font-medium text-indigo-900">
                      {searchBenchmarkResult.binaryResult.foundIndex >= 0
                        ? `Found at sorted index ${searchBenchmarkResult.binaryResult.foundIndex}`
                        : 'Not Found'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-100">
                  <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-wider block mb-1">
                    Interval Shrink Trace:
                  </span>
                  <p className="text-xs font-mono text-indigo-900 bg-white p-2.5 rounded border border-indigo-200">
                    {searchBenchmarkResult.binaryResult.stepsTrace.join(' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Efficiency summary badge */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-slate-700">
                  Binary search reduced comparisons by{' '}
                  <strong className="text-slate-900">
                    {searchBenchmarkResult.efficiencyGainPercent}%
                  </strong>{' '}
                  for query '{searchQuery}'.
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                Prerequisite: Sorted index on key
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SORTING STUDIO */}
      {subTab === 'sort' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Multi-Attribute Sorting Studio
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Operates on internship records with custom C comparators, tracking comparisons and swap instrumentation.
                </p>
              </div>

              {/* Algorithm & Criteria Selectors */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setSortAlgo('merge')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      sortAlgo === 'merge'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Merge Sort
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortAlgo('quick')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      sortAlgo === 'quick'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Quick Sort
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortAlgo('insertion')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      sortAlgo === 'insertion'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Insertion Sort
                  </button>
                </div>

                <select
                  value={sortCriteria}
                  onChange={(e) => setSortCriteria(e.target.value as SortCriteria)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                >
                  <option value="deadline">Sort by Deadline (Earliest)</option>
                  <option value="company">Sort by Company (A → Z)</option>
                  <option value="priority">Sort by Priority (High → Low)</option>
                  <option value="stipend">Sort by Stipend (Highest)</option>
                </select>
              </div>
            </div>

            {/* Performance Instrumentation Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Algorithm
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {sortMetricsResult.algorithmName}
                </span>
                <span className="text-[11px] text-indigo-600 font-mono mt-0.5 block">
                  {sortMetricsResult.timeComplexity}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Comparisons
                </span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                  {sortMetricsResult.comparisons}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Record checks
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Swaps / Placements
                </span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
                  {sortMetricsResult.swaps}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Element moves
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Stability
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {sortMetricsResult.isStable ? 'Stable Sort' : 'Unstable Sort'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  Space: {sortMetricsResult.spaceComplexity}
                </span>
              </div>
            </div>

            {/* Sorted Table Output */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-4">Rank</th>
                    <th className="py-2.5 px-4">Company Name</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">Deadline</th>
                    <th className="py-2.5 px-4">Priority</th>
                    <th className="py-2.5 px-4 text-right">Stipend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {sortMetricsResult.sortedRecords.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        #{idx + 1}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {item.companyName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.jobRole}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-800">
                        {item.applicationDeadline}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {item.priority}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-slate-900">
                        {item.stipend || `$${item.stipendAmount?.toLocaleString()}/mo`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
