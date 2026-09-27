import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAY_1_QUIZ } from '../../data/quizData';

export const DailyQuizzesView: React.FC = () => {
  const { quizState, submitQuiz, resetQuiz, setActiveTab } = useApp();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    quizState.answers || {}
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showOnlyReview, setShowOnlyReview] = useState<boolean>(false);

  const categories = Array.from(new Set(DAY_1_QUIZ.map(q => q.category)));

  const filteredQuestions = DAY_1_QUIZ.filter(q => {
    if (filterCategory !== 'all' && q.category !== filterCategory) return false;
    return true;
  });

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuiz(selectedAnswers);
    setShowOnlyReview(true);
  };

  return (
    <div className="flex flex-col w-full animate-fadeIn pb-16 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-bold uppercase">
              DAILY ASSESSMENT SUITE
            </span>
            <span className="font-mono text-xs text-[#4edea3]">10 MCQS • 80% PASS THRESHOLD</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#e0fdff] tracking-tight mt-1">
            Day 01 Quiz: Verilog Operators &amp; Net Semantics
          </h1>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded bg-[#181b25] border border-white/[0.06] flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#849495] uppercase">SCORE:</span>
            <span className="font-mono text-sm text-[#4edea3] font-bold">
              {quizState.score} / {quizState.total} ({Math.round((quizState.score / quizState.total) * 100)}%)
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-[10px] font-bold">
              {quizState.passed ? 'PASSED' : 'RETRY NEEDED'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Chips & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181b25] p-3 rounded border border-white/[0.06]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded font-mono text-xs transition-colors ${
              filterCategory === 'all'
                ? 'bg-[#00f2fe] text-[#00373a] font-bold'
                : 'bg-[#1c1f29] text-[#b9cacb] hover:text-[#dfe2ef]'
            }`}
          >
            All Questions (10)
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                filterCategory === cat
                  ? 'bg-[#00f2fe] text-[#00373a] font-bold'
                  : 'bg-[#1c1f29] text-[#b9cacb] hover:text-[#dfe2ef]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetQuiz();
              setSelectedAnswers({});
              setShowOnlyReview(false);
            }}
            className="px-3 py-1 rounded bg-[#262a34] hover:bg-[#31353f] text-[#dfe2ef] font-mono text-xs transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-[#181b25] rounded p-5 border border-white/[0.06] space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-xs text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-bold shrink-0">
                    Q{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-[#dfe2ef]">{q.question}</h3>
                    <span className="font-mono text-[10px] text-[#849495] mt-0.5 block">
                      Category: {q.category} &bull; Difficulty: {q.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-7">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let style = 'bg-[#1c1f29] text-[#b9cacb] border border-white/[0.04] hover:bg-[#262a34]';

                  if (quizState.submitted || showOnlyReview) {
                    if (optIdx === q.correctIndex) {
                      style = 'bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/40 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/40';
                    }
                  } else if (isSelected) {
                    style = 'bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/40 font-semibold';
                  }

                  return (
                    <button
                      type="button"
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded text-left font-sans text-xs transition-colors cursor-pointer ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Explanation always visible after submission or review */}
              {(quizState.submitted || showOnlyReview) && (
                <div className="p-3 bg-[#1c1f29] rounded text-xs text-[#b9cacb] border border-white/[0.04] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#4edea3] font-mono text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                    <span>TECHNICAL SIGN-OFF EXPLANATION</span>
                  </div>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveTab('todays-lesson')}
            className="px-4 py-2 rounded bg-[#1c1f29] hover:bg-[#262a34] text-[#dfe2ef] font-mono text-xs transition-colors"
          >
            &larr; Back to Today's Lesson
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded bg-[#00f2fe] text-[#00373a] font-semibold text-xs transition-all hover:opacity-95 shadow-[0_0_12px_rgba(0,242,254,0.3)]"
          >
            Submit All Answers &amp; Compute Score
          </button>
        </div>
      </form>
    </div>
  );
};
