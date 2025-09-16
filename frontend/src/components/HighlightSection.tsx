import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, ExternalLink, Github, Calendar } from 'lucide-react';
import { highlightsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Highlight {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  type: 'project' | 'devlog';
  target_id: string;
  target_slug?: string;
  featured: boolean;
  created_at: string;
  metadata?: {
    live_url?: string;
    github_url?: string;
    tags?: string[];
  };
}

export function HighlightSection() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const data = await highlightsAPI.getAll();
        setHighlights(data);
      } catch (err) {
        console.error('Failed to fetch highlights:', err);
        setError('하이라이트를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  const handleHighlightClick = (highlight: Highlight) => {
    if (highlight.type === 'project') {
      navigate(`/projects/${highlight.target_id}`);
    } else if (highlight.type === 'devlog') {
      navigate(`/devlogs/${highlight.target_slug}`);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-32 bg-muted rounded"></div>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  if (highlights.length === 0) {
    return null; // Don't render anything if no highlights
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
          <h2 className="text-3xl sm:text-4xl mb-4">주요 성과</h2>
          <p className="text-muted-foreground text-lg">
            특별히 주목할 만한 프로젝트와 학습 경험을 소개합니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => handleHighlightClick(highlight)}
              >
                {highlight.image_url && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={highlight.image_url}
                      alt={highlight.title}
                      className="w-full h-full object-cover"
                    />
                    {highlight.featured && (
                      <Badge className="absolute top-3 left-3">Featured</Badge>
                    )}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3"
                    >
                      {highlight.type === 'project' ? '프로젝트' : '개발 로그'}
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg mb-3">{highlight.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
                    {highlight.description}
                  </p>

                  {highlight.metadata?.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {highlight.metadata.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(highlight.created_at).toLocaleDateString('ko-KR')}
                    </div>
                    
                    <div className="flex gap-2">
                      {highlight.metadata?.live_url && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(highlight.metadata?.live_url, '_blank');
                          }}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                      {highlight.metadata?.github_url && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(highlight.metadata?.github_url, '_blank');
                          }}
                        >
                          <Github className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
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