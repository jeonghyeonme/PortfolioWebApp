import { useState, useEffect, FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { coverLetterAPI } from '../services/api';
import { CoverLetterData } from '../services/coverLetter';
import { Toaster, toast } from 'sonner';

interface CoverLetterEditFormProps {
  coverLetterData: CoverLetterData;
  onSave: (updatedCoverLetter: CoverLetterData) => void;
  onCancel: () => void;
}

export function CoverLetterEditForm({ coverLetterData, onSave, onCancel }: CoverLetterEditFormProps) {
  const [formData, setFormData] = useState<Partial<CoverLetterData>>(coverLetterData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(coverLetterData);
  }, [coverLetterData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.id) return;

    setIsSubmitting(true);
    try {
      const updatedData = await coverLetterAPI.update(formData.id, formData);
      toast.success('자기소개서가 성공적으로 수정되었습니다.');
      onSave(updatedData);
    } catch (error) {
      toast.error('자기소개서 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="content">내용</Label>
          <Textarea
            id="content"
            value={formData.content || ''}
            onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
            rows={15}
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>취소</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </form>
    </>
  );
}
