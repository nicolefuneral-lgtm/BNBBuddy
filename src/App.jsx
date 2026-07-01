// ── REVIEWS ───────────────────────────────────────────────────────────────────
export async function getReviews(profileId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('profile_id', profileId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function addReview({ profileId, reviewerId, sterren, tekst }) {
  const { error } = await supabase.from('reviews').insert({
    profile_id: profileId,
    reviewer_id: reviewerId,
    sterren,
    tekst,
    status: 'pending',
  })
  if (error) throw error
}
