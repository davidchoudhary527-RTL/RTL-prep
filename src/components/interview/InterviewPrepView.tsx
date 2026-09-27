import React, { useState } from 'react';
import { FLASHCARDS, WHITEBOARD_PUZZLES } from '../../data/interviewData';

export const InterviewPrepView: React.FC = () => {
  const [subTab, setSubTab] = useState<'flashcards' | 'puzzles'>('flashcards');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const companies = ['Qualcomm', 'NVIDIA', 'Google', 'Apple', 'Analog Devices', 'Broadcom'];

  const filteredFlashcards = FLASHCARDS.filter(card => {
    if (selectedCompany === 'all') return true;
    return card.company.toLowerCase().includes(selectedCompany.toLowerCase());
  });

  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleHint = (id: string) => {
    setRevealedHints(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-col w-full animate-fadeIn pb-16 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-bold uppercase">
              SILICON INTERVIEW PORTAL
            </span>
            <span className="font-mono text-xs text-[#4edea3]">TIER-1 ARCHITECTURAL SCREENING</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#e0fdff] tracking-tight mt-1">
            ASIC Front-End &amp; Architecture Interview Mastery
          </h1>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center p-1 bg-[#181b25] rounded border border-white/[0.06]">
          <button
            onClick={() => setSubTab('flashcards')}
            className={`px-3 py-1.5 rounded font-mono text-xs transition-colors flex items-center gap-1.5 ${
              subTab === 'flashcards'
                ? 'bg-[#00f2fe] text-[#00373a] font-bold shadow-sm'
                : 'text-[#b9cacb] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">psychology</span>
            <span>Core Flashcards</span>
          </button>
          <button
            onClick={() => setSubTab('puzzles')}
            className={`px-3 py-1.5 rounded font-mono text-xs transition-colors flex items-center gap-1.5 ${
              subTab === 'puzzles'
                ? 'bg-[#00f2fe] text-[#00373a] font-bold shadow-sm'
                : 'text-[#b9cacb] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">code</span>
            <span>Whiteboard Puzzles</span>
          </button>
        </div>
      </div>

      {subTab === 'flashcards' && (
        <div className="space-y-4">
          {/* Company Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-[#181b25] p-2.5 rounded border border-white/[0.06]">
            <button
              onClick={() => setSelectedCompany('all')}
              className={`px-3 py-1 rounded font-mono text-xs shrink-0 transition-colors ${
                selectedCompany === 'all'
                  ? 'bg-[#00f2fe] text-[#00373a] font-bold'
                  : 'bg-[#1c1f29] text-[#b9cacb] hover:text-[#dfe2ef]'
              }`}
            >
              All Silicon Companies
            </button>
            {companies.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCompany(c)}
                className={`px-3 py-1 rounded font-mono text-xs shrink-0 transition-colors ${
                  selectedCompany === c
                    ? 'bg-[#00f2fe] text-[#00373a] font-bold'
                    : 'bg-[#1c1f29] text-[#b9cacb] hover:text-[#dfe2ef]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Flashcards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFlashcards.map(card => {
              const isRevealed = revealedAnswers[card.id];

              return (
                <div
                  key={card.id}
                  className="bg-[#181b25] rounded p-5 border border-white/[0.06] flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20 font-semibold">
                        {card.company}
                      </span>
                      <span className="font-mono text-[10px] text-[#849495]">{card.role}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded">
                        {card.topic}
                      </span>
                      <span className="font-mono text-[10px] text-[#b9cacb]">
                        Domain: {card.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#e0fdff] leading-snug pt-1">
                      "{card.question}"
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {isRevealed ? (
                      <div className="p-3.5 bg-[#1c1f29] rounded text-xs text-[#dfe2ef] leading-relaxed border border-white/[0.04] space-y-1 animate-fadeIn">
                        <strong className="text-[#00f2fe] font-mono text-[11px] block">
                          Architectural Answer &amp; Sign-Off Key:
                        </strong>
                        <p>{card.answer}</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#1c1f29]/50 rounded text-center text-xs text-[#849495] border border-dashed border-white/[0.08]">
                        Click "Reveal Answer" below to test your recall.
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#849495]">Frequency: Top 5%</span>
                      <button
                        onClick={() => toggleAnswer(card.id)}
                        className="px-3 py-1.5 rounded bg-[#262a34] hover:bg-[#31353f] text-[#00f2fe] font-mono text-xs transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isRevealed ? 'visibility_off' : 'visibility'}
                        </span>
                        <span>{isRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subTab === 'puzzles' && (
        <div className="space-y-5">
          {WHITEBOARD_PUZZLES.map(puzzle => {
            const hasHints = revealedHints[puzzle.id];
            const hasSolution = revealedSolutions[puzzle.id];

            return (
              <div
                key={puzzle.id}
                className="bg-[#181b25] rounded p-5 border border-white/[0.06] space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded font-semibold border border-[#4edea3]/20">
                        {puzzle.company}
                      </span>
                      <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded">
                        Difficulty: {puzzle.difficulty}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-[#e0fdff] mt-1">{puzzle.title}</h2>
                  </div>
                  <span className="font-mono text-xs text-[#b9cacb]">Frequency: {puzzle.frequency}</span>
                </div>

                <div className="bg-[#1c1f29] p-4 rounded text-xs text-[#dfe2ef] font-mono leading-relaxed border border-white/[0.04]">
                  <pre className="whitespace-pre-wrap">{puzzle.prompt}</pre>
                </div>

                {/* Hints Accordion */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleHint(puzzle.id)}
                    className="flex items-center gap-1.5 font-mono text-xs text-[#00f2fe] hover:underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                    <span>{hasHints ? 'Hide Architectural Hints' : 'Show Step-by-Step Mathematical Hints'}</span>
                  </button>

                  {hasHints && (
                    <div className="p-3.5 bg-[#0a0e17] rounded text-xs text-[#b9cacb] space-y-1.5 border border-white/[0.04] animate-fadeIn">
                      {puzzle.hints.map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[#00f2fe] font-mono">&bull;</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Solution Reveal */}
                <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                  <button
                    onClick={() => toggleSolution(puzzle.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#262a34] hover:bg-[#31353f] text-[#4edea3] font-mono text-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {hasSolution ? 'visibility_off' : 'terminal'}
                    </span>
                    <span>{hasSolution ? 'Hide Complete Verilog Solution' : 'View Complete Verilog Solution'}</span>
                  </button>

                  {hasSolution && (
                    <div className="space-y-3 pt-2 animate-fadeIn">
                      <div className="p-3.5 bg-[#0a0e17] rounded text-xs text-[#dfe2ef] leading-relaxed border border-white/[0.04]">
                        <strong className="text-[#00f2fe] font-mono text-xs block mb-1">
                          Microarchitectural Derivation:
                        </strong>
                        <pre className="whitespace-pre-wrap font-sans">{puzzle.solutionExplanation}</pre>
                      </div>

                      <div className="p-4 bg-[#0a0e17] rounded font-mono text-xs text-[#dfe2ef] overflow-x-auto leading-relaxed border border-white/[0.04]">
                        <pre>{puzzle.verilogSolution}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
