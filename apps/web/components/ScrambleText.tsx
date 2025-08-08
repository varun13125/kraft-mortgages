"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  scrambleSpeed?: number;
  revealSpeed?: number;
  characters?: string;
}

export function ScrambleText({ 
  text, 
  className = "",
  delay = 0,
  scrambleSpeed = 50,
  revealSpeed = 100,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const revealedChars = useRef(0);

  const scrambleText = () => {
    let scrambled = "";
    for (let i = 0; i < text.length; i++) {
      if (i < revealedChars.current) {
        scrambled += text[i];
      } else if (text[i] === " ") {
        scrambled += " ";
      } else {
        scrambled += characters[Math.floor(Math.random() * characters.length)];
      }
    }
    return scrambled;
  };

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    revealedChars.current = 0;

    // Initial scramble phase
    const scrambleInterval = setInterval(() => {
      setDisplayText(scrambleText());
    }, scrambleSpeed);

    // Reveal phase
    setTimeout(() => {
      clearInterval(scrambleInterval);
      
      const revealInterval = setInterval(() => {
        if (revealedChars.current >= text.length) {
          clearInterval(revealInterval);
          setDisplayText(text);
          setIsAnimating(false);
          return;
        }
        
        revealedChars.current++;
        setDisplayText(scrambleText());
      }, revealSpeed);
      
      intervalRef.current = revealInterval;
    }, 1000);
  }, [isAnimating, scrambleSpeed, revealSpeed, text, characters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startAnimation();
    }, delay);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, delay, startAnimation]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      {displayText || text}
    </motion.span>
  );
}

interface RevealTextProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function RevealText({ children, delay = 0, className = "" }: RevealTextProps) {
  const words = (children as string).split(" ");

  return (
    <div className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-2"
          initial={{ 
            opacity: 0, 
            y: 50,
            rotateX: 90,
            filter: "blur(10px)"
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            filter: "blur(0px)"
          }}
          transition={{
            duration: 0.8,
            delay: delay + (i * 0.1),
            ease: [0.25, 0.4, 0.25, 1],
          }}
          style={{ 
            transformPerspective: 1000,
            transformStyle: "preserve-3d"
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  showCursor?: boolean;
}

export function TypewriterText({ 
  text, 
  delay = 0, 
  speed = 100, 
  className = "",
  showCursor = true 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingCursor, setShowingCursor] = useState(showCursor);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      const typeTimer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        } else {
          clearInterval(typeTimer);
          // Blink cursor a few times then hide
          if (showCursor) {
            setTimeout(() => setShowingCursor(false), 2000);
          }
        }
      }, speed);

      return () => clearInterval(typeTimer);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, delay, speed, currentIndex, showCursor]);

  return (
    <span className={className}>
      {displayedText}
      {showingCursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="ml-1 text-brand-400"
        >
          |
        </motion.span>
      )}
    </span>
  );
}