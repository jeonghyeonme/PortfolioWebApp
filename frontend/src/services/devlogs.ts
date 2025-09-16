import { supabase } from '../utils/supabase/client';

export interface DevLogData {
  id?: number;
  title: string;
  content: string;
  published?: boolean;
  tag_ids?: number[];
}

// Helper to manage many-to-many relations
const manageRelations = async (dev_log_id: number, tag_ids: number[] = []) => {
  await supabase.from('TagsOnDevLogs').delete().eq('dev_log_id', dev_log_id);
  if (tag_ids && tag_ids.length > 0) {
    const relations = tag_ids.map(id => ({ dev_log_id, tag_id: id }));
    const { error } = await supabase.from('TagsOnDevLogs').insert(relations);
    if (error) throw error;
  }
};

// READ (List for Admin)
export const getDevLogs = async () => {
  const { data, error } = await supabase
    .from('DevLog')
    .select('id, title, published, created_at, updated_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// READ (Single with relations)
export const getDevLogById = async (id: number) => {
  const { data, error } = await supabase
    .from('DevLog')
    .select('*, TagsOnDevLogs ( Tag (id, name) )')
    .eq('id', id)
    .single();
  if (error) throw error;

  const formattedData = {
    ...data,
    tag_ids: data.TagsOnDevLogs.map((t: any) => t.Tag.id),
  };
  return formattedData;
};

// CREATE
export const createDevLog = async (devLogData: DevLogData) => {
  const { tag_ids, ...mainData } = devLogData;
  const { data, error } = await supabase.from('DevLog').insert(mainData).select().single();
  if (error) throw error;
  await manageRelations(data.id, tag_ids);
  return data;
};

// UPDATE
export const updateDevLog = async (id: number, devLogData: any) => {
  const { tag_ids } = devLogData;

  const dataToUpdate = {
    title: devLogData.title,
    content: devLogData.content,
    published: devLogData.published,
  };

  const { error } = await supabase
    .from('DevLog')
    .update(dataToUpdate)
    .eq('id', id);

  if (error) {
    console.error('Error during DevLog update:', JSON.stringify(error, null, 2));    
    throw error;
  }

  if (tag_ids !== undefined) {
    await manageRelations(id, tag_ids);
  }
  
  return null;
};

// DELETE
export const deleteDevLog = async (id: number) => {
  const { error } = await supabase.from('DevLog').delete().eq('id', id);
  if (error) throw error;
  return true;
};