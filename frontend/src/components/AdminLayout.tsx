import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function AdminLayout() {
  return (
    <div>
      <Navigation />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
