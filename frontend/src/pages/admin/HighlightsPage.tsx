import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { MoreHorizontal, BookOpen, Folder } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { getHighlights, createHighlight, updateHighlight, deleteHighlight, HighlightData } from '../../services/highlights';
import { getProjects } from '../../services/projects';
import { getDevLogs } from '../../services/devlogs';
import { Toaster, toast } from 'sonner';

export function HighlightsPage() {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [devLogs, setDevLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<HighlightData>>({ project_ids: [], dev_log_ids: [] });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [highlightsData, projectsData, devLogsData] = await Promise.all([
        getHighlights(),
        getProjects(),
        getDevLogs(),
      ]);
      setHighlights(highlightsData);
      setProjects(projectsData);
      setDevLogs(devLogsData);
    } catch (error) {
      toast.error('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEditClick = (highlight: any) => {
    setEditingId(highlight.id!);
    setFormData({
      title: highlight.title,
      description: highlight.description,
      cover_url: highlight.cover_url,
      display_order: highlight.display_order,
      project_ids: highlight.HighlightsOnProjects.map((p: any) => p.Project.id) || [],
      dev_log_ids: highlight.HighlightsOnDevLogs.map((d: any) => d.DevLog.id) || [],
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ project_ids: [], dev_log_ids: [] });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 하이라이트를 삭제하시겠습니까?')) {
      try {
        await deleteHighlight(id);
        toast.success('하이라이트가 삭제되었습니다.');
        fetchData();
      } catch (error) {
        toast.error('하이라이트 삭제에 실패했습니다.');
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!formData.title || !formData.description) {
      toast.error('제목과 설명은 필수 항목입니다.');
      setIsSubmitting(false);
      return;
    }
    try {
      if (editingId) {
        await updateHighlight(editingId, formData as HighlightData);
        toast.success('하이라이트가 수정되었습니다.');
      } else {
        await createHighlight(formData as HighlightData);
        toast.success('하이라이트가 생성되었습니다.');
      }
      handleCancelEdit();
      fetchData();
    } catch (error) {
      toast.error(`하이라이트 ${editingId ? '수정' : '생성'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectSelection = (projectId: number) => {
    setFormData(prev => {
      const selected = prev.project_ids || [];
      if (selected.includes(projectId)) {
        return { ...prev, project_ids: selected.filter(id => id !== projectId) };
      } else {
        return { ...prev, project_ids: [...selected, projectId] };
      }
    });
  };

  const handleDevLogSelection = (devLogId: number) => {
    setFormData(prev => {
      const selected = prev.dev_log_ids || [];
      if (selected.includes(devLogId)) {
        return { ...prev, dev_log_ids: selected.filter(id => id !== devLogId) };
      } else {
        return { ...prev, dev_log_ids: [...selected, devLogId] };
      }
    });
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? '하이라이트 수정' : '새 하이라이트 추가'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic Info */}
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
                  
                  {/* Project Selection */}
                  <div className="space-y-2">
                    <Label>연결할 프로젝트</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border p-2">
                      {projects.map(p => (
                        <div key={p.id} className="flex items-center gap-2">
                          <Checkbox id={`proj-${p.id}`} checked={formData.project_ids?.includes(p.id)} onCheckedChange={() => handleProjectSelection(p.id)} />
                          <Label htmlFor={`proj-${p.id}`}>{p.title}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DevLog Selection */}
                  <div className="space-y-2">
                    <Label>연결할 개발 로그</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border p-2">
                      {devLogs.map(d => (
                        <div key={d.id} className="flex items-center gap-2">
                          <Checkbox id={`dev-${d.id}`} checked={formData.dev_log_ids?.includes(d.id)} onCheckedChange={() => handleDevLogSelection(d.id)} />
                          <Label htmlFor={`dev-${d.id}`}>{d.title}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '저장 중...' : '저장'}</Button>
                    {editingId && <Button variant="outline" onClick={handleCancelEdit}>취소</Button>}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* List Section */}
          <div className="lg-col-span-2">
            <Card>
              <CardHeader><CardTitle>하이라이트 목록</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>순서</TableHead><TableHead>제목</TableHead><TableHead>연결</TableHead><TableHead className="text-right">작업</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {loading ? <TableRow><TableCell colSpan={4} className="text-center">로딩 중...</TableCell></TableRow> :
                     highlights.length > 0 ? highlights.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell>{h.display_order}</TableCell>
                        <TableCell>{h.title}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {h.HighlightsOnProjects.map((p: any) => <div key={`proj-${p.project_id}`} className="flex items-center gap-1 text-xs"><Folder className="w-3 h-3" /> {p.Project?.title || 'N/A'}</div>)}
                            {h.HighlightsOnDevLogs.map((d: any) => <div key={`dev-${d.dev_log_id}`} className="flex items-center gap-1 text-xs"><BookOpen className="w-3 h-3" /> {d.DevLog?.title || 'N/A'}</div>)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleEditClick(h)}>수정</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(h.id)} className="text-red-500">삭제</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )) : <TableRow><TableCell colSpan={4} className="text-center">하이라이트가 없습니다.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </>
  );
}
