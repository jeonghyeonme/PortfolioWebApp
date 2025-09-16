import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { TiptapEditor } from '../../components/TiptapEditor';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { getProjectById, createProject, updateProject, ProjectData } from '../../services/projects';
import { getSkills, SkillData } from '../../services/skills';
import { getTags, TagData } from '../../services/tags';
import { Toaster, toast } from 'sonner';

const defaultState: Partial<ProjectData> = {
  title: '',
  description: '',
  image_url: '',
  project_url: '',
  github_url: '',
  skill_ids: [],
  tag_ids: [],
};

// Helper to format date for input[type=date]
const formatDateForInput = (dateString: string | undefined | null) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
};

export function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ProjectData>>(defaultState);
  const [allSkills, setAllSkills] = useState<SkillData[]>([]);
  const [allTags, setAllTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, tagsData] = await Promise.all([getSkills(), getTags()]);
        setAllSkills(skillsData);
        setAllTags(tagsData);
        if (isEditMode) {
          const projectData = await getProjectById(Number(id));
          setFormData(projectData);
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
        await updateProject(Number(id), formData as ProjectData);
        toast.success('프로젝트가 성공적으로 수정되었습니다.');
      } else {
        await createProject(formData as ProjectData);
        toast.success('프로젝트가 성공적으로 생성되었습니다.');
      }
      navigate('/admin/projects');
    } catch (error) {
      toast.error(`프로젝트 ${isEditMode ? '수정' : '생성'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRelationChange = (type: 'skill_ids' | 'tag_ids', itemId: number) => {
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-8">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? '프로젝트 수정' : '새 프로젝트 추가'}</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Main form fields */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="title">프로젝트 제목</Label>
                  <Input id="title" value={formData.title || ''} onChange={(e) => setFormData(p => ({...p, title: e.target.value}))} required />
                </div>
                <div>
                  <Label htmlFor="description">상세 설명</Label>
                  <TiptapEditor
                    content={formData.description || ''}
                    onChange={(newContent) => setFormData(p => ({ ...p, description: newContent }))}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="image_url">이미지 URL</Label>
                    <Input id="image_url" value={formData.image_url || ''} onChange={(e) => setFormData(p => ({...p, image_url: e.target.value}))} />
                  </div>
                  <div>
                    <Label htmlFor="project_url">프로젝트 URL</Label>
                    <Input id="project_url" value={formData.project_url || ''} onChange={(e) => setFormData(p => ({...p, project_url: e.target.value}))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="github_url">GitHub 저장소 URL</Label>
                  <Input id="github_url" value={formData.github_url || ''} onChange={(e) => setFormData(p => ({...p, github_url: e.target.value}))} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="start_date">시작일</Label>
                    <Input id="start_date" type="date" value={formatDateForInput(formData.start_date)} onChange={(e) => setFormData(p => ({...p, start_date: e.target.value}))} required />
                  </div>
                  <div>
                    <Label htmlFor="end_date">종료일</Label>
                    <Input id="end_date" type="date" value={formatDateForInput(formData.end_date)} onChange={(e) => setFormData(p => ({...p, end_date: e.target.value || null}))} />
                    <p className="text-xs text-muted-foreground mt-1">비워두면 '현재 진행 중'으로 표시됩니다.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            {/* Relations */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">기술 스킬</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {allSkills.map(skill => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <Checkbox id={`skill-${skill.id}`} checked={formData.skill_ids?.includes(skill.id!)} onCheckedChange={() => handleRelationChange('skill_ids', skill.id!)} />
                      <Label htmlFor={`skill-${skill.id}`}>{skill.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">태그</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {allTags.map(tag => (
                    <div key={tag.id} className="flex items-center gap-2">
                      <Checkbox id={`tag-${tag.id}`} checked={formData.tag_ids?.includes(tag.id!)} onCheckedChange={() => handleRelationChange('tag_ids', tag.id!)} />
                      <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? '저장 중...' : '프로젝트 저장'}
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
