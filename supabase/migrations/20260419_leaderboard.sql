-- Create leaderboard table for race-to-finish high scores
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name text NOT NULL,
  level integer NOT NULL CHECK (level >= 1 AND level <= 3),
  variation integer NOT NULL CHECK (variation >= 1 AND variation <= 4),
  moves_used integer NOT NULL,
  completed_at timestamptz DEFAULT now() NOT NULL
);

-- Index for fast leaderboard queries (best scores first = fewest moves)
CREATE INDEX IF NOT EXISTS idx_leaderboard_level_moves 
  ON leaderboard (level, variation, moves_used ASC);

-- Enable Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leaderboard
CREATE POLICY "leaderboard_read" ON leaderboard
  FOR SELECT USING (true);

-- Allow anyone to insert their score
CREATE POLICY "leaderboard_insert" ON leaderboard
  FOR INSERT WITH CHECK (true);