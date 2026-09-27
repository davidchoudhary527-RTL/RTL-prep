import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DAYS_DATA, PHASES } from '../../data/curriculumData';
import { PhaseId } from '../../types/curriculum';

export const RoadmapView: React.FC = () => {
  const { setActiveTab, openDayDrawer, completedDays, targetNode } = useApp();

  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtered day cards
  const filteredDays = useMemo(() => {
    return DAYS_DATA.filter(day => {
      // Phase check
      if (selectedPhase !== 'all' && day.phase !== selectedPhase) {
        return false;
      }

      // Status check
      if (statusFilter === 'active' && day.status !== 'active') return false;
      if (statusFilter === 'gate' && !day.isMilestone) return false;
      if (statusFilter === 'locked' && day.status !== 'locked') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = day.title.toLowerCase().includes(query);
        const matchesDesc = day.desc.toLowerCase().includes(query);
        const matchesTags = day.tags.some(t => t.toLowerCase().includes(query));
        const matchesLab = day.lab.toLowerCase().includes(query);
        const matchesDay = `day ${day.day}`.includes(query) || `d${day.day}`.includes(query);

        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesLab && !matchesDay) {
          return false;
        }
      }

      return true;
    });
  }, [selectedPhase, searchQuery, statusFilter]);

  const handleResetFilters = () => {
    setSelectedPhase('all');
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleResumeDay1 = () => {
    setActiveTab('todays-lesson');
  };

  return (
    <div className="flex flex-col w-full animate-fadeIn pb-16">
      {/* Top Telemetry & Global Progress Strip */}
      <section className="mb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-2 text-[#b9cacb] font-mono text-[11px] uppercase tracking-wider">
          <span
            onClick={() => setActiveTab('dashboard')}
            className="hover:text-[#00f2fe] cursor-pointer transition-colors"
          >
            Curriculum
          </span>
          <span>/</span>
          <span className="text-[#00dce6]">ASIC Front-End Core</span>
          <span>/</span>
          <span className="text-[#4edea3] font-medium">Trajectory Plan</span>
        </div>

        {/* Title & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#e0fdff] tracking-tight">
              60-Day ASIC RTL Curriculum Roadmap
            </h1>
            <p className="text-sm text-[#b9cacb] mt-1.5 max-w-4xl leading-relaxed">
              Complete tape-out readiness trajectory from Verilog fundamentals to advanced ASIC front-end RTL design, STA, CDC, and Tier-1 silicon interview prep.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto">
            <button
              onClick={handleResumeDay1}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#00f2fe] text-[#00373a] font-semibold text-xs hover:shadow-[0_0_16px_rgba(0,242,254,0.4)] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              <span>Resume Day 01</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#1c1f29] hover:bg-[#262a34] text-[#dfe2ef] font-mono text-xs transition-colors border border-white/[0.06]"
            >
              <span className="material-symbols-outlined text-[16px]">unfold_more</span>
              <span>Expand All</span>
            </button>
          </div>
        </div>

        {/* Telemetry Cards Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#181b25] p-3 rounded border border-white/[0.06]">
          {/* Overall Progress */}
          <div className="flex flex-col p-3 bg-[#1c1f29] rounded border border-white/[0.04]">
            <div className="flex items-center justify-between text-[#b9cacb] mb-1 font-mono text-[10px]">
              <span className="uppercase tracking-wider">Overall Progress</span>
              <span className="text-[#00f2fe] font-semibold">{completedDays.length} / 60 Days</span>
            </div>
            <div className="w-full bg-[#0a0e17] h-1.5 rounded overflow-hidden mb-1.5">
              <div
                className="bg-[#00f2fe] h-full shadow-[0_0_8px_#00f2fe] transition-all duration-300"
                style={{ width: `${Math.max((completedDays.length / 60) * 100, 1.7)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#4edea3] font-medium">
                {((completedDays.length / 60) * 100).toFixed(1)}% Completed
              </span>
              <span className="text-[#849495]">{60 - completedDays.length} Remaining</span>
            </div>
          </div>

          {/* Active Phase */}
          <div className="flex flex-col p-3 bg-[#1c1f29] rounded border border-white/[0.04]">
            <div className="flex items-center justify-between text-[#b9cacb] mb-1 font-mono text-[10px]">
              <span className="uppercase tracking-wider">Active Phase</span>
              <span className="h-2 w-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            </div>
            <span className="text-xs font-semibold text-[#00f2fe] truncate">Phase 1: Verilog Fundamentals</span>
            <span className="font-mono text-[10px] text-[#b9cacb] mt-auto">Day 01 of 10 in Phase</span>
          </div>

          {/* Target Track */}
          <div className="flex flex-col p-3 bg-[#1c1f29] rounded border border-white/[0.04]">
            <div className="flex items-center justify-between text-[#b9cacb] mb-1 font-mono text-[10px]">
              <span className="uppercase tracking-wider">Target Tape-Out Track</span>
              <span className="material-symbols-outlined text-[16px] text-[#00dce6]">memory</span>
            </div>
            <span className="text-xs font-semibold text-[#dfe2ef] truncate">{targetNode}</span>
            <span className="font-mono text-[10px] text-[#4edea3] mt-auto">Front-End Digital Sign-Off</span>
          </div>

          {/* Sign-Off Gates */}
          <div className="flex flex-col p-3 bg-[#1c1f29] rounded border border-white/[0.04]">
            <div className="flex items-center justify-between text-[#b9cacb] mb-1 font-mono text-[10px]">
              <span className="uppercase tracking-wider">Sign-Off Gates</span>
              <span className="text-[#dfe2ef] font-mono">0 / 6 CLEARED</span>
            </div>
            <div className="flex gap-1 my-auto">
              <div className="flex-1 h-1.5 bg-[#00f2fe]/40 rounded-sm"></div>
              <div className="flex-1 h-1.5 bg-[#31353f] rounded-sm"></div>
              <div className="flex-1 h-1.5 bg-[#31353f] rounded-sm"></div>
              <div className="flex-1 h-1.5 bg-[#31353f] rounded-sm"></div>
              <div className="flex-1 h-1.5 bg-[#31353f] rounded-sm"></div>
              <div className="flex-1 h-1.5 bg-[#31353f] rounded-sm"></div>
            </div>
            <span className="font-mono text-[10px] text-[#b9cacb]">Gate 1 Assessment in 9 Days</span>
          </div>
        </div>
      </section>

      {/* Sticky Filter & Search Toolbar */}
      <section className="sticky top-16 z-30 bg-[#0a0e17]/95 backdrop-blur-md py-3 mb-6 border-b border-white/[0.06]">
        <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
          {/* Phase Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-3 py-1.5 rounded font-mono text-xs shrink-0 transition-all ${
                selectedPhase === 'all'
                  ? 'bg-[#00f2fe] text-[#00373a] font-bold shadow-[0_0_8px_rgba(0,242,254,0.3)]'
                  : 'bg-[#1c1f29] text-[#b9cacb] hover:text-[#dfe2ef] hover:bg-[#262a34]'
              }`}
            >
              All (60 Days)
            </button>
            {PHASES.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPhase(p.id)}
                className={`px-3 py-1.5 rounded font-mono text-xs shrink-0 transition-all ${
                  selectedPhase === p.id
                    ? 'bg-[#00f2fe] text-[#00373a] font-bold shadow-[0_0_8px_rgba(0,242,254,0.3)]'
                    : 'bg-[#1c1f29] text-[#b9cacb] hover:text-[#dfe2ef] hover:bg-[#262a34]'
                }`}
              >
                Phase {p.num}: {p.subtitle.split('&')[0]} ({p.startDay}-{p.endDay})
              </button>
            ))}
          </div>

          {/* Quick Search & Filter Select */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#849495] text-[16px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search RTL topic, CDC, SVA, STA..."
                className="w-full bg-[#181b25] pl-8 pr-3 py-1.5 rounded font-mono text-xs text-[#dfe2ef] placeholder:text-[#849495]/60 focus:outline-none focus:ring-1 focus:ring-[#00f2fe] border border-white/[0.06]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#849495] hover:text-[#dfe2ef]"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>

            {/* Status Select */}
            <div className="relative shrink-0">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-[#181b25] text-[#dfe2ef] font-mono text-xs px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-[#00f2fe] border border-white/[0.06] cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="active">Active Only</option>
                <option value="gate">Milestone Gates Only</option>
                <option value="locked">Upcoming / Locked</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 60-Day Interactive Curriculum Sections */}
      <div className="flex flex-col gap-8">
        {PHASES.map(phase => {
          const phaseDays = filteredDays.filter(d => d.phase === phase.id);
          if (phaseDays.length === 0) return null;

          const isPhase1 = phase.id === 'p1';

          return (
            <div key={phase.id} className="flex flex-col gap-3">
              {/* Phase Header Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 bg-[#181b25] p-4 rounded border border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-widest uppercase ${
                        isPhase1 ? 'bg-[#00f2fe] text-[#00373a]' : 'bg-[#262a34] text-[#dfe2ef]'
                      }`}
                    >
                      Phase 0{phase.num}
                    </span>
                    <span className="font-mono text-xs text-[#4edea3]">
                      DAYS 0{phase.startDay} – {phase.endDay < 10 ? `0${phase.endDay}` : phase.endDay}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono text-[10px] uppercase ${
                        isPhase1
                          ? 'bg-[#4edea3]/10 text-[#4edea3]'
                          : phase.num === 6
                          ? 'bg-[#00f2fe]/10 text-[#00f2fe]'
                          : 'bg-[#1c1f29] text-[#849495]'
                      }`}
                    >
                      {isPhase1 ? 'Active Stage' : phase.num === 6 ? 'Final Stage' : 'Upcoming'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#e0fdff] mt-1">{phase.subtitle}</h2>
                  <p className="text-xs text-[#b9cacb] mt-0.5 max-w-4xl">{phase.description}</p>
                </div>
                <div className="text-right mt-2 md:mt-0 font-mono text-xs text-[#b9cacb]">
                  <span>PROGRESS: </span>
                  <span className={isPhase1 ? 'text-[#4edea3] font-semibold' : 'text-[#849495]'}>
                    {isPhase1 ? '1 / 10 Days (10%)' : '0 / 10 Days (0%)'}
                  </span>
                </div>
              </div>

              {/* Grid of 10 Cards for this Phase */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                {phaseDays.map(day => {
                  const isCurrent = day.day === 1;
                  const isGate = day.isMilestone;

                  return (
                    <div
                      key={day.day}
                      onClick={() => openDayDrawer(day.day)}
                      className={`group flex flex-col justify-between p-3.5 rounded transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#262a34] border border-[#00f2fe] shadow-[0_0_16px_rgba(0,242,254,0.15)] hover:bg-[#31353f]'
                          : isGate
                          ? 'bg-[#1c1f29] border border-[#4edea3]/30 hover:bg-[#262a34]'
                          : 'bg-[#1c1f29] border border-white/[0.05] hover:bg-[#262a34]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`font-mono text-xs font-bold tracking-wider ${
                              isCurrent ? 'text-[#00f2fe]' : isGate ? 'text-[#4edea3]' : 'text-[#849495]'
                            }`}
                          >
                            DAY {day.day < 10 ? `0${day.day}` : day.day}
                          </span>
                          {isCurrent ? (
                            <span className="px-1.5 py-0.5 rounded bg-[#00f2fe] text-[#00373a] font-mono text-[9px] font-bold flex items-center gap-1 shadow-[0_0_6px_#00f2fe]">
                              <span className="h-1 w-1 rounded-full bg-[#00373a] animate-ping"></span>
                              ACTIVE
                            </span>
                          ) : isGate ? (
                            <span className="px-1.5 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-[10px] font-semibold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[13px]">verified</span>
                              GATE 0{day.gateNum}
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[#849495]/40 text-[15px]">lock</span>
                          )}
                        </div>

                        <h3
                          className={`text-xs font-semibold mb-1 transition-colors leading-snug ${
                            isCurrent
                              ? 'text-[#e0fdff] group-hover:text-[#00f2fe]'
                              : isGate
                              ? 'text-[#e0fdff] group-hover:text-[#4edea3]'
                              : 'text-[#dfe2ef] group-hover:text-[#e0fdff]'
                          }`}
                        >
                          {day.title}
                        </h3>

                        <p className="text-[11px] text-[#b9cacb] line-clamp-2 mb-2 leading-relaxed">
                          {day.desc}
                        </p>
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {day.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded bg-[#181b25] font-mono text-[9px] text-[#b9cacb] border border-white/[0.04]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] font-mono text-[10px] text-[#b9cacb]">
                          <span className={`flex items-center gap-1 truncate ${isCurrent || isGate ? 'text-[#4edea3]' : ''}`}>
                            <span className="material-symbols-outlined text-[13px]">
                              {isGate ? 'flag' : 'code'}
                            </span>
                            <span className="truncate">{day.lab.split(':')[1] || day.lab}</span>
                          </span>
                          <span className="shrink-0 ml-1">{day.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
