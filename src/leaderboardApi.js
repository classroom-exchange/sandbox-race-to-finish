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
/**
 * Submit a score to the leaderboard.
 * @param {string} playerName
 * @param {number} levelIdx (0-2)
 * @param {number} varIdx (0-3)
 * @param {number} moveCount
 * @returns {Promise<{data, error}>}
 */
export async function submitScore({ playerName, levelIdx, varIdx, moveCount }) {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert([{
      player_name: playerName,
      level_idx: levelIdx,
      var_idx: varIdx,
      move_count: moveCount,
    }]);
  if (error) throw error;
  return data;
}

/**
 * Fetch top scores for a given level and variation (fewest moves = best).
 * @param {number} levelIdx (0-2)
 * @param {number} varIdx (0-3)
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchTopScores({ levelIdx, varIdx, limit = 10 }) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('player_name, move_count, created_at')
    .eq('level_idx', levelIdx)
    .eq('var_idx', varIdx)
    .order('move_count', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data;
}