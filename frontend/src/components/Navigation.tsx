import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, Home, Folder, BookOpen, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/highlights', label: 'Highlights', icon: Sparkles },
    { path: '/projects', label: 'Projects', icon: Folder },
    { path: '/devlogs', label: 'Dev Log', icon: BookOpen },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Home', icon: Home },
    { path: '/admin/highlights', label: 'Highlights', icon: Sparkles },
    { path: '/admin/projects', label: 'Projects', icon: Folder },
    { path: '/admin/devlogs', label: 'Dev Log', icon: BookOpen },
  ];

  const currentNavItems = location.pathname.startsWith('/admin') ? adminNavItems : navItems;

  const isActiveLink = (path: string) => {
    if (path === '/' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    navigate('/'); // Navigate to home page first to avoid seeing login page
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('로그아웃에 실패했습니다.');
    } else {
      toast.success('성공적으로 로그아웃되었습니다.');
    }
    setIsMobileMenuOpen(false);
  };

  // Updated authButton logic
  const authButton = user ? (
    <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  ) : null; // Render nothing if not logged in

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to={user ? "/admin" : "/"}>
              <h1 className="text-xl font-medium hover:text-primary transition-colors cursor-pointer">
                DEV.PORTFOLIO {user && <span className="text-xs text-primary">(Admin)</span>}
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button variant={isActiveLink(item.path) ? 'default' : 'ghost'} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
            <div className="ml-4">
              {!loading && authButton}
            </div>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button variant={isActiveLink(item.path) ? 'default' : 'ghost'} onClick={() => setIsMobileMenuOpen(false)} className="w-full justify-start flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="border-t pt-2">
                {!loading && user && (
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}