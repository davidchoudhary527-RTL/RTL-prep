import React from 'react';
import { useApp } from '../../context/AppContext';
import { DAYS_DATA, PHASES } from '../../data/curriculumData';

export const DashboardView: React.FC = () => {
  const { setActiveTab, openDayDrawer, completedDays, quizState, edaEngine } = useApp();

  const day1 = DAYS_DATA[0];

  const handleDownloadSyllabus = (e: React.MouseEvent) => {
    e.preventDefault();
    const syllabusText = `================================================================================
60-DAY ASIC RTL CURRICULUM ROADMAP - SILICON HARDWARE ARCHITECTURE
================================================================================
Target Track: TSMC 5nm FinFET Front-End Digital Sign-Off
Simulator Engines: Icarus Verilog 12, Verilator 5.018, Synopsys VCS
Synthesizer: Yosys / Synopsys Design Compiler
STA Tool: Synopsys PrimeTime / OpenSTA
Lint Tool: SpyGlass / Verilator Lint

${PHASES.map(p => `
--------------------------------------------------------------------------------
${p.title.toUpperCase()} (${p.daysRange})
Description: ${p.description}
--------------------------------------------------------------------------------
${DAYS_DATA.filter(d => d.phase === p.id)
  .map(d => `Day ${d.day < 10 ? '0' + d.day : d.day}: ${d.title} [${d.time}]
  Lab: ${d.lab}
  Tags: ${d.tags.join(', ')}
  Interview Focus: ${d.interviewQ}`)
  .join('\n\n')}
`).join('\n')}

================================================================================
END OF SYLLABUS DOCUMENT
================================================================================`;

    const blob = new Blob([syllabusText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '60-Day-ASIC-RTL-Curriculum-Syllabus.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-6 animate-fadeIn">
      {/* Top Telemetry Banner & Diagnostic Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-1 pb-3 border-b border-white/[0.08]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#1c1f29] font-mono text-[10px] text-[#e0fdff] uppercase tracking-wider border border-white/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] inline-block mr-1.5 shadow-[0_0_6px_#4edea3] animate-pulse"></span>
              ACTIVE RUN • TARGET: ASIC TAPE-OUT READY
            </span>
            <span className="font-mono text-[10px] text-[#b9cacb]">SEED: 0x4F1A • 60-DAY PIPELINE</span>
          </div>
          <h1 className="text-2xl font-bold text-[#e0fdff] tracking-tight mt-1">
            ASIC / RTL Verification Workbench
          </h1>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#181b25] font-mono text-xs text-[#b9cacb] border border-white/[0.05]">
            <span className="material-symbols-outlined text-[15px] text-[#4edea3]">verified_user</span>
            <span>SYNTHESIS: DC COMPLIANT</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#181b25] font-mono text-xs text-[#b9cacb] border border-white/[0.05]">
            <span className="material-symbols-outlined text-[15px] text-[#00f2fe]">memory</span>
            <span>SV-2012 LINT: CLEAN</span>
          </div>
        </div>
      </div>

      {/* Recommended Next Step Banner */}
      <div className="rounded-lg bg-gradient-to-r from-[#181b25] via-[#1c1f29] to-[#181b25] border border-[#00f2fe]/30 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_16px_rgba(0,242,254,0.08)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe] shrink-0">
            <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#4edea3] font-semibold">
                NEXT RECOMMENDED STEP
              </span>
              <span className="w-1 h-1 rounded-full bg-[#849495]"></span>
              <span className="font-mono text-[10px] text-[#b9cacb]">
                Day 01 Recap Finalized • {completedDays.length > 0 ? 'All Milestones Met' : 'In Progress'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#dfe2ef] mt-0.5">
              Ready to advance! Review Day 01 synthesis sign-off or preview{' '}
              <span className="text-[#00f2fe] font-semibold">Day 02: Combinational Logic &amp; Gate Primitives</span>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setActiveTab('todays-lesson')}
            className="px-3 py-1.5 rounded bg-[#262a34] text-[#dfe2ef] hover:text-[#00f2fe] font-mono text-xs transition-colors flex items-center gap-1.5 border border-white/[0.06]"
          >
            <span>Review Day 01 Summary</span>
            <span className="material-symbols-outlined text-[15px]">history_edu</span>
          </button>
          <button
            onClick={() => openDayDrawer(2)}
            className="px-3.5 py-1.5 rounded bg-[#00f2fe] text-[#00373a] font-semibold text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(0,242,254,0.3)] hover:opacity-95 transition-opacity"
          >
            <span>Preview Day 02</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 1. Top Overview Metric Row (3 Column Dense Instrumental Bento) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric Card 1: Master Progress */}
        <div className="relative overflow-hidden rounded bg-[#181b25] p-5 shadow-sm border border-white/[0.06] flex flex-col justify-between group hover:bg-[#1c1f29] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#b9cacb]">
                CURRICULUM TRAJECTORY
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-[#e0fdff] tracking-tight">Day 1</span>
                <span className="text-base text-[#b9cacb] font-normal">/ 60</span>
              </div>
            </div>
            <div className="relative flex items-center justify-center w-14 h-14">
              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  className="stroke-[#31353f]"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="19"
                  strokeWidth="3.5"
                />
                <circle
                  className="stroke-[#00f2fe]"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="19"
                  strokeDasharray="119.38"
                  strokeDashoffset={119.38 - (119.38 * Math.max(completedDays.length, 1)) / 60}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-mono text-[11px] text-[#00f2fe] font-bold">
                {((Math.max(completedDays.length, 1) / 60) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between items-center font-mono text-[10px]">
              <span className="text-[#00f2fe] font-semibold uppercase">Phase 1: Verilog Fundamentals</span>
              <span className="text-[#4edea3]">10% Complete (1/10)</span>
            </div>
            <div className="w-full h-1.5 bg-[#31353f] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00f2fe] to-[#4edea3] w-[10%] rounded-full shadow-[0_0_8px_rgba(0,242,254,0.4)]"></div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[#b9cacb] font-mono text-[10px]">
              <span className="flex items-center gap-1 truncate">
                <span className="material-symbols-outlined text-[14px] text-[#4edea3]">flag</span>
                <span>Next Milestone: Day 10 Comprehensive RTL Gatekeeper</span>
              </span>
              <span className="font-semibold text-[#00f2fe] shrink-0 ml-1">1.7% SILICON PATH</span>
            </div>
          </div>
        </div>

        {/* Metric Card 2: Daily Streak Counter */}
        <div className="relative overflow-hidden rounded bg-[#181b25] p-5 shadow-sm border border-white/[0.06] flex flex-col justify-between group hover:bg-[#1c1f29] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#b9cacb]">
                CADENCE &amp; UPTIME
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-bold text-[#4edea3] tracking-tight">1 Day</span>
                <span className="px-1.5 py-0.5 rounded bg-[#262a34] text-[10px] font-mono text-[#4edea3] font-medium uppercase tracking-wider border border-[#4edea3]/30">
                  Active Streak 🔥
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded bg-[#262a34] flex items-center justify-center text-[#4edea3] shadow-[inset_0_0_12px_rgba(78,222,163,0.15)] border border-[#4edea3]/20">
              <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#dfe2ef]">Target: 60 Days Sustained</span>
              <span className="text-[#4edea3]">Streak Shield: Active</span>
            </div>
            <div className="grid grid-cols-12 gap-1 py-1">
              <div className="h-2 rounded-sm bg-[#4edea3] shadow-[0_0_6px_rgba(78,222,163,0.6)]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
              <div className="h-2 rounded-sm bg-[#262a34]"></div>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-[#b9cacb] pt-1">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] inline-block"></span>
                Day 01 Milestone Logged
              </span>
              <span className="text-[#00f2fe] font-semibold">EPOCH 01</span>
            </div>
          </div>
        </div>

        {/* Metric Card 3: Quick Stats & Verification KPI */}
        <div className="relative overflow-hidden rounded bg-[#181b25] p-5 shadow-sm border border-white/[0.06] flex flex-col justify-between group hover:bg-[#1c1f29] transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#b9cacb]">
                EVALUATION METRICS
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-[#e0fdff] tracking-tight">
                  0{completedDays.length}
                  <span className="text-[#849495] font-normal text-xl">/60</span>
                </span>
                <span className="font-mono text-[10px] text-[#4edea3] font-semibold ml-1.5">
                  SOLVED &amp; SIGNED
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded bg-[#262a34] flex items-center justify-center text-[#00f2fe] border border-[#00f2fe]/20">
              <span className="material-symbols-outlined text-[24px]">analytics</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#1c1f29] p-2.5 rounded border border-white/[0.04] flex flex-col justify-between">
              <span className="font-mono text-[10px] text-[#b9cacb] uppercase">Quiz Avg</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-base font-bold text-[#4edea3]">
                  {quizState.submitted ? `${Math.round((quizState.score / quizState.total) * 100)}%` : '-- %'}
                </span>
                <span className="font-mono text-[10px] text-[#b9cacb]">
                  {quizState.submitted ? `(${quizState.score}/${quizState.total} Pass)` : 'N/A'}
                </span>
              </div>
            </div>
            <div className="bg-[#1c1f29] p-2.5 rounded border border-white/[0.04] flex flex-col justify-between">
              <span className="font-mono text-[10px] text-[#b9cacb] uppercase">Interview Fit</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-base font-bold text-[#4edea3]">3.4%</span>
                <span className="font-mono text-[10px] text-[#4edea3]">+1.4% L1 JNR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dedicated Today's Day 01 Milestones / Checklist Tracker Widget */}
      <div className="rounded bg-[#181b25] border border-white/[0.08] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#4edea3]/15 flex items-center justify-center text-[#4edea3]">
              <span className="material-symbols-outlined text-[18px]">checklist</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#e0fdff]">Today's Day 01 Milestones / Checklist</h3>
              <p className="text-xs text-[#b9cacb]">Live progress tracker across Day 01 curriculum modules &amp; sign-offs</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-[#849495] uppercase">COMPLETION:</span>
              <span className="text-[#4edea3] font-bold">4 of 5 (80%)</span>
            </div>
            <div className="w-24 h-2 bg-[#31353f] rounded-full overflow-hidden">
              <div className="h-full bg-[#4edea3] w-4/5 rounded-full shadow-[0_0_6px_#4edea3]"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Milestone 1 */}
          <div className="p-3 rounded bg-[#1c1f29] flex flex-col justify-between border border-[#4edea3]/25 hover:border-[#4edea3]/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#4edea3] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span> 100% READ
                </span>
                <span className="material-symbols-outlined text-[#849495] text-[16px]">menu_book</span>
              </div>
              <div className="text-xs font-semibold text-[#e0fdff] mt-1">Theory &amp; Schematics</div>
              <p className="text-[11px] text-[#b9cacb] line-clamp-2">Wire vs reg, port semantics &amp; delta delays reviewed.</p>
            </div>
            <button
              onClick={() => setActiveTab('todays-lesson')}
              className="mt-2.5 pt-2 border-t border-white/[0.06] text-[#00f2fe] hover:text-[#e0fdff] font-mono text-[10px] flex items-center justify-between text-left"
            >
              <span>Open Today's Lesson</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>

          {/* Milestone 2 */}
          <div className="p-3 rounded bg-[#1c1f29] flex flex-col justify-between border border-[#4edea3]/25 hover:border-[#4edea3]/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#4edea3] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span> COMPLETED
                </span>
                <span className="material-symbols-outlined text-[#849495] text-[16px]">link</span>
              </div>
              <div className="text-xs font-semibold text-[#e0fdff] mt-1">External Curated Guides</div>
              <p className="text-[11px] text-[#b9cacb] line-clamp-2">ChipVerify, VLSI Verify &amp; YouTube Verilog labs done.</p>
            </div>
            <button
              onClick={() => setActiveTab('todays-lesson')}
              className="mt-2.5 pt-2 border-t border-white/[0.06] text-[#00f2fe] hover:text-[#e0fdff] font-mono text-[10px] flex items-center justify-between text-left"
            >
              <span>View Guide Links</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>

          {/* Milestone 3 */}
          <div className="p-3 rounded bg-[#1c1f29] flex flex-col justify-between border border-[#4edea3]/25 hover:border-[#4edea3]/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#4edea3] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span> 12/12 PASS
                </span>
                <span className="material-symbols-outlined text-[#849495] text-[16px]">terminal</span>
              </div>
              <div className="text-xs font-semibold text-[#e0fdff] mt-1">RTL Practice Lab</div>
              <p className="text-[11px] text-[#b9cacb] line-clamp-2">4:1 Mux with Tri-State verified; Lint 0 errors clean.</p>
            </div>
            <button
              onClick={() => setActiveTab('rtl-ide-lab')}
              className="mt-2.5 pt-2 border-t border-white/[0.06] text-[#00f2fe] hover:text-[#e0fdff] font-mono text-[10px] flex items-center justify-between text-left"
            >
              <span>Launch RTL Lab</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>

          {/* Milestone 4 */}
          <div className="p-3 rounded bg-[#1c1f29] flex flex-col justify-between border border-[#4edea3]/25 hover:border-[#4edea3]/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#4edea3] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span> 9/10 (90%)
                </span>
                <span className="material-symbols-outlined text-[#849495] text-[16px]">quiz</span>
              </div>
              <div className="text-xs font-semibold text-[#e0fdff] mt-1">10-Q Assessment</div>
              <p className="text-[11px] text-[#b9cacb] line-clamp-2">Passed on 1st attempt. Threshold 80% met.</p>
            </div>
            <button
              onClick={() => setActiveTab('daily-quizzes')}
              className="mt-2.5 pt-2 border-t border-white/[0.06] text-[#00f2fe] hover:text-[#e0fdff] font-mono text-[10px] flex items-center justify-between text-left"
            >
              <span>Review Quiz Answers</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>

          {/* Milestone 5 */}
          <div className="p-3 rounded bg-[#1c1f29] flex flex-col justify-between border border-[#00f2fe]/30 hover:border-[#00f2fe]/60 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#00f2fe] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span> 4/4 REVIEWED
                </span>
                <span className="material-symbols-outlined text-[#849495] text-[16px]">psychology</span>
              </div>
              <div className="text-xs font-semibold text-[#e0fdff] mt-1">ASIC Flashcards</div>
              <p className="text-[11px] text-[#b9cacb] line-clamp-2">ASIC standard cells vs FPGA LUT trade-offs mastered.</p>
            </div>
            <button
              onClick={() => setActiveTab('interview-prep')}
              className="mt-2.5 pt-2 border-t border-white/[0.06] text-[#00f2fe] hover:text-[#e0fdff] font-mono text-[10px] flex items-center justify-between text-left"
            >
              <span>Review Interview Q&amp;A</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Break / High-Tech Context Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">terminal</span>
          <h2 className="text-lg font-semibold text-[#e0fdff]">Day 01 Execution Deck</h2>
          <span className="px-2 py-0.5 rounded bg-[#1c1f29] font-mono text-[10px] text-[#4edea3] uppercase font-semibold border border-[#4edea3]/20">
            ALL STAGES COMPLETED &amp; VERIFIED
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#b9cacb] hidden sm:inline-block">
          ESTIMATED RUNTIME: ~2.5 HOURS • COMPLETED IN 1.8 HOURS
        </span>
      </div>

      {/* 3. Main Action Cards Grid (Responsive 2x2 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card A: Today's Lesson */}
        <div className="rounded bg-[#181b25] p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-[#1c1f29] transition-all border border-white/[0.06]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] font-mono text-[10px] uppercase font-semibold">
                  DAY 1 LESSON
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1c1f29] text-[#b9cacb] font-mono text-[10px]">
                  THEORY &amp; SCHEMATICS
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#4edea3] flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> 100% COMPLETE
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#e0fdff]">{day1.title}</h3>
              <p className="text-xs text-[#b9cacb] mt-1.5 leading-relaxed">
                Continuous assignments, <code className="font-mono text-[#00f2fe] text-[11px] px-1 py-0.5 rounded bg-[#1c1f29]">wire</code> vs <code className="font-mono text-[#00f2fe] text-[11px] px-1 py-0.5 rounded bg-[#1c1f29]">reg</code> datatypes, port declarations, and structural vs behavioral abstraction levels.
              </p>
            </div>

            <div className="bg-[#1c1f29] p-3 rounded space-y-1.5 border border-white/[0.04]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#b9cacb] block mb-1">
                Core Architecture Concepts
              </span>
              <div className="flex items-center gap-2 text-xs text-[#dfe2ef]">
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">check_circle</span>
                <span>Verilog Language Foundations &amp; Simulation Semantics</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#dfe2ef]">
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">check_circle</span>
                <span>Nets, Registers &amp; Logic Values (<code className="font-mono text-[#4edea3]">0, 1, X, Z</code>)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#dfe2ef]">
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">check_circle</span>
                <span>Continuous <code className="font-mono text-[#4edea3]">assign</code> statement mechanics &amp; delta delays</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#4edea3]">READING COMPLETE • 45 MIN</span>
            <button
              onClick={() => setActiveTab('todays-lesson')}
              className="px-4 py-2 rounded bg-[#262a34] text-[#00f2fe] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#31353f] transition-colors"
            >
              <span>Review Today's Lesson</span>
              <span className="material-symbols-outlined text-[17px]">menu_book</span>
            </button>
          </div>
        </div>

        {/* Card B: Practice Problem */}
        <div className="rounded bg-[#181b25] p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-[#1c1f29] transition-all border border-[#4edea3]/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] font-mono text-[10px] uppercase font-semibold">
                  PRACTICE PROBLEM #01
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1c1f29] text-[#b9cacb] font-mono text-[10px]">
                  BEGINNER • VERILOG-2001
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified</span> 12/12 VECTORS PASS
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#e0fdff]">
                Parameterized 4-to-1 Multiplexer with Tri-State Output
              </h3>
              <p className="text-xs text-[#b9cacb] mt-1.5 leading-relaxed">
                Write a parameter-controlled mux (<code className="font-mono text-[#00f2fe] text-[11px]">DATA_WIDTH=8</code>) with synchronous enable and high-impedance (<code className="font-mono text-[#4edea3] text-[11px]">'bz</code>) handling. Verify with automated testbench vectors.
              </p>
            </div>

            {/* Diagnostics row */}
            <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#1c1f29] rounded border border-white/[0.04] font-mono text-[10px]">
              <div className="flex flex-col">
                <span className="text-[#849495] uppercase">TIMING SLACK</span>
                <span className="text-[#4edea3] font-semibold">+586 ps [MET]</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#849495] uppercase">LINT CHECK</span>
                <span className="text-[#00f2fe] font-semibold">0 Errors / 0 Warn</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#849495] uppercase">CELL AREA</span>
                <span className="text-[#dfe2ef] font-semibold">14.28 µm²</span>
              </div>
            </div>

            <div className="bg-[#0a0e17] p-3 rounded font-mono text-[11px] text-[#dfe2ef] space-y-0.5 overflow-x-auto border border-white/[0.04]">
              <div className="text-[#849495]">// RTL Interface Contract (Synthesized)</div>
              <div><span className="text-[#00f2fe]">module</span> mux4_tristate #(</div>
              <div className="pl-4 text-[#849495]"><span className="text-[#00f2fe]">parameter</span> WIDTH = 8</div>
              <div>) (</div>
              <div className="pl-4"><span className="text-[#4edea3]">input</span>  [WIDTH-1:0] in0, in1, in2, in3,</div>
              <div className="pl-4"><span className="text-[#4edea3]">input</span>  [1:0]       sel, oe,</div>
              <div className="pl-4"><span className="text-[#00f2fe]">output</span> [WIDTH-1:0] out</div>
              <div>);</div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#4edea3]">AUTO-GRADER: 12 TESTBENCH CASES</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('rtl-ide-lab')}
                className="px-3 py-1.5 rounded bg-[#262a34] text-[#dfe2ef] font-mono text-xs hover:bg-[#31353f] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">query_stats</span>
                <span>Waveforms</span>
              </button>
              <button
                onClick={() => setActiveTab('rtl-ide-lab')}
                className="px-4 py-2 rounded bg-[#00f2fe] text-[#00373a] font-semibold text-xs flex items-center gap-1.5 hover:opacity-95 shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all"
              >
                <span className="material-symbols-outlined text-[17px]">terminal</span>
                <span>Open in RTL Lab</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card C: Daily Quiz */}
        <div className="rounded bg-[#181b25] p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-[#1c1f29] transition-all border border-[#4edea3]/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#31353f] text-[#dfe2ef] font-mono text-[10px] uppercase font-semibold">
                  DAILY ASSESSMENT
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1c1f29] text-[#b9cacb] font-mono text-[10px]">
                  10 MCQS • 80% THRESHOLD
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span> {quizState.score}/10 (90%) PASS
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#e0fdff]">
                Day 1 Quiz: Verilog Operators &amp; Net Semantics
              </h3>
              <p className="text-xs text-[#b9cacb] mt-1.5 leading-relaxed">
                Evaluate bitwise vs logical operators, reduction operators, and <code className="font-mono text-[#4edea3] text-[11px]">X-propagation</code> in event-driven simulators.
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[#849495] uppercase tracking-wider block">Domain Mastery Breakdown</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> Delta Delays: Mastered
                </span>
                <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> Wire vs Reg: Mastered
                </span>
                <span className="px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span> Tri-State FinFET: Reviewed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-[#1c1f29] rounded flex items-center gap-2.5 border border-white/[0.04]">
                <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">help_center</span>
                <div>
                  <div className="font-mono text-[10px] text-[#b9cacb] uppercase">Questions</div>
                  <div className="font-mono text-xs text-[#dfe2ef] font-semibold">10 Multi-Choice</div>
                </div>
              </div>
              <div className="p-2.5 bg-[#1c1f29] rounded flex items-center gap-2.5 border border-white/[0.04]">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px]">verified</span>
                <div>
                  <div className="font-mono text-[10px] text-[#b9cacb] uppercase">Your Score</div>
                  <div className="font-mono text-xs text-[#4edea3] font-semibold">
                    {quizState.score} / {quizState.total} (90%) PASS
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#4edea3]">DAY 2 REPOSITORY UNLOCKED</span>
            <button
              onClick={() => setActiveTab('daily-quizzes')}
              className="px-4 py-2 rounded bg-[#262a34] text-[#00f2fe] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#31353f] transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">replay</span>
              <span>Retake / Review Quiz</span>
            </button>
          </div>
        </div>

        {/* Card D: Interview Prep */}
        <div className="rounded bg-[#181b25] p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-[#1c1f29] transition-all border border-white/[0.06]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#d8d7ff]/15 text-[#f9f5ff] font-mono text-[10px] uppercase font-semibold">
                  INTERVIEW PREP #01
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1c1f29] text-[#b9cacb] font-mono text-[10px]">
                  ARCHITECTURAL FOUNDATION
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] font-mono text-[10px] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span> 4/4 FLASHCARDS
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#e0fdff]">
                ASIC vs FPGA Front-End Architecture
              </h3>
              <p className="text-xs text-[#b9cacb] mt-1.5 leading-relaxed">
                Explain <code className="font-mono text-[#00f2fe] text-[11px]">wire</code> vs <code className="font-mono text-[#00f2fe] text-[11px]">reg</code> in synthesizable Verilog and how logic gates map differently in ASIC standard cell libraries versus FPGA LUTs.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#b9cacb] block">Target Hardware Teams</span>
              <div className="flex flex-wrap gap-1.5">
                {['Qualcomm', 'NVIDIA', 'Apple Silicon', 'Broadcom'].map(company => (
                  <span
                    key={company}
                    className="px-2 py-0.5 rounded bg-[#1c1f29] text-[#dfe2ef] font-mono text-[10px] border border-white/[0.04]"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#b9cacb]">FREQUENCY: VERY HIGH (TOP 5%)</span>
            <button
              onClick={() => setActiveTab('interview-prep')}
              className="px-4 py-2 rounded bg-[#262a34] text-[#00f2fe] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#31353f] transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">psychology</span>
              <span>Review Technical Q&amp;A</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. 60-Day Progress Grid (Interactive Heatmap / Roadmap Visualizer) */}
      <div className="rounded bg-[#181b25] p-5 space-y-4 shadow-sm border border-white/[0.08]">
        {/* Header with Legend */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#00f2fe] font-semibold">
                SYNTHESIS ROADMAP
              </span>
              <span className="w-1 h-1 rounded-full bg-[#849495]"></span>
              <span className="font-mono text-[10px] text-[#b9cacb]">6 SPECIALIZED DOMAINS</span>
            </div>
            <h3 className="text-xl font-semibold text-[#e0fdff] mt-1">
              60-Day Curriculum Matrix &amp; Progress Heatmap
            </h3>
            <p className="text-xs text-[#b9cacb] mt-0.5 max-w-3xl">
              Structured journey across 6 specialized modules from digital basics to tape-out readiness and senior ASIC interview rounds. Click any tile to inspect or launch.
            </p>
          </div>

          {/* State Legend */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-[#b9cacb] bg-[#1c1f29] px-3 py-1.5 rounded border border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#00f2fe] shadow-[0_0_6px_rgba(0,242,254,0.6)]"></span>
              <span className="text-[#e0fdff] font-medium">In Progress (Day 1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#4edea3]"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#262a34]"></span>
              <span>Locked / Upcoming</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#93000a]"></span>
              <span>Gate Review</span>
            </div>
          </div>
        </div>

        {/* Phase Header Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 pt-1">
          {PHASES.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveTab('60-day-roadmap')}
              className={`p-2.5 rounded text-left transition-colors border ${
                idx === 0
                  ? 'bg-[#1c1f29] border-[#00f2fe]/40'
                  : 'bg-[#1c1f29]/60 border-white/[0.04] hover:bg-[#1c1f29]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] font-semibold ${idx === 0 ? 'text-[#00f2fe]' : 'text-[#dfe2ef]'}`}>
                  Phase {p.num}: {p.daysRange}
                </span>
                {idx === 0 ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] shadow-[0_0_4px_#4edea3]"></span>
                ) : (
                  <span className="material-symbols-outlined text-[12px] text-[#849495]">lock</span>
                )}
              </div>
              <div className="font-mono text-[10px] text-[#b9cacb] truncate mt-0.5">
                {p.subtitle.split('&')[0]}
              </div>
            </button>
          ))}
        </div>

        {/* 60-Node Interactive Matrix (10 columns x 6 rows) */}
        <div className="p-3 bg-[#0a0e17] rounded border border-white/[0.04] overflow-x-auto">
          <div className="min-w-[700px] grid grid-cols-10 gap-2">
            {DAYS_DATA.map(d => {
              const isCurrent = d.day === 1;
              const isCompleted = completedDays.includes(d.day);
              const isGate = d.isMilestone;

              let cardBg = 'bg-[#181b25]';
              let ringClass = 'border border-white/[0.05]';
              let statusText = 'LOCK';
              let statusColor = 'text-[#849495]';

              if (isCurrent) {
                cardBg = 'bg-[#262a34] ring-2 ring-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.3)]';
                ringClass = '';
                statusText = 'RUNNING';
                statusColor = 'text-[#4edea3]';
              } else if (d.day === 2) {
                cardBg = 'bg-[#181b25] border border-[#00f2fe]/30 hover:bg-[#1c1f29]';
                statusText = 'UNLOCKED';
                statusColor = 'text-[#00f2fe]';
              } else if (isGate) {
                cardBg = 'bg-[#181b25] border border-[#4edea3]/30 hover:bg-[#1c1f29]';
                statusText = d.day === 60 ? 'FINAL' : 'CHECK';
                statusColor = 'text-[#4edea3]';
              }

              return (
                <button
                  key={d.day}
                  onClick={() => openDayDrawer(d.day)}
                  className={`flex flex-col justify-between p-2 rounded text-left transition-all hover:-translate-y-0.5 group ${cardBg} ${ringClass}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        isCurrent
                          ? 'text-[#00f2fe]'
                          : isGate
                          ? 'text-[#4edea3]'
                          : d.day === 2
                          ? 'text-[#00f2fe]'
                          : 'text-[#849495]'
                      }`}
                    >
                      D{d.day < 10 ? `0${d.day}` : d.day}
                    </span>
                    {isCurrent ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]"></span>
                      </span>
                    ) : isCompleted ? (
                      <span className="material-symbols-outlined text-[#4edea3] text-[13px]">check_circle</span>
                    ) : isGate ? (
                      <span className="material-symbols-outlined text-[#4edea3] text-[13px]">verified</span>
                    ) : (
                      <span className="material-symbols-outlined text-[#849495]/40 text-[12px]">lock</span>
                    )}
                  </div>
                  <span
                    className={`font-sans text-[10px] truncate mt-1.5 font-medium ${
                      isCurrent ? 'text-[#e0fdff]' : isGate ? 'text-[#e0fdff] font-semibold' : 'text-[#dfe2ef]'
                    }`}
                  >
                    {d.shortTitle}
                  </span>
                  <span className={`font-mono text-[9px] mt-0.5 font-semibold ${statusColor}`}>
                    {statusText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Hardware Lab Telemetry Footer */}
      <div className="rounded bg-[#181b25] p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-[#b9cacb] font-mono text-xs border border-white/[0.06]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-[#4edea3]">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_6px_#4edea3]"></span>
            EDA ENGINE v24.2.1 CONNECTED
          </span>
          <span className="hidden sm:inline text-[#849495]">•</span>
          <span className="text-[#b9cacb]">{edaEngine}</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[#4edea3] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] inline-block"></span>
            REGRESSION PIPELINE: DAY 01 PASSED
          </span>
          <button
            onClick={handleDownloadSyllabus}
            className="text-[#00f2fe] hover:underline flex items-center gap-1 transition-colors"
          >
            <span>Download Complete Syllabus PDF</span>
            <span className="material-symbols-outlined text-[14px]">download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
