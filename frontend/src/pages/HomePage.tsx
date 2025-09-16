import { HeroSection } from '../components/HeroSection';
import { HighlightSection } from '../components/HighlightSection';
import { Dashboard } from '../components/Dashboard';
import { Timeline } from '../components/Timeline';
import { ProjectsSection } from '../components/ProjectsSection';
import { DevLogSection } from '../components/DevLogSection';

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <HighlightSection />
      <Dashboard />
      <Timeline />
      
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
        publishedOnly={true}
      />
    </div>
  );
}