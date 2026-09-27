import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAY_1_QUIZ } from '../../data/quizData';
import { FLASHCARDS } from '../../data/interviewData';

export const LessonView: React.FC = () => {
  const {
    setActiveTab,
    checklistProgress,
    toggleChecklist,
    quizState,
    submitQuiz,
    resetQuiz,
    openDayDrawer,
    markDayComplete,
  } = useApp();

  // Code Tab state inside Lab section
  const [codeTab, setCodeTab] = useState<'design' | 'tb'>('design');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Quiz interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    quizState.answers || {}
  );
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});

  // AI Mentor Prompt state
  const [mentorQuery, setMentorQuery] = useState<string>(
    'Why reg does not always synthesize to a Flip-Flop?'
  );
  const [mentorAnswer, setMentorAnswer] = useState<string>(
    "In Verilog-2001, reg is merely a simulation-time scheduling token declaring that the identifier retains state across procedural events. During ASIC synthesis (e.g., via Synopsys Design Compiler or Cadence Genus), an always @(*) block assigning to a reg generates purely combinational standard cells (NAND, NOR, MUX) if all conditional branches (if/else, case) are fully specified. A physical D-Flip-Flop (DFF_X1) is strictly inferred only when the sensitivity list is edge-triggered (posedge clk or negedge rst_n). In FPGA architectures, synthesis tools also map incomplete assignments to internal Distributed RAM or transparent latches, which are strictly flagged as fatal errors in tier-1 ASIC DRC/lint signoffs."
  );

  // SVG schematic hover inspection state
  const [hoveredNet, setHoveredNet] = useState<string | null>(null);

  // Calculate checklist completion
  const checklistKeys = Object.keys(checklistProgress);
  const checkedCount = checklistKeys.filter(k => checklistProgress[k]).length;
  const checklistPct = Math.round((checkedCount / checklistKeys.length) * 100);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleExplanation = (id: number) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitQuizForm = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuiz(selectedAnswers);
    // expand all explanations after submit
    const allExp: Record<number, boolean> = {};
    DAY_1_QUIZ.forEach(q => {
      allExp[q.id] = true;
    });
    setExpandedExplanations(allExp);
  };

  const handleAiPromptClick = (topic: string) => {
    if (topic.includes('Flip-Flop')) {
      setMentorQuery('Why reg != Flip-Flop in synthesizable ASIC RTL?');
      setMentorAnswer(
        "In Verilog-2001, reg is merely a simulation-time scheduling token declaring that the identifier retains state across procedural events. During ASIC synthesis (e.g., via Synopsys Design Compiler or Cadence Genus), an always @(*) block assigning to a reg generates purely combinational standard cells (NAND, NOR, MUX) if all conditional branches (if/else, case) are fully specified. A physical D-Flip-Flop (DFF_X1) is strictly inferred only when the sensitivity list is edge-triggered (posedge clk or negedge rst_n). In FPGA architectures, synthesis tools also map incomplete assignments to internal Distributed RAM or transparent latches, which are strictly flagged as fatal errors in tier-1 ASIC DRC/lint signoffs."
      );
    } else if (topic.includes('X-propagation')) {
      setMentorQuery('How do Qualcomm & NVIDIA interviewers test X-propagation?');
      setMentorAnswer(
        "Qualcomm and NVIDIA interviewers target X-optimism. In Verilog RTL simulation, an if (sel) evaluated on 1'bx evaluates to false (else path taken), masking a fatal hardware fault! In silicon, physical standard cells with floating inputs resolve non-deterministically or draw excessive crowbar current. ASIC verification uses gate-level simulation (GLS) with SDF back-annotation or formal equivalence checkers (Formality/Conformal) to guarantee non-masked X-states."
      );
    } else {
      setMentorQuery('Show me the gate-level equivalent of assign out = sel ? b : a;');
      setMentorAnswer(
        'In TSMC/GlobalFoundries standard cell libraries, continuous assignment assign out = sel ? b : a; maps directly to an integrated 2-to-1 multiplexer cell (e.g., MUX2D1BWP). Physically, it is composed of balanced transmission gates (CMOS pass-transistor logic) and an inverter for sel, optimized for symmetric rise/fall propagation delay (t_pd < 14ps on TSMC N5).'
      );
    }
  };

  const handleCompleteDay1 = () => {
    markDayComplete(1);
    openDayDrawer(2);
  };

  const designCodeText = `// =============================================================================
// Module: mux4_tristate
// Description: 4-to-1 Parameterized Multiplexer with Active-Low Tri-State Buffer
// Standard: IEEE 1364-2001 Synthesizable RTL
// Target: TSMC 5nm / ASIC Pad Standard Cell IO ring
// =============================================================================
\`timescale 1ns/1ps

module mux4_tristate #(
    parameter DATA_WIDTH = 8
)(
    input  wire [DATA_WIDTH-1:0] in0,
    input  wire [DATA_WIDTH-1:0] in1,
    input  wire [DATA_WIDTH-1:0] in2,
    input  wire [DATA_WIDTH-1:0] in3,
    input  wire [1:0]            sel,
    input  wire                  oe_n, // Active-low output enable
    output wire [DATA_WIDTH-1:0] out   // High-impedance Z when oe_n == 1
);

    // 1. Internal structural net continuous declaration (No latch/DFF inferred)
    wire [DATA_WIDTH-1:0] mux_core;

    // 2. Continuous conditional assignment: Synthesizes to balanced AOI/MUX cells
    assign mux_core = (sel == 2'b00) ? in0 :
                       (sel == 2'b01) ? in1 :
                       (sel == 2'b10) ? in2 : in3;

    // 3. Tri-state output buffer driver mapped to IO Pad Cell boundary
    // When disabled (!oe), driver floats to 'z' preventing bus short-circuit
    assign out = (!oe_n) ? mux_core : {DATA_WIDTH{1'bz}};

endmodule`;

  const tbCodeText = `\`timescale 1ns/1ps

module tb_mux4_tri;
    localparam WIDTH = 8;

    reg  [WIDTH-1:0] t_in0, t_in1, t_in2, t_in3;
    reg  [1:0]       t_sel;
    reg              t_oe_n;
    wire [WIDTH-1:0] t_out;

    // Instantiate Unit Under Test (UUT)
    mux4_tristate #(.DATA_WIDTH(WIDTH)) uut (
        .in0(t_in0), .in1(t_in1), .in2(t_in2), .in3(t_in3),
        .sel(t_sel), .oe_n(t_oe_n), .out(t_out)
    );

    initial begin
        // Setup stimulus
        t_in0 = 8'hAA; t_in1 = 8'hBB; t_in2 = 8'hCC; t_in3 = 8'hDD;
        t_oe_n = 1'b0; t_sel = 2'b00; #5;
        if (t_out !== 8'hAA) $fatal(1, "FAIL: Expected 0xAA");

        t_sel = 2'b01; #5;
        if (t_out !== 8'hBB) $fatal(1, "FAIL: Expected 0xBB");

        t_sel = 2'b10; #5;
        if (t_out !== 8'hCC) $fatal(1, "FAIL: Expected 0xCC");

        t_sel = 2'b11; #5;
        if (t_out !== 8'hDD) $fatal(1, "FAIL: Expected 0xDD");

        // Check Tri-State Assertion
        t_oe_n = 1'b1; #5;
        if (t_out !== 8'bzzzz_zzzz) $fatal(1, "FAIL: Expected 8'bz on disabled OE");

        $display("--- ALL ASSERTIONS PASSED (100% COVERAGE) ---");
        $finish;
    end
endmodule`;

  return (
    <div className="flex flex-col w-full animate-fadeIn pb-16 space-y-8">
      {/* 1. TOP DAY HEADER & NAVIGATION BREADCRUMB */}
      <section className="pt-2 flex flex-col gap-4">
        {/* Breadcrumb & Phase Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[#b9cacb]">
            <span
              onClick={() => setActiveTab('60-day-roadmap')}
              className="hover:text-[#00f2fe] transition-colors cursor-pointer"
            >
              Curriculum
            </span>
            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            <span className="text-[#dfe2ef]">Phase 1: Verilog Fundamentals (Days 1–10)</span>
            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            <span className="text-[#00f2fe] font-semibold">Day 01</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">
              Milestone: Silicon Foundation
            </span>
            <span className="font-mono text-[10px] text-[#b9cacb] bg-[#1c1f29] px-2 py-0.5 rounded border border-white/[0.04]">
              TSMC 5nm Reference Flow
            </span>
          </div>
        </div>

        {/* Title and Subtitle Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="max-w-4xl flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-[#00f2fe] bg-[#181b25] px-2 py-0.5 rounded border border-[#00f2fe]/30 font-semibold">
                DAY 01 OF 60
              </span>
              <span className="font-mono text-xs text-[#b9cacb] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#4edea3]">local_fire_department</span>
                1 Day Active Streak
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#e0fdff] tracking-tight">
              Verilog Basics &amp; Modeling Constructs
            </h1>
            <p className="text-sm text-[#b9cacb] max-w-3xl leading-relaxed">
              Transitioning from FPGA look-up tables (LUTs) to ASIC standard-cell netlists, IEEE 1364 4-state logic semantics, and continuous assignment paradigms.
            </p>
          </div>

          {/* Action Nav Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto">
            <button
              disabled
              className="flex items-center gap-1 px-3 py-2 rounded bg-[#181b25] text-[#849495]/40 font-mono text-xs cursor-not-allowed border border-white/[0.04]"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Previous</span>
            </button>
            <button
              onClick={() => openDayDrawer(2)}
              className="flex items-center gap-1 px-3 py-2 rounded bg-[#262a34] hover:bg-[#31353f] text-[#00f2fe] font-mono text-xs transition-colors border border-white/[0.06]"
            >
              <span>Day 02</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => setActiveTab('rtl-ide-lab')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#00f2fe] text-[#00373a] font-semibold text-xs transition-all hover:opacity-95 shadow-[0_0_12px_rgba(0,242,254,0.3)]"
            >
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              <span>Open in RTL Lab</span>
            </button>
          </div>
        </div>

        {/* Meta Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#181b25] p-3.5 rounded border border-white/[0.06]">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#849495] uppercase">Phase Completion</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-sm text-[#00f2fe] font-semibold">10.0%</span>
              <span className="text-[11px] text-[#b9cacb]">(1 of 10 Days in Phase 1)</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#849495] uppercase">Estimated Effort</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-sm text-[#dfe2ef] font-semibold">2.5 Hours</span>
              <span className="text-[11px] text-[#b9cacb]">Theory + Lab + Quiz</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#849495] uppercase">ASIC Interview Relevance</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-sm text-[#4edea3] font-semibold">High Priority</span>
              <span className="text-[11px] text-[#b9cacb]">Google / Qualcomm Gate</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#849495] uppercase">Synthesis Target</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-sm text-[#00dce6] font-semibold">Nangate 45nm / TSMC N5</span>
              <span className="h-2 w-2 rounded-full bg-[#4edea3] inline-block shadow-[0_0_6px_#4edea3]"></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DAILY COMPLETION CHECKLIST */}
      <section className="bg-[#181b25] rounded border border-white/[0.06] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-[#e0fdff] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[20px]">checklist</span>
              Daily Execution Tracker
            </h2>
            <p className="text-xs text-[#b9cacb]">
              Complete all 5 milestones to unlock the Day 02 Netlist Synthesis module.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#00f2fe] font-medium">
              {checklistPct}% Complete ({checkedCount}/5 Tasks)
            </span>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                checklistPct === 100
                  ? 'text-[#4edea3] bg-[#4edea3]/15'
                  : 'text-[#00f2fe] bg-[#1c1f29]'
              }`}
            >
              {checklistPct === 100 ? 'Completed (Ready for Day 02)' : `In Progress (${checkedCount}/5 Completed)`}
            </span>
          </div>
        </div>

        {/* Progress Meter */}
        <div className="w-full h-1.5 bg-[#31353f] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00f2fe] shadow-[0_0_8px_#00f2fe] transition-all duration-300"
            style={{ width: `${checklistPct}%` }}
          ></div>
        </div>

        {/* Checkbox Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <label className="flex items-start gap-2.5 p-2.5 bg-[#1c1f29] rounded hover:bg-[#262a34] cursor-pointer transition-colors border border-white/[0.04]">
            <input
              type="checkbox"
              checked={checklistProgress.task1}
              onChange={() => toggleChecklist('task1')}
              className="mt-0.5 h-4 w-4 rounded bg-[#0a0e17] text-[#00f2fe] accent-[#00f2fe] focus:ring-0"
            />
            <div className="flex flex-col">
              <span className="text-xs text-[#dfe2ef] font-medium">1. Theory &amp; Microarchitecture</span>
              <span className="text-[11px] text-[#b9cacb]">FPGA vs ASIC nets, 4-state logic semantics</span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 bg-[#1c1f29] rounded hover:bg-[#262a34] cursor-pointer transition-colors border border-white/[0.04]">
            <input
              type="checkbox"
              checked={checklistProgress.task2}
              onChange={() => toggleChecklist('task2')}
              className="mt-0.5 h-4 w-4 rounded bg-[#0a0e17] text-[#00f2fe] accent-[#00f2fe] focus:ring-0"
            />
            <div className="flex flex-col">
              <span className="text-xs text-[#dfe2ef] font-medium">2. External Curated Guides</span>
              <span className="text-[11px] text-[#b9cacb]">ChipVerify &amp; VLSI Verify modeling articles</span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 bg-[#1c1f29] rounded hover:bg-[#262a34] cursor-pointer transition-colors border border-white/[0.04]">
            <input
              type="checkbox"
              checked={checklistProgress.task3}
              onChange={() => toggleChecklist('task3')}
              className="mt-0.5 h-4 w-4 rounded bg-[#0a0e17] text-[#00f2fe] accent-[#00f2fe] focus:ring-0"
            />
            <div className="flex flex-col">
              <span className="text-xs text-[#dfe2ef] font-medium">3. RTL Practice Lab</span>
              <span className="text-[11px] text-[#b9cacb]">4-to-1 MUX with active-low tri-state enable</span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 bg-[#1c1f29] rounded hover:bg-[#262a34] cursor-pointer transition-colors border border-white/[0.04]">
            <input
              type="checkbox"
              checked={checklistProgress.task4}
              onChange={() => toggleChecklist('task4')}
              className="mt-0.5 h-4 w-4 rounded bg-[#0a0e17] text-[#00f2fe] accent-[#00f2fe] focus:ring-0"
            />
            <div className="flex flex-col">
              <span className="text-xs text-[#dfe2ef] font-medium">4. 10-Question Assessment</span>
              <span className="text-[11px] text-[#b9cacb]">Benchmark score &ge; 80% to pass checkpoint</span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 bg-[#1c1f29] rounded hover:bg-[#262a34] cursor-pointer transition-colors border border-white/[0.04]">
            <input
              type="checkbox"
              checked={checklistProgress.task5}
              onChange={() => toggleChecklist('task5')}
              className="mt-0.5 h-4 w-4 rounded bg-[#0a0e17] text-[#00f2fe] accent-[#00f2fe] focus:ring-0"
            />
            <div className="flex flex-col">
              <span className="text-xs text-[#dfe2ef] font-medium">5. Tier-1 Interview Flashcards</span>
              <span className="text-[11px] text-[#b9cacb]">Qualcomm &amp; NVIDIA X-propagation deep dive</span>
            </div>
          </label>
        </div>
      </section>

      {/* 3. SECTION 1: THEORY (FPGA TO ASIC PARADIGM SHIFT) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-bold uppercase">
              SECTION 1
            </span>
            <h2 className="text-lg font-bold text-[#e0fdff] tracking-tight">
              Theory: The FPGA to ASIC Paradigm Shift
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[#849495]">READ TIME: ~25 MIN</span>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FPGA Column */}
          <div className="bg-[#181b25] rounded p-4 flex flex-col gap-3 border border-white/[0.06]">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <div className="flex items-center gap-2 text-[#dfe2ef]">
                <span className="material-symbols-outlined text-[#4edea3] text-[20px]">view_in_ar</span>
                <span className="text-sm font-semibold">FPGA Architectural Model</span>
              </div>
              <span className="font-mono text-[10px] text-[#b9cacb] bg-[#1c1f29] px-2 py-0.5 rounded">
                Xilinx Ultrascale+ / Intel Agilex
              </span>
            </div>
            <ul className="flex flex-col gap-2.5 text-xs text-[#b9cacb]">
              <li className="flex items-start gap-2">
                <span className="text-[#4edea3] font-mono mt-0.5">&gt;</span>
                <span>
                  <strong className="text-[#dfe2ef]">Fabric Primitive:</strong> Logic functions map into fixed 6-input SRAM Look-Up Tables (LUT6), dedicated carry chains (CARRY8), and hardened DSP58 slices.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4edea3] font-mono mt-0.5">&gt;</span>
                <span>
                  <strong className="text-[#dfe2ef]">Interconnect:</strong> Programmable routing matrices with high RC parasitic delay. Re-routing is free post-fabrication via bitstream reconfiguration.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4edea3] font-mono mt-0.5">&gt;</span>
                <span>
                  <strong className="text-[#dfe2ef]">Clocking:</strong> Hardened regional/global Clock Buffers (BUFG, MMCM, PLL). Hold-time violations rarely occur because tool inserts routing delay automatically.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4edea3] font-mono mt-0.5">&gt;</span>
                <span>
                  <strong className="text-[#dfe2ef]">Internal Tri-States:</strong> Physically nonexistent inside core logic. Synthesis tools translate them automatically to multiplexer networks.
                </span>
              </li>
            </ul>
          </div>

          {/* ASIC Column */}
          <div className="bg-[#181b25] rounded p-4 flex flex-col gap-3 border border-white/[0.06]">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <div className="flex items-center gap-2 text-[#00f2fe]">
                <span className="material-symbols-outlined text-[#00f2fe] text-[20px]">developer_board</span>
                <span className="text-sm font-semibold">ASIC Standard Cell Flow</span>
              </div>
              <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded border border-[#00f2fe]/20">
                TSMC N5 / Intel 18A / GF 12LP
              </span>
            </div>
            <ul className="flex flex-col gap-2.5 text-xs text-[#b9cacb]">
              <li className="flex items-start gap-2">
                <span className="text-[#00f2fe] font-mono mt-0.5">&gt;</span>
                <span>
                  <strong className="text-[#dfe2ef]">Fabric Primitive:</strong> Discrete transistor layouts (NAND2_X1, AOI22_X2, DFFQ_X4) tailored for specific drive strength, leakage power, and propagation delay.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00f2fe] font-mono mt-0.5">&gt;</span>
                <span>
                  <strong className="text-[#dfe2ef]">Interconnect:</strong> Multi-layer physical metal stacks (M1 through M13). A tape-out mask revision costs $2M–$8M; design errors are fatal.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00f2fe] font-mono mt-0.5">&gt;</span>
                <span>
                  <strong className="text-[#dfe2ef]">Clock Tree Synthesis (CTS):</strong> Synthesized from scratch using CTS inverter buffers. Hold time violations must be manually fixed with delay buffers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00f2fe] font-mono mt-0.5">&gt;</span>
                <span>
                  <strong className="text-[#dfe2ef]">Tri-States:</strong> Strictly forbidden inside deep-submicron logic cores due to floating gate leakage; strictly confined to pad ring IO cells.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4-State Logic Breakdown */}
        <div className="bg-[#181b25] rounded p-5 border border-white/[0.06] space-y-3">
          <h3 className="text-sm font-semibold text-[#e0fdff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00dce6] text-[18px]">grid_4x4</span>
            The IEEE 1364 4-Value Logic System &amp; Silicon Realities
          </h3>
          <p className="text-xs text-[#b9cacb] leading-relaxed">
            In Verilog-2001, every scalar wire and register evaluates to one of four states. In FPGA debugging, designers often overlook <code className="text-[#00f2fe] font-mono">X</code> states due to power-on bitstream initialization. In ASIC fabrication, uninitialized nets lead to unknown silicon states.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded bg-[#1c1f29] border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#4edea3]">0 (Logic Low)</span>
                <span className="font-mono text-[9px] text-[#4edea3] bg-[#4edea3]/10 px-1 py-0.5 rounded">VSS</span>
              </div>
              <p className="text-[11px] text-[#b9cacb]">
                Ground reference (0V). Pull-down NMOS network conducting to ground. Guaranteed deterministic state.
              </p>
            </div>

            <div className="p-3 rounded bg-[#1c1f29] border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#00f2fe]">1 (Logic High)</span>
                <span className="font-mono text-[9px] text-[#00f2fe] bg-[#00f2fe]/10 px-1 py-0.5 rounded">VDD</span>
              </div>
              <p className="text-[11px] text-[#b9cacb]">
                Positive supply voltage (0.75V–1.0V). Pull-up PMOS network conducting to power rail. Deterministic high.
              </p>
            </div>

            <div className="p-3 rounded bg-[#1c1f29] border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#ffb4ab]">X (Unknown)</span>
                <span className="font-mono text-[9px] text-[#ffb4ab] bg-[#ffb4ab]/10 px-1 py-0.5 rounded">CRITICAL</span>
              </div>
              <p className="text-[11px] text-[#b9cacb]">
                Bus contention (two active drivers driving 0 &amp; 1), uninitialized registers, timing violations, or metastability.
              </p>
            </div>

            <div className="p-3 rounded bg-[#1c1f29] border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#d8d7ff]">Z (High Impedance)</span>
                <span className="font-mono text-[9px] text-[#d8d7ff] bg-[#d8d7ff]/10 px-1 py-0.5 rounded">FLOATING</span>
              </div>
              <p className="text-[11px] text-[#b9cacb]">
                Both PMOS and NMOS channels turned off in a tri-state output driver. High capacitive susceptibility to cross-talk noise.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Schematic: 4:1 Mux & Tri-state Pad */}
        <div className="bg-[#181b25] rounded p-5 border border-white/[0.06] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <span className="font-mono text-[10px] text-[#00f2fe] uppercase font-semibold">ASIC NETLIST VISUALIZER</span>
              <h3 className="text-sm font-semibold text-[#e0fdff]">
                Microarchitecture: 4-to-1 Mux &amp; Boundary Tri-State Pad
              </h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-[#b9cacb]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#4edea3]"></span> Wire Net (Continuous)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#00f2fe]"></span> Control Bus
              </span>
            </div>
          </div>

          {/* Interactive SVG Schematic */}
          <div className="w-full bg-[#0a0e17] rounded p-4 overflow-x-auto border border-white/[0.04]">
            <svg
              className="w-full min-w-[720px] h-auto text-[#dfe2ef] font-mono select-none"
              viewBox="0 0 860 260"
              fill="none"
              stroke="currentColor"
            >
              <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="rgba(255,255,255,0.06)"></circle>
              </pattern>
              <rect width="860" height="260" fill="url(#grid-dots)"></rect>

              {/* in0 */}
              <path
                d="M 40 40 L 220 40"
                stroke={hoveredNet === 'in0' ? '#00f2fe' : '#849495'}
                strokeWidth={hoveredNet === 'in0' ? '3' : '1.5'}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredNet('in0')}
                onMouseLeave={() => setHoveredNet(null)}
              />
              <text x="40" y="32" fill="#849495" fontSize="10">in0[DATA_WIDTH-1:0]</text>

              {/* in1 */}
              <path
                d="M 40 80 L 220 80"
                stroke={hoveredNet === 'in1' ? '#00f2fe' : '#849495'}
                strokeWidth={hoveredNet === 'in1' ? '3' : '1.5'}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredNet('in1')}
                onMouseLeave={() => setHoveredNet(null)}
              />
              <text x="40" y="72" fill="#849495" fontSize="10">in1[DATA_WIDTH-1:0]</text>

              {/* in2 */}
              <path
                d="M 40 120 L 220 120"
                stroke={hoveredNet === 'in2' ? '#00f2fe' : '#849495'}
                strokeWidth={hoveredNet === 'in2' ? '3' : '1.5'}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredNet('in2')}
                onMouseLeave={() => setHoveredNet(null)}
              />
              <text x="40" y="112" fill="#849495" fontSize="10">in2[DATA_WIDTH-1:0]</text>

              {/* in3 */}
              <path
                d="M 40 160 L 220 160"
                stroke={hoveredNet === 'in3' ? '#00f2fe' : '#849495'}
                strokeWidth={hoveredNet === 'in3' ? '3' : '1.5'}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredNet('in3')}
                onMouseLeave={() => setHoveredNet(null)}
              />
              <text x="40" y="152" fill="#849495" fontSize="10">in3[DATA_WIDTH-1:0]</text>

              {/* 4:1 Mux Polygon */}
              <polygon
                points="220,20 320,50 320,150 220,180"
                fill="#1c1f29"
                stroke="#00dce6"
                strokeWidth="2"
                className="cursor-pointer hover:fill-[#262a34] transition-colors"
              />
              <text x="245" y="105" fill="#e0fdff" fontSize="13" fontWeight="bold">4:1 MUX</text>
              <text x="232" y="122" fill="#b9cacb" fontSize="9">Continuous Logic</text>

              {/* Select line */}
              <path
                d="M 270 230 L 270 165"
                stroke="#00f2fe"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <circle cx="270" cy="165" r="3" fill="#00f2fe" />
              <text x="210" y="245" fill="#00f2fe" fontSize="10">sel[1:0] (Decoder)</text>

              {/* Internal Net: mux_data */}
              <path
                d="M 320 100 L 480 100"
                stroke={hoveredNet === 'mux_core' ? '#00f2fe' : '#4edea3'}
                strokeWidth={hoveredNet === 'mux_core' ? '3.5' : '2'}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredNet('mux_core')}
                onMouseLeave={() => setHoveredNet(null)}
              />
              <text x="340" y="90" fill="#4edea3" fontSize="10">wire [7:0] mux_core</text>
              <circle cx="400" cy="100" r="3" fill="#4edea3" />

              {/* BUFIF1 Tri-State Buffer */}
              <polygon
                points="480,70 540,100 480,130"
                fill="#1c1f29"
                stroke="#00dce6"
                strokeWidth="2"
                className="cursor-pointer hover:fill-[#262a34] transition-colors"
              />
              <text x="488" y="104" fill="#e0fdff" fontSize="10" fontWeight="bold">BUFIF1</text>

              {/* Active-low output enable */}
              <path d="M 510 230 L 510 135" stroke="#ffb4ab" strokeWidth="1.5" />
              <circle cx="510" cy="133" r="2.5" fill="#ffb4ab" />
              <circle cx="510" cy="140" r="3" fill="#0a0e17" stroke="#ffb4ab" strokeWidth="1.5" />
              <text x="475" y="245" fill="#ffb4ab" fontSize="10">oe_n (Active-Low)</text>

              {/* Output Net to IO Pad */}
              <path
                d="M 540 100 L 680 100"
                stroke="#00f2fe"
                strokeWidth="2.5"
              />
              <text x="560" y="90" fill="#00f2fe" fontSize="10" fontWeight="bold">
                out[DATA_WIDTH-1:0]
              </text>

              {/* IO Pad Cell */}
              <rect
                x="680"
                y="75"
                width="130"
                height="50"
                rx="3"
                fill="#262a34"
                stroke="#4edea3"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="695" y="96" fill="#e0fdff" fontSize="11" fontWeight="bold">IO PAD CELL</text>
              <text x="695" y="112" fill="#4edea3" fontSize="9">Drive / Hi-Z State</text>

              {/* Annotation */}
              <rect x="440" y="15" width="220" height="34" rx="2" fill="#181b25" stroke="rgba(255,255,255,0.06)" />
              <text x="448" y="30" fill="#b9cacb" fontSize="9">ASIC Note: Tri-state strictly at</text>
              <text x="448" y="42" fill="#4edea3" fontSize="9">chip boundary standard cell pad.</text>
            </svg>
          </div>

          {hoveredNet && (
            <div className="p-2 bg-[#1c1f29] rounded font-mono text-xs text-[#00f2fe] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>
                Net highlighted: <strong className="text-[#e0fdff]">{hoveredNet}</strong> (Continuous assignment without inferred state retention)
              </span>
            </div>
          )}
        </div>

        {/* Verilog Code Reference Block */}
        <div className="bg-[#181b25] rounded p-4 border border-white/[0.06]">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
            <div className="flex items-center gap-2 font-mono text-xs text-[#00f2fe]">
              <span className="material-symbols-outlined text-[17px]">code</span>
              <span>mux4_tristate.v — Verilog-2001 Reference Implementation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">
                Synthesizable Netlist Target
              </span>
              <button
                onClick={() => handleCopyCode(designCodeText)}
                className="px-2 py-1 rounded bg-[#262a34] hover:bg-[#31353f] text-[#b9cacb] hover:text-[#e0fdff] font-mono text-[10px] transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedCode ? 'check' : 'content_copy'}
                </span>
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <div className="bg-[#0a0e17] p-4 rounded font-mono text-xs text-[#dfe2ef] overflow-x-auto leading-relaxed border border-white/[0.04]">
            <pre>{designCodeText}</pre>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: CURATED TECHNICAL READING & MEDIA */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-bold uppercase">
              SECTION 2
            </span>
            <h2 className="text-lg font-bold text-[#e0fdff] tracking-tight">
              Curated Technical Reading &amp; Media
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[#849495]">PEER-REVIEWED REFERENCES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Guide 1 */}
          <div className="bg-[#181b25] rounded p-4 flex flex-col justify-between hover:bg-[#1c1f29] transition-colors border border-white/[0.06]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-semibold">
                  DOCUMENTATION
                </span>
                <span className="font-mono text-[10px] text-[#b9cacb] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> 15 min read
                </span>
              </div>
              <h3 className="text-xs font-semibold text-[#e0fdff]">ChipVerify: Wire vs Reg &amp; Operators</h3>
              <p className="text-[11px] text-[#b9cacb] leading-relaxed">
                Comprehensive reference on Verilog data storage semantics, continuous assignments, and operator precedence tables.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/[0.04] flex items-center justify-between font-mono text-xs">
              <span className="text-[#4edea3]">chipverify.com</span>
              <a
                href="https://chipverify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f2fe] hover:underline flex items-center gap-1"
              >
                <span>Open Guide</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Guide 2 */}
          <div className="bg-[#181b25] rounded p-4 flex flex-col justify-between hover:bg-[#1c1f29] transition-colors border border-white/[0.06]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-semibold">
                  ARTICLE
                </span>
                <span className="font-mono text-[10px] text-[#b9cacb] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> 20 min read
                </span>
              </div>
              <h3 className="text-xs font-semibold text-[#e0fdff]">VLSI Verify: Continuous Assignments</h3>
              <p className="text-[11px] text-[#b9cacb] leading-relaxed">
                Exploration of event queues, delta simulation cycles (#0), and how continuous drivers schedule events in Verilog simulators.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/[0.04] flex items-center justify-between font-mono text-xs">
              <span className="text-[#4edea3]">vlsiverify.com</span>
              <a
                href="https://vlsiverify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f2fe] hover:underline flex items-center gap-1"
              >
                <span>Open Guide</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Guide 3 */}
          <div className="bg-[#181b25] rounded p-4 flex flex-col justify-between hover:bg-[#1c1f29] transition-colors border border-white/[0.06]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded font-semibold">
                  VIDEO PLAYLIST
                </span>
                <span className="font-mono text-[10px] text-[#b9cacb] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> 32 min video
                </span>
              </div>
              <h3 className="text-xs font-semibold text-[#e0fdff]">All About VLSI: ASIC vs FPGA Front-End</h3>
              <p className="text-[11px] text-[#b9cacb] leading-relaxed">
                Visual walkthrough comparing FPGA synthesis mapping into Xilinx primitives vs ASIC logic synthesis targeting Standard Cell Libraries.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/[0.04] flex items-center justify-between font-mono text-xs">
              <span className="text-[#4edea3]">youtube.com</span>
              <a
                href="https://www.youtube.com/@Allaboutvlsii/playlists"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f2fe] hover:underline flex items-center gap-1"
              >
                <span>Watch Playlist</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 3: RTL PRACTICE PROBLEM & WORKBENCH */}
      <section className="space-y-4" id="rtl-lab-workbench">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-bold uppercase">
              SECTION 3
            </span>
            <h2 className="text-lg font-bold text-[#e0fdff] tracking-tight">
              RTL Hands-on Lab: Parameterized MUX &amp; Active-Low Tri-State
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded flex items-center gap-1 border border-[#4edea3]/20">
            <span className="material-symbols-outlined text-[14px]">verified</span> Auto-Graded Simulation
          </span>
        </div>

        <div className="bg-[#181b25] rounded p-5 border border-white/[0.06] space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#dfe2ef]">Design Specification: RTL-D01-MUX4</h3>
            <p className="text-xs text-[#b9cacb] mt-1 leading-relaxed">
              Implement a parameterized <code className="text-[#00f2fe] font-mono">mux4_tri</code> circuit. Your design must conform strictly to the continuous assignment modeling paradigm (<code className="text-[#00f2fe] font-mono">assign</code> statements only). Procedural <code className="text-[#00f2fe] font-mono">always</code> blocks are strictly prohibited to reinforce combinational netlist fundamentals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#1c1f29] rounded border border-white/[0.04]">
              <span className="font-mono text-[10px] text-[#849495] uppercase">Parameters</span>
              <p className="font-mono text-xs text-[#00f2fe] mt-0.5 font-semibold">DATA_WIDTH (Default: 8)</p>
              <span className="text-[11px] text-[#b9cacb]">Width of all input/output data ports.</span>
            </div>
            <div className="p-3 bg-[#1c1f29] rounded border border-white/[0.04]">
              <span className="font-mono text-[10px] text-[#849495] uppercase">Port Interfaces</span>
              <p className="font-mono text-xs text-[#00f2fe] mt-0.5 font-semibold">in0..in3, sel[1:0], oe_n</p>
              <span className="text-[11px] text-[#b9cacb]"><code className="text-[#00f2fe] font-mono">oe_n</code> is active-low enable.</span>
            </div>
            <div className="p-3 bg-[#1c1f29] rounded border border-white/[0.04]">
              <span className="font-mono text-[10px] text-[#849495] uppercase">Verification Criteria</span>
              <p className="font-mono text-xs text-[#4edea3] mt-0.5 font-semibold">100% 4-State Assertion Pass</p>
              <span className="text-[11px] text-[#b9cacb]">Must pass High-Z checks when <code className="text-[#00f2fe] font-mono">oe_n=1</code>.</span>
            </div>
          </div>

          {/* Code Workspace Tabs */}
          <div className="bg-[#0a0e17] rounded overflow-hidden border border-white/[0.06]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#262a34] border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCodeTab('design')}
                  className={`px-3 py-1 rounded font-mono text-xs transition-colors ${
                    codeTab === 'design'
                      ? 'bg-[#181b25] text-[#00f2fe] font-semibold shadow-sm'
                      : 'text-[#b9cacb] hover:text-[#dfe2ef]'
                  }`}
                >
                  design.sv (RTL Skeleton)
                </button>
                <button
                  onClick={() => setCodeTab('tb')}
                  className={`px-3 py-1 rounded font-mono text-xs transition-colors ${
                    codeTab === 'tb'
                      ? 'bg-[#181b25] text-[#00f2fe] font-semibold shadow-sm'
                      : 'text-[#b9cacb] hover:text-[#dfe2ef]'
                  }`}
                >
                  testbench.sv (Self-Checking)
                </button>
              </div>
              <span className="font-mono text-[10px] text-[#849495]">
                Simulator: Icarus Verilog 12 / Synopsys VCS
              </span>
            </div>

            <div className="p-4 font-mono text-xs text-[#dfe2ef] overflow-x-auto leading-relaxed">
              <pre>{codeTab === 'design' ? designCodeText : tbCodeText}</pre>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="font-mono text-[11px] text-[#b9cacb] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#4edea3]">memory</span>
              Integrated with Synopsys VCS &amp; GTKWave Waveform Viewer
            </span>
            <button
              onClick={() => setActiveTab('rtl-ide-lab')}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#00f2fe] text-[#00373a] hover:bg-[#6ff6ff] font-semibold text-xs transition-all shadow-[0_0_14px_rgba(0,242,254,0.3)]"
            >
              <span>Launch in RTL Lab Workbench</span>
              <span className="material-symbols-outlined text-[17px]">open_in_new</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: 10-QUESTION DAILY ASSESSMENT */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-bold uppercase">
              SECTION 4
            </span>
            <h2 className="text-lg font-bold text-[#e0fdff] tracking-tight">
              10-Question Daily ASIC Assessment
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">
              Gate Target: 80% (8/10 Correct)
            </span>
            {quizState.submitted && (
              <span className="font-mono text-xs text-[#4edea3] font-bold">
                Score: {quizState.score}/{quizState.total} ({Math.round((quizState.score / quizState.total) * 100)}%)
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmitQuizForm} className="space-y-3">
          {DAY_1_QUIZ.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctIndex;
            const isExpanded = expandedExplanations[q.id];

            return (
              <div
                key={q.id}
                className="bg-[#181b25] rounded p-4 flex flex-col gap-3 border border-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-semibold shrink-0">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#dfe2ef]">{q.question}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleExplanation(q.id)}
                    className="text-[#849495] hover:text-[#00f2fe] transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-7 font-sans text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    let optionStyle = 'bg-[#1c1f29] text-[#b9cacb] border border-white/[0.04] hover:bg-[#262a34]';

                    if (quizState.submitted) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = 'bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/40 font-medium';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/40';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-[#00f2fe]/15 text-[#00f2fe] border border-[#00f2fe]/40 font-medium';
                    }

                    return (
                      <button
                        type="button"
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-2.5 rounded text-left transition-colors cursor-pointer ${optionStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isExpanded && (
                  <div className="mt-1 p-3 bg-[#1c1f29] rounded text-xs text-[#b9cacb] border border-white/[0.04] space-y-1">
                    <div className="flex items-center gap-1.5 text-[#4edea3] font-mono text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">psychology</span>
                      <span>ASIC INTERVIEW INSIGHT &bull; {q.category.toUpperCase()}</span>
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={resetQuiz}
              className="px-4 py-2 rounded bg-[#262a34] hover:bg-[#31353f] text-[#dfe2ef] font-mono text-xs transition-colors"
            >
              Reset Answers
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-[#00f2fe] text-[#00373a] font-semibold text-xs transition-all hover:opacity-95 shadow-[0_0_12px_rgba(0,242,254,0.3)]"
            >
              Submit &amp; Evaluate Quiz (10 Questions)
            </button>
          </div>
        </form>
      </section>

      {/* 7. SECTION 5: ASIC INTERVIEW PREPARATION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-bold uppercase">
              SECTION 5
            </span>
            <h2 className="text-lg font-bold text-[#e0fdff] tracking-tight">
              ASIC Interview Mastery &amp; Flashcards
            </h2>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#b9cacb]">
            <span className="text-[#849495]">Targeting:</span>
            <span className="text-[#00f2fe]">Google &bull; NVIDIA &bull; Qualcomm &bull; ADI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FLASHCARDS.slice(0, 4).map(card => (
            <div
              key={card.id}
              className="bg-[#181b25] rounded p-4 flex flex-col justify-between border border-white/[0.06] space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20 font-semibold">
                    {card.company}
                  </span>
                  <span className="font-mono text-[10px] text-[#849495]">{card.role}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-[#dfe2ef] leading-snug">
                  "{card.question}"
                </h3>
              </div>
              <div className="p-3 bg-[#1c1f29] rounded text-xs text-[#b9cacb] leading-relaxed border border-white/[0.04]">
                <strong className="text-[#00f2fe] font-mono text-[11px] block mb-1">
                  Architectural Answer:
                </strong>
                {card.answer}
              </div>
            </div>
          ))}
        </div>

        {/* Self-Audit Checklist */}
        <div className="bg-[#181b25] rounded p-4 border border-white/[0.06] space-y-2.5">
          <h3 className="text-xs font-semibold text-[#e0fdff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-[18px]">rule</span>
            Day 01 Self-Audit Verification Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#b9cacb]">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[16px] shrink-0 mt-0.5">
                check_circle
              </span>
              <span>
                I can clearly explain the difference between simulation storage (<code className="text-[#00f2fe] font-mono">reg</code>) and silicon storage (<code className="text-[#00f2fe] font-mono">DFF</code>).
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[16px] shrink-0 mt-0.5">
                check_circle
              </span>
              <span>
                I understand the IEEE 1364 4-value resolution table (0, 1, X, Z) and contention current.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[16px] shrink-0 mt-0.5">
                check_circle
              </span>
              <span>
                I can design a parameterizable multiplexer without unintentional latch inference.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-[16px] shrink-0 mt-0.5">
                check_circle
              </span>
              <span>
                I understand why tri-states are restricted to chip IO pad boundaries.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION 6: AI RTL MENTOR & DEBUGGING ADVISOR */}
      <section className="bg-[#181b25] rounded p-5 border border-white/[0.06] space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#262a34] flex items-center justify-center text-[#00f2fe] border border-[#00f2fe]/20">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-[#e0fdff] block">AI RTL Mentor — Day 01 Advisor</span>
              <span className="font-mono text-[10px] text-[#4edea3]">
                Trained on IEEE 1364-2001 &amp; Synopsys Design Compiler Synthesis Manuals
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-[#b9cacb] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#4edea3] shadow-[0_0_6px_#4edea3]"></span>
            Ready to analyze RTL
          </span>
        </div>

        {/* Quick prompt chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAiPromptClick('reg != Flip-Flop')}
            className="px-3 py-1.5 rounded bg-[#1c1f29] hover:bg-[#262a34] font-mono text-xs text-[#00f2fe] transition-colors border border-white/[0.05] flex items-center gap-1.5"
          >
            <span>💡 Why reg != Flip-Flop?</span>
          </button>
          <button
            onClick={() => handleAiPromptClick('X-propagation')}
            className="px-3 py-1.5 rounded bg-[#1c1f29] hover:bg-[#262a34] font-mono text-xs text-[#00f2fe] transition-colors border border-white/[0.05] flex items-center gap-1.5"
          >
            <span>🔍 How Qualcomm tests X-propagation</span>
          </button>
          <button
            onClick={() => handleAiPromptClick('Gate-level synthesis')}
            className="px-3 py-1.5 rounded bg-[#1c1f29] hover:bg-[#262a34] font-mono text-xs text-[#00f2fe] transition-colors border border-white/[0.05] flex items-center gap-1.5"
          >
            <span>⚡ Gate-level synthesis of assign ? :</span>
          </button>
        </div>

        {/* Advisor Response Box */}
        <div className="bg-[#0a0e17] rounded p-4 space-y-1.5 border border-white/[0.04]">
          <div className="flex items-center gap-1.5 text-[#00f2fe] font-mono text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>Advisor Query: {mentorQuery}</span>
          </div>
          <p className="text-xs text-[#dfe2ef] leading-relaxed font-sans">{mentorAnswer}</p>
        </div>
      </section>

      {/* 9. BOTTOM LESSON COMPLETION CTA */}
      <section className="py-6 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="text-base font-semibold text-[#e0fdff]">Completed Day 01?</span>
          <p className="text-xs text-[#b9cacb] max-w-lg">
            Next up: Day 02 covers <strong className="text-[#dfe2ef]">Combinational Logic &amp; Procedural Blocks (always @*, blocking vs non-blocking assignments)</strong>.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-3 mt-1 font-mono text-xs text-[#b9cacb]">
            <button
              onClick={() => setActiveTab('60-day-roadmap')}
              className="hover:text-[#00f2fe] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">map</span> View 60-Day ASIC Roadmap
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('rtl-ide-lab')}
              className="hover:text-[#00f2fe] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">terminal</span> Run Lab Simulation
            </button>
          </div>
        </div>

        <button
          onClick={handleCompleteDay1}
          className="flex items-center gap-2 px-6 py-3 rounded bg-[#00f2fe] text-[#00373a] font-semibold text-xs sm:text-sm hover:bg-[#6ff6ff] transition-all shadow-[0_0_16px_rgba(0,242,254,0.35)] shrink-0"
        >
          <span>Mark Day 01 Complete &amp; Proceed to Day 02</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </section>
    </div>
  );
};
