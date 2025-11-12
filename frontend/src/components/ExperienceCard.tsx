import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ExperienceData } from '../services/experiences';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Link2 } from 'lucide-react';

interface ExperienceCardProps {
  experience: ExperienceData;
  isAdmin?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, isAdmin, onEdit, onDelete }) => {
  return (
    <Card className="w-full mb-8 overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{experience.title}</CardTitle>
          <div className="flex items-center gap-2">
            {!experience.published && <Badge variant="outline">Draft</Badge>}
            {isAdmin && onEdit && onDelete && (
              <div className="flex gap-2">
                <button onClick={() => onEdit(experience.id!)} className="text-sm text-blue-500 hover:underline">Edit</button>
                <button onClick={() => onDelete(experience.id!)} className="text-sm text-red-500 hover:underline">Delete</button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h3 className="font-semibold">Problem</h3>
          <ReactMarkdown>{experience.problem_description}</ReactMarkdown>
          
          <h3 className="font-semibold mt-4">Solution</h3>
          <ReactMarkdown>{experience.solution_process}</ReactMarkdown>

          <h3 className="font-semibold mt-4">Lessons Learned</h3>
          <ReactMarkdown>{experience.lessons_learned}</ReactMarkdown>
        </div>
      </CardContent>
      {experience.related_links && experience.related_links.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-4">
            {experience.related_links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Link2 className="w-4 h-4" />
                {link.label}
              </a>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
