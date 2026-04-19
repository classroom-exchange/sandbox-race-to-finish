import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Submit a score to the leaderboard.
 * @param {string} playerName
 * @param {number} level  (1-3)
 * @param {number} variation (1-4)
 * @param {number} movesUsed
 * @returns {Promise<{data, error}>}
 */
export async function submitScore(playerName, level, variation, movesUsed) {
  return supabase.from('leaderboard').insert([
    {
      player_name: playerName,
      level: level,
      variation: variation,
      moves_used: movesUsed,
    },
  ]);
}

/**
 * Fetch top 10 scores for a given level and variation (fewest moves = best).
 * @param {number} level
 * @param {number} variation
 * @returns {Promise<{data, error}>}
 */
export async function fetchLeaderboard(level, variation) {
  return supabase
    .from('leaderboard')
    .select('player_name, moves_used, completed_at')
    .eq('level', level)
    .eq('variation', variation)
    .order('moves_used', { ascending: true })
    .limit(10);
}