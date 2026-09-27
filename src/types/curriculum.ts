export type PhaseId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';

export type DayStatus = 'active' | 'completed' | 'locked' | 'gate';

export interface DayData {
  day: number;
  phase: PhaseId;
  phaseNum: number;
  title: string;
  shortTitle: string;
  desc: string;
  longDesc: string;
  status: DayStatus;
  isMilestone?: boolean;
  gateNum?: number;
  lab: string;
  time: string;
  tags: string[];
  objectives: string[];
  interviewQ: string;
  specs?: {
    parameters: string;
    ports: string;
    criteria: string;
  };
  designCode?: string;
  testbenchCode?: string;
}

export interface PhaseInfo {
  id: PhaseId;
  num: number;
  title: string;
  subtitle: string;
  daysRange: string;
  startDay: number;
  endDay: number;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Flashcard {
  id: string;
  company: string;
  role: string;
  topic: string;
  question: string;
  answer: string;
  category: 'CDC' | 'STA' | 'Verilog' | 'Datapath' | 'Synthesis' | 'Architecture';
}

export interface WhiteboardPuzzle {
  id: string;
  title: string;
  company: string;
  frequency: string;
  difficulty: 'Medium' | 'Hard' | 'Extreme';
  prompt: string;
  hints: string[];
  solutionExplanation: string;
  verilogSolution: string;
}

export type ThemeMode = 'dark' | 'light' | 'silicon';

export type NavigationPath =
  | 'dashboard'
  | '60-day-roadmap'
  | 'todays-lesson'
  | 'rtl-ide-lab'
  | 'daily-quizzes'
  | 'interview-prep'
  | 'settings';
