import { supabase } from '../utils/supabase/client';

// Profile API
export const profileAPI = {
  get: async () => {
    const { data, error } = await supabase
      .from('Profile')
      .select('*')
      .single();


    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    return data;
  },
  update: async (updates: { [key: string]: any }) => {
    // Assuming there's only one profile, we need its ID.
    // Let's fetch it first, or assume a known ID if it's static.
    // For this case, let's assume the profile ID is 1 for simplicity.
    // A better approach would be to get the user's profile ID.
    const { data, error } = await supabase
      .from('Profile')
      .update(updates)
      .eq('id', 1) // IMPORTANT: Assuming profile ID is 1
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    return data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (params?: { skill?: string; limit?: number }) => {
    let query = supabase
      .from('Project')
      .select(`
        *,
        SkillOnProject (
          Skill (
            id,
            name
          )
        )
      `);

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    query = query.order('created_at', { ascending: false });

    let { data, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    if (params?.skill && data) {
      data = data.filter((p: any) => 
        p.SkillOnProject.some((s: any) => s.Skill.name === params.skill)
      );
    }

    return data.map((p: any) => ({
      ...p,
      technologies: p.SkillOnProject.map((s: any) => s.Skill.name)
    }));
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('Project')
      .select(`
        *,
        SkillOnProject (
          Skill (
            id,
            name,
            image_url,
            SkillCategory ( name )
          )
        ),
        TagsOnProjects (
          Tag ( id, name )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project by id:', error);
      throw error;
    }

    return {
      ...data,
      technologies: data.SkillOnProject.map((s: any) => s.Skill),
      tags: data.TagsOnProjects.map((t: any) => t.Tag),
    };
  },
};

// DevLogs API
export const devlogsAPI = {
  getAll: async (params?: { published?: boolean; tag?: string; limit?: number }) => {
    let query = supabase
      .from('DevLog')
      .select(`
        *,
        TagsOnDevLogs (
          Tag (
            id,
            name
          )
        )
      `);

    if (params?.published) {
      query = query.eq('published', true);
    }
    
    if (params?.limit) {
      query = query.limit(params.limit);
    }

    query = query.order('created_at', { ascending: false });

    let { data, error } = await query;

    if (error) {
      console.error('Error fetching dev logs:', error);
      throw error;
    }

    if (params?.tag && data) {
      data = data.filter((p: any) => 
        p.TagsOnDevLogs.some((t: any) => t.Tag.name === params.tag)
      );
    }

    return data.map((p: any) => ({
      ...p,
      tags: p.TagsOnDevLogs.map((t: any) => t.Tag.name)
    }));
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('DevLog')
      .select(`
        *,
        TagsOnDevLogs (
          Tag ( id, name )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching dev log by id:', error);
      throw error;
    }

    return {
      ...data,
      tags: data.TagsOnDevLogs.map((t: any) => t.Tag.name),
    };
  },
};

// Highlights API
export const highlightsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('Highlight')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching highlights:', error);
      throw error;
    }
    return data;
  },
};

// Skills API
export const skillsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('Skill')
      .select('name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
    return data.map(s => s.name);
  }
};

// Tags API
export const tagsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('Tag')
      .select('name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
    return data.map(t => t.name);
  }
};

// Timeline API
export const timelineAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('Timeline')
      .select('*')
      .order('SortOrder', { ascending: true });

    if (error) {
      console.error('Error fetching timeline:', error);
      throw error;
    }
    return data;
  },
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('Timeline')
      .select('*')
      .eq('Id', id)
      .single();

    if (error) {
      console.error('Error fetching timeline item by id:', error);
      throw error;
    }
    return data;
  },
  create: async (item: Omit<TimelineItem, 'Id' | 'CreatedAt' | 'UserId'>) => {
    const { data, error } = await supabase
      .from('Timeline')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Error creating timeline item:', error);
      throw error;
    }
    return data;
  },
  update: async (id: string, updates: Partial<TimelineItem>) => {
    const { data, error } = await supabase
      .from('Timeline')
      .update(updates)
      .eq('Id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating timeline item:', error);
      throw error;
    }
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('Timeline')
      .delete()
      .eq('Id', id);

    if (error) {
      console.error('Error deleting timeline item:', error);
      throw error;
    }
    return true;
  },
};

// Define the TimelineItem type for better type-safety

export interface TimelineItem {

  Id: string;

  UserId: string;

  Type: 'work' | 'education';

  Title: string;

  Company?: string;

  Location?: string;

  Period: string;

  Description?: string;

  Technologies?: string[];

  SortOrder: number;

  CreatedAt: string;

}



// Dashboard API

export const dashboardAPI = {

  get: async () => {

    const { data, error } = await supabase

      .from('Dashboard')

      .select('*')

      .single();



    if (error) {

      console.error('Error fetching dashboard data:', error);

      throw error;

    }

    return data;

  },
  update: async (id: number, updates: Partial<any>) => {
    const { data, error } = await supabase
      .from('Dashboard')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error updating dashboard data:', error);
      throw error;
    }
    return data;
  },

};

// Cover Letter API
import * as coverLetterService from './coverLetter';

export const coverLetterAPI = {
  getPrimary: coverLetterService.getPrimaryCoverLetter,
  getById: coverLetterService.getCoverLetterById,
  update: coverLetterService.updateCoverLetter,
};
