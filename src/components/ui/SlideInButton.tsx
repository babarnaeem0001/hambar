import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface SlideInButtonProps extends React.ComponentProps<typeof motion.button> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "glass" | "dark" | "light" | "neutral" | "pill-dark";
  align?: "left" | "center";
  rounded?: "full" | "xl" | "2xl";
}

export default function SlideInButton({
  children,
  icon = <ArrowRight size={13} />,
  variant = "glass",
  align = "center",
  rounded = "full",
  className = "",
  ...props
}: SlideInButtonProps) {
  // Spring transition definition for responsive mechanical sliding effect
  const transition = {
    type: "spring" as const,
    stiffness: 350,
    damping: 26,
    mass: 0.9,
  };

  const textVariants = {
    rest: { x: align === "left" ? 0 : 0 },
    hover: { x: align === "left" ? 12 : 8 },
  };

  const iconCircleVariants = {
    rest: { x: -32, opacity: 0, scale: 0.75 },
    hover: { x: 6, opacity: 1, scale: 1 },
  };

  const variants = {
    glass: "bg-white/30 text-neutral-900 border border-neutral-300/40 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:bg-white/50",
    dark: "bg-neutral-950 text-white border border-neutral-900 hover:border-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.05)] hover:bg-neutral-900",
    light: "bg-white text-neutral-950 border border-neutral-200 shadow-sm hover:bg-neutral-50",
    neutral: "bg-neutral-900 text-neutral-200 border border-neutral-850 hover:border-neutral-750 hover:bg-neutral-850 shadow-md",
    "pill-dark": "bg-neutral-950 text-white border border-neutral-850 hover:border-neutral-750 shadow-lg hover:bg-neutral-900",
  };

  const badgeVariants = {
    glass: "bg-neutral-900 text-white",
    dark: "bg-white text-neutral-950",
    light: "bg-neutral-950 text-white",
    neutral: "bg-white text-neutral-950",
    "pill-dark": "bg-white text-neutral-950",
  };

  const roundedClasses = {
    full: "rounded-full",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
  };

  return (
    <motion.button
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden inline-flex items-center min-h-[44px] h-11 px-5 select-none transition-all duration-300 font-sans tracking-tight cursor-pointer ${roundedClasses[rounded]} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Absolute sliding circle badge */}
      <motion.div
        variants={iconCircleVariants}
        transition={transition}
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm z-10 ${badgeVariants[variant]}`}
      >
        {icon}
      </motion.div>

      {/* Button text container - shifted on hover */}
      <motion.span
        variants={textVariants}
        transition={transition}
        className={`relative z-0 flex items-center w-full text-sm font-semibold tracking-tight ${
          align === "left" ? "text-left pl-7 justify-start" : "text-center justify-center"
        }`}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
