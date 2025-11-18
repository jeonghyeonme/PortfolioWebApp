import { HeroSection } from '../components/HeroSection';
import { Dashboard } from '../components/Dashboard';
import { Timeline } from '../components/Timeline';
import { CoverLetterSection } from '../components/CoverLetterSection';

interface HomePageProps {
  isAdmin?: boolean;
}

export function HomePage({ isAdmin = false }: HomePageProps) {
  return (
    <div>
      <HeroSection isAdmin={isAdmin} />
      <Dashboard isAdmin={isAdmin} />
      <Timeline isAdmin={isAdmin} />
      <CoverLetterSection isAdmin={isAdmin} />
    </div>
  );
}
