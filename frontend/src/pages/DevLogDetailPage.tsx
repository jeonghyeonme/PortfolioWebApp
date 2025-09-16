import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Calendar, Clock, Share2, BookOpen } from 'lucide-react';
import { devlogsAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Or your preferred theme

interface DevLogDetail {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  category: string;
  published_at: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  updated_at: string;
}

export function DevLogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<DevLogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('포스트 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const data = await devlogsAPI.getById(id);
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch dev log:', err);
        setError('개발 로그를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium mt-4 mb-2">{line.slice(4)}</h3>;
      }
      
      // Lists
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 mb-1 list-disc list-inside">
            {line.slice(2)}
          </li>
        );
      }
      
      // Code blocks (simple implementation)
      if (line.startsWith('```')) {
        return null; // Handle in a more sophisticated way if needed
      }
      
      // Bold text
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="mb-3 leading-relaxed">
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
      
      // Regular paragraphs
      if (line.trim()) {
        return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
      }
      
      // Empty lines
      return <br key={index} />;
    });
  };

  if (loading) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-8 w-48"></div>
            <div className="space-y-4 mb-8">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">{error || '포스트를 찾을 수 없습니다.'}</p>
          <Button onClick={() => navigate('/devlogs')}>
            개발 로그 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/devlogs')}
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          개발 로그 목록으로 돌아가기
        </Button>
        
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="prose prose-lg max-w-none"
        >
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-border">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={post.featured ? 'default' : 'secondary'}>
                {post.category}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl sm:text-4xl mb-6 leading-tight">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>발행일: {new Date(post.published_at).toLocaleDateString('ko-KR')}</span>
              </div>
              {post.updated_at !== post.published_at && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>수정일: {new Date(post.updated_at).toLocaleDateString('ko-KR')}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                공유
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="prose-content max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom components for styling if needed
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                code: ({node, inline, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div className="bg-gray-800 text-white p-4 rounded-md my-4 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code className="bg-muted text-muted-foreground rounded-sm px-1" {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg mb-2">이 글이 도움이 되었나요?</h3>
                    <p className="text-sm text-muted-foreground">
                      더 많은 개발 이야기는 개발 로그에서 확인하세요.
                    </p>
                  </div>
                  <Button onClick={() => navigate('/devlogs')}>
                    더 많은 글 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.article>
      </div>
    </div>
  );
}