// Accessibility utilities for the Todo AI Chatbot frontend

/**
 * Announce a message to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the element after a delay to prevent cluttering the DOM
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Focus management utilities
 */
export const focusElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
};

/**
 * Trap focus within a specific container (useful for modals)
 */
export const trapFocus = (container: HTMLElement, firstFocusElement?: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  if (focusableElements.length === 0) return;

  const firstElement = firstFocusElement || focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);

  // Focus the first element initially
  firstElement.focus();

  // Return a cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * High contrast mode detection
 */
export const isHighContrastMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for high contrast mode using CSS media query
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Reduced motion mode detection
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for reduced motion preference
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Utility to conditionally apply animation based on user preferences
 */
export const shouldAnimate = (): boolean => {
  return !prefersReducedMotion();
};

/**
 * Color contrast checking (simplified version)
 */
export const checkColorContrast = (foregroundColor: string, backgroundColor: string): boolean => {
  // This is a simplified contrast checker
  // In a real implementation, you'd want to use a more robust algorithm
  const fg = hexToRgb(foregroundColor);
  const bg = hexToRgb(backgroundColor);

  if (!fg || !bg) return false;

  const luminance1 = calculateLuminance(fg.r, fg.g, fg.b);
  const luminance2 = calculateLuminance(bg.r, bg.g, bg.b);

  const ratio = luminance1 > luminance2
    ? (luminance2 + 0.05) / (luminance1 + 0.05)
    : (luminance1 + 0.05) / (luminance2 + 0.05);

  // WCAG AA standard requires at least 4.5:1 contrast ratio
  return ratio < 0.22; // Which means contrast ratio > 4.5:1
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const calculateLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

/**
 * Screen reader only CSS class
 */
export const srOnlyStyle = `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;

/**
 * Focus visible utility - detects if user is navigating with keyboard
 */
export const setupKeyboardNavigation = () => {
  let isUsingKeyboard = true;

  const handleMouseDown = () => {
    isUsingKeyboard = false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      isUsingKeyboard = true;
    }
  };

  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('keydown', handleKeyDown);
  };
};

// Initialize keyboard navigation detection
setupKeyboardNavigation();