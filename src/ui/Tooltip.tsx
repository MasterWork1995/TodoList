import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

type TooltipProps = {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
};

const getIsTouchDevice = () =>
  typeof window !== 'undefined' &&
  (window.ontouchstart !== undefined || window.matchMedia('(pointer: coarse)').matches);

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 100,
  className = '',
}: TooltipProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouchDevice(getIsTouchDevice());
  }, []);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  useEffect(() => {
    if (!visible || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 6;
    const tooltipHeight = 32;
    const tooltipWidth = 120;
    let top = 0;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - gap;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + gap;
        break;
      default:
        top = rect.top - tooltipHeight - gap;
    }
    setCoords({ top, left });
  }, [visible, position]);

  useEffect(() => {
    if (!visible) return;
    const handleOutside = (e: TouchEvent | MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      hide();
    };
    document.addEventListener('touchstart', handleOutside, { capture: true, passive: true });
    document.addEventListener('click', handleOutside, true);
    return () => {
      document.removeEventListener('touchstart', handleOutside, true);
      document.removeEventListener('click', handleOutside, true);
    };
  }, [visible]);

  const child = (
    <div
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onTouchEnd={() => {
        if (!visible) show();
      }}
      className={`inline-flex ${className}`.trim()}
    >
      {children}
    </div>
  );

  const tooltipEl = (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[90] max-w-[200px] rounded-lg bg-surface-800 px-3 py-2 text-center text-xs font-medium text-white shadow-lg"
          role="tooltip"
          id={`tooltip-${content.replace(/\s/g, '-')}`}
          style={{
            top: coords.top,
            left: Math.max(8, Math.min(coords.left, window.innerWidth - 208)),
          }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isTouchDevice) {
    return <div className={`inline-flex ${className}`.trim()}>{children}</div>;
  }

  return (
    <>
      {child}
      {typeof document !== 'undefined' && createPortal(tooltipEl, document.body)}
    </>
  );
}
