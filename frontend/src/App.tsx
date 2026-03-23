import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserRole } from './hooks/useQueries';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetup from './components/ProfileSetup';
import UnifiedDashboard from './pages/UnifiedDashboard';
import { Loader2 } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing || (isAuthenticated && (profileLoading || roleLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <WelcomeScreen />
        ) : showProfileSetup ? (
          <ProfileSetup />
        ) : (
          <UnifiedDashboard />
        )}
      </main>
      <Footer />
    </div>
  );
}
