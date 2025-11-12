import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ExperienceData } from '../../services/experiences';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { X } from 'lucide-react';

const experienceSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  problem_description: z.string().min(1, '문제 상황을 입력해주세요.'),
  solution_process: z.string().min(1, '해결 과정을 입력해주세요.'),
  lessons_learned: z.string().min(1, '배운 점을 입력해주세요.'),
  published: z.boolean().default(false),
  related_links: z.array(z.object({
    label: z.string().min(1, '레이블을 입력해주세요.'),
    url: z.string().url('유효한 URL을 입력해주세요.'),
  })).optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  experienceData?: ExperienceData | null;
  onSave: (data: ExperienceFormValues) => void;
  onCancel: () => void;
}

export const ExperienceEditForm: React.FC<ExperienceFormProps> = ({ experienceData, onSave, onCancel }) => {
  const isEditMode = !!experienceData;

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: '',
      problem_description: '',
      solution_process: '',
      lessons_learned: '',
      published: false,
      related_links: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'related_links',
  });

  useEffect(() => {
    if (experienceData) {
      form.reset({
        ...experienceData,
        related_links: experienceData.related_links || [],
      });
    } else {
      form.reset({
        title: '',
        problem_description: '',
        solution_process: '',
        lessons_learned: '',
        published: false,
        related_links: [],
      });
    }
  }, [experienceData, form]);

  const onSubmit = (values: ExperienceFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="예: 레거시 시스템 성능 개선" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="problem_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>문제 상황</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="어떤 문제가 있었나요?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="solution_process"
          render={({ field }) => (
            <FormItem>
              <FormLabel>해결 과정</FormLabel>
              <FormControl>
                <Textarea rows={6} placeholder="어떻게 문제를 해결했나요?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lessons_learned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>배운 점</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="이 경험을 통해 무엇을 배웠나요?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="text-base font-medium mb-2">관련 링크</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <FormField
                control={form.control}
                name={`related_links.${index}.label`}
                render={({ field }) => <Input placeholder="레이블 (예: GitHub)" {...field} className="w-1/3" />}
              />
              <FormField
                control={form.control}
                name={`related_links.${index}.url`}
                render={({ field }) => <Input placeholder="https://..." {...field} className="w-2/3" />}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ label: '', url: '' })}>
            링크 추가
          </Button>
        </div>

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>공개 상태</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">
            {isEditMode ? '수정하기' : '저장하기'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
