"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  subtitle?: string;
  className?: string;
  accent?: boolean;
  interactive?: boolean;
  glowColor?: string;
  headerAction?: React.ReactNode;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  title,
  subtitle,
  className = "",
  accent = false,
  interactive = false,
  glowColor,
  headerAction,
  onClick,
}: GlassCardProps) {
  const cardClass = accent
    ? "glass-card-accent"
    : interactive
    ? "glass-card-interactive"
    : "glass-card";

  const Component = interactive ? motion.div : "div";
  const hoverProps = interactive
    ? {
        whileHover: { y: -2, transition: { duration: 0.2 } },
      }
    : {};

  return (
    <Component
      {...hoverProps}
      onClick={onClick}
      className={`rounded-xl p-5 overflow-hidden border border-netflix-border ${cardClass} ${className}`}
      style={
        glowColor
          ? {
              boxShadow: [
                // Hairline top-edge: light catching the glass rim — always neutral white
                "0 1px 0 0 rgba(255,255,255,0.12) inset",
                // Faint warm inner bloom — refraction, NOT a tint (very low opacity)
                "0 0 40px 0 rgba(229,9,20,0.03) inset",
                // External elevation with coloured penumbra below the card
                "0 16px 48px rgba(0,0,0,0.52)",
                `0 8px 28px -6px ${glowColor}`,
              ].join(", "),
            }
          : undefined
      }
    >
      {/* Header */}
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex flex-col">
            {title && (
              <h3 className="font-bold text-[#F5F5F1] text-base tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <span className="text-xs text-[#A3A3A3] mt-0.5 font-medium leading-none">
                {subtitle}
              </span>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Content */}
      <div className="h-full">{children}</div>
    </Component>
  );
}
