"use client";

import { ReactNode } from "react";

interface MotionFadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function MotionFadeIn({ children, delay = 0, className = "" }: MotionFadeInProps) {
  return (
    <div
      className={`animate-in fade-in duration-500 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
