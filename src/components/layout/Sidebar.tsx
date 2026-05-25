"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  TrendingUp, 
  DollarSign, 
  Globe, 
  GitCommit, 
  Calendar, 
  FileText, 
  HelpCircle, 
  FolderGit2,
  Tv,
  Activity
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Executive Summary", href: "/executive", icon: TrendingUp },
    { name: "Operating Expenses", href: "/expenses", icon: DollarSign },
    { name: "Regional Performance", href: "/regions", icon: Globe },
    { name: "Margin Bridge", href: "/margin-bridge", icon: GitCommit },
    { name: "Long Range Plan (5Y)", href: "/long-range-plan", icon: Calendar },
    { name: "Growth Diagnostics", href: "/growth-diagnostics", icon: Activity },
    { name: "Analyst Narrative", href: "/analyst-narrative", icon: FileText },
    { name: "Methodology & Sources", href: "/methodology", icon: HelpCircle },
    { name: "Recruiter Portfolio", href: "/portfolio-summary", icon: FolderGit2 },
  ];

  return (
    <aside className={`w-64 border-r border-netflix-border bg-[#0a0a0a]/90 backdrop-blur-md flex flex-col z-20 shrink-0 ${className}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-netflix-border">
        <Link href="/executive" className="flex items-center gap-3">
          {/* Authentic folding Netflix Red 'N' logo in SVG with back-lit radial red glow */}
          <div className="shrink-0 w-6 h-8 relative flex items-center justify-center">
            {/* Backdrop Radial Red Glow */}
            <div className="absolute w-8 h-8 bg-netflix-red/30 rounded-full blur-md -z-10 animate-pulse-glow" />
            
            <svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
              <path d="M0 32V0h6v32H0z" fill="#B20710" />
              <path d="M18 32V0h6v32h-6z" fill="#B20710" />
              <path d="M0 0l18 32h6L6 0H0z" fill="#E50914" />
            </svg>
          </div>
          <span className="font-extrabold tracking-wider text-lg text-gradient-red uppercase">
            NETFLIX <span className="font-light text-xs tracking-widest text-[#A3A3A3] ml-0.5">FP&A</span>
          </span>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-xs uppercase tracking-widest text-[#666666] font-semibold px-2 mb-3">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/executive" && pathname === "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive 
                  ? "bg-netflix-red/10 text-netflix-red border-l-2 border-netflix-red" 
                  : "text-[#A3A3A3] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-netflix-red" : "text-[#A3A3A3] group-hover:text-white"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Corporate Footnote */}
      <div className="p-4 border-t border-netflix-border bg-black/40 text-[10px] text-[#666666] text-center">
        Netflix FP&A Intelligence Dashboard v1.0
        <div className="mt-1 font-mono text-[9px]">Strictly Confidential</div>
      </div>
    </aside>
  );
}
