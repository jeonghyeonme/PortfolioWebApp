import { supabase } from '../utils/supabase/client';

export interface CoverLetterData {
  id?: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

const TABLE_NAME = 'cover_letters';

export const getPrimaryCoverLetter = async (): Promise<CoverLetterData> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching primary cover letter:', error);
    throw error;
  }
  return data;
};

export const getCoverLetterById = async (id: number): Promise<CoverLetterData> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching cover letter with id ${id}:`, error);
    throw error;
  }
  return data;
};

export const updateCoverLetter = async (id: number, updates: Partial<CoverLetterData>): Promise<CoverLetterData> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating cover letter with id ${id}:`, error);
    throw error;
  }
  return data;
};
