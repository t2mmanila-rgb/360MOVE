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
      points_profile_completion: profile.pointsProfileCompletion || profile.points_profile_completion || 0,
      points_hr_share: profile.pointsHRShare || profile.points_hr_share || 0,
      points_friend_share: profile.pointsFriendShare || profile.points_friend_share || 0,
      points_onboarding: profile.pointsOnboarding || profile.points_onboarding || 0,
      points_scans: profile.pointsScans || profile.points_scans || 0,
      points_shared: !!(profile.pointsShared || profile.points_shared),
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
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Supabase Sync Error:', err);
    return profile;
  }
};

/**
 * Get profile by email from Supabase and map to camelCase.
 */
export const getProfile = async (email: string) => {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    // Map snake_case to camelCase for the app
    return {
      ...data,
      companyName: data.company_name,
      workSetup: data.work_setup,
      profileCompleted: data.profile_completed,
      pointsProfileCompletion: data.points_profile_completion,
      pointsHRShare: data.points_hr_share,
      pointsFriendShare: data.points_friend_share,
      pointsOnboarding: data.points_onboarding,
      pointsScans: data.points_scans,
      pointsShared: data.points_shared,
      ageRange: data.age_range,
      fitnessLevel: data.fitness_level,
      workoutFrequency: data.workout_frequency,
      trainingGoal: data.training_goal
    };
  } catch (err) {
    console.error('Supabase Fetch Error:', err);
    return null;
  }
};

export const syncUserActivity = async (
  email: string, 
  activityId: string, 
  points: number = 0, 
  profile?: any,
  status: string = 'registered',
  isOnsite: boolean = false
): Promise<void> => {
  if (!supabaseUrl || !supabaseAnonKey) return;

  const lowerEmail = email.toLowerCase();
  let userProfile = profile;

  if (userProfile) {
    try {
      await syncProfile(userProfile, userProfile.profile_type || 'fitstreet');
    } catch (err) {
      console.warn('[Supabase] Pre-sync profile failed:', err);
    }
  }

  try {
    const { data: profileExists } = await supabase.from('profiles').select('email').ilike('email', lowerEmail).single();
    
    if (!profileExists && userProfile) {
      await syncProfile(userProfile, userProfile.profile_type || 'fitstreet'); 
    }

    const { error } = await supabase
      .from('user_activities')
      .upsert({
        user_email: lowerEmail,
        activity_id: activityId,
        points_earned: points,
        status: status,
        is_onsite: isOnsite,
        registered_at: new Date().toISOString()
      }, { onConflict: 'user_email, activity_id' });

    if (error) {
      console.error('[Supabase] Activity sync error:', error);
      if (error.code === '23503' && !userProfile) {
        const stored = localStorage.getItem('user_profile') || localStorage.getItem('generic_user_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          await syncProfile(parsed, parsed.profile_type || 'fitstreet');
          return syncUserActivity(email, activityId, points, parsed, status, isOnsite);
        }
      }
      throw error;
    }
  } catch (err) {
    console.warn('[Supabase] Activity sync failed:', err);
  }
};

/**
 * Fetch all activities for a user by email.
 */
export const getUserActivities = async (email: string) => {
  if (!supabaseUrl || !supabaseAnonKey) return [];

  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .ilike('user_email', email.toLowerCase());

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[Supabase] Fetch activities failed:', err);
    return [];
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
        // Fetch existing first to avoid downgrading points
        const existing = await getProfile(parsed.email);
        if (!existing || (parsed.points || 0) > (existing.points || 0)) {
          await syncProfile(parsed, 'fitstreet');
          results.profiles++;
        }
        
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
        const existing = await getProfile(parsed.email);
        if (!existing || (parsed.points || 0) > (existing.points || 0)) {
          await syncProfile(parsed, 'generic');
          results.profiles++;
        }
      }
    } catch (err) { console.error('Migration error (Generic):', err); }
  }

  if (results.profiles > 0 || results.activities > 0) {
    console.log(`[Supabase] Migration Complete: ${results.profiles} profiles, ${results.activities} activities synced.`);
  }

  return results;
};
