import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import TodoPreview from '@/components/landing/todo-preview';
import { NavbarWrapper } from '@/components/navigation/navbar-wrapper';

// Define the features to display
const features = [
  {
    title: 'Task Management',
    description: 'Easily create, organize, and track your tasks with intuitive controls.'
  },
  {
    title: 'Priority Setting',
    description: 'Set priorities to focus on what matters most and boost your productivity.'
  },
  {
    title: 'Team Collaboration',
    description: 'Share tasks and collaborate with your team in real-time.'
  }
];

export default async function HomePage() {
  // Check if user is authenticated
  const session = await getAuthSession();

  // If user is authenticated, redirect to tasks page
  if (session) {
    redirect('/tasks');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - wrapped to handle client/server mismatch */}
      <NavbarWrapper />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Todo Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              See How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Experience our intuitive interface designed to help you stay organized
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <TodoPreview />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Todo App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}