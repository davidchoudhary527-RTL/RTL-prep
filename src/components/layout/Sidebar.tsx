import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationPath } from '../../types/curriculum';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, mobileNavOpen, setMobileNavOpen } = useApp();

  const navItems: { path: NavigationPath; label: string; icon: string }[] = [
    { path: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { path: '60-day-roadmap', label: '60-Day Roadmap', icon: 'route' },
    { path: 'todays-lesson', label: "Today's Lesson", icon: 'menu_book' },
    { path: 'rtl-ide-lab', label: 'RTL IDE / Lab', icon: 'terminal' },
    { path: 'daily-quizzes', label: 'Daily Quizzes', icon: 'quiz' },
    { path: 'interview-prep', label: 'Interview Prep', icon: 'psychology' },
  ];

  const handleNavClick = (path: NavigationPath) => {
    setActiveTab(path);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#0a0e17] border-r border-white/[0.08] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col">
        {/* Brand header */}
        <div className="h-16 px-4 flex items-center justify-between bg-[#181b25]/80 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#262a34] flex items-center justify-center text-[#00f2fe] border border-[#00f2fe]/20 shadow-[0_0_8px_rgba(0,242,254,0.15)]">
              <span className="material-symbols-outlined text-[20px]">memory</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#e0fdff] tracking-tight">RTL Learning</span>
              <span className="font-mono text-[9px] text-[#b9cacb] uppercase tracking-widest">Hardware Arch</span>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setMobileNavOpen(false)}
            className="lg:hidden p-1.5 rounded hover:bg-white/[0.08] text-[#b9cacb] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Synthesis Engine Running Indicator */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#181b25] border border-white/[0.05]">
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider font-medium">
              SYNTHESIS ENGINE
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3] shadow-[0_0_6px_#4edea3]"></span>
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1 px-2.5 mt-1">
          {navItems.map(item => {
            const isActive = activeTab === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 text-left font-sans text-xs ${
                  isActive
                    ? 'bg-[#262a34] text-[#00f2fe] font-semibold shadow-[inset_3px_0_0_0_#00f2fe]'
                    : 'text-[#b9cacb] hover:bg-[#1c1f29] hover:text-[#dfe2ef]'
                }`}
              >
                <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-[#00f2fe]' : 'text-[#849495]'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Panel: Settings & Core Freq */}
      <div className="p-3 bg-[#181b25]/60 border-t border-white/[0.06]">
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors text-left text-xs ${
              activeTab === 'settings'
                ? 'bg-[#262a34] text-[#00f2fe] font-semibold shadow-[inset_3px_0_0_0_#00f2fe]'
                : 'text-[#b9cacb] hover:bg-[#1c1f29] hover:text-[#dfe2ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </button>
        </nav>
        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between px-2">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-[#849495] uppercase">CORE FREQ</span>
            <span className="font-mono text-[11px] text-[#4edea3] font-semibold">1.25 GHz OK</span>
          </div>
          <span className="material-symbols-outlined text-[#4edea3] text-[18px] animate-pulse">speed</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 z-50 hidden lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Mobile Sliding Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
