import { ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { ProjectData } from '../../services/projects';

interface ProjectFormProps {
  formData: Partial<ProjectData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ProjectData>>>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export function ProjectForm({ formData, setFormData, onSubmit, isSubmitting }: ProjectFormProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">프로젝트 제목</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">상세 설명 (Markdown 지원)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={10}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="imageUrl">이미지 URL</Label>
              <Input id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="https://..." />
            </div>
            <div>
              <Label htmlFor="projectUrl">프로젝트 URL (Live Demo)</Label>
              <Input id="projectUrl" name="projectUrl" value={formData.projectUrl || ''} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div>
            <Label htmlFor="githubUrl">GitHub 저장소 URL</Label>
            <Input id="githubUrl" name="githubUrl" value={formData.githubUrl || ''} onChange={handleChange} placeholder="https://github.com/..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '프로젝트 저장'}
        </Button>
      </div>
    </form>
  );
}