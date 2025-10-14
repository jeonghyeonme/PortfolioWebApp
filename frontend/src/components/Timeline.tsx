import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Calendar, MapPin, Briefcase, GraduationCap, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { timelineAPI, TimelineItem } from '../services/api';
import { TimelineForm } from './admin/TimelineForm';

const iconMap = {
  work: Briefcase,
  education: GraduationCap,
};

interface TimelineProps {
  isAdmin?: boolean;
}

export function Timeline({ isAdmin = false }: TimelineProps) {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Admin state
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  const fetchTimelineData = async () => {
    setLoading(true);
    try {
      const data = await timelineAPI.getAll();
      setTimelineData(data || []);
    } catch (err) {
      setError('경력 정보를 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  // Admin handlers
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
        fetchTimelineData();
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
        await timelineAPI.update(selectedItem.Id, formData);
        toast.success('항목이 성공적으로 수정되었습니다.');
      } else {
        await timelineAPI.create(formData);
        toast.success('새 항목이 성공적으로 추가되었습니다.');
      }
      fetchTimelineData();
      setIsDialogOpen(false);
      setSelectedItem(null);
    } catch (err) {
      toast.error('저장에 실패했습니다.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && timelineData.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="relative flex items-start gap-6 animate-pulse">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-muted"></div>
                <div className="flex-1 bg-muted rounded-lg p-6 h-32"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </section>
    );
  }
  
  if (timelineData.length === 0 && !isAdmin) {
    return null;
  }

  return (
    <>
      {isAdmin && <Toaster position="bottom-right" />}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex justify-center items-center gap-4 mb-4">
              <h2 className="text-3xl sm:text-4xl">경력 & 학습 여정</h2>
              {isAdmin && (
                <Button size="sm" onClick={handleAddNew}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  추가
                </Button>
              )}
            </div>
            <p className="text-muted-foreground text-lg">
              지속적인 성장과 도전을 통해 쌓아온 개발 경험을 소개합니다
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-8">
              {timelineData.map((item, index) => {
                const Icon = iconMap[item.Type] || Briefcase;
                return (
                  <motion.div
                    key={item.Id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative flex items-start gap-6 group"
                  >
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                      item.Type === 'work' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-6">
                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDelete(item.Id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-medium">{item.Title}</h3>
                            <p className="text-muted-foreground">{item.Company}</p>
                          </div>
                          <div className="flex flex-col sm:items-end gap-1 mt-2 sm:mt-0">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="w-4 h-4" />{item.Period}</div>
                            {item.Location && <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="w-4 h-4" />{item.Location}</div>}
                          </div>
                        </div>
                        {item.Description && <p className="text-muted-foreground mb-4">{item.Description}</p>}
                        {item.Technologies && item.Technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.Technologies.map((tech, techIndex) => <Badge key={`${item.Id}-${tech}-${techIndex}`} variant="outline" className="text-xs">{tech}</Badge>)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {isAdmin && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{selectedItem ? '타임라인 수정' : '새 타임라인 추가'}</DialogTitle>
              <DialogDescription>
                {selectedItem ? '선택한 항목의 내용을 수정합니다.' : '새로운 경력 또는 학습 이력을 추가합니다.'}
              </DialogDescription>
            </DialogHeader>
            <TimelineForm
              initialData={selectedItem}
              onSave={handleSave}
              onCancel={() => setIsDialogOpen(false)}
              isSaving={isSaving}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
