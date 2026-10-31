"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Re-skinned for Nammane: the original ships in neutral black/white
// (neutral-800/neutral-200) and Roboto Light pulled from Google Fonts at
// runtime. This keeps the exact same animation (letter stretch/bounce +
// orbiting dot -- tuned specifically to the 7 letters of "Loading", so the
// `text` prop isn't meant to be swapped to something else) but renders it
// in the app's own violet-to-pink brand gradient and Plus Jakarta Sans
// instead, and drops the Roboto import so it doesn't make its own network
// request for a typeface the rest of the app never uses.
export interface KineticTextLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export function KineticTextLoader({
  className,
  text = "Loading",
  ...props
}: KineticTextLoaderProps) {
  const letters = text.split("");

  return (
    <div
      className={cn("relative flex items-center justify-center font-light", className)}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      {...props}
    >
      <style>{`
        @keyframes ktl-dotMove {
          0%, 100% { transform: rotate(180deg) translate(-80px, -10px) rotate(-180deg); }
          50% { transform: rotate(0deg) translate(-81px, 10px) rotate(0deg); }
        }
        @keyframes ktl-letterStretch {
          0%, 100% { transform: scale(1, 0.35); transform-origin: 100% 75%; }
          8%, 28% { transform: scale(1, 1.4); transform-origin: 100% 67%; }
          37% { transform: scale(1, 0.875); transform-origin: 100% 75%; }
          46% { transform: scale(1, 1.03); transform-origin: 100% 75%; }
          50%, 97% { transform: scale(1); transform-origin: 100% 75%; }
        }
        @keyframes ktl-l-bounce {
          0%, 45%, 70%, 100% { transform: scaleY(1.11); }
          49% { transform: scaleY(0.31); }
          50% { transform: scaleY(0.16); }
          53% { transform: scaleY(0.63); }
          60% { transform: scaleY(1.275); }
          68% { transform: scaleY(1.04); }
        }
      `}</style>
      
      <div className="relative scale-75 md:scale-90 lg:scale-100">
        {/* The moving dot, in the brand's violet accent */}
        <div
          className="absolute z-10 top-[40px] left-[85px] w-[6px] h-[6px] rounded-full"
          style={{ background: '#c23ffb', animation: "ktl-dotMove 1800ms cubic-bezier(0.25,0.25,0.75,0.75) infinite" }}
        />

        <p
          className="relative m-0 whitespace-nowrap text-[3.75rem] font-extrabold bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(120deg,#8b3ffb 0%,#c23ffb 45%,#ff4f9e 100%)' }}
          aria-label={text}
        >
          {letters.map((char, index) => {
            if (index === 0 && char.toUpperCase() === 'L') {
              return (
                <span
                  key={index}
                  className="inline-block relative tracking-[8px] transform origin-[100%_70%]"
                  style={{ animation: "ktl-l-bounce 1800ms cubic-bezier(0.25,0.25,0.75,0.75) infinite" }}
                >
                  {char}
                </span>
              );
            }

            if (index === 4 && char.toLowerCase() === 'i') {
              return (
                <span
                  key={index}
                  className="inline-block relative tracking-[8px] transform origin-[100%_70%]"
                  style={{ animation: "ktl-letterStretch 1800ms cubic-bezier(0.25,0.23,0.73,0.75) infinite" }}
                >
                  {char === 'i' ? 'ı' : char}
                </span>
              );
            }

            return (
              <span key={index} className="inline-block relative tracking-[8px]">
                {char}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

export default KineticTextLoader;
