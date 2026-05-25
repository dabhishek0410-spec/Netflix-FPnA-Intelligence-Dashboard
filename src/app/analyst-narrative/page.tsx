"use client";

import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import AnalystNarrativePanel from "@/components/analyst/AnalystNarrativePanel";
import ActualForecastTimeline from "@/components/forecast/ActualForecastTimeline";

function AnalystNarrativeContent() {
  return (
    <div className="space-y-6">
      {/* Dynamic timeline for selecting years and triggering periods */}
      <ActualForecastTimeline />

      {/* Main Narrative Side-by-side cockpit */}
      <AnalystNarrativePanel />
    </div>
  );
}

export default function AnalystNarrativePage() {
  return (
    <DashboardShell title="FP&A Analyst Narrative Cockpit">
      <AnalystNarrativeContent />
    </DashboardShell>
  );
}
