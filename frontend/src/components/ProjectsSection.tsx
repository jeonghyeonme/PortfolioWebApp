import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ExternalLink, Github, Calendar, User, ArrowRight } from 'lucide-react';
import { projectsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string;
  image_url?: string;
  technologies: string[];
  category: string;
  period: string;
  role: string;
  live_url?: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
}

interface ProjectsSectionProps {
  limit?: number;
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export function ProjectsSection({ limit, title = "프로젝트", showViewAll = false, viewAllLink = "/projects" }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = limit ? { limit } : undefined;
        const data = await projectsAPI.getAll(params);
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('프로젝트를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [limit]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-96 animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg">
            문제 해결과 사용자 경험 개선에 중점을 둔 다양한 프로젝트들을 소개합니다
          </p>
        </motion.div>

        {showViewAll && (
          <div className="text-center mb-8">
            <Button onClick={() => navigate(viewAllLink)} variant="outline">
              모든 프로젝트 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="relative">
                  {project.image_url && (
                    <ImageWithFallback
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  {project.featured && (
                    <Badge className="absolute top-3 left-3">Featured</Badge>
                  )}
                </div>
                
                <CardContent className="p-6 flex-1">
                  <h3 className="text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(project.technologies || []).slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}