"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { DashboardProvider } from "./DashboardContext";
import GlobalAiSummary from "../analyst/GlobalAiSummary";

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardShell({ children, title }: DashboardShellProps) {
  return (
    <DashboardProvider>
      <div className="flex w-screen h-screen overflow-hidden bg-black text-[#F5F5F1] relative font-sans">
        {/* Grain Overlay */}
        <div className="grain-overlay" />

        {/* Netflix-style full-bleed red corner vignette */}
        <div className="netflix-vignette" />

        {/* Cinematic Spotlight Backdrops */}
        <div className="spotlight-bg">
          <div className="spotlight-red-1" />
          <div className="spotlight-red-2" />
        </div>

        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Content Panel */}
        <div className="flex-1 flex flex-col min-w-0 z-10 relative">
          {/* Topbar Controls */}
          <Topbar title={title} />

          {/* Main Scrollable Viewport */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 animate-cinematic-fade-in relative">
            {/* dynamic executive GenAI briefs */}
            <GlobalAiSummary />
            
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
