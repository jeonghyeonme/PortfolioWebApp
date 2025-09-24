import { supabase } from '../utils/supabase/client';

export interface HighlightData {
  id?: number;
  title: string;
  description: string;
  cover_url?: string;
  display_order?: number;
  project_ids?: number[];  // Changed from projectId
  dev_log_ids?: number[];  // Changed from devLogId
}

// Helper to manage many-to-many relations for Highlights
const manageHighlightRelations = async (highlightId: number, project_ids: number[] = [], dev_log_ids: number[] = []) => {
  // Clear existing relations
  await supabase.from('HighlightsOnProjects').delete().eq('highlight_id', highlightId);
  await supabase.from('HighlightsOnDevLogs').delete().eq('highlight_id', highlightId);

  // Insert new project relations
  if (project_ids.length > 0) {
    const projectRelations = project_ids.map(projectId => ({ highlight_id: highlightId, project_id: projectId }));
    const { error } = await supabase.from('HighlightsOnProjects').insert(projectRelations);
    if (error) throw error;
  }

  // Insert new devlog relations
  if (dev_log_ids.length > 0) {
    const devLogRelations = dev_log_ids.map(devLogId => ({ highlight_id: highlightId, dev_log_id: devLogId }));
    const { error } = await supabase.from('HighlightsOnDevLogs').insert(devLogRelations);
    if (error) throw error;
  }
};

// READ (List) - Now includes relations
export const getHighlights = async () => {
  const { data, error } = await supabase
    .from('Highlight')
    .select(`
      *,
      HighlightsOnProjects ( Project (id, title) ),
      HighlightsOnDevLogs ( DevLog (id, title) )
    `)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
};

// READ (Single) - Now includes relations
export const getHighlightById = async (id: number) => {
  const { data, error } = await supabase
    .from('Highlight')
    .select(`
      *,
      HighlightsOnProjects ( project_id ),
      HighlightsOnDevLogs ( dev_log_id )
    `)
    .eq('id', id)
    .single();
  if (error) {
    console.error(error); // Log the actual error
    throw error;
  }

  // Destructure to remove the nested arrays from the main object
  const { HighlightsOnProjects, HighlightsOnDevLogs, ...restOfData } = data;

  // Format data for the form
  const formattedData = {
    ...restOfData,
    project_ids: HighlightsOnProjects.map((p: any) => p.project_id),
    dev_log_ids: HighlightsOnDevLogs.map((d: any) => d.dev_log_id),
  };
  return formattedData;
};

// READ (Single for Detail Page) - Fetches nested titles using RPC
export const getHighlightDetailsById = async (id: number) => {
  const { data, error } = await supabase
    .rpc('get_highlight_details', { p_id: id });

  if (error) {
    console.error('RPC Error:', error);
    throw error;
  }
  return data;
};

// CREATE
export const createHighlight = async (highlightData: HighlightData) => {
  const { project_ids, dev_log_ids, ...mainData } = highlightData;
  const { data, error } = await supabase.from('Highlight').insert(mainData).select().single();
  if (error) throw error;

  await manageHighlightRelations(data.id, project_ids, dev_log_ids);
  return data;
};

// UPDATE
export const updateHighlight = async (id: number, highlightData: HighlightData) => {
  const { project_ids, dev_log_ids, ...mainData } = highlightData;
  const { data, error } = await supabase.from('Highlight').update(mainData).eq('id', id).select().single();
  if (error) throw error;

  await manageHighlightRelations(data.id, project_ids, dev_log_ids);
  return data;
};

// DELETE
export const deleteHighlight = async (id: number) => {
  // Relations are deleted automatically by CASCADE constraint
  const { error } = await supabase.from('Highlight').delete().eq('id', id);
  if (error) throw error;
  return true;
};