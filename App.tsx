import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Send, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
import ProblemCard from './components/ProblemCard';
import { MathProblem, ProblemState, VerificationStatus, SubmitPayloadItem } from './types';
import { fetchProblems, submitBatch } from './services/mockApi';

const DEFAULT_API_KEY = '12345abc';

function App() {
  const [problems, setProblems] = useState<ProblemState[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const data = await fetchProblems(DEFAULT_API_KEY);
      // Map API data to local state with tracking fields
      const initializedData: ProblemState[] = data.map(p => ({
        ...p,
        status: VerificationStatus.PENDING,
        original_knowledge_points: [...p.knowledge_points],
        original_methods: [...p.methods]
      }));
      setProblems(initializedData);
    } catch (err: any) {
      setError(err.message || '获取题目失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateProblem = useCallback((id: string, questionNumber: number, updates: Partial<ProblemState>) => {
    setProblems(prev => prev.map(p => {
      if (p.id === id && p.question_number === questionNumber) {
        return { ...p, ...updates };
      }
      return p;
    }));
  }, []);

  const handleSubmit = async () => {
    const unverifiedCount = problems.filter(p => p.status === VerificationStatus.PENDING).length;
    
    if (unverifiedCount > 0) {
      if (!window.confirm(`您还有 ${unverifiedCount} 道题目未验证。确定要提交吗？`)) {
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: SubmitPayloadItem[] = problems.map(p => ({
        id: p.id,
        question_number: p.question_number,
        modified: p.status === VerificationStatus.MODIFIED,
        final_knowledge_points: p.knowledge_points,
        final_methods: p.methods
      }));

      await submitBatch(DEFAULT_API_KEY, payload);
      
      setSuccessMsg('所有题目验证已提交成功！');
      setProblems([]); // Clear interface
      
    } catch (err: any) {
      setError(err.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  // Derived state for progress
  const completedCount = problems.filter(p => p.status !== VerificationStatus.PENDING).length;
  const progressPercent = problems.length > 0 ? (completedCount / problems.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">MathVerify <span className="text-indigo-600">Pro</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">当前进度</span>
               <div className="flex items-center gap-2">
                 <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-indigo-500 transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                   />
                 </div>
                 <span className="text-xs font-bold text-indigo-700">{completedCount}/{problems.length}</span>
               </div>
            </div>
            <button 
              onClick={loadData} 
              disabled={loading || submitting}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              title="刷新数据"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* State: Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-red-500 font-bold">错误:</span>
              <span className="text-red-700">{error}</span>
            </div>
            <button onClick={loadData} className="text-red-600 font-semibold text-sm underline hover:text-red-800">重试</button>
          </div>
        )}

        {/* State: Success/Empty */}
        {!loading && problems.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {successMsg ? (
              <>
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">提交完成</h2>
                <p className="text-slate-500 max-w-md mb-8">{successMsg}</p>
              </>
            ) : (
               <>
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <BookOpen className="w-12 h-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">准备开始</h2>
                <p className="text-slate-500 max-w-md mb-8">点击下方按钮获取新的一批题目进行验证。</p>
               </>
            )}
            
            <button
              onClick={loadData}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> 获取新题目
            </button>
          </div>
        )}

        {/* State: Loading */}
        {loading && problems.length === 0 && (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 h-64 animate-pulse">
                <div className="h-12 bg-slate-100 border-b border-slate-200" />
                <div className="p-6 grid grid-cols-12 gap-6 h-full">
                  <div className="col-span-7 space-y-4">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-32 bg-slate-50 rounded mt-4" />
                  </div>
                  <div className="col-span-5 space-y-4">
                     <div className="h-4 bg-slate-100 rounded w-1/3" />
                     <div className="flex gap-2">
                       <div className="h-8 w-16 bg-slate-100 rounded" />
                       <div className="h-8 w-20 bg-slate-100 rounded" />
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List of Problems */}
        <div className="space-y-8">
          {problems.map((problem) => (
            <ProblemCard 
              key={`${problem.id}-${problem.question_number}`} 
              problem={problem} 
              onUpdate={handleUpdateProblem}
            />
          ))}
        </div>
      </main>

      {/* Floating Bottom Action Bar */}
      {problems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] px-4 py-4 z-20">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="text-sm text-slate-500 hidden sm:block">
              已处理 {completedCount} / {problems.length} 题
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`
                flex-1 sm:flex-none sm:min-w-[200px] flex items-center justify-center gap-2 
                px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all
                ${submitting 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0'
                }
              `}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 正在提交...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> 提交本次验证
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;