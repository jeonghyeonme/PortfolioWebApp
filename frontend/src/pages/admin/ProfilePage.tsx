import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { getProfile, updateProfile, ProfileData } from '../../services/profile';
import { Toaster, toast } from 'sonner';

// Define a clear default structure for the form state
const defaultState: ProfileData = {
    full_name: '',
    job_title: '',
    bio: '',
    email: '',
    profile_image_url: '',
    social_links: { github: '', linkedin: '' },
    keywords: [],
};

// This interface is for the form's state, where keywords are a string
interface FormState extends Omit<ProfileData, 'keywords'> {
    keywords: string;
}

export function ProfilePage() {
    const [formData, setFormData] = useState<Partial<FormState>>({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                // Convert keywords array to a comma-separated string for the form
                setFormData({
                    ...data,
                    keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : '',
                });
            } catch (error) {
                toast.error('프로필 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...(prev.socialLinks || {}),
                [name]: value,
            },
        }));
    };
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.full_name || !formData.job_title || !formData.email) {
            toast.error('이름, 직함, 이메일은 필수 항목입니다.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Convert keywords string back to an array before submitting
            const keywordsArray = formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
            
            const dataToSubmit = {
                ...formData,
                keywords: keywordsArray,
            };

            await updateProfile(dataToSubmit as ProfileData);
            toast.success('프로필이 성공적으로 업데이트되었습니다!');
        } catch (error) {
            toast.error('프로필 업데이트에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8">프로필 정보를 불러오는 중...</div>;
    }

    return (
        <>
            <Toaster position="bottom-right" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>프로필 관리</CardTitle>
                        <CardDescription>웹사이트에 표시될 당신의 정보를 수정하세요.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Other fields remain the same */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="full_name">이름</Label>
                                    <Input id="full_name" name="full_name" value={formData.full_name || ''} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="job_title">직함</Label>
                                    <Input id="job_title" name="job_title" value={formData.job_title || ''} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="email">이메일</Label>
                                <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="profile_image_url">프로필 이미지 URL</Label>
                                <Input id="profile_image_url" name="profile_image_url" value={formData.profile_image_url || ''} onChange={handleChange} placeholder="https://..." />
                            </div>
                            <div>
                                <Label htmlFor="bio">자기소개 (Markdown 지원)</Label>
                                <Textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleChange} rows={5} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="github">GitHub 사용자 이름</Label>
                                    <Input id="github" name="github" value={formData.social_links?.github || ''} onChange={handleSocialChange} placeholder="your-github" />
                                </div>
                                <div>
                                    <Label htmlFor="linkedin">LinkedIn 프로필명</Label>
                                    <Input id="linkedin" name="linkedin" value={formData.social_links?.linkedin || ''} onChange={handleSocialChange} placeholder="your-linkedin" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="keywords">핵심 키워드 (쉼표로 구분)</Label>
                                <Input id="keywords" name="keywords" value={formData.keywords || ''} onChange={handleChange} />
                                <p className="text-sm text-muted-foreground mt-1">예: #성능최적화, #UI/UX, #문제해결</p>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? '저장 중...' : '프로필 저장'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
}
