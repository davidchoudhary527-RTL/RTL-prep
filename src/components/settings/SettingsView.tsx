import React from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeMode } from '../../types/curriculum';

export const SettingsView: React.FC = () => {
  const {
    theme,
    setTheme,
    targetNode,
    setTargetNode,
    edaEngine,
    setEdaEngine,
    completedDays,
  } = useApp();

  const handleResetProgress = () => {
    if (window.confirm('Reset all progress back to Day 01 initial workbench state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col w-full animate-fadeIn pb-16 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#00f2fe] bg-[#1c1f29] px-2 py-0.5 rounded font-bold uppercase">
              WORKBENCH CONFIGURATION
            </span>
            <span className="font-mono text-xs text-[#4edea3]">SYSTEM CONTROL &amp; FOUNDRY PRESETS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#e0fdff] tracking-tight mt-1">
            Environment &amp; EDA Engine Settings
          </h1>
        </div>
      </div>

      {/* Theme Modes */}
      <div className="bg-[#181b25] rounded p-5 border border-white/[0.06] space-y-4 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-[#e0fdff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">palette</span>
            Appearance &amp; Accessibility Theme
          </h2>
          <p className="text-xs text-[#b9cacb] mt-1">
            Choose between dark instrumental workbench mode, clean light mode, or high-contrast phosphorus silicon mode.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Dark Mode */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded text-left transition-all border ${
              theme === 'dark'
                ? 'bg-[#1c1f29] border-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                : 'bg-[#1c1f29]/50 border-white/[0.06] hover:bg-[#1c1f29]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#e0fdff]">Dark Mode (Default)</span>
              <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">dark_mode</span>
            </div>
            <div className="h-6 w-full rounded bg-[#0f131c] flex items-center px-2 gap-1.5 border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe]"></span>
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              <span className="w-8 h-1.5 rounded bg-white/[0.1]"></span>
            </div>
            <p className="text-[10px] text-[#b9cacb] mt-2">
              Calibrated deep optical black (#0f131c) for low ocular fatigue during long chip synthesis sessions.
            </p>
          </button>

          {/* Light Mode */}
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded text-left transition-all border ${
              theme === 'light'
                ? 'bg-[#1c1f29] border-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                : 'bg-[#1c1f29]/50 border-white/[0.06] hover:bg-[#1c1f29]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#e0fdff]">Clean Light Mode</span>
              <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">light_mode</span>
            </div>
            <div className="h-6 w-full rounded bg-[#f4f6fa] flex items-center px-2 gap-1.5 border border-black/[0.08]">
              <span className="w-2 h-2 rounded-full bg-[#008f9c]"></span>
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              <span className="w-8 h-1.5 rounded bg-black/[0.1]"></span>
            </div>
            <p className="text-[10px] text-[#b9cacb] mt-2">
              High-contrast daylight engineering theme with crisp typography and clear schematic view.
            </p>
          </button>

          {/* Silicon Mode */}
          <button
            onClick={() => setTheme('silicon')}
            className={`p-4 rounded text-left transition-all border ${
              theme === 'silicon'
                ? 'bg-[#1c1f29] border-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                : 'bg-[#1c1f29]/50 border-white/[0.06] hover:bg-[#1c1f29]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#e0fdff]">Silicon High-Contrast</span>
              <span className="material-symbols-outlined text-[#4edea3] text-[18px]">terminal</span>
            </div>
            <div className="h-6 w-full rounded bg-[#000000] flex items-center px-2 gap-1.5 border border-[#00f2fe]/40">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe]"></span>
              <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
              <span className="w-8 h-1.5 rounded bg-[#00f2fe]/40"></span>
            </div>
            <p className="text-[10px] text-[#b9cacb] mt-2">
              Pure black substrate with vivid laser lines optimized for high-end OLED and micro-LED displays.
            </p>
          </button>
        </div>
      </div>

      {/* Target Foundry Process */}
      <div className="bg-[#181b25] rounded p-5 border border-white/[0.06] space-y-4 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-[#e0fdff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">memory</span>
            Target Semiconductor Process Node
          </h2>
          <p className="text-xs text-[#b9cacb] mt-1">
            Standard cell libraries, DRC rule checks, and timing corners (t_setup, t_hold) calibrate to this spec.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'TSMC 5nm FinFET Spec', node: 'N5 Node', tech: 'FinFET 3nm/5nm Library', clock: '1.25 GHz Target' },
            { id: 'Intel 18A RibbonFET', node: '18A GAA', tech: 'PowerVia Backside Delivery', clock: '1.40 GHz Target' },
            { id: 'GlobalFoundries 12LP', node: '12nm FinFET', tech: 'Low Power Automotive Core', clock: '1.00 GHz Target' },
            { id: 'Samsung 4nm GAA', node: '4LPP MBCFET', tech: 'Multi-Bridge-Channel FET', clock: '1.30 GHz Target' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setTargetNode(item.id)}
              className={`p-3 rounded text-left transition-all border ${
                targetNode === item.id
                  ? 'bg-[#1c1f29] border-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.15)]'
                  : 'bg-[#1c1f29]/60 border-white/[0.04] hover:bg-[#1c1f29]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#e0fdff]">{item.node}</span>
                {targetNode === item.id && (
                  <span className="material-symbols-outlined text-[#00f2fe] text-[16px]">check_circle</span>
                )}
              </div>
              <div className="text-xs text-[#dfe2ef] mt-1 font-medium">{item.id}</div>
              <div className="font-mono text-[10px] text-[#4edea3] mt-2">{item.clock}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Engine & Compiler */}
      <div className="bg-[#181b25] rounded p-5 border border-white/[0.06] space-y-4 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-[#e0fdff] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f2fe] text-[18px]">terminal</span>
            Simulation &amp; Linter Toolchain
          </h2>
          <p className="text-xs text-[#b9cacb] mt-1">
            Choose the execution backend powering testbench vector evaluation and waveform traces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'IVERILOG + VERILATOR 5.018', label: 'Icarus + Verilator (Default)', note: 'WebAssembly multi-threaded native runner' },
            { id: 'SYNOPSYS VCS 2024.03', label: 'Synopsys VCS Model', note: 'Commercial Tier-1 compiler emulation mode' },
            { id: 'CADENCE XCELIUM 23.09', label: 'Cadence Xcelium Model', note: 'Multi-core mixed-language simulation model' },
          ].map(eng => (
            <button
              key={eng.id}
              onClick={() => setEdaEngine(eng.id)}
              className={`p-3 rounded text-left transition-all border ${
                edaEngine === eng.id
                  ? 'bg-[#1c1f29] border-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.15)]'
                  : 'bg-[#1c1f29]/60 border-white/[0.04] hover:bg-[#1c1f29]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#e0fdff]">{eng.label}</span>
                {edaEngine === eng.id && (
                  <span className="material-symbols-outlined text-[#00f2fe] text-[16px]">check_circle</span>
                )}
              </div>
              <p className="text-[11px] text-[#b9cacb] mt-1.5">{eng.note}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Reset State */}
      <div className="bg-[#181b25] rounded p-5 border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#e0fdff]">Reset Workbench State</h3>
          <p className="text-xs text-[#b9cacb] mt-0.5">
            Clear all local simulation logs, quiz scores, and reset to Day 01 defaults.
          </p>
        </div>
        <button
          onClick={handleResetProgress}
          className="px-4 py-2 rounded bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#ffb4ab]/20 font-mono text-xs transition-colors shrink-0"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
};
