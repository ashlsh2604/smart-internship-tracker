import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Play,
  FileCode,
  Download,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Layers,
  BookOpen,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';
import {
  fetchCBackendStatus,
  fetchCFilesList,
  fetchCFileContent,
  runCEngineTests,
  CBackendStatus,
  CFileItem,
} from '../../services/cBackendService';
import { Button } from '../Button';

export const CBackendStudioView: React.FC = () => {
  const [status, setStatus] = useState<CBackendStatus | null>(null);
  const [files, setFiles] = useState<CFileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('include/internship.h');
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Test suite execution
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);

  // Active view tab inside C Studio
  const [activeTab, setActiveTab] = useState<'terminal' | 'code' | 'viva'>('code');

  useEffect(() => {
    fetchCBackendStatus().then(setStatus);
    fetchCFilesList().then((fileList) => {
      setFiles(fileList);
      if (fileList.length > 0) {
        setSelectedFile(fileList[0].path);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedFile) {
      setLoadingFile(true);
      fetchCFileContent(selectedFile).then((content) => {
        setFileContent(content);
        setLoadingFile(false);
      });
    }
  }, [selectedFile]);

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setActiveTab('terminal');
    const res = await runCEngineTests();
    setTerminalOutput(res.output);
    setIsRunningTests(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCodebase = () => {
    const textContent =
      `# SMART INTERNSHIP DEADLINE TRACKER - C BACKEND\n` +
      `# File: ${selectedFile}\n\n` +
      fileContent;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.split('/').pop() || 'c_code.c';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Clean Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            C Source Code ({files.length} Files)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'terminal'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terminal Output
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('viva')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'viva'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Viva Reference & Complexities
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleRunTests}
            loading={isRunningTests}
            icon={<Play className="w-3.5 h-3.5" />}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium whitespace-nowrap"
          >
            Run C Backend Tests
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleDownloadCodebase}
            icon={<Download className="w-3.5 h-3.5 text-slate-600" />}
            className="text-xs text-slate-700 whitespace-nowrap"
          >
            Export C File
          </Button>
        </div>
      </div>

      {/* TAB 1: C TERMINAL TEST RUNNER */}
      {activeTab === 'terminal' && (
        <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">
                bash - c_engine test (Native Linux Binary)
              </span>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleRunTests}
              loading={isRunningTests}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] h-7 px-2.5"
            >
              Execute Tests
            </Button>
          </div>

          <div className="p-4 sm:p-6 font-mono text-xs overflow-x-auto min-h-[360px] text-emerald-400/90 leading-relaxed">
            {terminalOutput ? (
              <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
            ) : (
              <div className="text-slate-500 flex flex-col items-center justify-center py-16">
                <Terminal className="w-8 h-8 mb-2 text-slate-600" />
                <p>Click "Execute Tests" to run the compiled C backend binary test suite.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Executes unit tests across Phase 1 (Linked List, Stack, Queue), Phase 2 (BST, Graph), Phase 3 (Searching, Sorting), and Phase 4 (Greedy, DP, Backtracking).
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: C SOURCE CODE EXPLORER */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* File sidebar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs md:col-span-1 max-h-[600px] overflow-y-auto space-y-1">
            <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              C Headers (.h)
            </div>
            {files
              .filter((f) => f.category === 'Header')
              .map((f) => (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => setSelectedFile(f.path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedFile === f.path
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-slate-400">.h</span>
                </button>
              ))}

            <div className="px-2 py-1.5 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100">
              C Sources (.c)
            </div>
            {files
              .filter((f) => f.category === 'Source')
              .map((f) => (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => setSelectedFile(f.path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedFile === f.path
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-slate-400">.c</span>
                </button>
              ))}

            <div className="px-2 py-1.5 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100">
              Build & Docs
            </div>
            {files
              .filter((f) => f.category === 'Build' || f.category === 'Documentation')
              .map((f) => (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => setSelectedFile(f.path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedFile === f.path
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-slate-400">{f.category}</span>
                </button>
              ))}
          </div>

          {/* Code Viewer */}
          <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 overflow-hidden shadow-xs md:col-span-3 flex flex-col max-h-[600px]">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="font-mono text-xs text-slate-300">
                backend-c/{selectedFile}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCodebase}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="p-4 font-mono text-xs overflow-y-auto flex-1 leading-relaxed text-slate-200">
              {loadingFile ? (
                <div className="text-slate-500 py-12 text-center">Loading C source...</div>
              ) : (
                <pre className="whitespace-pre-wrap">{fileContent}</pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIVA CHEAT SHEET */}
      {activeTab === 'viva' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Academic Viva Examination Reference Matrix
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Theoretical and practical justifications for every algorithmic design choice made in this project.
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Phase</th>
                    <th className="py-2.5 px-3">Data Structure / Algorithm</th>
                    <th className="py-2.5 px-3">Primary Operation</th>
                    <th className="py-2.5 px-3">Time Complexity</th>
                    <th className="py-2.5 px-3">Space Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 1</td>
                    <td className="py-2 px-3">Doubly Linked List</td>
                    <td className="py-2 px-3 font-mono">insert_tail / insert_head</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-medium">O(1)</td>
                    <td className="py-2 px-3 font-mono">O(1)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 1</td>
                    <td className="py-2 px-3">Doubly Linked List</td>
                    <td className="py-2 px-3 font-mono">delete_by_id</td>
                    <td className="py-2 px-3 font-mono text-slate-700 font-medium">O(N) search + O(1) bypass</td>
                    <td className="py-2 px-3 font-mono">O(1)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 1</td>
                    <td className="py-2 px-3">Linked Stack (Undo)</td>
                    <td className="py-2 px-3 font-mono">push / pop / peek</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-medium">O(1)</td>
                    <td className="py-2 px-3 font-mono">O(1)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 1</td>
                    <td className="py-2 px-3">Linked Queue (Pipeline)</td>
                    <td className="py-2 px-3 font-mono">enqueue / dequeue</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-medium">O(1)</td>
                    <td className="py-2 px-3 font-mono">O(1)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 2</td>
                    <td className="py-2 px-3">Binary Search Tree (BST)</td>
                    <td className="py-2 px-3 font-mono">insert / search</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-medium">O(log N) avg / O(N) worst</td>
                    <td className="py-2 px-3 font-mono">O(H) recursion</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 2</td>
                    <td className="py-2 px-3">BST Inorder Traversal</td>
                    <td className="py-2 px-3 font-mono">inorder_walk (sorted order)</td>
                    <td className="py-2 px-3 font-mono text-slate-700 font-medium">O(N)</td>
                    <td className="py-2 px-3 font-mono">O(H) recursion</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 2</td>
                    <td className="py-2 px-3">Adjacency List Graph</td>
                    <td className="py-2 px-3 font-mono">BFS / DFS Traversals</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-medium">O(V + E)</td>
                    <td className="py-2 px-3 font-mono">O(V)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 3</td>
                    <td className="py-2 px-3">Binary Search</td>
                    <td className="py-2 px-3 font-mono">search_binary (sorted)</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-medium">O(log N)</td>
                    <td className="py-2 px-3 font-mono">O(1)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 3</td>
                    <td className="py-2 px-3">Merge Sort</td>
                    <td className="py-2 px-3 font-mono">sort_merge (deadline)</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-medium">O(N log N) (guaranteed stable)</td>
                    <td className="py-2 px-3 font-mono">O(N) aux</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 3</td>
                    <td className="py-2 px-3">Quick Sort</td>
                    <td className="py-2 px-3 font-mono">sort_quick (company name)</td>
                    <td className="py-2 px-3 font-mono text-slate-700 font-medium">O(N log N) avg</td>
                    <td className="py-2 px-3 font-mono">O(log N) call stack</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 4</td>
                    <td className="py-2 px-3">Greedy Interval Scheduling</td>
                    <td className="py-2 px-3 font-mono">Earliest finish selection</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-medium">O(N log N)</td>
                    <td className="py-2 px-3 font-mono">O(N)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 4</td>
                    <td className="py-2 px-3">0/1 Knapsack (DP)</td>
                    <td className="py-2 px-3 font-mono">Max prep utility subproblems</td>
                    <td className="py-2 px-3 font-mono text-emerald-700 font-medium">O(N × W)</td>
                    <td className="py-2 px-3 font-mono">O(N × W) table</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Phase 4</td>
                    <td className="py-2 px-3">Backtracking Solver</td>
                    <td className="py-2 px-3 font-mono">Slot conflict resolution</td>
                    <td className="py-2 px-3 font-mono text-slate-700 font-medium">O(M^N) pruned branch/bound</td>
                    <td className="py-2 px-3 font-mono">O(N) call stack</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Key C Memory Management Rules Implemented:
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Memory Leaks:</strong> Every <code className="font-mono text-slate-800">malloc()</code> in <code className="font-mono text-slate-800">list_insert</code>, <code className="font-mono text-slate-800">stack_push</code>, and <code className="font-mono text-slate-800">queue_enqueue</code> is paired with a corresponding <code className="font-mono text-slate-800">free()</code> in the destroy and pop routines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dangling Pointer Prevention:</strong> Pointer reassignments bypass deleted nodes before calling <code className="font-mono text-slate-800">free(curr)</code> (<code className="font-mono text-slate-800">curr-&gt;prev-&gt;next = curr-&gt;next; curr-&gt;next-&gt;prev = curr-&gt;prev;</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Stable Sorting Guarantee:</strong> Merge Sort uses <code className="font-mono text-slate-800">&lt;=</code> comparison in the merge phase to strictly guarantee stability for identical application deadlines.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
