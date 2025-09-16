import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Clock, ArrowRight, Bookmark, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { devlogsAPI, tagsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface DevLogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  published_at: string;
  tags: string[];
  featured: boolean;
  published: boolean;
}

export function DevLogsPage() {
  const [posts, setPosts] = useState<DevLogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [postsData, tagsData] = await Promise.all([
          devlogsAPI.getAll({ published: true }),
          tagsAPI.getAll()
        ]);
        setPosts(postsData);
        setAllTags(tagsData);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchFilteredPosts = async () => {
      setLoading(true);
      try {
        const params: any = { published: true };
        if (selectedTag) {
          params.tag = selectedTag;
        }
        const data = await devlogsAPI.getAll(params);
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch filtered posts:', err);
        setError('개발 로그를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    // Run only when selectedTag changes, not on initial load
    if (!loading) {
      fetchFilteredPosts();
    }
  }, [selectedTag]);

  const handlePostClick = (id: string) => {
    navigate(`/devlogs/${id}`);
  };

  // Filter posts by search query on the client side
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-6 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-5 w-12 bg-muted rounded"></div>
                    <div className="h-5 w-16 bg-muted rounded"></div>
                  </div>
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
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl mb-4">개발 일지</h1>
          <p className="text-muted-foreground text-lg">
            지속적인 학습과 성장 과정을 기록하고 공유합니다
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button 
              variant={selectedTag === '' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTag('')}
            >
              전체
            </Button>
            {allTags.map((tag) => (
              <Button 
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePostClick(post.id)}
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
                
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-start text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.published_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery 
                ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` 
                : selectedTag 
                  ? `"${selectedTag}" 태그에 해당하는 포스트가 없습니다.` 
                  : '개발 로그가 없습니다.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}