import { supabase } from '../utils/supabase/client';

// --- SkillCategory Interfaces & API ---
export interface SkillCategoryData {
  id?: number;
  name: string;
}

export const getSkillCategories = async () => {
  const { data, error } = await supabase.from('SkillCategory').select('*').order('name');
  if (error) throw error;
  return data;
};

export const createSkillCategory = async (categoryData: Partial<SkillCategoryData>) => {
  const { data, error } = await supabase.from('SkillCategory').insert(categoryData).select().single();
  if (error) throw error;
  return data;
};

export const updateSkillCategory = async (id: number, categoryData: Partial<SkillCategoryData>) => {
  const { data, error } = await supabase.from('SkillCategory').update(categoryData).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteSkillCategory = async (id: number) => {
  const { error } = await supabase.from('SkillCategory').delete().eq('id', id);
  if (error) throw error;
  return true;
};


// --- Skill Interfaces & API ---
export interface SkillData {
  id?: number;
  name: string;
  image_url?: string;
  category_id: number;
}

export const getSkills = async () => {
  const { data, error } = await supabase
    .from('Skill')
    .select('*, SkillCategory(name)')
    .order('name');
  if (error) throw error;
  return data;
};

export const createSkill = async (skillData: Partial<SkillData>) => {
  const { data, error } = await supabase.from('Skill').insert(skillData).select().single();
  if (error) throw error;
  return data;
};

export const updateSkill = async (id: number, skillData: Partial<SkillData>) => {
  // Explicitly build the object to update, removing any relational data like SkillCategory
  const dataToUpdate = {
    name: skillData.name,
    image_url: skillData.image_url,
    category_id: skillData.category_id,
  };

  console.log("Data being sent to update Skill:", JSON.stringify(dataToUpdate, null, 2));

  const { data, error } = await supabase
    .from('Skill')
    .update(dataToUpdate)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating skill:", JSON.stringify(error, null, 2));
    throw error;
  }
  return data;
};

export const deleteSkill = async (id: number) => {
  const { error } = await supabase.from('Skill').delete().eq('id', id);
  if (error) throw error;
  return true;
};
