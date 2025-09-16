import { supabase } from '../utils/supabase/client';

export interface ProfileData {
  id?: number;
  full_name: string;
  job_title: string;
  bio: string;
  profile_image_url?: string;
  email: string;
  social_links: { [key: string]: string };
  keywords: string[];
}

// Get the profile data (always id = 1)
export const getProfile = async (): Promise<ProfileData> => {
  const { data, error } = await supabase
    .from('Profile')
    .select('*')
    .eq('id', 1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: "The result contains 0 rows"
    console.error('Error fetching profile:', error);
    throw new Error('프로필 정보를 불러오는 데 실패했습니다.');
  }

  // If no profile exists, return a default structure
  if (!data) {
    return {
      fullName: '',
      jobTitle: '',
      bio: '',
      email: '',
      socialLinks: {},
      keywords: [],
    };
  }

  return data;
};

// Update or create the profile data
export const updateProfile = async (profileData: ProfileData): Promise<ProfileData> => {
  const { data, error } = await supabase
    .from('Profile')
    .upsert({ ...profileData, id: 1 }) // Use upsert to create if not exists, or update if exists
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw new Error('프로필 정보를 업데이트하는 데 실패했습니다.');
  }

  return data;
};
