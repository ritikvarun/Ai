'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardContent from '../components/DashboardContent';

export default function Home() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  // Check system dark mode preferences on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isSystemDark);
    }
  }, []);

  // Synchronize isDark state with the document root class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground cozy-transition font-sans">
        {/* Sidebar Component */}
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          isDark={isDark} 
          setIsDark={setIsDark} 
        />

        {/* Right-hand Workspace Pane */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Navbar Header with Search, Collab indicators, and Theme Toggle */}
          <Navbar 
            isDark={isDark} 
            setIsDark={setIsDark} 
            activePage={activePage} 
          />

          {/* Dynamic Interactive Page Content */}
          <DashboardContent activePage={activePage} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}
