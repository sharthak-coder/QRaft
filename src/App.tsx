import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { MadhubaniBackground } from './components/ui/MadhubaniBackground';
import { GateGuard } from './components/layout/GateGuard';
import { WelcomePage } from './pages/Welcome';
import { LoginPage } from './pages/Login';
import { WorkspacePage } from './pages/Workspace';
import { TermsPage } from './pages/Terms';
import { NotFoundPage } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="relative min-h-screen bg-paper text-ink selection:bg-saffron/25 selection:text-peacock-deep font-sans">
          <MadhubaniBackground />

          {/* Route Handlers */}
          <Routes>
            {/* Public Entry Gate: Welcome page */}
            <Route path="/" element={<WelcomePage />} />

            {/* Public Legal / Terms page (always reachable) */}
            <Route path="/terms" element={<TermsPage />} />

            {/* Gate-guarded pages */}
            <Route
              path="/login"
              element={
                <GateGuard>
                  <LoginPage />
                </GateGuard>
              }
            />

            <Route
              path="/app"
              element={
                <GateGuard>
                  <WorkspacePage />
                </GateGuard>
              }
            />

            {/* 404 Catch-all */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
