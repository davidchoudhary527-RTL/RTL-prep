import React from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeMode } from '../../types/curriculum';

export const Header: React.FC = () => {
  const { theme, toggleTheme, timingSlack, setMobileNavOpen } = useApp();

  const getThemeIcon = (t: ThemeMode) => {
    switch (t) {
      case 'light':
        return 'light_mode';
      case 'silicon':
        return 'terminal';
      case 'dark':
      default:
        return 'dark_mode';
    }
  };

  const getThemeLabel = (t: ThemeMode) => {
    switch (t) {
      case 'light':
        return 'Light Theme';
      case 'silicon':
        return 'Silicon High-Contrast';
      case 'dark':
      default:
        return 'Dark Mode';
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#0a0e17]/90 dark:bg-[#0a0e17]/90 backdrop-blur-xl z-40 border-b border-white/[0.08] dark:border-white/[0.08] shadow-[0_1px_8px_rgba(0,0,0,0.3)] transition-colors duration-200">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile Toggle + Hardware Core Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[#dfe2ef] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00f2fe]"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>

          <div className="flex items-center gap-2 bg-[#181b25] px-3 py-1.5 rounded border border-white/[0.06] shadow-[0_0_12px_rgba(0,242,254,0.06)]">
            <span className="material-symbols-outlined text-[#00dce6] text-[16px]">developer_board</span>
            <span className="font-mono text-xs sm:text-[11px] text-[#dfe2ef] tracking-wide font-medium truncate max-w-[170px] sm:max-w-none">
              Silicon Core v1.4 • 60-Day ASIC Pipeline
            </span>
            <span className="h-2 w-2 rounded-full bg-[#4edea3] inline-block shrink-0 shadow-[0_0_6px_#4edea3]"></span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 bg-[#1c1f29] px-2.5 py-1 rounded font-mono text-[11px] text-[#b9cacb] border border-white/[0.04]">
            <span className="text-[#4edea3] font-semibold">TIMING SLACK:</span>
            <span className="text-[#e0fdff] font-semibold">{timingSlack}</span>
          </div>
        </div>

        {/* Right: Synthesis Stage + Theme Toggle + User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 bg-[#181b25] px-3 py-1.5 rounded border border-white/[0.06]">
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider">STAGE</span>
            <span className="font-mono text-[11px] text-[#00f2fe] font-semibold">SYNTHESIS / LEC</span>
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            title={`Current: ${getThemeLabel(theme)}. Click to switch.`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#181b25] hover:bg-[#262a34] text-[#b9cacb] hover:text-[#00f2fe] transition-all border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#00f2fe]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#00f2fe]">
              {getThemeIcon(theme)}
            </span>
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider">
              {theme}
            </span>
          </button>

          {/* User profile */}
          <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 border-l border-white/[0.08]">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="font-mono text-xs text-[#dfe2ef] font-medium leading-tight">Alex Mercer</span>
              <span className="font-mono text-[10px] text-[#4edea3] tracking-tight leading-tight">FPGA -&gt; ASIC Fellow</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#006a70] to-[#00f2fe] p-0.5 flex items-center justify-center shadow-[0_0_8px_rgba(0,242,254,0.3)]">
              <div className="w-full h-full rounded-full bg-[#0a0e17] flex items-center justify-center text-[#00f2fe]">
                <span className="material-symbols-outlined text-[17px]">person</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
