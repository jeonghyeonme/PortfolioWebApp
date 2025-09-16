import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, ArrowRight, Bookmark } from 'lucide-react';
import { devlogsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface DevLogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string;
  published_at: string;
  read_time: number;
  tags: string[];
  featured: boolean;
  published: boolean;
}

interface DevLogSectionProps {
  limit?: number;
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  publishedOnly?: boolean;
}

export function DevLogSection({ limit, title = "개발 일지", showViewAll = false, viewAllLink = "/devlogs", publishedOnly = false }: DevLogSectionProps) {
  const [posts, setPosts] = useState<DevLogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params: any = {};
        if (limit) params.limit = limit;
        if (publishedOnly) params.published = true;
        
        const data = await devlogsAPI.getAll(params);
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch dev logs:', err);
        setError('개발 로그를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit, publishedOnly]);

  const handlePostClick = (slug: string) => {
    navigate(`/devlogs/${slug}`);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-6 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded"></div>
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

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
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
            지속적인 학습과 성장 과정을 기록하고 공유합니다
          </p>
        </motion.div>

        {showViewAll && (
          <div className="text-center mb-8">
            <Button onClick={() => navigate(viewAllLink)} variant="outline">
              모든 개발 로그 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Featured Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePostClick(post.slug)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={post.featured ? 'default' : 'secondary'}>
                      {post.category}
                    </Badge>
                    {post.featured && (
                      <Bookmark className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <h3 className="text-lg">{post.title}</h3>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.published_at).toLocaleDateString('ko-KR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.read_time}분
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