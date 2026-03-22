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
    const upsertData: any = {
      email: profile.email?.toLowerCase(),
      name: profile.name,
      company_name: profile.companyName || profile.company_name,
      work_setup: profile.workSetup || profile.work_setup,
      categories: profile.categories,
      city: profile.city,
      profile_type: type,
      points: profile.points,
      profile_completed: !!profile.profileCompleted,
      points_profile_completion: profile.pointsProfileCompletion || 0,
      points_shared: !!profile.pointsShared,
      occupation: profile.occupation,
      updated_at: new Date().toISOString()
    };

    // Only add optional fields if they have values to avoid overwriting with NULL
    if (profile.ageRange || profile.age_range) upsertData.age_range = profile.ageRange || profile.age_range;
    if (profile.gender) upsertData.gender = profile.gender;
    if (profile.fitnessLevel || profile.fitness_level) upsertData.fitness_level = profile.fitnessLevel || profile.fitness_level;
    if (profile.workoutFrequency || profile.workout_frequency) upsertData.workout_frequency = profile.workoutFrequency || profile.workout_frequency;
    if (profile.trainingGoal || profile.training_goal) upsertData.training_goal = profile.trainingGoal || profile.training_goal;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(upsertData, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      // Robustness: If schema is out of sync (PGRST204), try a minimal upsert
      if (error.code === 'PGRST204' || error.message.includes('column')) {
        console.warn('[Supabase] Schema mismatch, retrying minimal sync...', error.message);
        const minimalData = { ...upsertData };
        delete minimalData.occupation;
        delete minimalData.points_profile_completion;
        
        const { data: retryData, error: retryError } = await supabase
          .from('profiles')
          .upsert(minimalData, { onConflict: 'email' })
          .select()
          .single();
          
        if (retryError) throw retryError;
        return retryData;
      }
      throw error;
    }
    
    // Success alert for debugging purposes on mobile - will be removed once confirmed working
    if (typeof window !== 'undefined' && profile.name === 'test1') {
      console.log('✅ SYNC SUCCESS for', profile.email);
    }
    
    return data;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('Supabase Sync Error:', errorMsg);
    
    // Add a temporary alert for debugging on mobile
    if (typeof window !== 'undefined') {
      // Don't alert for every minor error to avoid spamming the user, 
      // but do alert for major ones
      if (errorMsg.includes('PGRST204')) {
        alert(`⚠️ DATABASE SCHEMA ERROR: Please run the SQL migration I provided to add the 'occupation' column.`);
      } else {
        alert(`⚠️ SYNC FAILED for ${profile.email}: ${errorMsg}`);
      }
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
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows'
    return data;
  } catch (err) {
    console.error('Supabase Fetch Error:', err);
    return null;
  }
};

export const syncUserActivity = async (email: string, activityId: string, points: number = 0, profile?: any): Promise<void> => {
  if (!supabaseUrl || !supabaseAnonKey) return;

  const lowerEmail = email.toLowerCase();
  let userProfile = profile; // Use a local variable for the profile

  // If a profile is provided, ensure it's synced first to satisfy foreign key constraints
  if (userProfile) {
    try {
      await syncProfile(userProfile, userProfile.profile_type || 'fitstreet');
    } catch (err) {
      console.warn('[Supabase] Pre-sync profile failed:', err);
    }
  }

  console.log(`[Supabase] Syncing activity ${activityId} for user ${lowerEmail}...`);
  try {
    // 1. Ensure profile exists first (retry/recovery logic)
    const { data: profileExists } = await supabase.from('profiles').select('email').eq('email', lowerEmail).single();
    
    if (!profileExists && userProfile) {
      console.log('Profile missing in Supabase during activity sync, creating...', lowerEmail);
      await syncProfile(userProfile, userProfile.profile_type || 'fitstreet'); 
    }

    const { error } = await supabase
      .from('user_activities')
      .upsert({
        user_email: lowerEmail,
        activity_id: activityId,
        points_awarded: points,
        registered_at: new Date().toISOString()
      }, { onConflict: 'user_email, activity_id' });

    if (error) {
      console.error('[Supabase] Activity sync error:', error);
      
      // If error is foreign key violation, try to resolve by creating profile if not already tried
      if (error.code === '23503' && !userProfile) { // Use userProfile here
        console.log('[Supabase] Retrying activity sync after creating missing profile...');
        const stored = localStorage.getItem('user_profile') || localStorage.getItem('generic_user_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          await syncProfile(parsed, parsed.profile_type || 'fitstreet');
          return syncUserActivity(email, activityId, points, parsed);
        }
      }

      if (typeof window !== 'undefined') {
        alert(`⚠️ ACTIVITY SYNC FAILED: ${error.message}`);
      }
      throw error;
    }
    console.log('[Supabase] Activity sync successful.');
  } catch (err) {
    console.warn('[Supabase] Activity sync failed:', err);
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

  if (results.profiles > 0 || results.activities > 0) {
    console.log(`[Supabase] Migration Complete: ${results.profiles} profiles, ${results.activities} activities synced.`);
  }

  return results;
};
