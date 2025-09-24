import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ExternalLink, Github, Calendar, Edit, Trash, PlusCircle } from 'lucide-react';
import { projectsAPI, skillsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  technologies: string[];
  category: string;
  start_date: string;
  end_date?: string;
  live_url?: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
}

interface ProjectsPageProps {
  isAdmin?: boolean;
}

export function ProjectsPage({ isAdmin = false }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const navigate = useNavigate();

  const fetchProjects = async (skill = '') => {
    setLoading(true);
    try {
      const params = skill ? { skill } : {};
      const data = await projectsAPI.getAll(params);
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('프로젝트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialSkills = async () => {
      try {
        const skillsData = await skillsAPI.getAll();
        setAllSkills(skillsData);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
      }
    };
    
    fetchProjects();
    fetchInitialSkills();
  }, []);

  useEffect(() => {
    fetchProjects(selectedSkill);
  }, [selectedSkill]);

  const handleProjectClick = (projectId: string) => {
    const path = isAdmin ? `/admin/projects/edit/${projectId}` : `/projects/${projectId}`;
    navigate(path);
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      try {
        // await projectsAPI.delete(projectId);
        toast.success('프로젝트가 삭제되었습니다.');
        fetchProjects(selectedSkill);
      } catch (error) {
        toast.error('프로젝트 삭제에 실패했습니다.');
        console.error('Failed to delete project:', error);
      }
    }
  };

  if (loading) {
    // Skeleton loader
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-96 animate-pulse"><div className="h-48 bg-muted rounded-t-lg"></div><CardContent className="p-6"><div className="h-4 bg-muted rounded mb-2"></div><div className="h-3 bg-muted rounded mb-4"></div><div className="flex gap-2"><div className="h-5 w-12 bg-muted rounded"></div><div className="h-5 w-16 bg-muted rounded"></div></div></CardContent></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8"><div className="max-w-6xl mx-auto text-center"><p className="text-muted-foreground">{error}</p><Button onClick={() => fetchProjects(selectedSkill)} className="mt-4">다시 시도</Button></div></div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl mb-4">프로젝트</h1>
          <p className="text-muted-foreground text-lg">문제 해결과 사용자 경험 개선에 중점을 둔 다양한 프로젝트들을 소개합니다</p>
          {isAdmin && (
            <Button className="mt-4" onClick={() => navigate('/admin/projects/new')}>
              <PlusCircle className="w-4 h-4 mr-2" />
              새 프로젝트 작성
            </Button>
          )}
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button variant={selectedSkill === '' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedSkill('')}>All</Button>
          {allSkills.map((skill) => (
            <Button key={skill} variant={selectedSkill === skill ? 'default' : 'outline'} size="sm" onClick={() => setSelectedSkill(skill)}>{skill}</Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
              <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => handleProjectClick(project.id)}>
                <div className="relative">
                  {project.image_url && <ImageWithFallback src={project.image_url} alt={project.title} className="w-full h-48 object-cover rounded-t-lg" />}
                  {project.featured && <Badge className="absolute top-3 left-3">Featured</Badge>}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/admin/projects/edit/${project.id}`); }}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive" onClick={(e) => handleDelete(e, project.id)}><Trash className="w-4 h-4" /></Button>
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-1">
                  <h3 className="text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{project.description}</p>
                  <div className="mb-4 text-sm text-muted-foreground"><div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{new Date(project.start_date).toLocaleDateString('ko-KR')} ~ {project.end_date ? new Date(project.end_date).toLocaleDateString('ko-KR') : '진행 중'}</span></div></div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (<Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>))}
                    {project.technologies.length > 3 && <Badge variant="outline" className="text-xs">+{project.technologies.length - 3}</Badge>}
                  </div>
                  <div className="flex gap-2">
                    {project.live_url && <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); window.open(project.live_url, '_blank'); }}><ExternalLink className="w-4 h-4" /></Button>}
                    {project.github_url && <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); window.open(project.github_url, '_blank'); }}><Github className="w-4 h-4" /></Button>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-12"><p className="text-muted-foreground">{selectedSkill ? `"${selectedSkill}" 기술을 사용한 프로젝트가 없습니다.` : '프로젝트가 없습니다.'}</p></div>
        )}
      </div>
    </div>
  );
}
