import React from "react";
import { cn } from "@/lib/utils";

// Installed from VengeanceUI's pop-button registry item (a chunky
// press-down "NeoPOP" style button: a flat color face sitting on a hard,
// unblurred offset shadow that collapses when pressed). The original ships
// in a rose/cream palette that doesn't match Nammane -- `popButtonClasses`
// below re-skins the exact same shadow/press mechanic in the app's own
// violet-to-pink brand gradient (the same colors as .nm-btn-gold in
// globals.css) instead of hand-rolling a new button style from scratch.
//
// Exported as a className builder (not just the <button> below) because
// Sign in/Sign up in Header.tsx are <a>/<Link> elements, not <button>s --
// this lets the same pop-button look apply to whichever element already
// carries the href/onClick, instead of nesting a button inside a link.
export type PopButtonVariant = "primary" | "outline";

export function popButtonClasses(variant: PopButtonVariant = "primary") {
  if (variant === "outline") {
    return cn(
      "group relative inline-flex items-center justify-center font-extrabold uppercase text-white",
      "rounded-xl bg-[#1a1533] border-2 border-white/15",
      "transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]",
      "shadow-[0_8px_0_-1px_rgba(255,255,255,0.08),0_8px_0_0_rgba(0,0,0,0.6)]",
      "hover:bg-[#1d1840] hover:-translate-y-0.5 hover:shadow-[0_9px_0_-1px_rgba(255,255,255,0.08),0_9px_0_0_rgba(0,0,0,0.6)]",
      "active:translate-y-2 active:shadow-[0_0px_0_-1px_rgba(255,255,255,0.08),0_0px_0_0_rgba(0,0,0,0.6)]"
    );
  }
  return cn(
    "group relative inline-flex items-center justify-center font-extrabold uppercase text-white",
    "rounded-xl border-2 border-[#1b0a3d]",
    "bg-[linear-gradient(120deg,#8b3ffb_0%,#c23ffb_45%,#ff4f9e_100%)]",
    "transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]",
    "shadow-[0_8px_0_-1px_#f9b3e0,0_8px_0_0_#4a1397]",
    "hover:-translate-y-0.5 hover:shadow-[0_9px_0_-1px_#f9b3e0,0_9px_0_0_#4a1397]",
    "active:translate-y-2 active:shadow-[0_0px_0_-1px_#f9b3e0,0_0px_0_0_#4a1397]"
  );
}

export interface PopButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PopButtonVariant;
}

export function PopButton({ className, variant = "primary", children = "Learn More", ...props }: PopButtonProps) {
  return (
    <button className={cn(popButtonClasses(variant), "px-8 py-5", className)} {...props}>
      {children}
    </button>
  );
}

export default PopButton;
