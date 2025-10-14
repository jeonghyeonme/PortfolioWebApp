import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Github, Linkedin, Mail, Download, Globe, Edit } from 'lucide-react';
import { profileAPI } from '../services/api';
import { Toaster } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ProfileEditForm } from './ProfileEditForm';
import { ProfileData } from '../services/profile';

interface HeroSectionProps {
  isAdmin?: boolean;
}

export function HeroSection({ isAdmin = false }: HeroSectionProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await profileAPI.get();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('프로필을 불러오는데 실패했습니다.');
      setProfile({
        full_name: '김개발',
        job_title: '풀스택 개발자',
        bio: '<p>사용자 경험을 최우선으로 생각하며, <b>문제 해결</b>과 <b>지속적인 학습</b>을 통해 더 나은 웹 서비스를 만들어가는 풀스택 개발자입니다.</p>',
        keywords: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'Python', 'AWS', 'Docker'],
        social_links: { github: 'https://github.com', linkedin: 'https://linkedin.com', email: 'dev@example.com' },
        resume_url: '#'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
    setIsEditDialogOpen(false);
  };

  const renderBioFromHTML = (htmlString: string) => {
    return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  if (loading) return <section className="min-h-screen" />;
  if (!profile) return <section className="min-h-screen flex items-center justify-center"><p>{error || '프로필을 불러올 수 없습니다.'}</p></section>;

  const githubUrl = profile.social_links?.github
    ? profile.social_links.github.startsWith('http')
      ? profile.social_links.github
      : `https://github.com/${profile.social_links.github}`
    : '#';

  return (
    <>
      <Toaster position="bottom-right" />
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        
        {isAdmin && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <div className="absolute top-20 right-5 z-10">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  프로필 수정
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader><DialogTitle>프로필 수정</DialogTitle></DialogHeader>
              <ProfileEditForm 
                profileData={profile} 
                onSave={handleProfileUpdate}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {profile.profile_image_url && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-8">
                <ImageWithFallback src={profile.profile_image_url} alt={profile.full_name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20" />
              </motion.div>
            )}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl mb-6">
              안녕하세요,{' '}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">{profile.job_title}</span>{' '}
              {profile.full_name}입니다
            </h1>
            <div className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              {renderBioFromHTML(profile.bio)}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {profile.keywords.map((keyword, index) => (
                <motion.div key={keyword} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Badge variant="secondary" className="text-sm px-3 py-1">{keyword}</Badge>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex gap-4">
                {profile.resume_url && <Button className="flex items-center gap-2" onClick={() => window.open(profile.resume_url, '_blank')}><Download className="w-4 h-4" />이력서 다운로드</Button>}
                {profile.social_links.email && <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open(`mailto:${profile.social_links.email}`, '_blank')}><Mail className="w-4 h-4" />연락하기</Button>}
              </div>
              <div className="flex gap-3">
                {profile.social_links.github && <Button size="icon" variant="ghost" onClick={() => window.open(githubUrl, '_blank')}><Github className="w-5 h-5" /></Button>}
                {profile.social_links.linkedin && <Button size="icon" variant="ghost" onClick={() => window.open(profile.social_links.linkedin, '_blank')}><Linkedin className="w-5 h-5" /></Button>}
                {profile.social_links.website && <Button size="icon" variant="ghost" onClick={() => window.open(profile.social_links.website, '_blank')}><Globe className="w-5 h-5" /></Button>}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}