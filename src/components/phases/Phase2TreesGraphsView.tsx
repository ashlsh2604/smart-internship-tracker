import React, { useState } from 'react';
import {
  GitBranch,
  Network,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  Play,
} from 'lucide-react';
import { InternshipRecord } from '../../types/internship';
import {
  buildBST,
  traverseBST,
  calculateBSTHeight,
  runGraphBFS,
  runGraphDFS,
  DEFAULT_GRAPH_NODES,
} from '../../services/cBackendService';
import { Button } from '../Button';

interface Phase2TreesGraphsViewProps {
  records: InternshipRecord[];
}

export const Phase2TreesGraphsView: React.FC<Phase2TreesGraphsViewProps> = ({ records }) => {
  const [subTab, setSubTab] = useState<'bst' | 'graph'>('bst');

  // BST state
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [bstSearchQuery, setBstSearchQuery] = useState('Google');
  const [bstSearchResult, setBstSearchResult] = useState<string | null>(null);

  // Graph state
  const [graphStartNode, setGraphStartNode] = useState('Google');
  const [graphAlgorithm, setGraphAlgorithm] = useState<'BFS' | 'DFS'>('BFS');

  const bstRoot = buildBST(records);
  const treeHeight = calculateBSTHeight(bstRoot);
  const traversalSteps = traverseBST(bstRoot, traversalType);

  const handleBSTSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bstSearchQuery.trim()) return;

    let curr = bstRoot;
    const query = bstSearchQuery.trim().toLowerCase();
    const trace: string[] = [];

    while (curr) {
      const currCompany = curr.data.companyName.toLowerCase();
      trace.push(`Inspecting node '${curr.data.companyName}' (Depth: ${curr.depth})`);

      if (currCompany === query) {
        trace.push(`Target '${curr.data.companyName}' locked! (Role: ${curr.data.jobRole}, Deadline: ${curr.data.applicationDeadline})`);
        setBstSearchResult(trace.join(' → '));
        return;
      } else if (query < currCompany) {
        trace.push(`'${query}' < '${currCompany}' → Traverse LEFT branch`);
        curr = curr.left;
      } else {
        trace.push(`'${query}' > '${currCompany}' → Traverse RIGHT branch`);
        curr = curr.right;
      }
    }
    trace.push(`Reached NULL pointer. Company '${bstSearchQuery}' not found in BST.`);
    setBstSearchResult(trace.join(' → '));
  };

  const graphResult =
    graphAlgorithm === 'BFS'
      ? runGraphBFS(graphStartNode, DEFAULT_GRAPH_NODES)
      : runGraphDFS(graphStartNode, DEFAULT_GRAPH_NODES);

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSubTab('bst')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'bst'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Binary Search Tree (BST)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('graph')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'graph'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill & Opportunity Graph (BFS & DFS)
          </button>
        </div>

        <div className="text-xs text-slate-500">
          {subTab === 'bst' ? (
            <span>BST Height: <strong className="font-mono text-slate-800">{treeHeight} levels</strong> · Nodes: <strong className="font-mono text-slate-800">{records.length}</strong></span>
          ) : (
            <span>Graph Vertices: <strong className="font-mono text-slate-800">{DEFAULT_GRAPH_NODES.length}</strong> · Model: Adjacency List</span>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: BINARY SEARCH TREE */}
      {subTab === 'bst' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Binary Search Tree Indexed by Company Name
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recursive tree in C (<code className="font-mono text-indigo-600">BSTNode* left</code> and <code className="font-mono text-indigo-600">BSTNode* right</code>) indexing applications alphabetically in $O(\log N)$ average time.
                </p>
              </div>

              {/* Traversal Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setTraversalType('inorder')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    traversalType === 'inorder'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Inorder (A → Z Sorted)
                </button>
                <button
                  type="button"
                  onClick={() => setTraversalType('preorder')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    traversalType === 'preorder'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Preorder (Serialization)
                </button>
                <button
                  type="button"
                  onClick={() => setTraversalType('postorder')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    traversalType === 'postorder'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Postorder (Bottom-Up)
                </button>
              </div>
            </div>

            {/* Traversal sequence tape */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  {traversalType.toUpperCase()} TRAVERSAL ORDER ({traversalSteps.length} NODES):
                </span>
                <span className="font-mono text-[11px] text-indigo-600">
                  {traversalType === 'inorder' && 'Left → Root → Right'}
                  {traversalType === 'preorder' && 'Root → Left → Right'}
                  {traversalType === 'postorder' && 'Left → Right → Root'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {traversalSteps.map((step, idx) => (
                  <div key={`${step.id}-${idx}`} className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs text-xs">
                      <span className="font-bold text-slate-900">{step.companyName}</span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-mono">({step.id})</span>
                    </div>
                    {idx < traversalSteps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* BST Lookup Bar */}
            <div className="pt-4 border-t border-slate-100">
              <form onSubmit={handleBSTSearch} className="flex gap-2 max-w-xl">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={bstSearchQuery}
                    onChange={(e) => setBstSearchQuery(e.target.value)}
                    placeholder="Search company in BST (e.g. Google, Stripe)..."
                    className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs whitespace-nowrap shrink-0"
                >
                  Binary Search in BST
                </Button>
              </form>

              {bstSearchResult && (
                <div className="mt-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                  <strong className="text-slate-900 font-sans block mb-1">Search Traversal Path:</strong>
                  {bstSearchResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GRAPH (BFS & DFS) */}
      {subTab === 'graph' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Adjacency List Graph: Company → Roles → Required Skills
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Models relational career dependencies in C. Demonstrates <strong className="text-slate-700">Queue-based Breadth-First Search (BFS)</strong> and <strong className="text-slate-700">Stack/Recursive Depth-First Search (DFS)</strong>.
                </p>
              </div>

              {/* Traversal selector */}
              <div className="flex items-center gap-2">
                <select
                  value={graphStartNode}
                  onChange={(e) => setGraphStartNode(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                >
                  <option value="Google">Start at: Google</option>
                  <option value="Microsoft">Start at: Microsoft</option>
                  <option value="Amazon">Start at: Amazon</option>
                  <option value="Stripe">Start at: Stripe</option>
                  <option value="SWE Intern">Start at: SWE Intern</option>
                </select>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGraphAlgorithm('BFS')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      graphAlgorithm === 'BFS'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    BFS (Shortest Path)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGraphAlgorithm('DFS')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      graphAlgorithm === 'DFS'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    DFS (Deep Dive)
                  </button>
                </div>
              </div>
            </div>

            {/* Traversal Result Tape */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 mb-6">
              <div className="flex items-center justify-between text-xs text-indigo-900 mb-2">
                <span className="font-bold">
                  {graphAlgorithm} Exploration Sequence (Starting from '{graphStartNode}'):
                </span>
                <span className="font-mono text-[11px] text-indigo-700">
                  Complexity: O(V + E) = O({DEFAULT_GRAPH_NODES.length} + 12)
                </span>
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-indigo-100">
                {graphResult.pathDescription}
              </p>
            </div>

            {/* Graph Adjacency List Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                C Adjacency List Node Map
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {DEFAULT_GRAPH_NODES.map((node) => (
                  <div
                    key={node.name}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-bold text-slate-900">{node.name}</span>
                      <span className="text-slate-400 font-mono text-[10px] uppercase">
                        {node.type}
                      </span>
                    </div>

                    {node.edges.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">Leaf vertex (No outgoing edges)</p>
                    ) : (
                      <div className="space-y-1">
                        {node.edges.map((edge, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100"
                          >
                            <span className="text-[11px] text-indigo-600 font-mono">
                              ↳ {edge.relation}
                            </span>
                            <span className="font-medium text-slate-900 text-[11px] truncate max-w-[120px]">
                              {edge.target}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
