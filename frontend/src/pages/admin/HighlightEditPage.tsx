import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { getHighlightById, createHighlight, updateHighlight, HighlightData } from '../../services/highlights';
import { getProjects } from '../../services/projects';
import { getDevLogs } from '../../services/devlogs';
import { Toaster, toast } from 'sonner';

const defaultState: Partial<HighlightData> = {
  title: '',
  description: '',
  cover_url: '',
  display_order: 0,
  project_ids: [],
  dev_log_ids: [],
};

export function HighlightEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<HighlightData>>(defaultState);
  const [projects, setProjects] = useState<any[]>([]);
  const [devLogs, setDevLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, devLogsData] = await Promise.all([getProjects(), getDevLogs()]);
        setProjects(projectsData);
        setDevLogs(devLogsData);
        if (isEditMode) {
          const highlightData = await getHighlightById(Number(id));
          setFormData(highlightData);
        }
      } catch (error) {
        toast.error('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateHighlight(Number(id), formData as HighlightData);
        toast.success('하이라이트가 성공적으로 수정되었습니다.');
      } else {
        await createHighlight(formData as HighlightData);
        toast.success('하이라이트가 성공적으로 생성되었습니다.');
      }
      setTimeout(() => navigate('/admin/highlights'), 1000);
    } catch (error) {
      toast.error(`하이라이트 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectionChange = (type: 'project_ids' | 'dev_log_ids', itemId: number) => {
    setFormData(prev => {
      const selectedIds = prev[type] || [];
      const newIds = selectedIds.includes(itemId)
        ? selectedIds.filter(id => id !== itemId)
        : [...selectedIds, itemId];
      return { ...prev, [type]: newIds };
    });
  };

  if (loading) return <div className="p-8">로딩 중...</div>;

  return (
    <>
      <Toaster position="bottom-right" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? '하이라이트 수정' : '새 하이라이트 추가'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="title">제목</Label>
                <Input id="title" value={formData.title || ''} onChange={(e) => setFormData(p => ({...p, title: e.target.value}))} required />
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Input id="description" value={formData.description || ''} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} required />
              </div>
              <div>
                <Label htmlFor="cover_url">커버 이미지 URL</Label>
                <Input id="cover_url" value={formData.cover_url || ''} onChange={(e) => setFormData(p => ({...p, cover_url: e.target.value}))} />
              </div>
              <div>
                <Label htmlFor="display_order">표시 순서</Label>
                <Input id="display_order" type="number" value={formData.display_order || 0} onChange={(e) => setFormData(p => ({...p, display_order: Number(e.target.value)}))} />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">연결할 프로젝트</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {projects.map(p => (
                    <div key={p.id} className="flex items-center gap-2">
                      <Checkbox id={`proj-${p.id}`} checked={formData.project_ids?.includes(p.id)} onCheckedChange={() => handleSelectionChange('project_ids', p.id)} />
                      <Label htmlFor={`proj-${p.id}`}>{p.title}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">연결할 개발 로그</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {devLogs.map(d => (
                    <div key={d.id} className="flex items-center gap-2">
                      <Checkbox id={`dev-${d.id}`} checked={formData.dev_log_ids?.includes(d.id)} onCheckedChange={() => handleSelectionChange('dev_log_ids', d.id)} />
                      <Label htmlFor={`dev-${d.id}`}>{d.title}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/highlights')}>취소</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '하이라이트 저장'}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  );
}