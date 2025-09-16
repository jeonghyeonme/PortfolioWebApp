import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { TiptapEditor } from '../../components/TiptapEditor';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import { getDevLogById, createDevLog, updateDevLog, DevLogData } from '../../services/devlogs';
import { getTags, TagData } from '../../services/tags';
import { Toaster, toast } from 'sonner';

const defaultState: Partial<DevLogData> = {
  title: '',
  content: '',
  published: false,
  tag_ids: [],
};

export function DevLogEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<DevLogData>>(defaultState);
  const [allTags, setAllTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsData = await getTags();
        setAllTags(tagsData);
        if (isEditMode) {
          const devLogData = await getDevLogById(Number(id));
          setFormData(devLogData);
        }
      } catch (error) {
        toast.error('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTagChange = (tagId: number) => {
    setFormData(prev => {
      const selectedIds = prev.tag_ids || [];
      const newIds = selectedIds.includes(tagId)
        ? selectedIds.filter(id => id !== tagId)
        : [...selectedIds, tagId];
      return { ...prev, tag_ids: newIds };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateDevLog(Number(id), formData as DevLogData);
        toast.success('개발 로그가 성공적으로 수정되었습니다.');
      } else {
        await createDevLog(formData as DevLogData);
        toast.success('개발 로그가 성공적으로 생성되었습니다.');
      }
      navigate('/admin/devlogs');
    } catch (error) {
      toast.error(`개발 로그 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">로딩 중...</div>;

  return (
    <>
      <Toaster position="bottom-right" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{isEditMode ? '개발 로그 수정' : '새 개발 로그 작성'}</h1>
              <div className="flex items-center space-x-2">
                <Label htmlFor="published-switch">{formData.published ? '발행됨' : '초안'}</Label>
                <Switch id="published-switch" checked={formData.published} onCheckedChange={(checked) => setFormData(p => ({...p, published: checked}))} />
              </div>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="content">내용 (Markdown 지원)</Label>
                  <Textarea id="content" name="content" value={formData.content || ''} onChange={handleChange} rows={20} required />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">태그</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {allTags.map(tag => (
                    <div key={tag.id} className="flex items-center gap-2">
                      <Checkbox id={`tag-${tag.id}`} checked={formData.tag_ids?.includes(tag.id!)} onCheckedChange={() => handleTagChange(tag.id!)} />
                      <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? '저장 중...' : '로그 저장'}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  );
}