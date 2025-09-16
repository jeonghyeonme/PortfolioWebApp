import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';

// Page imports
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { DevLogsPage } from './pages/DevLogsPage';
import { DevLogDetailPage } from './pages/DevLogDetailPage';
import { HighlightsPage } from './pages/HighlightsPage';
import { UIKitPage } from './pages/UIKitPage';

// Admin page imports
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProfilePage } from './pages/admin/ProfilePage';
import { ProjectsListPage } from './pages/admin/ProjectsListPage';
import { ProjectEditPage } from './pages/admin/ProjectEditPage';
import { DevLogsListPage } from './pages/admin/DevLogsListPage';
import { DevLogEditPage } from './pages/admin/DevLogEditPage';
import { HighlightsPage as AdminHighlightsPage } from './pages/admin/HighlightsPage';
import { TagsPage } from './pages/admin/TagsPage';
import { SkillsPage } from './pages/admin/SkillsPage';

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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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
          <Route path="uikit" element={<UIKitPage />} />
          <Route path="design-system" element={<Navigate to="/uikit" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsListPage />} />
          <Route path="projects/new" element={<ProjectEditPage />} />
          <Route path="projects/edit/:id" element={<ProjectEditPage />} />
          <Route path="devlogs" element={<DevLogsListPage />} />
          <Route path="devlogs/new" element={<DevLogEditPage />} />
          <Route path="devlogs/edit/:id" element={<DevLogEditPage />} />
          <Route path="highlights" element={<AdminHighlightsPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="profile" element={<ProfilePage />} />
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

function Footer() {
  return (
    <footer className="bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Footer content can be added here */}
      </div>
    </footer>
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
