import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PHASES } from '../../data/curriculumData';

export const DayInspectorDrawer: React.FC = () => {
  const { selectedDay, setSelectedDay, setActiveTab, setCurrentDay, markDayComplete } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDay) {
        setSelectedDay(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDay, setSelectedDay]);

  if (!selectedDay) return null;

  const phaseObj = PHASES.find(p => p.id === selectedDay.phase) || PHASES[0];

  const handleOpenWorkspace = () => {
    setCurrentDay(selectedDay.day);
    if (selectedDay.day === 1) {
      setActiveTab('todays-lesson');
    } else {
      setActiveTab('rtl-ide-lab');
    }
    setSelectedDay(null);
  };

  const handleLaunchLab = () => {
    setCurrentDay(selectedDay.day);
    setActiveTab('rtl-ide-lab');
    setSelectedDay(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedDay(null)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#181b25] border-l border-white/[0.1] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="p-5 bg-[#1c1f29] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded bg-[#00f2fe] text-[#00373a] font-mono text-xs font-bold shadow-[0_0_8px_rgba(0,242,254,0.4)]">
                DAY {selectedDay.day < 10 ? `0${selectedDay.day}` : selectedDay.day}
              </span>
              <span
                className={`font-mono text-xs uppercase tracking-wider font-semibold ${
                  selectedDay.status === 'active'
                    ? 'text-[#4edea3]'
                    : selectedDay.status === 'gate'
                    ? 'text-[#00f2fe]'
                    : 'text-[#b9cacb]'
                }`}
              >
                {selectedDay.status === 'active'
                  ? 'ACTIVE IN PROGRESS'
                  : selectedDay.status === 'gate'
                  ? 'MILESTONE GATE CHECK'
                  : selectedDay.status === 'completed'
                  ? 'COMPLETED / SIGNED'
                  : 'CURRICULUM LOCKED'}
              </span>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-8 h-8 rounded bg-[#262a34] hover:bg-[#31353f] flex items-center justify-center text-[#dfe2ef] transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">close</span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {/* Title & Phase */}
            <div>
              <span className="font-mono text-[11px] text-[#00f2fe] uppercase tracking-wider block font-medium">
                {phaseObj.title}
              </span>
              <h2 className="text-xl font-bold text-[#e0fdff] tracking-tight mt-1">
                {selectedDay.title}
              </h2>
              <p className="text-sm text-[#b9cacb] mt-2 leading-relaxed">
                {selectedDay.longDesc || selectedDay.desc}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#1c1f29] rounded border border-white/[0.06]">
              <div>
                <span className="font-mono text-[10px] text-[#849495] uppercase block">ESTIMATED EFFORT</span>
                <span className="font-mono text-sm text-[#dfe2ef] font-semibold">{selectedDay.time}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#849495] uppercase block">TARGET EDA ENGINE</span>
                <span className="font-mono text-sm text-[#00f2fe] font-semibold">Icarus &amp; Yosys 0.38</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <span className="font-mono text-[10px] text-[#849495] uppercase tracking-wider block mb-1.5">
                SYLLABUS TOPICS &amp; PRAGMAS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDay.tags.map(t => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-[#262a34] text-[#b9cacb] font-mono text-[11px] border border-white/[0.04]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] text-[#e0fdff] uppercase tracking-wider font-semibold block">
                Core Learning Objectives
              </span>
              <ul className="space-y-2 text-xs text-[#dfe2ef]">
                {selectedDay.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#1c1f29]/70 p-2.5 rounded border border-white/[0.04]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[16px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lab Specification Deliverable */}
            <div className="p-4 rounded bg-[#1c1f29] border border-[#00f2fe]/20">
              <div className="flex items-center gap-1.5 text-[#00f2fe] font-mono text-xs font-semibold mb-1">
                <span className="material-symbols-outlined text-[17px]">terminal</span>
                <span>{selectedDay.lab}</span>
              </div>
              <p className="text-xs text-[#b9cacb] leading-relaxed">
                Implement complete synthesizable code adhering to clean gate-level modeling rules. Pass all automated unit testbench vectors with zero lint violations.
              </p>
              {selectedDay.specs && (
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] font-mono text-[11px] text-[#b9cacb] space-y-1">
                  <div><span className="text-[#849495]">Parameters:</span> <span className="text-[#dfe2ef]">{selectedDay.specs.parameters}</span></div>
                  <div><span className="text-[#849495]">Interfaces:</span> <span className="text-[#dfe2ef]">{selectedDay.specs.ports}</span></div>
                  <div><span className="text-[#849495]">Sign-Off Cut:</span> <span className="text-[#4edea3]">{selectedDay.specs.criteria}</span></div>
                </div>
              )}
            </div>

            {/* Sample Silicon Interview Question */}
            <div className="p-4 rounded bg-[#1c1f29] border border-white/[0.06]">
              <span className="font-mono text-[10px] text-[#4edea3] uppercase tracking-wider font-semibold block mb-1">
                Sample Silicon Interview Question
              </span>
              <p className="text-xs text-[#dfe2ef] italic leading-relaxed">
                "{selectedDay.interviewQ}"
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-5 bg-[#1c1f29] border-t border-white/[0.08] flex items-center justify-between gap-3">
            <button
              onClick={handleLaunchLab}
              className="flex-1 py-2.5 px-4 rounded bg-[#262a34] hover:bg-[#31353f] text-[#dfe2ef] font-mono text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">terminal</span>
              <span>Open in RTL Lab</span>
            </button>
            <button
              onClick={handleOpenWorkspace}
              className="flex-1 py-2.5 px-4 rounded bg-[#00f2fe] text-[#00373a] font-semibold text-xs transition-all hover:opacity-95 shadow-[0_0_14px_rgba(0,242,254,0.35)] flex items-center justify-center gap-1.5"
            >
              <span>Launch Day {selectedDay.day < 10 ? `0${selectedDay.day}` : selectedDay.day} Workspace</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
