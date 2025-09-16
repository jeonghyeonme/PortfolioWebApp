import { supabase } from '../utils/supabase/client';

export interface TagData {
  id?: number;
  name: string;
}

export const getTags = async () => {
  const { data, error } = await supabase.from('Tag').select('*').order('name');
  if (error) throw error;
  return data;
};

export const createTag = async (tagData: Partial<TagData>) => {
  const { data, error } = await supabase.from('Tag').insert(tagData).select().single();
  if (error) throw error;
  return data;
};

export const updateTag = async (id: number, tagData: Partial<TagData>) => {
  const { data, error } = await supabase.from('Tag').update(tagData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteTag = async (id: number) => {
  const { error } = await supabase.from('Tag').delete().eq('id', id);
  if (error) throw error;
  return true;
};
