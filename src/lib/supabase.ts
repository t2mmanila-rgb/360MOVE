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
        age_range: profile.ageRange || profile.age_range,
        gender: profile.gender,
        fitness_level: profile.fitnessLevel || profile.fitness_level,
        workout_frequency: profile.workoutFrequency || profile.workout_frequency,
        training_goal: profile.trainingGoal || profile.training_goal,
        profile_type: type,
        points: profile.points, // Use the points from the profile object
        profile_completed: !!profile.profileCompleted,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase Sync Error:', err);
    // Add a temporary alert for debugging on mobile
    if (typeof window !== 'undefined') {
      alert(`⚠️ SYNC FAILED: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    }
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
    if (typeof window !== 'undefined') {
      alert(`⚠️ ACTIVITY SYNC FAILED: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    }
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

/**
 * Migration helper to move legacy localStorage data to Supabase
 */
export const migrateLocalData = async () => {
  if (!supabaseUrl || !supabaseAnonKey) return;

  const results = { profiles: 0, activities: 0 };

  // 1. Migrate Fitstreet Profile
  const fsProfile = localStorage.getItem('user_profile');
  if (fsProfile) {
    try {
      const parsed = JSON.parse(fsProfile);
      if (parsed.email) {
        await syncProfile(parsed, 'fitstreet');
        results.profiles++;
        
        // Migrate registrations
        const regIds = localStorage.getItem('registered_activity_ids');
        if (regIds) {
          const ids = JSON.parse(regIds);
          for (const id of ids) {
            await syncUserActivity(parsed.email, id);
            results.activities++;
          }
        }
      }
    } catch (err) { console.error('Migration error (FS):', err); }
  }

  // 2. Migrate Generic Registration
  const genProfile = localStorage.getItem('generic_user_profile');
  if (genProfile) {
    try {
      const parsed = JSON.parse(genProfile);
      if (parsed.email) {
        await syncProfile(parsed, 'generic');
        results.profiles++;
      }
    } catch (err) { console.error('Migration error (Generic):', err); }
  }

  return results;
};
