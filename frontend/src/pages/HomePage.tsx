import { HeroSection } from '../components/HeroSection';
import { HighlightSection } from '../components/HighlightSection';
import { Dashboard } from '../components/Dashboard';
import { Timeline } from '../components/Timeline';

interface HomePageProps {
  isAdmin?: boolean;
}

export function HomePage({ isAdmin = false }: HomePageProps) {
  return (
    <div>
      <HeroSection isAdmin={isAdmin} />
      <Dashboard isAdmin={isAdmin} />
      <Timeline isAdmin={isAdmin} />
      <HighlightSection />
    </div>
  );
}
