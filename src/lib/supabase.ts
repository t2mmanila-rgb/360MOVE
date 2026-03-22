import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ SUPABASE ERROR: Credentials missing from environment. Row Level Security and Database Sync will not function.');
} else {
  console.log('✅ SUPABASE CONNECTED: Initializing client with', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sync profile with Supabase and optionally localStorage.
 */
export const syncProfile = async (profile: any, type: 'generic' | 'fitstreet') => {
  if (!supabaseUrl || !supabaseAnonKey) return profile;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        email: profile.email,
        name: profile.name,
        company_name: profile.company_name,
        work_setup: profile.work_setup,
        categories: profile.categories,
        city: profile.city,
        profile_type: type,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase Sync Error:', err);
    return profile;
  }
};

/**
 * Get profile by email from Supabase.
 */
export const getProfile = async (email: string) => {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows'
    return data;
  } catch (err) {
    console.error('Supabase Fetch Error:', err);
    return null;
  }
};

export const syncUserActivity = async (email: string, activityId: string, points: number = 0) => {
  if (!supabaseUrl || !supabaseAnonKey) return;

  try {
    const { error } = await supabase
      .from('user_activities')
      .upsert({
        user_email: email,
        activity_id: activityId,
        points_awarded: points,
        registered_at: new Date().toISOString()
      }, { onConflict: 'user_email,activity_id' });

    if (error) throw error;
  } catch (err) {
    console.warn('Supabase activity sync failed:', err);
  }
};

export const deleteUserActivity = async (email: string, activityId: string) => {
  if (!supabaseUrl || !supabaseAnonKey) return;

  try {
    const { error } = await supabase
      .from('user_activities')
      .delete()
      .match({ user_email: email, activity_id: activityId });

    if (error) throw error;
  } catch (err) {
    console.warn('Supabase activity deletion failed:', err);
  }
};
