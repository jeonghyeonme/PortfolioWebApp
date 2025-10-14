import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Page imports
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { DevLogsPage } from './pages/DevLogsPage';
import { DevLogDetailPage } from './pages/DevLogDetailPage';
import { HighlightsPage } from './pages/HighlightsPage';
import { HighlightDetailPage } from './pages/HighlightDetailPage'; // Add this import
import { LoginPage } from './pages/admin/LoginPage';

// Admin-specific page imports for editing/creating
import { ProjectEditPage } from './pages/admin/ProjectEditPage';
import { DevLogEditPage } from './pages/admin/DevLogEditPage';
import { HighlightEditPage } from './pages/admin/HighlightEditPage';

// Custom hook for the admin shortcut
const useAdminShortcut = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        navigate('/admin/login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  useAdminShortcut();
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="devlogs" element={<DevLogsPage />} />
          <Route path="devlogs/:id" element={<DevLogDetailPage />} />
          <Route path="highlights" element={<HighlightsPage />} />
          <Route path="highlights/:id" element={<HighlightDetailPage />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<HomePage isAdmin={true} />} />
            <Route path="projects" element={<ProjectsPage isAdmin={true} />} />
            <Route path="projects/new" element={<ProjectEditPage />} />
            <Route path="projects/edit/:id" element={<ProjectEditPage />} />
            <Route path="devlogs" element={<DevLogsPage isAdmin={true} />} />
            <Route path="devlogs/new" element={<DevLogEditPage />} />
            <Route path="devlogs/edit/:id" element={<DevLogEditPage />} />
            <Route path="highlights" element={<HighlightsPage isAdmin={true} />} />
            <Route path="highlights/new" element={<HighlightEditPage />} />
            <Route path="highlights/edit/:id" element={<HighlightEditPage />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function PublicLayout() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// AdminLayout will be similar to PublicLayout but might have a different Navbar or footer in the future
function AdminLayout() {
  return (
    <>
      <Navigation /> 
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl mb-4">404</h1>
        <p className="text-muted-foreground mb-6">페이지를 찾을 수 없습니다.</p>
        <a href="/" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

export default App;