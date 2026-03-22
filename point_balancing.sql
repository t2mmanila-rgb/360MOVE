-- Set starting points for existing users
-- Fitstreet users get 1 point
UPDATE profiles 
SET points = 1 
WHERE profile_type = 'fitstreet';

-- Generic 360MOVE users get 30 points
UPDATE profiles 
SET points = 30 
WHERE profile_type = 'generic';

-- Optional: Update table default for future-proofing (though code overrides it)
ALTER TABLE profiles ALTER COLUMN points SET DEFAULT 1;
