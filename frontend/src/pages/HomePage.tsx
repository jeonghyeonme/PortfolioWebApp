import { HeroSection } from '../components/HeroSection';
import { Dashboard } from '../components/Dashboard';
import { Timeline } from '../components/Timeline';
import { MyStoriesSection } from '../components/MyStoriesSection';

interface HomePageProps {
  isAdmin?: boolean;
}

export function HomePage({ isAdmin = false }: HomePageProps) {
  return (
    <div>
      <HeroSection isAdmin={isAdmin} />
      <Dashboard isAdmin={isAdmin} />
      <Timeline isAdmin={isAdmin} />
      <MyStoriesSection isAdmin={isAdmin} />
    </div>
  );
}
