import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rkjujkpwfmvabpuiqjbj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJranVqa3B3Zm12YWJwdWlxamJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTg5OTUsImV4cCI6MjA5NDY5NDk5NX0.Xg3pW4-lTyMvF7spBqE3D0-5KEq8TVa8OYBJNP8QSgA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── AUTH HELPERS ──────────────────────────────────────────────────────────────
export async function signUp({ email, password, name, role }) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  // Create profile row
  const { error: profError } = await supabase.from('profiles').insert({
    id: data.user.id,
    email,
    name,
    role,
    status: 'pending',
  })
  if (profError) throw profError
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

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// ── PROFILE HELPERS ───────────────────────────────────────────────────────────
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, photos(*)')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
}

export async function getApprovedProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, photos(*)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ── PHOTO HELPERS ─────────────────────────────────────────────────────────────
export async function uploadPhoto(userId, file, type = 'gallery') {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(path, file)
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)
  const { error: dbError } = await supabase.from('photos').insert({
    profile_id: userId,
    url: publicUrl,
    type,
  })
  if (dbError) throw dbError
  return publicUrl
}

// ── MESSAGE HELPERS ───────────────────────────────────────────────────────────
export async function getMessages(userId, otherUserId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function sendMessage(senderId, receiverId, text) {
  const { error } = await supabase.from('messages').insert({
    sender_id: senderId,
    receiver_id: receiverId,
    text,
  })
  if (error) throw error
}

// ── LIKES HELPERS ─────────────────────────────────────────────────────────────
export async function likeProfile(fromId, toId) {
  const { error } = await supabase.from('likes').upsert({ from_id: fromId, to_id: toId })
  if (error) throw error
}

export async function getLikes(userId) {
  const { data, error } = await supabase
    .from('likes')
    .select('to_id')
    .eq('from_id', userId)
  if (error) throw error
  return data.map(l => l.to_id)
}
