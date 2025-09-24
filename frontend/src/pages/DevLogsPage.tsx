import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Edit, Trash, PlusCircle, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { devlogsAPI, tagsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

interface DevLogsPageProps {
  isAdmin?: boolean;
}

export function DevLogsPage({ isAdmin = false }: DevLogsPageProps) {
  const [posts, setPosts] = useState<DevLogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const fetchDevLogs = async (tag = '') => {
    setLoading(true);
    try {
      const params: any = isAdmin ? {} : { published: true };
      if (tag) params.tag = tag;
      const data = await devlogsAPI.getAll(params);
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch dev logs:', err);
      setError('개발 로그를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialTags = async () => {
      try {
        const tagsData = await tagsAPI.getAll();
        setAllTags(tagsData);
      } catch (err) { console.error('Failed to fetch tags:', err); }
    };
    fetchDevLogs();
    fetchInitialTags();
  }, [isAdmin]);

  useEffect(() => {
    fetchDevLogs(selectedTag);
  }, [selectedTag]);

  const handlePostClick = (id: string) => {
    const path = isAdmin ? `/admin/devlogs/edit/${id}` : `/devlogs/${id}`;
    navigate(path);
  };

  const handleDelete = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 개발 로그를 삭제하시겠습니까?')) {
      try {
        // await devlogsAPI.delete(postId);
        toast.success('개발 로그가 삭제되었습니다.');
        fetchDevLogs(selectedTag);
      } catch (error) {
        toast.error('개발 로그 삭제에 실패했습니다.');
        console.error('Failed to delete dev log:', error);
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    // Skeleton loader
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8"><div className="max-w-6xl mx-auto"><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3, 4, 5, 6].map((i) => (<Card key={i} className="h-64 animate-pulse"><CardHeader><div className="h-4 bg-muted rounded mb-2"></div><div className="h-6 bg-muted rounded"></div></CardHeader><CardContent><div className="h-3 bg-muted rounded mb-2"></div><div className="h-3 bg-muted rounded mb-4"></div><div className="flex gap-2"><div className="h-5 w-12 bg-muted rounded"></div><div className="h-5 w-16 bg-muted rounded"></div></div></CardContent></Card>))}</div></div></div>
    );
  }

  if (error) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8"><div className="max-w-6xl mx-auto text-center"><p className="text-muted-foreground">{error}</p><Button onClick={() => fetchDevLogs(selectedTag)} className="mt-4">다시 시도</Button></div></div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl mb-4">개발 일지</h1>
          <p className="text-muted-foreground text-lg">지속적인 학습과 성장 과정을 기록하고 공유합니다</p>
          {isAdmin && (
            <Button className="mt-4" onClick={() => navigate('/admin/devlogs/new')}>
              <PlusCircle className="w-4 h-4 mr-2" />
              새 개발 로그 작성
            </Button>
          )}
        </motion.div>

        <div className="mb-8 space-y-4">
          <div className="max-w-md mx-auto"><div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" /><Input placeholder="검색어를 입력하세요..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div></div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant={selectedTag === '' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTag('')}>전체</Button>
            {allTags.map((tag) => (<Button key={tag} variant={selectedTag === tag ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTag(tag)}>{tag}</Button>))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
              <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => handlePostClick(post.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>{!post.published && <Badge variant="destructive">비공개</Badge>}</div>
                    {isAdmin && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/admin/devlogs/edit/${post.id}`); }}><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="destructive" onClick={(e) => handleDelete(e, post.id)}><Trash className="w-4 h-4" /></Button>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg">{post.title}</h3>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (<Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>))}
                    {post.tags.length > 3 && <Badge variant="outline" className="text-xs">+{post.tags.length - 3}</Badge>}
                  </div>
                  <div className="flex items-center justify-start text-sm text-muted-foreground"><div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.published_at).toLocaleDateString('ko-KR')}</div></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12"><p className="text-muted-foreground">{searchQuery ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : selectedTag ? `"${selectedTag}" 태그에 해당하는 포스트가 없습니다.` : '개발 로그가 없습니다.'}</p></div>
        )}
      </div>
    </div>
  );
}
