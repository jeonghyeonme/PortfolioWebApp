import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { getTags, createTag, updateTag, deleteTag, TagData } from '../../services/tags';
import { Toaster, toast } from 'sonner';

export function TagsPage() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<TagData>>({ name: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const tagsData = await getTags();
      setTags(tagsData);
    } catch (error) {
      toast.error('태그를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (tag: TagData) => {
    setEditingId(tag.id!);
    setFormData({ name: tag.name });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 태그를 삭제하시겠습니까? 모든 콘텐츠에서 연결이 해제됩니다.')) {
      try {
        await deleteTag(id);
        toast.success('태그가 삭제되었습니다.');
        fetchData();
      } catch (error) {
        toast.error('태그 삭제에 실패했습니다.');
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('태그 이름은 필수입니다.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateTag(editingId, formData);
        toast.success('태그가 수정되었습니다.');
      } else {
        await createTag(formData);
        toast.success('태그가 생성되었습니다.');
      }
      handleCancelEdit();
      fetchData();
    } catch (error) {
      toast.error(`태그 ${editingId ? '수정' : '생성'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8"
      >
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? '태그 수정' : '새 태그 추가'}</CardTitle>
                <CardDescription>콘텐츠를 분류할 태그를 관리하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">태그 이름</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '저장 중...' : '저장'}</Button>
                    {editingId && <Button variant="outline" onClick={handleCancelEdit}>취소</Button>}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>태그 목록</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={2} className="text-center">로딩 중...</TableCell></TableRow>
                    ) : tags.length > 0 ? (
                      tags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell>{tag.name}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleEditClick(tag)}>수정</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(tag.id!)} className="text-red-500">삭제</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={2} className="text-center">태그가 없습니다.</TableCell></TableRow>
                    )}
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
