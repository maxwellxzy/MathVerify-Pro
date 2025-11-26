import React, { useState, useEffect } from 'react';
import { Check, Edit2, RotateCcw, X, Save, AlertCircle } from 'lucide-react';
import { ProblemState, VerificationStatus } from '../types';
import MathRender from './MathRender';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProblemCardProps {
  problem: ProblemState;
  onUpdate: (id: string, questionNumber: number, updates: Partial<ProblemState>) => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit state
  const [editKnowledge, setEditKnowledge] = useState('');
  const [editMethods, setEditMethods] = useState('');

  // Initialize local edit state when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditKnowledge(problem.knowledge_points.join(', '));
      setEditMethods(problem.methods.join(', '));
    }
  }, [isEditing, problem]);

  const handleVerify = () => {
    onUpdate(problem.id, problem.question_number, {
      status: VerificationStatus.VERIFIED,
    });
  };

  const handleSaveEdit = () => {
    // Split by English comma (,) or Chinese comma (，) and trim whitespace
    const newKnowledge = editKnowledge.split(/,|，/).map(s => s.trim()).filter(Boolean);
    const newMethods = editMethods.split(/,|，/).map(s => s.trim()).filter(Boolean);

    onUpdate(problem.id, problem.question_number, {
      status: VerificationStatus.MODIFIED,
      knowledge_points: newKnowledge,
      methods: newMethods,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const isVerified = problem.status === VerificationStatus.VERIFIED;
  const isModified = problem.status === VerificationStatus.MODIFIED;

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border-2 transition-all duration-300 overflow-hidden scroll-mt-20",
      isVerified ? "border-green-500/50 shadow-green-100" : 
      isModified ? "border-amber-400/50 shadow-amber-100" : "border-slate-200"
    )}>
      {/* Header Bar */}
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">
            #{problem.question_number}
          </span>
          <span className="text-xs text-slate-400 font-mono">ID: {problem.id}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isVerified && (
             <span className="flex items-center gap-1 text-green-600 text-sm font-semibold px-3 py-1 bg-green-50 rounded-full">
               <Check className="w-4 h-4" /> 已正确
             </span>
          )}
          {isModified && (
             <span className="flex items-center gap-1 text-amber-600 text-sm font-semibold px-3 py-1 bg-amber-50 rounded-full">
               <Edit2 className="w-4 h-4" /> 已修改
             </span>
          )}
          {problem.status === VerificationStatus.PENDING && (
            <span className="flex items-center gap-1 text-slate-400 text-sm font-medium px-3 py-1 bg-slate-100 rounded-full">
              <AlertCircle className="w-4 h-4" /> 待验证
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Question Content */}
        <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-100">
          {problem.img_url && (
            <div className="mb-6 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <img src={problem.img_url} alt="题目图片" className="w-full h-auto max-h-64 object-contain" />
            </div>
          )}
          <div className="text-lg">
            <MathRender content={problem.markdown} />
          </div>
        </div>

        {/* Right: Verification Controls */}
        <div className="lg:col-span-5 p-6 bg-slate-50/30 flex flex-col h-full">
          <div className="flex-grow space-y-6">
            
            {/* Knowledge Points Section */}
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">知识点</h4>
              {isEditing ? (
                <textarea
                  value={editKnowledge}
                  onChange={(e) => setEditKnowledge(e.target.value)}
                  className="w-full p-3 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-all"
                  rows={3}
                  placeholder="请输入知识点，支持中文或英文逗号分隔..."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {problem.knowledge_points.length > 0 ? (
                    problem.knowledge_points.map((kp, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-md border border-indigo-100 font-medium">
                        {kp}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic text-sm">暂无知识点</span>
                  )}
                </div>
              )}
            </div>

            {/* Methods Section */}
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">方法</h4>
              {isEditing ? (
                <textarea
                  value={editMethods}
                  onChange={(e) => setEditMethods(e.target.value)}
                  className="w-full p-3 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition-all"
                  rows={3}
                  placeholder="请输入方法，支持中文或英文逗号分隔..."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {problem.methods.length > 0 ? (
                    problem.methods.map((m, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm rounded-md border border-teal-100 font-medium">
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic text-sm">暂无方法</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" /> 保存修改
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  取消
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleVerify}
                  disabled={isVerified}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm",
                    isVerified 
                      ? "bg-green-100 text-green-700 cursor-default" 
                      : "bg-green-600 hover:bg-green-700 text-white hover:shadow-green-200 hover:shadow-md"
                  )}
                >
                  {isVerified ? (
                    <>
                      <Check className="w-5 h-5" /> 已正确
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" /> 正确
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm border",
                    isModified
                      ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                  )}
                >
                  <Edit2 className="w-4 h-4" /> {isModified ? "再次修改" : "修改"}
                </button>
              </div>
            )}
            
            {(isVerified || isModified) && !isEditing && (
                <button 
                  onClick={() => onUpdate(problem.id, problem.question_number, { status: VerificationStatus.PENDING })}
                  className="w-full mt-3 text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 py-1"
                >
                  <RotateCcw className="w-3 h-3" /> 重置状态
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;