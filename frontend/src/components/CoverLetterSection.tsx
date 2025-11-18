import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Edit } from 'lucide-react';
import { coverLetterAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface CoverLetter {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface CoverLetterSectionProps {
  isAdmin?: boolean;
}

export function CoverLetterSection({ isAdmin = false }: CoverLetterSectionProps) {
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoverLetter = async () => {
      try {
        // Assuming you have a method to get the primary cover letter
        const data = await coverLetterAPI.getPrimary(); 
        setCoverLetter(data);
      } catch (error) {
        console.error('Failed to fetch cover letter:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoverLetter();
  }, []);

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
                <h2 className="text-2xl">{coverLetter.title}</h2>
              </CardTitle>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate(`/admin/cover-letter/edit/${coverLetter.id}`)}>
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </Button>
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
