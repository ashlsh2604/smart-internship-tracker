import React, { useState } from 'react';
import {
  Layers,
  RotateCcw,
  ListOrdered,
  Plus,
  Trash2,
  Code2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { InternshipRecord, ApplicationStatus, ApplicationPriority, ActionRecord } from '../../types/internship';
import { buildDoublyLinkedListNodes, validateExpressionParentheses } from '../../services/cBackendService';
import { cleanId } from '../../utils/internshipFilter';
import { Button } from '../Button';
import { InternshipApplicationForm } from '../InternshipApplicationForm';

interface Phase1LinearViewProps {
  records: InternshipRecord[];
  allRecordsCount?: number;
  isFiltered?: boolean;
  onResetFilters?: () => void;
  onAddRecord: (record: InternshipRecord, atHead: boolean) => void;
  onDeleteRecord: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  undoStack: ActionRecord[];
  onUndo: () => void;
  reviewQueue: InternshipRecord[];
  onEnqueue: (record: InternshipRecord) => void;
  onDequeue: () => void;
}

export const Phase1LinearView: React.FC<Phase1LinearViewProps> = ({
  records,
  allRecordsCount,
  isFiltered = false,
  onResetFilters,
  onAddRecord,
  onDeleteRecord,
  onUpdateStatus,
  undoStack,
  onUndo,
  reviewQueue,
  onEnqueue,
  onDequeue,
}) => {
  const [subTab, setSubTab] = useState<'linked_list' | 'stack' | 'queue' | 'expression'>('linked_list');
  const [showAddModal, setShowAddModal] = useState(false);

  // Expression tester state
  const [testExpression, setTestExpression] = useState("((company == 'Google') && (priority == 'High'))");
  const expressionResult = validateExpressionParentheses(testExpression);

  const nodes = buildDoublyLinkedListNodes(records);

  return (
    <div className="space-y-6">
      {/* Sub navigation segmented bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab('linked_list')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'linked_list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Doubly Linked List ({records.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('stack')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'stack'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stack Undo/Redo ({undoStack.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('queue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'queue'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Review Queue ({reviewQueue.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('expression')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'expression'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expression Stack
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'linked_list' && (
            <Button
              type="button"
              size="sm"
              onClick={() => setShowAddModal(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs whitespace-nowrap shrink-0"
            >
              Insert Node
            </Button>
          )}
          {subTab === 'stack' && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={undoStack.length === 0}
              onClick={onUndo}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs whitespace-nowrap shrink-0"
            >
              Undo Last Action (Pop)
            </Button>
          )}
          {subTab === 'queue' && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={reviewQueue.length === 0}
              onClick={onDequeue}
              icon={<ListOrdered className="w-3.5 h-3.5" />}
              className="text-xs whitespace-nowrap shrink-0"
            >
              Dequeue Front Application
            </Button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: DOUBLY LINKED LIST */}
      {subTab === 'linked_list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">Time Complexity: Insert O(1) | Delete O(n)</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Head: <strong className="font-mono text-slate-700">{nodes[0]?.memoryAddress || 'NULL'}</strong></span>
              <span>Tail: <strong className="font-mono text-slate-700">{nodes[nodes.length - 1]?.memoryAddress || 'NULL'}</strong></span>
            </div>
          </div>

          {/* Node Pointer Visualizer Ribbon */}
          <div className="overflow-x-auto pb-4 pt-2">
            <div className="flex items-stretch gap-3 min-w-max">
              <div className="flex flex-col items-center justify-center px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-500">
                <span>HEAD</span>
                <span className="text-slate-400">↓</span>
                <span className="font-bold text-slate-800">{nodes[0]?.memoryAddress || 'NULL'}</span>
              </div>

              {nodes.length === 0 ? (
                <div className="flex items-center justify-center px-4 py-3 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-xs text-slate-500">
                  <span>No nodes match current filter criteria</span>
                </div>
              ) : (
                nodes.map((node, idx) => (
                <div key={node.data.id} className="flex items-center gap-2">
                  <div className="w-64 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-100 pb-1.5 mb-2">
                      <span>ADDR: {node.memoryAddress}</span>
                      <span className="text-indigo-600 font-semibold">{cleanId(node.data.id)}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm truncate">
                        {node.data.companyName}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {node.data.jobRole}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                        <span>{node.data.location}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{node.data.applicationDeadline}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[10px] font-mono text-slate-400">
                        <div>PREV: {node.prevAddress ? node.prevAddress.slice(0, 8) + '…' : 'NULL'}</div>
                        <div>NEXT: {node.nextAddress ? node.nextAddress.slice(0, 8) + '…' : 'NULL'}</div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEnqueue(node.data)}
                          title="Enqueue to Review Pipeline"
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(node.data.id)}
                          title="Delete Node (Pointer Bypass)"
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {idx < nodes.length - 1 && (
                    <div className="flex flex-col items-center justify-center text-slate-400 px-1 font-mono text-[10px]">
                      <span>⇄</span>
                    </div>
                  )}
                </div>
              )))}

              <div className="flex flex-col items-center justify-center px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-500">
                <span>TAIL</span>
                <span className="text-slate-400">↓</span>
                <span className="font-bold text-slate-800">NULL</span>
              </div>
            </div>
          </div>

          {/* Tabular Record List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Internship Linked List Records
                </h3>
                {isFiltered && (
                  <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
                    Filtered
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>
                  {records.length}{' '}
                  {isFiltered && allRecordsCount !== undefined
                    ? `of ${allRecordsCount} nodes in linked chain`
                    : 'nodes loaded in doubly linked chain'}
                </span>
                {isFiltered && onResetFilters && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-blue-600 hover:text-blue-800 underline text-xs cursor-pointer ml-1"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Node ID</th>
                    <th className="py-2.5 px-4">Company & Role</th>
                    <th className="py-2.5 px-4">Deadline</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Priority</th>
                    <th className="py-2.5 px-4 text-right">Stipend</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <p className="font-semibold text-slate-700 text-sm">
                            No internship applications match this filter
                          </p>
                          <p className="text-xs text-slate-500">
                            Adjust the status filter or clear the search query to view applications.
                          </p>
                          {onResetFilters && (
                            <button
                              type="button"
                              onClick={onResetFilters}
                              className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer transition-colors"
                            >
                              Reset Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    records.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900">
                          {cleanId(rec.id)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{rec.companyName}</div>
                          <div className="text-[11px] text-slate-400">{rec.jobRole} · {rec.location}</div>
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                          {rec.applicationDeadline}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={rec.applicationStatus}
                            onChange={(e) => onUpdateStatus(rec.id, e.target.value as ApplicationStatus)}
                            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="Bookmarked">Bookmarked</option>
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-slate-700">
                            {rec.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-slate-900">
                          {rec.stipend || `$${rec.stipendAmount?.toLocaleString()}/mo`}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onEnqueue(rec)}
                              title="Enqueue for Pipeline Review"
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors text-[11px]"
                            >
                              Enqueue
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteRecord(rec.id)}
                              title="Delete Record"
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STACK UNDO/REDO */}
      {subTab === 'stack' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Undo / Redo Action Stack
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Implemented via Singly Linked List with operations occurring at the <code className="font-mono text-indigo-600">head (top)</code> pointer for guaranteed $O(1)$ constant time.
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={undoStack.length === 0}
                onClick={onUndo}
                icon={<RotateCcw className="w-3.5 h-3.5 text-indigo-600" />}
                className="whitespace-nowrap shrink-0"
              >
                Undo Top Operation ({undoStack.length})
              </Button>
            </div>

            {undoStack.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg text-slate-500">
                <RotateCcw className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">Stack is currently empty.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Perform actions (insert a node, delete an application, or update status) to push frames onto the stack.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                  <span>TOP OF STACK [O(1) PEEK / POP]</span>
                  <span>CAPACITY: 50 FRAMES</span>
                </div>

                {undoStack.map((act, idx) => (
                  <div
                    key={act.id}
                    className={`p-3.5 rounded-lg border transition-all flex items-center justify-between ${
                      idx === 0
                        ? 'bg-indigo-50/50 border-indigo-200 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                          idx === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {undoStack.length - idx}
                      </div>

                      <div>
                        <div className="font-medium text-xs flex items-center gap-2">
                          <span className="font-bold text-slate-900">{act.type}</span>
                          <span aria-hidden="true">·</span>
                          <span>{act.description}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Company: <strong className="text-slate-600">{act.record.companyName}</strong> ({cleanId(act.record.id)})
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-[11px] text-slate-400 block">
                        {act.timestamp}
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] font-semibold text-indigo-700">
                          Next Pop Target
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: QUEUE PIPELINE */}
      {subTab === 'queue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  FIFO Application Review Queue
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Linked Queue maintaining both <code className="font-mono text-indigo-600">front</code> and <code className="font-mono text-indigo-600">rear</code> pointers for $O(1)$ Enqueue and Dequeue operations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={reviewQueue.length === 0}
                  onClick={onDequeue}
                  icon={<ListOrdered className="w-3.5 h-3.5" />}
                  className="whitespace-nowrap shrink-0 text-xs"
                >
                  Process Front ({reviewQueue.length > 0 ? reviewQueue[0].companyName : 'Empty'})
                </Button>
              </div>
            </div>

            {reviewQueue.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg text-slate-500">
                <ListOrdered className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">Review Queue is empty.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Click "Enqueue" on any application in the Doubly Linked List tab to queue it here for chronological review.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>FRONT POINTER [O(1) DEQUEUE]</span>
                  <span>REAR POINTER [O(1) ENQUEUE]</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {reviewQueue.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className={`p-4 rounded-xl border relative ${
                        idx === 0
                          ? 'border-indigo-300 bg-indigo-50/40'
                          : idx === reviewQueue.length - 1
                          ? 'border-slate-300 bg-slate-50/60'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                        <span className="font-bold text-slate-400">POS #{idx + 1}</span>
                        {idx === 0 && (
                          <span className="text-indigo-700 font-semibold bg-indigo-100/70 px-1.5 py-0.5 rounded">
                            FRONT
                          </span>
                        )}
                        {idx === reviewQueue.length - 1 && idx !== 0 && (
                          <span className="text-slate-700 font-semibold bg-slate-200 px-1.5 py-0.5 rounded">
                            REAR
                          </span>
                        )}
                      </div>

                      <h4 className="font-semibold text-slate-900 text-sm">{item.companyName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{item.jobRole}</p>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{item.applicationStatus}</span>
                        <span className="font-mono tabular-nums">{item.applicationDeadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EXPRESSION STACK */}
      {subTab === 'expression' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Expression Stack & Bracket Matcher
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Demonstrates stack-based expression parsing in C (<code className="font-mono text-indigo-600">char_stack_push</code> and <code className="font-mono text-indigo-600">char_stack_pop</code>). Validates nested parentheses, square brackets, and curly braces in complex query filters.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Filter Expression Query:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testExpression}
                    onChange={(e) => setTestExpression(e.target.value)}
                    placeholder="Enter query expression with () [] {}"
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setTestExpression("((company == 'Google' || company == 'Stripe') && (stipend >= 8000))")}
                    className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Sample Valid
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestExpression("((priority == 'High') && (status != 'Rejected'")}
                    className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Sample Invalid
                  </button>
                </div>
              </div>

              {/* Result banner */}
              <div
                className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                  expressionResult.isValid
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/60 border-amber-200 text-amber-900'
                }`}
              >
                {expressionResult.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-semibold">
                    {expressionResult.isValid ? 'Valid Expression Syntax' : 'Syntax Error Detected'}
                  </h4>
                  <p className="mt-0.5 leading-relaxed">{expressionResult.message}</p>
                  <div className="mt-2 text-[11px] font-mono opacity-80">
                    Matched Bracket Pairs: {expressionResult.matchedPairsCount} · Time Complexity: O(N) · Space Complexity: O(N)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal using reusable InternshipApplicationForm */}
      {showAddModal && (
        <InternshipApplicationForm
          isModal={true}
          onSubmit={(newRec, atHead) => {
            onAddRecord(newRec, atHead);
            setShowAddModal(false);
          }}
          onCancel={() => setShowAddModal(false)}
          title="Insert Node into Doubly Linked List"
          description="Enter company name, role, status, and deadline date. The record will be inserted into the doubly linked chain."
        />
      )}
    </div>
  );
};
