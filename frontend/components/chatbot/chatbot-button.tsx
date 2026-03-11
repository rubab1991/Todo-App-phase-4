'use client';

interface ChatbotButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Floating action button (bottom-right) that toggles the chatbot panel.
 */
export function ChatbotButton({ isOpen, onClick }: ChatbotButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        shadow-2xl hover:shadow-purple-500/40
        transition-all duration-300 hover:scale-110 active:scale-95
        bg-gradient-to-br from-purple-600 to-blue-500
        text-white
        focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2
      `}
    >
      {isOpen ? (
        /* Close (X) icon */
        <svg
          className="w-6 h-6 transition-transform duration-200 rotate-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        /* Chat bubble icon */
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      )}
    </button>
  );
}
