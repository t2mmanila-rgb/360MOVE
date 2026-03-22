import { useState, useEffect } from 'react';
import { MOCK_SCHEDULE, B2C_PROGRAMS, type Activity } from '../data/activities';

export const useActivity = () => {
  const [schedule, setSchedule] = useState<Activity[]>(MOCK_SCHEDULE);
  const [programs, setPrograms] = useState<Activity[]>(B2C_PROGRAMS);

  const applyOverrides = (overrides: Record<string, Partial<Activity>>) => {
    const updatedSchedule = MOCK_SCHEDULE.map(activity => {
      const override = overrides[activity.id];
      return override ? { ...activity, ...override } : activity;
    });
    
    const updatedPrograms = B2C_PROGRAMS.map(program => {
      const override = overrides[program.id];
      return override ? { ...program, ...override } : program;
    });

    setSchedule(updatedSchedule);
    setPrograms(updatedPrograms);
  };

  const fetchOverrides = async () => {
    try {
      // Try Supabase first
      const { supabase } = await import('./supabase');
      const { data, error } = await supabase
        .from('activity_overrides')
        .select('*');

      if (!error && data) {
        const overrides: Record<string, Partial<Activity>> = {};
        data.forEach((row: any) => {
          overrides[row.activity_id] = {
            category: row.category,
            points: row.points,
            day: row.day,
            time: row.time,
            isPaid: row.is_paid,
            location: row.location,
            description: row.description
          };
        });
        applyOverrides(overrides);
        return;
      }

      // Fallback to localStorage
      const storedOverrides = localStorage.getItem('admin_activity_overrides');
      if (storedOverrides) {
        applyOverrides(JSON.parse(storedOverrides));
      } else {
        setSchedule(MOCK_SCHEDULE);
        setPrograms(B2C_PROGRAMS);
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back", e);
    }
  };

  useEffect(() => {
    fetchOverrides();

    // Listen to local events
    window.addEventListener('storage', fetchOverrides);
    window.addEventListener('admin-overrides-updated', fetchOverrides);
    
    return () => {
      window.removeEventListener('storage', fetchOverrides);
      window.removeEventListener('admin-overrides-updated', fetchOverrides);
    };
  }, []);

  return { schedule, programs, refresh: fetchOverrides };
};
