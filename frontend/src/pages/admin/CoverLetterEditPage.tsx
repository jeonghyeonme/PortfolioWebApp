import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { coverLetterAPI } from '../../services/api';
import { CoverLetterData } from '../../services/coverLetter';
import { Toaster, toast } from 'sonner';

export function CoverLetterEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<CoverLetterData>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCoverLetter = async () => {
      if (id) {
        try {
          const data = await coverLetterAPI.getById(Number(id));
          setFormData(data);
        } catch (error) {
          toast.error('자기소개서를 불러오는 데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchCoverLetter();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    try {
      await coverLetterAPI.update(Number(id), formData);
      toast.success('자기소개서가 성공적으로 수정되었습니다.');
      setTimeout(() => navigate('/'), 1000); // Redirect to home to see changes
    } catch (error) {
      toast.error('자기소개서 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>자기소개서 수정</CardTitle>
          </CardHeader>
          <CardContent>
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
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '저장 중...' : '저장하기'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
