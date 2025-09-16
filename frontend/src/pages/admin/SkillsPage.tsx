import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { 
  getSkills, createSkill, updateSkill, deleteSkill, SkillData,
  getSkillCategories, createSkillCategory, updateSkillCategory, deleteSkillCategory, SkillCategoryData
} from '../../services/skills';
import { Toaster, toast } from 'sonner';

export function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<SkillCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [skillForm, setSkillForm] = useState<Partial<SkillData>>({ name: '', image_url: '', category_id: undefined });
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [isSkillSubmitting, setIsSkillSubmitting] = useState(false);

  const [categoryForm, setCategoryForm] = useState<Partial<SkillCategoryData>>({});
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [skillsData, categoriesData] = await Promise.all([getSkills(), getSkillCategories()]);
      setSkills(skillsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- Skill Handlers ---
  const handleSkillSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!skillForm.name || !skillForm.category_id) {
      toast.error('스킬 이름과 카테고리는 필수입니다.'); return;
    }
    setIsSkillSubmitting(true);
    try {
      if (editingSkillId) {
        await updateSkill(editingSkillId, skillForm);
        toast.success('스킬이 수정되었습니다.');
      } else {
        await createSkill(skillForm);
        toast.success('스킬이 생성되었습니다.');
      }
      setEditingSkillId(null); setSkillForm({ name: '', image_url: '', category_id: undefined }); fetchData();
    } catch (error) {
      toast.error(`스킬 ${editingSkillId ? '수정' : '생성'} 실패`);
    } finally {
      setIsSkillSubmitting(false);
    }
  };

  const handleSkillDelete = async (id: number) => {
    if (window.confirm('정말로 이 스킬을 삭제하시겠습니까?')) {
      try {
        await deleteSkill(id);
        toast.success('스킬이 삭제되었습니다.'); fetchData();
      } catch (error) {
        toast.error('스킬 삭제 실패');
      }
    }
  };

  // --- Category Handlers ---
  const handleCategorySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoryForm.name) {
      toast.error('카테고리 이름은 필수입니다.'); return;
    }
    setIsCategorySubmitting(true);
    try {
      if (editingCategoryId) {
        await updateSkillCategory(editingCategoryId, categoryForm);
        toast.success('카테고리가 수정되었습니다.');
      } else {
        await createSkillCategory(categoryForm);
        toast.success('카테고리가 생성되었습니다.');
      }
      setEditingCategoryId(null); setCategoryForm({}); fetchData();
    } catch (error) {
      toast.error(`카테고리 ${editingCategoryId ? '수정' : '생성'} 실패`);
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleCategoryDelete = async (id: number) => {
    if (window.confirm('정말로 이 카테고리를 삭제하시겠습니까? 이 카테고리에 속한 모든 스킬의 연결이 끊어집니다.')) {
      try {
        await deleteSkillCategory(id);
        toast.success('카테고리가 삭제되었습니다.'); fetchData();
      } catch (error) {
        toast.error('카테고리 삭제 실패: 먼저 이 카테고리에 속한 모든 스킬을 삭제하거나 다른 카테고리로 옮겨야 합니다.');
      }
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Forms Section */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader><CardTitle>{editingCategoryId ? '카테고리 수정' : '새 카테고리 추가'}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">카테고리 이름</Label>
                    <Input id="categoryName" value={categoryForm.name || ''} onChange={(e) => setCategoryForm(p => ({...p, name: e.target.value}))} required />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isCategorySubmitting}>{isCategorySubmitting ? '저장 중...' : '저장'}</Button>
                    {editingCategoryId && <Button variant="outline" onClick={() => { setEditingCategoryId(null); setCategoryForm({}); }}>취소</Button>}
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{editingSkillId ? '스킬 수정' : '새 스킬 추가'}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSkillSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="skillName">스킬 이름</Label>
                    <Input id="skillName" value={skillForm.name || ''} onChange={(e) => setSkillForm(p => ({...p, name: e.target.value}))} required />
                  </div>
                  <div>
                    <Label htmlFor="image_url">이미지 URL</Label>
                    <Input id="image_url" value={skillForm.image_url || ''} onChange={(e) => setSkillForm(p => ({...p, image_url: e.target.value}))} />
                  </div>
                  <div>
                    <Label htmlFor="category_id">카테고리</Label>
                    <Select value={skillForm.category_id?.toString()} onValueChange={(val) => setSkillForm(p => ({...p, category_id: Number(val)}))}>
                      <SelectTrigger><SelectValue placeholder="카테고리 선택..." /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id!.toString()}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSkillSubmitting}>{isSkillSubmitting ? '저장 중...' : '스킬 저장'}</Button>
                    {editingSkillId && <Button variant="outline" onClick={() => { setEditingSkillId(null); setSkillForm({}); }}>취소</Button>}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lists Section */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle>카테고리 목록</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>이름</TableHead><TableHead className="text-right">작업</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {loading ? <TableRow><TableCell colSpan={2} className="text-center">로딩 중...</TableCell></TableRow> :
                     categories.length > 0 ? categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell>{cat.name}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingCategoryId(cat.id!); setCategoryForm(cat); }}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleCategoryDelete(cat.id!)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </TableCell>
                      </TableRow>
                    )) : <TableRow><TableCell colSpan={2} className="text-center">카테고리가 없습니다.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>스킬 목록</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>이름</TableHead><TableHead>카테고리</TableHead><TableHead className="text-right">작업</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {loading ? <TableRow><TableCell colSpan={3} className="text-center">로딩 중...</TableCell></TableRow> :
                     skills.length > 0 ? skills.map((skill) => (
                      <TableRow key={skill.id}>
                        <TableCell>{skill.name}</TableCell>
                        <TableCell><Badge variant="outline">{skill.SkillCategory?.name}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingSkillId(skill.id); setSkillForm(skill); }}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleSkillDelete(skill.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                        </TableCell>
                      </TableRow>
                    )) : <TableRow><TableCell colSpan={3} className="text-center">스킬이 없습니다.</TableCell></TableRow>}
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
