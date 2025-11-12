import React, { useEffect, useState, useCallback } from 'react';
import { 
  getExperiences, 
  deleteExperience, 
  createExperience, 
  updateExperience, 
  ExperienceData 
} from '../services/experiences';
import { ExperienceCard } from './ExperienceCard';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ExperienceEditForm, ExperienceFormValues } from '../pages/admin/ExperienceEditForm';

interface ExperienceSectionProps {
  isAdmin?: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ isAdmin = false }) => {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceData | null>(null);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getExperiences(!isAdmin);
      setExperiences(data);
    } catch (error) {
      toast.error('경험 데이터를 불러오는 데 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleAddNew = () => {
    setSelectedExperience(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const experienceToEdit = experiences.find(exp => exp.id === id);
    if (experienceToEdit) {
      setSelectedExperience(experienceToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 경험을 삭제하시겠습니까?')) {
      try {
        await deleteExperience(id);
        toast.success('경험이 성공적으로 삭제되었습니다.');
        fetchExperiences(); // Refetch experiences
      } catch (error) {
        toast.error('경험 삭제에 실패했습니다.');
      }
    }
  };

  const handleSave = async (data: ExperienceFormValues) => {
    try {
      if (selectedExperience) {
        await updateExperience(selectedExperience.id!, data);
        toast.success('경험이 성공적으로 수정되었습니다.');
      } else {
        await createExperience(data);
        toast.success('경험이 성공적으로 생성되었습니다.');
      }
      setIsModalOpen(false);
      fetchExperiences(); // Refetch experiences
    } catch (error) {
      toast.error(selectedExperience ? '수정에 실패했습니다.' : '생성에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading experiences...</div>;
  }

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">경험 하이라이트</h2>
          {isAdmin && (
            <Button onClick={handleAddNew}>
              새 경험 추가
            </Button>
          )}
        </div>
        <div className="space-y-8">
          {experiences.length > 0 ? (
            experiences.map(exp => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-muted-foreground">아직 등록된 경험이 없습니다.</p>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedExperience ? '경험 수정' : '새 경험 추가'}</DialogTitle>
          </DialogHeader>
          <ExperienceEditForm
            experienceData={selectedExperience}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};
