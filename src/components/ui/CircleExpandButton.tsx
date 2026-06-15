import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface CircleExpandButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  align?: "left" | "center";
}

export default function CircleExpandButton({
  children,
  onClick,
  className = "",
  icon = <ArrowRight size={14} />,
  align = "left",
  ...props
}: CircleExpandButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const updateCoordinates = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <motion.button
      ref={containerRef}
      onMouseEnter={updateCoordinates}
      onMouseMove={updateCoordinates}
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`relative w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40 px-5 py-3 cursor-pointer text-sm font-medium transition-colors duration-500 h-12 flex items-center justify-between group select-none ${className}`}
      {...props}
    >
      {/* Immersive expanding ripple circle container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl z-0">
        <motion.div
          variants={{
            initial: { 
              scale: 0,
              opacity: 0,
            },
            hover: { 
              scale: 1.8,
              opacity: 1,
            }
          }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15, 
            mass: 0.6
          }}
          style={{
            left: coords.x || "50%",
            top: coords.y || "50%",
            width: "600px",
            height: "600px",
            marginLeft: "-300px",
            marginTop: "-300px",
          }}
          className="absolute bg-white rounded-full origin-center pointer-events-none"
        />
      </div>

      {/* Button text (Transitions text color from neutral-300 to black) */}
      <motion.span
        variants={{
          initial: { color: "#d4d4d4" },
          hover: { color: "#000000" },
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`relative z-10 font-bold tracking-tight text-sm flex-1 ${
          align === "left" ? "text-left" : "text-center"
        }`}
      >
        {children}
      </motion.span>

      {/* Slide / spring action arrow color translation */}
      {icon && (
        <motion.div
          variants={{
            initial: { x: 0, scale: 1, color: "#a3a3a3" },
            hover: { x: 3, scale: 1.1, color: "#000000" },
            tap: { x: 5, scale: 0.95 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative z-10 shrink-0 ml-2"
        >
          {icon}
        </motion.div>
      )}
    </motion.button>
  );
}
