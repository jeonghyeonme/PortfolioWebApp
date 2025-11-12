import { supabase } from '../utils/supabase/client';

export interface ExperienceData {
  id?: number;
  created_at?: string;
  title: string;
  problem_description: string;
  solution_process: string;
  lessons_learned: string;
  related_links?: { label: string; url: string }[];
  published: boolean;
}

// READ (List)
// Fetches all experiences for admin view, or only published ones for public view.
export const getExperiences = async (publishedOnly = true) => {
  let query = supabase
    .from('experiences')
    .select('*')
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as ExperienceData[];
};

// READ (Single)
export const getExperienceById = async (id: number) => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as ExperienceData;
};

// CREATE
export const createExperience = async (experienceData: Omit<ExperienceData, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experienceData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// UPDATE
export const updateExperience = async (id: number, experienceData: Partial<ExperienceData>) => {
  const { data, error } = await supabase
    .from('experiences')
    .update(experienceData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// DELETE
export const deleteExperience = async (id: number) => {
  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) throw error;
  return true;
};
