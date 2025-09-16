import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard, 
  Folder, 
  BookOpen, 
  Star, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  Palette,
  Tag,
  Wrench // Import Wrench icon for Skills
} from 'lucide-react';
import { signOut } from '../utils/supabase/client';

// Reusable Sidebar Content Component
const SidebarContent = ({ onNavigate, onSignOut }: { onNavigate: (path: string) => void, onSignOut: () => void }) => {
  const location = useLocation();
  const isActive = (href: string) => location.pathname.startsWith(href);

  const navigationItems = [
    { title: '대시보드', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: '프로필', href: '/admin/profile', icon: User },
    { title: '프로젝트', href: '/admin/projects', icon: Folder },
    { title: '개발 로그', href: '/admin/devlogs', icon: BookOpen },
    { title: '하이라이트', href: '/admin/highlights', icon: Star },
    { title: '태그', href: '/admin/tags', icon: Tag },
    { title: '스킬', href: '/admin/skills', icon: Wrench }, // Add Skills menu item
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-6 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/admin')}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-medium">Admin CMS</span>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant={isActive(item.href) ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onNavigate(item.href)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.title}
              </Button>
            );
          })}
        </div>
        <div className="border-t border-border mt-6 pt-4">
          <Button variant="ghost" className="w-full justify-start" onClick={() => onNavigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            포트폴리오 보기
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={onSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </nav>
    </div>
  );
};

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-muted/50">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background border-r
        transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent onNavigate={handleNavigate} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile overlay, shown when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="flex-1">
             {/* You can add breadcrumbs or page titles here if needed */}
          </div>
          <Badge variant="outline">v2.0</Badge>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}