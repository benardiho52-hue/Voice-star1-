import { supabase } from "../lib/supabase";

// Load published songs from Supabase.
export async function fetchSongs() {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Loading songs failed: ${error.message}`);
  return data || [];
}

// Keep compatibility with the existing service name.
export async function fetchPublishedSongs() {
  return fetchSongs();
}

// Load artists.
export async function fetchArtists() {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Loading artists failed: ${error.message}`);
  return data || [];
}

// Create an artist profile.
export async function createArtistProfile(name, genre = "Afrobeats") {
  const artistName = String(name || "").trim();

  if (!artistName) {
    throw new Error("Enter your artist name first.");
  }

  const { data, error } = await supabase
    .from("artists")
    .insert({
      name: artistName,
      genre: String(genre || "Afrobeats").trim(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Creating artist failed: ${error.message}`);
  }

  return data;
}

// Publish song details.
// An audio file must be uploaded separately before audio_url is supplied.
export async function publishSong({
  title,
  artist_name,
  genre = "Afrobeats",
  description = "",
  audio_url = null,
  cover_url = null,
}) {
  const cleanTitle = String(title || "").trim();
  const cleanArtist = String(artist_name || "").trim();

  if (!cleanTitle) throw new Error("Enter your song title first.");
  if (!cleanArtist) throw new Error("Enter your artist name first.");

  const { data, error } = await supabase
    .from("songs")
    .insert({
      title: cleanTitle,
      artist_name: cleanArtist,
      genre: String(genre || "Afrobeats").trim(),
      description: String(description || "").trim() || null,
      audio_url,
      cover_url,
      is_published: true,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Publishing song failed: ${error.message}`);
  }

  return data;
}

// Save a chat message.
// Requires a chat_messages table with these column names.
export async function addChatMessage(roomId, senderName, message) {
  const cleanMessage = String(message || "").trim();

  if (!cleanMessage) throw new Error("Enter a message first.");

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      room_id: roomId,
      sender_name: senderName || "Artist",
      message: cleanMessage,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Sending message failed: ${error.message}`);
  }

  return data;
}

// Load recent chat messages.
export async function fetchChat(roomId) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Loading chat failed: ${error.message}`);
  return data || [];
}

// The following features require matching database tables and columns.
// They report database errors rather than pretending data was saved.

export async function createRoom(hostId, roomName, isLive = true) {
  const name = String(roomName || "").trim();
  if (!name) throw new Error("Enter a room name first.");

  const { data, error } = await supabase
    .from("live_rooms")
    .insert({
      host_id: hostId,
      name,
      is_live: isLive,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Creating room failed: ${error.message}`);
  }

  return data;
}

export async function saveTask(
  userId,
  taskId,
  title,
  description = "",
  reward = 0
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      task_id: taskId,
      title,
      description,
      reward,
    })
    .select("*")
    .single();

  if (error) throw new Error(`Saving task failed: ${error.message}`);
  return data;
      }
