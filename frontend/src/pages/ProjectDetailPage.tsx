import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowLeft, ExternalLink, Github, Calendar, User, Target, Lightbulb, Settings, BookOpen } from 'lucide-react';
import { projectsAPI } from '../services/api';

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  long_description: string;
  image_url?: string;
  technologies: { name: string; image_url?: string }[];
  tags: { id: number; name: string }[];
  category: string;
  start_date: string;
  end_date?: string; // Optional
  live_url?: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
  challenges?: string;
  solutions?: string;
  key_features?: string[];
  lessons_learned?: string;
  future_improvements?: string[];
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('프로젝트 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const data = await projectsAPI.getById(id);
        setProject(data);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('프로젝트를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-8 w-48"></div>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">{error || '프로젝트를 찾을 수 없습니다.'}</p>
          <Button onClick={() => navigate('/projects')}>
            프로젝트 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const renderMarkdown = (text: string | undefined | null) => {
    if (!text) {
      return [];
    }
    return text.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mt-6 mb-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-medium mt-8 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4">{line.slice(2)}</li>;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/projects')}
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          프로젝트 목록으로 돌아가기
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div>
              {project.image_url && (
                <ImageWithFallback
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{project.category}</Badge>
                {project.featured && <Badge>Featured</Badge>}
              </div>
              
              <h1 className="text-3xl mb-4">{project.title}</h1>
              
              <div className="space-y-3 mb-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.start_date).toLocaleDateString('ko-KR')} ~ {project.end_date ? new Date(project.end_date).toLocaleDateString('ko-KR') : '현재 진행 중'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <Badge key={tech.name} variant="outline">
                    {tech.name}
                  </Badge>
                ))}
              </div>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-3">
                {project.live_url && (
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => window.open(project.live_url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </Button>
                )}
                {project.github_url && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open(project.github_url, '_blank')}
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Content Sections */}
          <div className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  프로젝트 개요
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="prose prose-sm max-w-none">
                  {renderMarkdown(project.long_description)}
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            {project.key_features && project.key_features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    주요 기능
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.key_features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Challenges & Solutions */}
            {(project.challenges || project.solutions) && (
              <div className="grid md:grid-cols-2 gap-6">
                {project.challenges && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        도전 과제
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {renderMarkdown(project.challenges)}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {project.solutions && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        해결 방법
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {renderMarkdown(project.solutions)}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Lessons Learned */}
            {project.lessons_learned && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    배운 점
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {renderMarkdown(project.lessons_learned)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Future Improvements */}
            {project.future_improvements && project.future_improvements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>향후 개선 계획</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.future_improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}