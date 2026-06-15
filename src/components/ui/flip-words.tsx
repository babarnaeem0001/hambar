import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function FlipWords({
  words,
  duration = 3000,
  className,
}: FlipWordsProps) {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    const word = words[(words.indexOf(currentWord) + 1) % words.length];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        exit={{
          opacity: 0,
          y: 0,
          filter: "blur(8px)",
        }}
        className="inline-flex flex-row flex-nowrap items-center whitespace-nowrap"
        key={currentWord}
      >
        {currentWord.split(" ").map((word, wordIndex) => (
          <span
            key={word + wordIndex}
            className="inline-flex whitespace-nowrap"
          >
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={letter + letterIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: wordIndex * 0.15 + letterIndex * 0.05,
                  duration: 0.25,
                }}
                className={className}
                style={{
                  WebkitTextStroke: "1.5px rgba(255, 255, 255, 1)",
                  WebkitTextFillColor: "black",
                  display: "inline-block",
                }}
              >
                {letter}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
