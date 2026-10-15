
import { supabase } from "../lib/supabase";

function checkError(action, error) {
  if (error) throw new Error(`${action}: ${error.message}`);
}

export async function fetchPublishedSongs() {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  checkError("Could not load songs", error);
  return data || [];
}

export const fetchSongs = fetchPublishedSongs;

export async function fetchArtists() {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false });

  checkError("Could not load artists", error);
  return data || [];
}

export async function createArtistProfile({
  name,
  genre = "Afrobeats",
}) {
  const cleanName = String(name || "").trim();
  if (!cleanName) throw new Error("Enter your artist name first.");

  const { data, error } = await supabase
    .from("artists")
    .insert({ name: cleanName, genre })
    .select("*")
    .single();

  checkError("Could not create artist profile", error);
  return data;
}

export async function publishSong({
  title,
  artist_name,
  genre = "Afrobeats",
  description = "",
  audio_url = null,
  cover_url = null,
}) {
  if (!String(title || "").trim()) {
    throw new Error("Enter your song title first.");
  }
  if (!String(artist_name || "").trim()) {
    throw new Error("Enter your artist name first.");
  }

  const { data, error } = await supabase
    .from("songs")
    .insert({
      title: String(title).trim(),
      artist_name: String(artist_name).trim(),
      genre: String(genre || "Afrobeats").trim(),
      description: String(description || "").trim() || null,
      audio_url,
      cover_url,
      is_published: true,
    })
    .select("*")
    .single();

  checkError("Could not publish song details", error);
  return data;
}

export async function fetchChat(roomId = "voice-star-room") {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("room_id", String(roomId))
    .order("created_at", { ascending: true })
    .limit(100);

  checkError("Could not load chat", error);
  return data || [];
}

export async function addChatMessage(
  roomId,
  senderName,
  message
) {
  const cleanMessage = String(message || "").trim();
  if (!cleanMessage) throw new Error("Type a message first.");
  if (cleanMessage.length > 1000) {
    throw new Error("Message is too long.");
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      room_id: String(roomId || "voice-star-room"),
      sender_name: String(senderName || "Artist").trim().slice(0, 80),
      message: cleanMessage,
    })
    .select("*")
    .single();

  checkError("Could not send message", error);
  return data;
}

export async function fetchLiveRooms() {
  const { data, error } = await supabase
    .from("live_rooms")
    .select("*")
    .eq("is_live", true)
    .order("created_at", { ascending: false });

  checkError("Could not load live rooms", error);
  return data || [];
}

export async function createRoom(
  hostId,
  roomName = "VoiceStar Music Room",
  isLive = true,
  hostName = "VoiceStar Artist"
) {
  const name = String(roomName || "").trim();
  if (!name) throw new Error("Enter a room name.");

  const { data, error } = await supabase
    .from("live_rooms")
    .insert({
      host_id: hostId == null ? null : String(hostId),
      host_name: String(hostName || "VoiceStar Artist").slice(0, 80),
      room_name: name.slice(0, 100),
      is_live: Boolean(isLive),
    })
    .select("*")
    .single();

  checkError("Could not create room", error);
  return data;
}

export async function endRoom(roomId) {
  if (!roomId) throw new Error("Room ID is required.");

  const { data, error } = await supabase
    .from("live_rooms")
    .update({ is_live: false })
    .eq("id", roomId)
    .select("*")
    .single();

  checkError("Could not end room", error);
  return data;
}

export async function fetchTasks(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", String(userId))
    .order("created_at", { ascending: false });

  checkError("Could not load tasks", error);
  return data || [];
}

export async function saveTask(
  userId,
  taskId,
  title,
  description = "",
  reward = 0
) {
  if (!userId) throw new Error("User ID is required.");
  if (!taskId) throw new Error("Task ID is required.");

  const amount = Number(reward);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Invalid task reward.");
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: String(userId),
      task_id: String(taskId),
      title: String(title || taskId).slice(0, 120),
      description: String(description || "").slice(0, 500) || null,
      reward: Math.floor(amount),
      completed: true,
    })
    .select("*")
    .single();

  checkError("Could not save task", error);
  return data;
}
