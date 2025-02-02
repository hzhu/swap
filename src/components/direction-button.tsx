"use client";

import clsx from "clsx";
import { useState, forwardRef } from "react";
import type { FC, ReactNode, ButtonHTMLAttributes } from "react";

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

const Lines: FC<{ active: boolean; children: ReactNode }> = ({
  active,
  children,
}) => (
  <div className="relative h-10 right-16">
    <div
      role="presentation"
      className={`h-4.5 w-9 rounded-tl-lg border-t-2 border-l-2 bottom-11 left-5 absolute ${
        active ? "border-gray-200" : "border-gray-100"
      }`}
    />
    {children}
    <div
      role="presentation"
      className={`h-4.5 w-9 rounded-bl-lg border-b-2 border-l-2 top-11 left-5 absolute ${
        active ? "border-gray-200" : "border-gray-100"
      }`}
    />
  </div>
);
