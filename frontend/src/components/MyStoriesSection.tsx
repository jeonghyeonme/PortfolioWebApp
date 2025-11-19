import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Edit } from 'lucide-react';
import { storiesAPI } from '../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { MyStoriesEditForm } from './MyStoriesEditForm';
import { StoriesData } from '../services/stories';

interface MyStoriesSectionProps {
  isAdmin?: boolean;
}

export function MyStoriesSection({ isAdmin = false }: MyStoriesSectionProps) {
  const [stories, setStories] = useState<StoriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const data = await storiesAPI.getPrimary();
      setStories(data);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSave = (updatedStories: StoriesData) => {
    setStories(updatedStories);
    setIsEditDialogOpen(false);
  };

  const renderStoryFromHTML = (htmlString: string) => {
    return <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!stories) {
    return null; // Or show a message if no stories are found
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {isAdmin && (
            <div className="flex justify-center mb-4">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    My Stories 수정
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto custom-scrollable-dialog">
                  <DialogHeader>
                    <DialogTitle>My Stories 수정</DialogTitle>
                  </DialogHeader>
                  <MyStoriesEditForm
                    storiesData={stories}
                    onSave={handleSave}
                    onCancel={() => setIsEditDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl mb-12 font-bold tracking-tight">My Stories</h2>
          
          <div className="text-left space-y-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4 border-b pb-2">성장 과정</h3>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {renderStoryFromHTML(stories.growth_story || "성장 과정에 대한 내용이 여기에 표시됩니다.")}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 border-b pb-2">성취 경험</h3>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {renderStoryFromHTML(stories.accomplishment_story || "성취 경험에 대한 내용이 여기에 표시됩니다.")}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
