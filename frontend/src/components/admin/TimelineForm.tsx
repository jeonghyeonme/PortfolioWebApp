import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TimelineItem } from '../../services/api';

const formSchema = z.object({
  Type: z.enum(['work', 'education'], { required_error: '타입을 선택해주세요.' }),
  Title: z.string().min(2, { message: '제목은 2자 이상이어야 합니다.' }),
  Company: z.string().optional(),
  Location: z.string().optional(),
  Period: z.string().min(2, { message: '기간을 입력해주세요.' }),
  Description: z.string().optional(),
  Technologies: z.array(z.string()).optional(),
  SortOrder: z.coerce.number().int().optional(),
});

type TimelineFormValues = z.infer<typeof formSchema>;

interface TimelineFormProps {
  initialData?: TimelineItem | null;
  onSave: (data: TimelineFormValues) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function TimelineForm({ initialData, onSave, onCancel, isSaving }: TimelineFormProps) {
  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Type: initialData?.Type || 'work',
      Title: initialData?.Title || '',
      Company: initialData?.Company || '',
      Location: initialData?.Location || '',
      Period: initialData?.Period || '',
      Description: initialData?.Description || '',
      Technologies: initialData?.Technologies || [],
      SortOrder: initialData?.SortOrder || 0,
    },
  });

  const onSubmit = (data: TimelineFormValues) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="Title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목</FormLabel>
                <FormControl><Input placeholder="예: 프론트엔드 개발자" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>소속</FormLabel>
                <FormControl><Input placeholder="예: 테크스타트업 A" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>타입</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="타입 선택" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="work">업무</SelectItem>
                    <SelectItem value="education">학습</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>기간</FormLabel>
                <FormControl><Input placeholder="예: 2023.03 - 현재" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>위치</FormLabel>
                <FormControl><Input placeholder="예: 서울, 대한민국" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="SortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>정렬 순서</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상세 설명</FormLabel>
              <FormControl><Textarea placeholder="주요 역할 및 성과를 입력하세요." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>기술 스택</FormLabel>
              <FormControl>
                <Input 
                  placeholder="쉼표(,)로 구분하여 입력하세요 (예: React,TypeScript,Node.js)" 
                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                  value={(field.value || []).join(', ')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            취소
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
