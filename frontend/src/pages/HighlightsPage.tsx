import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowRight, Calendar } from 'lucide-react';
import { highlightsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

// This interface should be kept in sync with the one in HighlightSection.tsx
// or moved to a shared types file.
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
    tags?: string[];
  };
}

export function HighlightsPage() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoading(true);
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
    if (highlight.type === 'project' && highlight.target_id) {
      navigate(`/projects/${highlight.target_id}`);
    } else if (highlight.type === 'devlog' && highlight.target_slug) {
      navigate(`/devlogs/${highlight.target_slug}`);
    }
  };

  if (loading) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-80 animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-muted rounded mb-4 w-full"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl mb-4">주요 성과</h1>
          <p className="text-muted-foreground text-lg">
            특별히 주목할 만한 프로젝트와 학습 경험을 소개합니다.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(highlight.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {highlights.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">하이라이트가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
