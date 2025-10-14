import { HeroSection } from '../components/HeroSection';
import { HighlightSection } from '../components/HighlightSection';
import { Dashboard } from '../components/Dashboard';
import { Timeline } from '../components/Timeline';
import { ProjectsSection } from '../components/ProjectsSection';
import { DevLogSection } from '../components/DevLogSection';

interface HomePageProps {
  isAdmin?: boolean;
}

export function HomePage({ isAdmin = false }: HomePageProps) {
  return (
    <div>
      <HeroSection isAdmin={isAdmin} />
      <HighlightSection />
      <Dashboard isAdmin={isAdmin} />
      <Timeline isAdmin={isAdmin} />
      
      {/* Latest Projects Preview */}
      <ProjectsSection 
        limit={3}
        title="최근 프로젝트"
        showViewAll={true}
        viewAllLink="/projects"
      />
      
      {/* Latest DevLogs Preview */}
      <DevLogSection 
        limit={3}
        title="최근 개발 로그"
        showViewAll={true}
        viewAllLink="/devlogs"
        publishedOnly={!isAdmin} // Show all posts for admin
      />
    </div>
  );
}
