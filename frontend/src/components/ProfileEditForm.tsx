import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { updateProfile, ProfileData } from '../services/profile';
import { toast } from 'sonner';
import { TiptapEditor } from './TiptapEditor'; // Import TiptapEditor

interface ProfileEditFormProps {
  profileData: ProfileData;
  onSave: (updatedProfile: ProfileData) => void;
  onCancel: () => void;
}

// This interface is for the form's state, where keywords are a string
interface FormState extends Omit<ProfileData, 'keywords'> {
    keywords: string;
}

export function ProfileEditForm({ profileData, onSave, onCancel }: ProfileEditFormProps) {
    const [formData, setFormData] = useState<Partial<FormState>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData({
            ...profileData,
            keywords: Array.isArray(profileData.keywords) ? profileData.keywords.join(', ') : '',
        });
    }, [profileData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBioChange = (newContent: string) => {
        setFormData(prev => ({ ...prev, bio: newContent }));
    };

    const handleSocialChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            social_links: {
                ...(prev.social_links || {}),
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
            const keywordsArray = formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
            
            const dataToSubmit = {
                ...formData,
                keywords: keywordsArray,
            };

            const updatedProfile = await updateProfile(dataToSubmit as ProfileData);
            toast.success('프로필이 성공적으로 업데이트되었습니다!');
            onSave(updatedProfile);
        } catch (error) {
            toast.error('프로필 업데이트에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="bio">자기소개</Label>
                <div className="mt-2 p-2 border rounded-md min-h-[120px]">
                    <TiptapEditor
                        content={formData.bio || ''}
                        onChange={handleBioChange}
                    />
                </div>
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
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onCancel}>취소</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : '변경사항 저장'}
                </Button>
            </div>
        </form>
    );
}
