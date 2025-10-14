
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { dashboardAPI } from '../services/api';
import { toast } from 'sonner';

// Assuming DashboardData is defined elsewhere, but let's define it for clarity
interface Skill {
  name: string;
  level: number;
}

interface DashboardData {
  id: number;
  completed_projects: string;
  development_experience: string;
  skills: Skill[];
}

interface DashboardEditFormProps {
  dashboardData: DashboardData;
  onSave: (updatedData: DashboardData) => void;
  onCancel: () => void;
}

// Form state will handle skills as a string for easier editing in a textarea
interface FormState extends Omit<DashboardData, 'skills'> {
    skills: string;
}

export function DashboardEditForm({ dashboardData, onSave, onCancel }: DashboardEditFormProps) {
    const [formData, setFormData] = useState<Partial<FormState>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Convert skills array to a pretty-printed JSON string for the textarea
        setFormData({
            ...dashboardData,
            skills: JSON.stringify(dashboardData.skills, null, 2),
        });
    }, [dashboardData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate and parse the skills JSON string before submitting
            let skillsArray: Skill[];
            try {
                skillsArray = JSON.parse(formData.skills || '[]');
            } catch (jsonError) {
                toast.error('기술 스택 필드의 JSON 형식이 올바르지 않습니다.');
                setIsSubmitting(false);
                return;
            }

            const dataToSubmit = {
                ...formData,
                skills: skillsArray,
            };

            // Remove id from the submission object as it shouldn't be updated
            const { id, ...updates } = dataToSubmit;



            const updatedData = await dashboardAPI.update(dashboardData.id, updates);
            toast.success('대시보드가 성공적으로 업데이트되었습니다!');
            onSave(updatedData);
        } catch (error) {
            console.error('Error updating dashboard:', error);
            toast.error('대시보드 업데이트에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="completed_projects">완료된 프로젝트</Label>
                    <Input id="completed_projects" name="completed_projects" value={formData.completed_projects || ''} onChange={handleChange} />
                </div>
                <div>
                    <Label htmlFor="development_experience">개발 경력</Label>
                    <Input id="development_experience" name="development_experience" value={formData.development_experience || ''} onChange={handleChange} />
                </div>
            </div>
            <div>
                <Label htmlFor="skills">기술 스택 (JSON 형식)</Label>
                <Textarea
                    id="skills"
                    name="skills"
                    value={formData.skills || ''}
                    onChange={handleChange}
                    rows={8}
                    placeholder='[{
  "name": "React",
  "level": 90
}]'
                />
                <p className="text-sm text-muted-foreground mt-1">
                    {'`[{"name": "스킬명", "level": 숙련도}]` 형식의 JSON 배열을 입력해주세요.'}
                </p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>취소</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : '변경사항 저장'}
                </Button>
            </div>
        </form>
    );
}
