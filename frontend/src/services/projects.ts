import { supabase } from '../utils/supabase/client';

export interface ProjectData {
  id?: number;
  title: string;
  description: string;
  published: boolean;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  start_date?: string;
  end_date?: string | null;
  skill_ids?: number[];
  tag_ids?: number[];
}

// Helper to manage many-to-many relations
const manageRelations = async (tableName: string, project_id: number, relatedIds: number[], relatedColumnName: string) => {
  const { error: deleteError } = await supabase.from(tableName).delete().eq('project_id', project_id);
  if (deleteError) throw deleteError;

  if (relatedIds && relatedIds.length > 0) {
    const relations = relatedIds.map(id => ({ project_id, [relatedColumnName]: id }));
    const { error: insertError } = await supabase.from(tableName).insert(relations);
    if (insertError) throw insertError;
  }
};

// READ (List for Admin)
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('Project')
    .select('id, title, created_at, published')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// READ (Single with relations)
export const getProjectById = async (id: number) => {
  const { data, error } = await supabase
    .from('Project')
    .select(`
      *,
      SkillOnProject ( Skill (id, name) ),
      TagsOnProjects ( Tag (id, name) )
    `)
    .eq('id', id)
    .single();
  if (error) throw error;
  
  const formattedData = {
    ...data,
    skill_ids: data.SkillOnProject.map((s: any) => s.Skill.id),
    tag_ids: data.TagsOnProjects.map((t: any) => t.Tag.id),
  };
  return formattedData;
};

// CREATE
export const createProject = async (projectData: ProjectData) => {
  const { skill_ids, tag_ids, ...mainData } = projectData;
  const { data, error } = await supabase.from('Project').insert(mainData).select().single();
  if (error) throw error;

  await manageRelations('SkillOnProject', data.id, skill_ids || [], 'skill_id');
  await manageRelations('TagsOnProjects', data.id, tag_ids || [], 'tag_id');
  
  return data;
};

// UPDATE (Corrected)
export const updateProject = async (id: number, projectData: any) => {
  const { skill_ids, tag_ids, ...mainData } = projectData;

  // Explicitly define the fields to be updated to avoid sending relational data
  const dataToUpdate = {
    title: mainData.title,
    description: mainData.description,
    published: mainData.published, // Ensure published is included
    image_url: mainData.image_url,
    project_url: mainData.project_url,
    github_url: mainData.github_url,
    start_date: mainData.start_date,
    end_date: mainData.end_date,
  };

  const { data, error } = await supabase
    .from('Project')
    .update(dataToUpdate)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", JSON.stringify(error, null, 2));
    throw error;
  }

  await manageRelations('SkillOnProject', data.id, skill_ids || [], 'skill_id');
  await manageRelations('TagsOnProjects', data.id, tag_ids || [], 'tag_id');

  return data;
};

// DELETE
export const deleteProject = async (id: number) => {
  await supabase.from('SkillOnProject').delete().eq('project_id', id);
  await supabase.from('TagsOnProjects').delete().eq('project_id', id);
  
  const { error } = await supabase.from('Project').delete().eq('id', id);
  if (error) throw error;
  return true;
};
