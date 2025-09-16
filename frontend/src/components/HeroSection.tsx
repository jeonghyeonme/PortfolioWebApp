import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Github, Linkedin, Mail, Download, Globe } from 'lucide-react';
import { profileAPI } from '../services/api';

interface Profile {
  full_name: string;
  job_title: string;
  bio: string;
  profile_image_url?: string;
  keywords: string[];
  social_links: {
    github?: string;
    linkedin?: string;
    email?: string;
    website?: string;
  };
  resume_url?: string;
}

export function HeroSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.get();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('프로필을 불러오는데 실패했습니다.');
        // Fallback data for development
        setProfile({
          full_name: '김개발',
          job_title: '풀스택 개발자',
          bio: '사용자 경험을 최우선으로 생각하며, **문제 해결**과 **지속적인 학습**을 통해 더 나은 웹 서비스를 만들어가는 풀스택 개발자입니다.',
          keywords: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Python', 'AWS', 'Docker'],
          social_links: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            email: 'dev@example.com'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Render bio with markdown-like formatting
  const renderBio = (bio: string) => {
    const parts = bio.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const text = part.slice(2, -2);
        return (
          <span key={index} className="text-foreground font-medium">
            {text}
          </span>
        );
      }
      return part;
    });
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-muted rounded-lg mb-6 mx-auto max-w-2xl"></div>
            <div className="h-8 bg-muted rounded-lg mb-8 mx-auto max-w-3xl"></div>
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 w-16 bg-muted rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && !profile) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {profile.profile_image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <ImageWithFallback
                src={profile.profile_image_url}
                alt={profile.full_name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20"
              />
            </motion.div>
          )}

          <h1 className="text-4xl sm:text-6xl lg:text-7xl mb-6">
            안녕하세요,{' '}
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              {profile.job_title}
            </span>{' '}
            {profile.full_name}입니다
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {renderBio(profile.bio)}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {profile.keywords.map((keyword, index) => (
              <motion.div
                key={keyword}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {keyword}
                </Badge>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="flex gap-4">
              {profile.resume_url && (
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => window.open(profile.resume_url, '_blank')}
                >
                  <Download className="w-4 h-4" />
                  이력서 다운로드
                </Button>
              )}
              {profile.social_links.email && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => window.open(`mailto:${profile.social_links.email}`, '_blank')}
                >
                  <Mail className="w-4 h-4" />
                  연락하기
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              {profile.social_links.github && (
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => window.open(profile.social_links.github, '_blank')}
                >
                  <Github className="w-5 h-5" />
                </Button>
              )}
              {profile.social_links.linkedin && (
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => window.open(profile.social_links.linkedin, '_blank')}
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
              )}
              {profile.social_links.website && (
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => window.open(profile.social_links.website, '_blank')}
                >
                  <Globe className="w-5 h-5" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}