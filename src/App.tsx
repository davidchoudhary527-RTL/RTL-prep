/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { LessonView } from './components/lesson/LessonView';
import { RtlLabView } from './components/lab/RtlLabView';
import { DailyQuizzesView } from './components/quiz/DailyQuizzesView';
import { InterviewPrepView } from './components/interview/InterviewPrepView';
import { SettingsView } from './components/settings/SettingsView';
import { DayInspectorDrawer } from './components/common/DayInspectorDrawer';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ef] transition-colors duration-200">
      {/* Top Header */}
      <Header />

      {/* Responsive Sidebar */}
      <Sidebar />

      {/* Main Viewport Container */}
      <div className="lg:pl-64 pt-16 min-h-screen flex flex-col">
        <main className="w-full px-4 sm:px-6 lg:px-8 pt-4 flex-1">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === '60-day-roadmap' && <RoadmapView />}
          {activeTab === 'todays-lesson' && <LessonView />}
          {activeTab === 'rtl-ide-lab' && <RtlLabView />}
          {activeTab === 'daily-quizzes' && <DailyQuizzesView />}
          {activeTab === 'interview-prep' && <InterviewPrepView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Day Inspector Drawer */}
      <DayInspectorDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
