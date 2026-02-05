"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      borderRadius = "100px",
      shimmerDuration = "3s",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-slate-800 bg-slate-950 px-6 py-1 font-medium text-white transition-colors duration-500 hover:bg-slate-900",
          className
        )}
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--border-radius": borderRadius,
            "--shimmer-duration": shimmerDuration,
            "--background": background,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-lg"
          style={{
            borderRadius: "var(--border-radius)",
          }}
        >
          <div
            className="absolute inset-0"
            style={
              {
                background: `linear-gradient(45deg, transparent, var(--shimmer-color), transparent)`,
                animation: `shimmer var(--shimmer-duration) infinite`,
                backgroundSize: "200% 200%",
              } as React.CSSProperties
            }
          />
        </div>
        <div className="relative z-10 flex items-center justify-center">
          {children}
        </div>

        <style>{`
          @keyframes shimmer {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }
        `}</style>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
