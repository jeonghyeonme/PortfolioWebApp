import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react';

export function Timeline() {
  const timelineData = [
    {
      type: 'work',
      title: '프론트엔드 개발자',
      company: '테크스타트업 A',
      location: '서울, 대한민국',
      period: '2023.03 - 현재',
      description: 'React/Next.js 기반 웹 애플리케이션 개발 및 사용자 경험 최적화',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      icon: Briefcase,
    },
    {
      type: 'work',
      title: '주니어 개발자',
      company: '웹 에이전시 B',
      location: '서울, 대한민국',
      period: '2022.06 - 2023.02',
      description: '다양한 클라이언트 프로젝트 참여, 풀스택 개발 경험',
      technologies: ['JavaScript', 'Node.js', 'MongoDB', 'AWS'],
      icon: Briefcase,
    },
    {
      type: 'education',
      title: '컴퓨터공학 학사',
      company: '한국대학교',
      location: '서울, 대한민국',
      period: '2018.03 - 2022.02',
      description: '웹 개발 동아리 활동, 다수의 프로젝트 리더 경험',
      technologies: ['Java', 'Python', 'C++', 'Database'],
      icon: GraduationCap,
    },
    {
      type: 'education',
      title: '코딩 부트캠프',
      company: '개발자 양성 과정',
      location: '온라인',
      period: '2021.07 - 2021.12',
      description: '실무 중심의 웹 개발 집중 학습, 팀 프로젝트 다수 완료',
      technologies: ['React', 'Node.js', 'Git', 'Agile'],
      icon: GraduationCap,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl mb-4">경력 & 학습 여정</h2>
          <p className="text-muted-foreground text-lg">
            지속적인 성장과 도전을 통해 쌓아온 개발 경험을 소개합니다
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

          <div className="space-y-8">
            {timelineData.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-6"
                >
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                    item.type === 'work' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Timeline content */}
                  <Card className="flex-1">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium">{item.title}</h3>
                          <p className="text-muted-foreground">{item.company}</p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1 mt-2 sm:mt-0">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {item.period}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}