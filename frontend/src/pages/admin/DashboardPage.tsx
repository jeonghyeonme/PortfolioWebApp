import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Folder, 
  BookOpen, 
  Star, 
  User, 
  Plus, 
  Edit,
  Eye,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { projectsAPI, devlogsAPI, highlightsAPI, profileAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { getAuthSession } from '../../utils/supabase/client';

interface DashboardStats {
  totalProjects: number;
  publishedPosts: number;
  totalHighlights: number;
  recentActivity: Array<{
    type: 'project' | 'devlog' | 'highlight';
    title: string;
    date: string;
    id: string;
  }>;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    publishedPosts: 0,
    totalHighlights: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { session } = await getAuthSession();
        if (!session) {
          navigate('/admin/login');
          return;
        }

        // Fetch all data
        const [projects, devlogs, highlights] = await Promise.all([
          projectsAPI.getAll(),
          devlogsAPI.getAll(),
          highlightsAPI.getAll()
        ]);

        // Calculate stats
        const recentActivity = [
          ...projects.slice(0, 3).map((p: any) => ({
            type: 'project' as const,
            title: p.title,
            date: p.createdAt || p.updatedAt,
            id: p.id
          })),
          ...devlogs.slice(0, 3).map((d: any) => ({
            type: 'devlog' as const,
            title: d.title,
            date: d.publishedAt || d.updatedAt,
            id: d.slug
          })),
          ...highlights.slice(0, 2).map((h: any) => ({
            type: 'highlight' as const,
            title: h.title,
            date: h.createdAt,
            id: h.id
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        setStats({
          totalProjects: projects.length,
          publishedPosts: devlogs.filter((d: any) => d.published).length,
          totalHighlights: highlights.length,
          recentActivity
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('대시보드 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const quickActions = [
    {
      title: '새 프로젝트',
      description: '새로운 프로젝트를 추가합니다',
      icon: Folder,
      action: () => navigate('/admin/projects/new'),
      color: 'bg-blue-500'
    },
    {
      title: '새 개발 로그',
      description: '새로운 개발 로그를 작성합니다',
      icon: BookOpen,
      action: () => navigate('/admin/devlogs/new'),
      color: 'bg-green-500'
    },
    {
      title: '새 하이라이트',
      description: '새로운 하이라이트를 생성합니다',
      icon: Star,
      action: () => navigate('/admin/highlights/new'),
      color: 'bg-yellow-500'
    },
    {
      title: '프로필 편집',
      description: '프로필 정보를 수정합니다',
      icon: User,
      action: () => navigate('/admin/profile'),
      color: 'bg-purple-500'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return Folder;
      case 'devlog': return BookOpen;
      case 'highlight': return Star;
      default: return Calendar;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project': return 'text-blue-500';
      case 'devlog': return 'text-green-500';
      case 'highlight': return 'text-yellow-500';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl mb-2">관리자 대시보드</h1>
          <p className="text-muted-foreground">포트폴리오 콘텐츠를 관리하고 현황을 확인하세요</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">총 프로젝트</p>
                  <p className="text-2xl font-medium">{stats.totalProjects}</p>
                </div>
                <Folder className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">발행된 로그</p>
                  <p className="text-2xl font-medium">{stats.publishedPosts}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">하이라이트</p>
                  <p className="text-2xl font-medium">{stats.totalHighlights}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">이번 달 활동</p>
                  <p className="text-2xl font-medium">{stats.recentActivity.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                빠른 작업
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.title}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={action.action}
                    >
                      <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                최근 활동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                        <Icon className={`w-4 h-4 ${getActivityColor(activity.type)}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    최근 활동이 없습니다.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/projects')}>
            <CardContent className="p-6 text-center">
              <Folder className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg mb-2">프로젝트 관리</h3>
              <p className="text-sm text-muted-foreground">프로젝트 추가, 수정, 삭제</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/devlogs')}>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg mb-2">개발 로그 관리</h3>
              <p className="text-sm text-muted-foreground">포스트 작성, 편집, 발행</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/highlights')}>
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-lg mb-2">하이라이트 관리</h3>
              <p className="text-sm text-muted-foreground">주요 성과 관리</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}