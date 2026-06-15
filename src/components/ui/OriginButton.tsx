import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface OriginButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
  children: string;
  onClick?: () => void;
  className?: string;
}

export default function OriginButton({ children, onClick, className = "", ...props }: OriginButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`relative w-full overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950/70 px-4 py-3 cursor-pointer text-sm font-medium text-neutral-200 transition-colors duration-300 h-12 flex items-center justify-between group select-none ${className}`}
      {...props}
    >
      {/* Background radial expansion origin fill */}
      <motion.div
        variants={{
          initial: { scale: 0, opacity: 0 },
          hover: { scale: 1, opacity: 1 },
        }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="absolute inset-0 bg-neutral-800 rounded-xl origin-center pointer-events-none z-0"
      />

      {/* Cyclic Text Transition Container */}
      <div className="relative overflow-hidden h-[20px] flex-1 text-left z-10 flex flex-col justify-start pointer-events-none">
        <motion.div
          variants={{
            initial: { y: 0 },
            hover: { y: -20 },
          }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="flex flex-col"
        >
          {/* Primary Text */}
          <span className="block h-[20px] text-neutral-250 leading-[20px] pr-2 whitespace-nowrap overflow-hidden text-ellipsis">
            {children}
          </span>
          {/* Incoming Duplicate Text */}
          <span className="block h-[20px] text-white leading-[20px] pr-2 whitespace-nowrap overflow-hidden text-ellipsis font-bold">
            {children}
          </span>
        </motion.div>
      </div>

      {/* Arrow right element with sliding dynamic spring feedback */}
      <div className="relative w-5 h-5 flex items-center justify-center shrink-0 z-10 pointer-events-none">
        <motion.div
          variants={{
            initial: { x: 0, color: '#737373' },
            hover: { x: 4, color: '#ffffff' },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowRight size={14} />
        </motion.div>
      </div>
    </motion.button>
  );
}
