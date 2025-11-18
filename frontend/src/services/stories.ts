import { supabase } from '../utils/supabase/client';

export interface StoriesData {
  id?: number;
  growth_story: string;
  accomplishment_story: string;
  created_at?: string;
  updated_at?: string;
}

const TABLE_NAME = 'stories';

export const getPrimaryStories = async (): Promise<StoriesData> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching primary stories:', error);
    throw error;
  }
  return data;
};

export const getStoriesById = async (id: number): Promise<StoriesData> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching stories with id ${id}:`, error);
    throw error;
  }
  return data;
};

export const updateStories = async (id: number, updates: Partial<StoriesData>): Promise<StoriesData> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating stories with id ${id}:`, error);
    throw error;
  }
  return data;
};
