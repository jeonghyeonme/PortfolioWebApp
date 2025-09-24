import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getHighlightDetailsById } from '../services/highlights';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight, Folder, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export function HighlightDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [highlight, setHighlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const highlightData = await getHighlightDetailsById(Number(id));
        
        // --- DEBUGGING STEP ---
        // Let's see what the API is actually returning.
        console.log('Fetched Highlight Data:', highlightData); 
        
        setHighlight(highlightData);

      } catch (error) {
        toast.error('데이터를 불러오는 데 실패했습니다.');
        console.error('Supabase fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="py-20 px-4 text-center">로딩 중...</div>;
  }

  if (!highlight) {
    return <div className="py-20 px-4 text-center">하이라이트를 찾을 수 없습니다. 데이터를 확인해주세요.</div>;
  }

  const relatedProjects = highlight.HighlightsOnProjects?.map((item: any) => item.Project).filter(Boolean) || [];
  const relatedDevLogs = highlight.HighlightsOnDevLogs?.map((item: any) => item.DevLog).filter(Boolean) || [];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        {highlight.cover_url && (
          <ImageWithFallback
            src={highlight.cover_url}
            alt={highlight.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{highlight.title}</h1>
        <p className="text-lg text-muted-foreground mb-12">{highlight.description}</p>

        {(relatedProjects.length > 0 || relatedDevLogs.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>연관된 콘텐츠</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedProjects.map((project: any) => (
                <div key={`proj-${project.id}`} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{project.title}</span>
                  </div>
                  <Button asChild variant="secondary" size="sm">
                    <Link to={`/projects/${project.id}`}>
                      보러가기 <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ))}
              {relatedDevLogs.map((devLog: any) => (
                <div key={`dev-${devLog.id}`} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{devLog.title}</span>
                  </div>
                  <Button asChild variant="secondary" size="sm">
                    <Link to={`/devlogs/${devLog.id}`}>
                      보러가기 <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}