import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rkjujkpwfmvabpuiqjbj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJranVqa3B3Zm12YWJwdWlxamJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTg5OTUsImV4cCI6MjA5NDY5NDk5NX0.Xg3pW4-lTyMvF7spBqE3D0-5KEq8TVa8OYBJNP8QSgA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── AUTH ──────────────────────────────────────────────────────────────────────
export async function signUp({ email, password, name, role }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  if (!data.user) throw new Error("Aanmelden mislukt, probeer opnieuw.")
  // Wait for auth to settle
  await new Promise(r => setTimeout(r, 800))
  // Create profile row immediately on signup
  const { error: profError } = await supabase.from('profiles').upsert({
    id: data.user.id,
    email,
    name,
    role,
    status: 'pending',
  })
  if (profError) console.error("Profile insert error:", profError.message)
  return data.user
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function signOut() {
  await supabase.auth.signOut()
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, photos(*)')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function upsertProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates })
  if (error) throw error
}

export async function getApprovedProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, photos(*)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}
export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, photos(*)')
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}
export async function deleteProfile(userId) {
  await supabase.from('photos').delete().eq('profile_id', userId)
  await supabase.from('messages').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
  await supabase.from('likes').delete().or(`from_id.eq.${userId},to_id.eq.${userId}`)
  const { error } = await supabase.from('profiles').delete().eq('id', userId)
  if (error) throw error
}
// ── PHOTOS ────────────────────────────────────────────────────────────────────
export async function uploadPhoto(userId, file, type = 'gallery') {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(path, file)
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)
  await supabase.from('photos').insert({ profile_id: userId, url: publicUrl, type })
  return publicUrl
}

// ── MESSAGES ──────────────────────────────────────────────────────────────────
export async function getMessages(userId, otherUserId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true })
  if (error) return []
  return data || []
}

export async function sendMessage(senderId, receiverId, text) {
  const { error } = await supabase.from('messages').insert({
    sender_id: senderId,
    receiver_id: receiverId,
    text,
  })
  if (error) throw error
}

// ── LIKES ─────────────────────────────────────────────────────────────────────
export async function likeProfile(fromId, toId) {
  await supabase.from('likes').upsert({ from_id: fromId, to_id: toId })
}

export async function getLikes(userId) {
  const { data } = await supabase.from('likes').select('to_id').eq('from_id', userId)
  return (data || []).map(l => l.to_id)
}
