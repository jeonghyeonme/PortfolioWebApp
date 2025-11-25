
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Code, GitCommit, Star, Edit } from 'lucide-react';
import { githubStatsAPI, dashboardAPI } from '../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Toaster } from 'sonner';
import { DashboardEditForm } from './DashboardEditForm';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Define interfaces for our data structures
interface Skill {
  name: string;
  level: number;
}

interface GitHubActivity {
  month: string;
  commits: number;
}

interface DashboardData {
  id: number;
  completed_projects: string;
  development_experience: string;
  skills: Skill[];
}

interface GitHubStats {
  totalStars: number;
  commitCountThisYear: number;
  commitActivity: GitHubActivity[];
}

interface DashboardProps {
  isAdmin?: boolean;
}

export function Dashboard({ isAdmin = false }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 대시보드 데이터와 캐시된 GitHub 통계를 병렬로 가져옵니다.
        const [dbData, cachedGithubStats] = await Promise.all([
          dashboardAPI.get(),
          githubStatsAPI.get(),
        ]);

        setDashboardData(dbData);
        
        // 가져온 통계 데이터를 기존 state 구조에 맞게 적용합니다.
        if (cachedGithubStats) {
          setGithubStats({
            totalStars: cachedGithubStats.total_stars,
            commitCountThisYear: cachedGithubStats.annual_commits,
            commitActivity: cachedGithubStats.monthly_commit_activity,
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDataUpdate = (updatedData: DashboardData) => {
    setDashboardData(updatedData);
    setIsEditDialogOpen(false);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">대시보드 데이터를 불러오는 중입니다...</p>
        </div>
      </section>
    );
  }

  if (error || !dashboardData) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">{error || '대시보드 데이터를 표시할 수 없습니다.'}</p>
        </div>
      </section>
    );
  }

  const stats = [
    { icon: Code, label: '완료된 프로젝트', value: dashboardData.completed_projects },
    { icon: GitCommit, label: '올해 커밋', value: githubStats?.commitCountThisYear.toLocaleString() || '0' },
    { icon: Star, label: 'GitHub Stars', value: githubStats?.totalStars.toLocaleString() || '0' },
    { icon: Calendar, label: '개발 경력', value: dashboardData.development_experience },
  ];

  return (
    <>
      <Toaster position="bottom-right" />
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        {isAdmin && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <div className="absolute top-5 right-5 z-10">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  대시보드 수정
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader><DialogTitle>대시보드 수정</DialogTitle></DialogHeader>
              <DialogDescription>
                대시보드에 표시되는 정보를 수정합니다. GitHub 데이터는 자동으로 업데이트됩니다.
              </DialogDescription>
              <DashboardEditForm 
                dashboardData={dashboardData}
                onSave={handleDataUpdate}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        <div className="max-w-6xl mx-auto" >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center" style={{ marginBottom: '3rem' }}
          >
            <h2 className="text-3xl sm:text-4xl mb-4 font-bold tracking-tight">개발 현황</h2>
            <p className="text-muted-foreground text-lg">지속적인 성장과 학습을 통해 쌓아온 개발 역량을 한눈에 확인해보세요</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      <stat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-4xl font-bold mb-1 text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader><CardTitle>기술 스택 숙련도</CardTitle></CardHeader>
                <CardContent>
                  <TooltipProvider>
                    <div className="flex flex-wrap gap-3">
                      {dashboardData.skills.sort((a, b) => b.level - a.level).map((skill) => (
                        <Tooltip key={skill.name}>
                          <TooltipTrigger asChild>
                            <div className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 transition-colors hover:bg-muted/50">
                              <span className="font-semibold text-sm">{skill.name}</span>
                              <div className="h-2.5 w-12 rounded-full bg-muted">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${skill.level}%` }}></div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>숙련도: {skill.level}%</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader><CardTitle>GitHub 활동 (지난 6개월)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={githubStats?.commitActivity || []} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="commits" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorCommits)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
