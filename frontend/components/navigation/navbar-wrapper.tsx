'use client';

import { useState, useEffect } from 'react';
import { Navbar } from './navbar';
import ChatContainer from '@/src/components/ChatContainer';

// Wrapper component to handle client-side rendering of Navbar
// This prevents hydration mismatches when Navbar uses client-side auth state
export function NavbarWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a minimal navbar during server-side render and initial client render
    return (
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">Todo App</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Render the full Navbar component after client-side hydration
  return (
    <>
      <Navbar />
      <ChatContainer />
    </>
  );
}