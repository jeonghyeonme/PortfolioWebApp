
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Code, GitCommit, Star, Edit } from 'lucide-react';
import { githubAPI } from '../services/githubAPI';
import { dashboardAPI } from '../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Toaster } from 'sonner';
import { DashboardEditForm } from './DashboardEditForm';

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
        
        const [dbData, totalStars, commitCountThisYear, commitActivity] = await Promise.all([
          dashboardAPI.get(),
          githubAPI.getTotalStars(),
          githubAPI.getCommitCountThisYear(),
          githubAPI.getCommitActivityForChart(),
        ]);

        setDashboardData(dbData);
        setGithubStats({ totalStars, commitCountThisYear, commitActivity });

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

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl mb-4">개발 현황</h2>
            <p className="text-muted-foreground text-lg">지속적인 성장과 학습을 통해 쌓아온 개발 역량을 한눈에 확인해보세요</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-medium mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader><CardTitle>기술 스택 숙련도</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader><CardTitle>GitHub 활동 (지난 6개월)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={githubStats?.commitActivity || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="commits" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
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
