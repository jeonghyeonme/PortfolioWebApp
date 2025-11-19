import { MyStoriesEditForm } from './MyStoriesEditForm';
import { StoriesData } from '../services/stories';
import { TiptapEditor } from './TiptapEditor';

interface MyStoriesEditFormProps {
  storiesData: StoriesData;
  onSave: (updatedStories: StoriesData) => void;
  onCancel: () => void;
}

export function MyStoriesEditForm({ storiesData, onSave, onCancel }: MyStoriesEditFormProps) {
  const [formData, setFormData] = useState<Partial<StoriesData>>(storiesData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(storiesData);
  }, [storiesData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.id) return;

    setIsSubmitting(true);
    try {
      const updatedData = await storiesAPI.update(formData.id, formData);
      toast.success('My Stories가 성공적으로 수정되었습니다.');
      onSave(updatedData);
    } catch (error) {
      toast.error('My Stories 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="growth_story">성장 과정</Label>
          <div className="mt-2 p-2 border rounded-md">
            <TiptapEditor
              content={formData.growth_story || ''}
              onChange={(newContent) => setFormData(p => ({ ...p, growth_story: newContent }))}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="accomplishment_story">성취 경험</Label>
          <div className="mt-2 p-2 border rounded-md">
            <TiptapEditor
              content={formData.accomplishment_story || ''}
              onChange={(newContent) => setFormData(p => ({ ...p, accomplishment_story: newContent }))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>취소</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </form>
    </>
  );
}
