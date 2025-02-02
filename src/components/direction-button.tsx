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
        "w-10 h-7 text-md rounded flex items-center justify-center translate-y-1.5 select-none",
        props.disabled
          ? ""
          : "dark:hover:bg-blue-500/75 dark:active:bg-blue-500/50",
        "rounded-sm transition-all duration-200 dark:bg-blue-500 disabled:text-slate-100 disabled:opacity-50",
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
