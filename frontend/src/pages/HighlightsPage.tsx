import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Calendar, Edit, Trash, PlusCircle } from 'lucide-react';
import { getHighlights, deleteHighlight } from '../services/highlights';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Highlight {
  id: number;
  title: string;
  description: string;
  cover_url?: string;
  projectId?: number;
  devLogId?: number;
  created_at: string;
}

interface HighlightsPageProps {
  isAdmin?: boolean;
}

export function HighlightsPage({ isAdmin = false }: HighlightsPageProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchHighlights = async () => {
    setLoading(true);
    try {
      const data = await getHighlights();
      setHighlights(data || []);
    } catch (err) {
      console.error('Failed to fetch highlights:', err);
      setError('하이라이트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const handleHighlightClick = (highlight: Highlight) => {
    if (isAdmin) {
      navigate(`/admin/highlights/edit/${highlight.id}`);
    } else {
      navigate(`/highlights/${highlight.id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, highlightId: number) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 하이라이트를 삭제하시겠습니까?')) {
      try {
        await deleteHighlight(highlightId);
        toast.success('하이라이트가 삭제되었습니다.');
        fetchHighlights();
      } catch (error) {
        toast.error('하이라이트 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">하이라이트 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
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
          {isAdmin && (
            <Button className="mt-4" onClick={() => navigate('/admin/highlights/new')}>
              <PlusCircle className="w-4 h-4 mr-2" />
              새 하이라이트 추가
            </Button>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight) => (
            <motion.div
              key={highlight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card 
                className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                onClick={() => handleHighlightClick(highlight)}
              >
                <div className="relative">
                  {highlight.cover_url && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={highlight.cover_url}
                        alt={highlight.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/admin/highlights/edit/${highlight.id}`); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={(e) => handleDelete(e, highlight.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg mb-3">{highlight.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
                    {highlight.description}
                  </p>
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