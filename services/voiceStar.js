import { supabase } from "../lib/supabase";

// Load published songs.
export async function fetchPublishedSongs() {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load songs: ${error.message}`);
  }

  return data || [];
}

// Keep compatibility with App.js if it calls fetchSongs().
export async function fetchSongs() {
  return fetchPublishedSongs();
}

// Load artist profiles.
export async function fetchArtists() {
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load artists: ${error.message}`);
  }

  return data || [];
}

// Save song details to Supabase.
// This does not upload the actual audio file.
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

  if (!cleanTitle) {
    throw new Error("Enter your song title first.");
  }

  if (!cleanArtist) {
    throw new Error("Enter your artist name first.");
  }

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
    throw new Error(`Could not save song: ${error.message}`);
  }

  return data;
}

// Create an artist profile.
export async function createArtistProfile({
  name,
  genre = "Afrobeats",
}) {
  const cleanName = String(name || "").trim();

  if (!cleanName) {
    throw new Error("Enter your artist name first.");
  }

  const { data, error } = await supabase
    .from("artists")
    .insert({
      name: cleanName,
      genre: String(genre || "Afrobeats").trim(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `Could not create artist profile: ${error.message}`
    );
  }

  return data;
}