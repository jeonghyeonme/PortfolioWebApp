import { useState, useEffect } from 'react';
import { timelineAPI, TimelineItem } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { TimelineForm } from '../../components/admin/TimelineForm';

export function TimelineAdminPage() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  const fetchTimelineItems = async () => {
    setLoading(true);
    try {
      const data = await timelineAPI.getAll();
      setTimelineItems(data || []);
    } catch (err) {
      setError('타임라인 데이터를 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineItems();
  }, []);

  const handleAddNew = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: TimelineItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      try {
        await timelineAPI.delete(id);
        toast.success('항목이 성공적으로 삭제되었습니다.');
        fetchTimelineItems();
      } catch (err) {
        toast.error('항목 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  const handleSave = async (formData: any) => {
    setIsSaving(true);
    try {
      if (selectedItem) {
        // Update existing item
        await timelineAPI.update(selectedItem.Id, formData);
        toast.success('항목이 성공적으로 수정되었습니다.');
      } else {
        // Create new item
        await timelineAPI.create(formData);
        toast.success('새 항목이 성공적으로 추가되었습니다.');
      }
      fetchTimelineItems();
      setIsDialogOpen(false);
      setSelectedItem(null);
    } catch (err) {
      toast.error('저장에 실패했습니다.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-destructive">{error}</div>;

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">타임라인 관리</h1>
          <Button onClick={handleAddNew}>
            <PlusCircle className="w-4 h-4 mr-2" />
            새 항목 추가
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>타임라인 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineItems.map((item) => (
                <div key={item.Id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">{item.Title} <span className="text-sm text-muted-foreground">({item.Company})</span></p>
                    <p className="text-sm text-muted-foreground">{item.Period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.Id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{selectedItem ? '타임라인 수정' : '새 타임라인 추가'}</DialogTitle>
            </DialogHeader>
            <TimelineForm
              initialData={selectedItem}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
              isSaving={isSaving}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
