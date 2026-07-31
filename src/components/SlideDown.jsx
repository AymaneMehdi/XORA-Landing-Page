import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * React 18-compatible slide-down height animation.
 * Uses `max-height` + `overflow: hidden` to avoid the `height: auto` CSS limitation.
 */
export default function SlideDown({
  children,
  durationMs = 500,
  easing = "ease-in-out",
  className = "",
}) {
  const isOpen = Boolean(children);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);

  // When closing, reset the measured height to ensure the next open animates from 0.
  useEffect(() => {
    if (!isOpen) setMaxHeight(0);
  }, [isOpen]);

  // Measure the content height on open.
  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!contentRef.current) return;
    setMaxHeight(contentRef.current.scrollHeight);
  }, [isOpen, children]);

  // Keep height in sync with dynamic content while open.
  useEffect(() => {
    if (!isOpen) return;
    if (!contentRef.current) return;
    if (typeof ResizeObserver === "undefined") return;

    const el = contentRef.current;
    const ro = new ResizeObserver(() => {
      setMaxHeight(el.scrollHeight);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        maxHeight: isOpen ? maxHeight : 0,
        transition: `max-height ${durationMs}ms ${easing}`,
        willChange: "max-height",
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

