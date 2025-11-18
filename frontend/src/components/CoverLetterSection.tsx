import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Edit } from 'lucide-react';
import { coverLetterAPI } from '../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CoverLetterEditForm } from './CoverLetterEditForm';
import { CoverLetterData } from '../services/coverLetter';

interface CoverLetterSectionProps {
  isAdmin?: boolean;
}

export function CoverLetterSection({ isAdmin = false }: CoverLetterSectionProps) {
  const [coverLetter, setCoverLetter] = useState<CoverLetterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchCoverLetter = async () => {
    setLoading(true);
    try {
      const data = await coverLetterAPI.getPrimary(); 
      setCoverLetter(data);
    } catch (error) {
      console.error('Failed to fetch cover letter:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoverLetter();
  }, []);

  const handleSave = (updatedCoverLetter: CoverLetterData) => {
    setCoverLetter(updatedCoverLetter);
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

  if (!coverLetter) {
    return null; // Or show a message if no cover letter is found
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
                <span className="text-2xl">{coverLetter.title}</span>
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
                      <DialogTitle>자기소개서 수정</DialogTitle>
                    </DialogHeader>
                    <CoverLetterEditForm
                      coverLetterData={coverLetter}
                      onSave={handleSave}
                      onCancel={() => setIsEditDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <p>{coverLetter.content}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
