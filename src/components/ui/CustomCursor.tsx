'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

type CursorVariant = 'default' | 'link' | 'project' | 'hidden';

export function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Raw pointer coordinates for direct, responsive dot tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth, critically-damped spring for the lagging outer ring (100–150ms gentle follow, no bounce)
  const springConfig = { damping: 30, stiffness: 220, mass: 0.55 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluateSupport = () => {
      const isFinePointer = finePointerQuery.matches;
      const isReducedMotion = reducedMotionQuery.matches;
      const supported = isFinePointer && !isReducedMotion;

      setIsEnabled(supported);
      if (supported) {
        document.documentElement.classList.add('has-custom-cursor');
      } else {
        document.documentElement.classList.remove('has-custom-cursor');
      }
    };

    evaluateSupport();

    finePointerQuery.addEventListener('change', evaluateSupport);
    reducedMotionQuery.addEventListener('change', evaluateSupport);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      finePointerQuery.removeEventListener('change', evaluateSupport);
      reducedMotionQuery.removeEventListener('change', evaluateSupport);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Project cards
      if (target.closest('[data-cursor="project"]')) {
        setCursorVariant('project');
        return;
      }

      // 2. Native form inputs / editable text
      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        setCursorVariant('hidden');
        return;
      }

      // 3. Interactive links and buttons
      if (target.closest('a, button, [role="button"], label, summary')) {
        setCursorVariant('link');
        return;
      }

      // 4. Default pointer
      setCursorVariant('default');
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleWindowBlur = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isEnabled, isVisible, mouseX, mouseY]);

  if (!isEnabled) return null;

  const currentScale = isMouseDown ? 0.88 : 1;

  // Outer ring visual states
  const ringVariants = {
    default: {
      width: 28,
      height: 28,
      opacity: isVisible ? 0.75 : 0,
      scale: currentScale,
      backgroundColor: 'transparent',
      borderColor: 'var(--accent)',
      borderWidth: 1,
    },
    link: {
      width: 44,
      height: 44,
      opacity: isVisible ? 1 : 0,
      scale: currentScale,
      backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)',
      borderColor: 'var(--accent)',
      borderWidth: 1.5,
    },
    project: {
      width: 60,
      height: 60,
      opacity: isVisible ? 1 : 0,
      scale: currentScale,
      backgroundColor: 'color-mix(in srgb, var(--accent) 12%, transparent)',
      borderColor: 'var(--accent)',
      borderWidth: 1.5,
    },
    hidden: {
      width: 20,
      height: 20,
      opacity: 0,
      scale: 0.8,
      backgroundColor: 'transparent',
      borderColor: 'var(--accent)',
      borderWidth: 1,
    },
  };

  // Center dot visual states
  const dotVariants = {
    default: {
      width: 5,
      height: 5,
      opacity: isVisible ? 1 : 0,
      scale: 1,
    },
    link: {
      width: 5,
      height: 5,
      opacity: isVisible ? 0.85 : 0,
      scale: 1,
    },
    project: {
      width: 0,
      height: 0,
      opacity: 0,
      scale: 0,
    },
    hidden: {
      width: 0,
      height: 0,
      opacity: 0,
      scale: 0,
    },
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* 1. Lagging Outer Ring (~28px default -> 44px link -> 60px project) */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
        }}
        variants={ringVariants}
        animate={cursorVariant}
        transition={{
          duration: 0.22,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center will-change-transform"
      >
        <AnimatePresence>
          {cursorVariant === 'project' && isVisible && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="font-mono text-[9px] tracking-widest text-accent font-semibold uppercase select-none pointer-events-none"
            >
              VIEW
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. Responsive Center Dot (5px diameter, follows mouse directly) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
        }}
        variants={dotVariants}
        animate={cursorVariant}
        transition={{
          duration: 0.18,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent will-change-transform"
      />
    </div>
  );
}
