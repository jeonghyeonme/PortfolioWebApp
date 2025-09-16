import { supabase } from '../utils/supabase/client';

export interface HighlightData {
  id?: number;
  title: string;
  description: string;
  cover_url?: string;
  display_order?: number;
  project_ids?: number[];
  dev_log_ids?: number[];
}

// READ (List for Admin)
export const getHighlights = async () => {
  const { data, error } = await supabase
    .from('Highlight')
    .select(`
      id, title, display_order,
      HighlightsOnProjects ( Project (title) ),
      HighlightsOnDevLogs ( DevLog (title) )
    `)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data;
};

// Helper function to manage relations
const manageRelations = async (highlight_id: number, project_ids: number[] = [], dev_log_ids: number[] = []) => {
  // Clear existing relations first
  await supabase.from('HighlightsOnProjects').delete().eq('highlight_id', highlight_id);
  await supabase.from('HighlightsOnDevLogs').delete().eq('highlight_id', highlight_id);

  // Insert new project relations
  if (project_ids.length > 0) {
    const projectRelations = project_ids.map(id => ({ highlight_id, project_id: id }));
    const { error: projectError } = await supabase.from('HighlightsOnProjects').insert(projectRelations);
    if (projectError) throw projectError;
  }

  // Insert new devlog relations
  if (dev_log_ids.length > 0) {
    const devLogRelations = dev_log_ids.map(id => ({ highlight_id, dev_log_id: id }));
    const { error: devLogError } = await supabase.from('HighlightsOnDevLogs').insert(devLogRelations);
    if (devLogError) throw devLogError;
  }
};

// CREATE
export const createHighlight = async (highlightData: HighlightData) => {
  const { project_ids, dev_log_ids, ...mainData } = highlightData;
  
  const { data, error } = await supabase
    .from('Highlight')
    .insert(mainData)
    .select()
    .single();

  if (error) throw error;

  await manageRelations(data.id, project_ids, dev_log_ids);
  return data;
};

// UPDATE
export const updateHighlight = async (id: number, highlightData: any) => {
  const { project_ids, dev_log_ids, ...mainData } = highlightData;

  // Explicitly build the object to update, ensuring no extra fields are sent.
  const dataToUpdate = {
    title: mainData.title,
    description: mainData.description,
    cover_url: mainData.cover_url,
    display_order: mainData.display_order,
  };

  const { data, error } = await supabase
    .from('Highlight')
    .update(dataToUpdate)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating highlight:", JSON.stringify(error, null, 2));
    throw error;
  }

  await manageRelations(data.id, project_ids, dev_log_ids);
  return data;
};

// DELETE
export const deleteHighlight = async (id: number) => {
  const { error } = await supabase.from('Highlight').delete().eq('id', id);
  if (error) throw error;
  return true;
};