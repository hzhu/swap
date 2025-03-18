"use client";

import clsx from "clsx";
import { useState, forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

export const DirectionButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, className, ...props }, ref) => {
  const [rotated, setRotated] = useState(false);
  const arrowStyles = clsx(
    "transition-all duration-200",
    rotated ? "rotate-180" : ""
  );

  return (
    <button
      ref={ref}
      className={clsx(
        "py-1 px-2 text-lg rounded-xl flex items-center justify-center translate-y-1.5 select-none transition-all",
        props.disabled
          ? ""
          : "dark:hover:bg-slate-600/75 dark:active:bg-slate-600/50",
        "rounded-md transition-all duration-200 dark:bg-slate-800 disabled:text-slate-100 disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        if (onClick) onClick(e);
        setRotated(!rotated);
      }}
      {...props}
    >
      <span className={arrowStyles}>&#8595;</span>
      <span className={arrowStyles}>&#8593;</span>
    </button>
  );
});
