import React, { createContext, useContext, useState, useEffect } from 'react';
import { DayData, NavigationPath, ThemeMode } from '../types/curriculum';
import { DAYS_DATA } from '../data/curriculumData';
import { DAY_1_QUIZ } from '../data/quizData';

interface QuizState {
  score: number;
  total: number;
  passed: boolean;
  submitted: boolean;
  answers: Record<number, number>;
}

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  activeTab: NavigationPath;
  setActiveTab: (tab: NavigationPath) => void;
  selectedDay: DayData | null;
  setSelectedDay: (day: DayData | null) => void;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  completedDays: number[];
  markDayComplete: (day: number) => void;
  toggleCompleteDay: (day: number) => void;
  checklistProgress: Record<string, boolean>;
  toggleChecklist: (key: string) => void;
  quizState: QuizState;
  submitQuiz: (answers: Record<number, number>) => void;
  resetQuiz: () => void;
  targetNode: string;
  setTargetNode: (node: string) => void;
  edaEngine: string;
  setEdaEngine: (engine: string) => void;
  timingSlack: string;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  openDayDrawer: (dayNum: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state with local persistence
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('rtl_theme') as ThemeMode;
    return saved === 'light' || saved === 'silicon' ? saved : 'dark';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('rtl_theme', newTheme);
    document.documentElement.classList.remove('dark', 'light', 'silicon');
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('silicon');
    else setTheme('dark');
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light', 'silicon');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Navigation tab
  const [activeTab, setActiveTabState] = useState<NavigationPath>(() => {
    const hash = window.location.hash.replace('#', '') as NavigationPath;
    const validTabs: NavigationPath[] = [
      'dashboard',
      '60-day-roadmap',
      'todays-lesson',
      'rtl-ide-lab',
      'daily-quizzes',
      'interview-prep',
      'settings',
    ];
    return validTabs.includes(hash) ? hash : 'dashboard';
  });

  const setActiveTab = (tab: NavigationPath) => {
    setActiveTabState(tab);
    window.location.hash = tab;
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Day Drawer
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>([1]);

  const markDayComplete = (day: number) => {
    if (!completedDays.includes(day)) {
      setCompletedDays(prev => [...prev, day]);
    }
  };

  const toggleCompleteDay = (day: number) => {
    setCompletedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // Checklist for Day 1
  const [checklistProgress, setChecklistProgress] = useState<Record<string, boolean>>({
    task1: true,
    task2: true,
    task3: true,
    task4: true,
    task5: false,
  });

  const toggleChecklist = (key: string) => {
    setChecklistProgress(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>({
    score: 9,
    total: 10,
    passed: true,
    submitted: true,
    answers: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 1, 7: 0, 8: 1, 9: 1, 10: 1 },
  });

  const submitQuiz = (answers: Record<number, number>) => {
    let correctCount = 0;
    DAY_1_QUIZ.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    setQuizState({
      score: correctCount,
      total: DAY_1_QUIZ.length,
      passed: correctCount >= 8,
      submitted: true,
      answers,
    });
    if (correctCount >= 8) {
      setChecklistProgress(prev => ({ ...prev, task4: true }));
      markDayComplete(1);
    }
  };

  const resetQuiz = () => {
    setQuizState({
      score: 0,
      total: 10,
      passed: false,
      submitted: false,
      answers: {},
    });
  };

  // Hardware Telemetry Config
  const [targetNode, setTargetNode] = useState<string>('TSMC 5nm FinFET Spec');
  const [edaEngine, setEdaEngine] = useState<string>('IVERILOG + VERILATOR 5.018');
  const [timingSlack, setTimingSlack] = useState<string>('+0.586 ns [PASS]');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const openDayDrawer = (dayNum: number) => {
    const found = DAYS_DATA.find(d => d.day === dayNum) || DAYS_DATA[0];
    setSelectedDay(found);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        activeTab,
        setActiveTab,
        selectedDay,
        setSelectedDay,
        currentDay,
        setCurrentDay,
        completedDays,
        markDayComplete,
        toggleCompleteDay,
        checklistProgress,
        toggleChecklist,
        quizState,
        submitQuiz,
        resetQuiz,
        targetNode,
        setTargetNode,
        edaEngine,
        setEdaEngine,
        timingSlack,
        mobileNavOpen,
        setMobileNavOpen,
        openDayDrawer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
