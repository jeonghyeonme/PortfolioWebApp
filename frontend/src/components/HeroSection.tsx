import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Github, Linkedin, Mail, Download, Globe, Edit } from 'lucide-react';
import { profileAPI } from '../services/api';
import { Toaster, toast } from 'sonner';
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
      // Updated mock data to reflect actual schema
      setProfile({
        id: 1,
        full_name: '김개발',
        job_title: '풀스택 개발자',
        bio: '<p>데이터 로딩에 실패하여 임시 데이터가 표시됩니다.</p>',
        profile_image_url: null,
        email: 'dev@example.com',
        social_links: { github: 'github' },
        keywords: ['Error', 'Fallback'],
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

  const handleCopyEmail = () => {
    console.log("handleCopyEmail called");
    console.log("Profile object:", profile);
    console.log("Email:", profile?.email);

    if (!profile?.email) return;

    const email = profile.email;
    const textArea = document.createElement('textarea');
    textArea.value = email;
    
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success('이메일 주소가 클립보드에 복사되었습니다.');
      } else {
        toast.error('이메일 주소 복사에 실패했습니다.');
      }
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      toast.error('이메일 주소 복사에 실패했습니다.');
    }

    document.body.removeChild(textArea);
  };

  const renderBioFromHTML = (htmlString: string) => {
    return <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: htmlString }} />;
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
        
        <div className="max-w-4xl mx-auto text-center">
          {isAdmin && (
            <div className="flex justify-center mb-4">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    프로필 수정
                  </Button>
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
            </div>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {profile.profile_image_url && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-8">
                <ImageWithFallback src={profile.profile_image_url} alt={profile.full_name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20" />
              </motion.div>
            )}
            <h1 
              className="text-4xl sm:text-6xl lg:text-7xl mb-6"
              style={{ fontWeight: 800, letterSpacing: '-0.025em', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}
            >
              안녕하세요,{' '}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">{profile.job_title}</span>{' '}
              {profile.full_name}입니다
            </h1>
            <div className="mb-8 max-w-3xl mx-auto">
              {renderBioFromHTML(profile.bio)}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {profile.keywords.map((keyword, index) => (
                <motion.div key={keyword} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Badge variant="secondary" className="text-sm px-3 py-1" style={{ fontWeight: 600 }}>{keyword}</Badge>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col gap-6 justify-center items-center">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex items-center gap-2" onClick={() => window.open(profile.resume_url || '#', '_blank')}><Download className="w-4 h-4" />이력서 다운로드</Button>
                {profile.email && <Button variant="outline" className="flex items-center gap-2" onClick={handleCopyEmail}><Mail className="w-4 h-4" />연락하기</Button>}
              </div>
              <div className="flex gap-3">
                {profile.social_links?.github && <Button size="icon" variant="ghost" onClick={() => window.open(githubUrl, '_blank')}><Github className="w-5 h-5" /></Button>}
                {profile.social_links?.linkedin && <Button size="icon" variant="ghost" onClick={() => window.open(profile.social_links.linkedin, '_blank')}><Linkedin className="w-5 h-5" /></Button>}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}