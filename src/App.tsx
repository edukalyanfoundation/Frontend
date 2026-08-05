import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './stores/authStore';
import { useThemeStore, applyTheme } from './stores/themeStore';
import { GlobalToastContainer } from './components/ui/GlobalToastContainer';
import { SmoothScrollProvider } from './components/ui/SmoothScrollProvider';
import { AntiGravityCanvas } from './components/ui/particle-effect-for-hero';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const App: React.FC = () => {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    initializeAuth();
    applyTheme(theme);
  }, [initializeAuth, theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SmoothScrollProvider>
          <AntiGravityCanvas className="fixed inset-0 z-0 overflow-hidden bg-slate-950 pointer-events-none" />
          <AppRoutes />
          <GlobalToastContainer />
        </SmoothScrollProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
