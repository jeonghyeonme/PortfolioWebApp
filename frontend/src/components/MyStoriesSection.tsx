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

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                <span className="text-2xl">My Stories</span>
              </CardTitle>
              {isAdmin && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      수정
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
              )}
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>성장 과정</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-lg max-w-none">
                      {stories.growth_story || "성장 과정에 대한 내용이 여기에 표시됩니다."}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>성취 경험</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-lg max-w-none">
                      {stories.accomplishment_story || "성취 경험에 대한 내용이 여기에 표시됩니다."}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
