import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  fetchPublishedSongs,
  fetchArtists,
  publishSong as publishSongToDatabase,
} from "./services/voiceStar";

import {
  startRecording,
  stopRecording,
} from "./features/Recording";

const C = {
  bg: "#10091B",
  card: "#20132F",
  purple: "#9B4DFF",
  pink: "#FF3DAE",
  white: "#FFFFFF",
  muted: "#B8A9C9",
  border: "#382448",
};

const TABS = ["Home", "Discover", "Studio", "Profile"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [artistName, setArtistName] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [genre, setGenre] = useState("Afrobeats");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [following, setFollowing] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadVoiceStar();
  }, []);

  async function loadVoiceStar() {
    setLoading(true);
    setErrorMessage("");

    try {
      const results = await Promise.allSettled([
        fetchPublishedSongs(),
        fetchArtists(),
      ]);

      if (results[0].status === "fulfilled") {
        setSongs(Array.isArray(results[0].value) ? results[0].value : []);
      } else {
        console.warn("Could not load songs:", results[0].reason);
      }

      if (results[1].status === "fulfilled") {
        setArtists(Array.isArray(results[1].value) ? results[1].value : []);
      } else {
        console.warn("Could not load artists:", results[1].reason);
      }

      if (
        results[0].status === "rejected" &&
        results[1].status === "rejected"
      ) {
        setErrorMessage(
          "Could not connect to the music database. Check your connection and Supabase setup."
        );
      }
    } catch (error) {
      setErrorMessage(error?.message || "Could not load VoiceStar data.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublishSong() {
    if (!songTitle.trim()) {
      Alert.alert("Song title required", "Enter your song title first.");
      return;
    }

    if (!artistName.trim()) {
      Alert.alert("Artist name required", "Enter your artist name first.");
      return;
    }

    setSaving(true);

    try {
      const newSong = await publishSongToDatabase({
        title: songTitle.trim(),
        artist_name: artistName.trim(),
        genre: genre.trim() || "Afrobeats",
        description: description.trim(),
      });

      if (newSong) {
        setSongs((current) => [
          newSong,
          ...current.filter((song) => song.id !== newSong.id),
        ]);
      }

      setSongTitle("");
      setDescription("");
      setActiveTab("Home");

      Alert.alert(
        "Song details saved",
        "VoiceStar saved your song information. Audio recording uploads and public playback must be connected separately."
      );

      await loadVoiceStar();
    } catch (error) {
      Alert.alert(
        "Could not publish",
        error?.message ||
          "The song could not be saved. Check your Supabase tables and permissions."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStartRecording() {
    try {
      await startRecording();
      setRecording(true);
      Alert.alert(
        "Recording started",
        "Your recording has started. Tap Stop Recording when you finish."
      );
    } catch (error) {
      Alert.alert(
        "Recording unavailable",
        error?.message ||
          "Recording could not start. Check the recording module and microphone permission."
      );
    }
  }

  async function handleStopRecording() {
    try {
      const result = await stopRecording();
      setRecording(false);

      Alert.alert(
        "Recording stopped",
        result?.path
          ? "Your recording has been saved on this device. Uploading it to your public song page is a separate step."
          : "Recording stopped."
      );
    } catch (error) {
      setRecording(false);
      Alert.alert(
        "Could not stop recording",
        error?.message || "Please try again."
      );
    }
  }

  function toggleFollow(name) {
    setFollowing((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  function toggleLike(id) {
    setLikedSongs((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function renderHeader() {
    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            Voice<Text style={styles.logoAccent}>Star</Text>
          </Text>
          <Text style={styles.tagline}>
            Your stage, your voice, your star power!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.liveButton}
          onPress={() =>
            Alert.alert(
              "VoiceStar Live",
              "Live audio/video streaming is not connected yet."
            )
          }
        >
          <Text style={styles.liveButtonText}>● LIVE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderHome() {
    return (
      <>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>WELCOME TO YOUR STAGE</Text>

          <Text style={styles.heroTitle}>
            Your voice deserves{"\n"}
            <Text style={styles.pinkText}>to be heard.</Text>
          </Text>

          <Text style={styles.bodyText}>
            Discover artists, create music, and share your talent with the
            VoiceStar community.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setActiveTab("Studio")}
          >
            <Text style={styles.primaryButtonText}>
              ✦ Open Artist Studio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setActiveTab("Discover")}
          >
            <Text style={styles.secondaryButtonText}>Discover Artists</Text>
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <TouchableOpacity style={styles.warningCard} onPress={loadVoiceStar}>
            <Text style={styles.warningTitle}>Connection issue</Text>
            <Text style={styles.bodyText}>{errorMessage}</Text>
            <Text style={styles.followText}>Tap to retry</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Music</Text>
          <Text style={styles.mutedText}>{songs.length} songs</Text>
        </View>

        {loading ? (
          <ActivityIndicator color={C.pink} size="large" />
        ) : songs.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.emptyIcon}>♫</Text>
            <Text style={styles.cardTitle}>Your stage starts here</Text>
            <Text style={styles.bodyText}>
              Publish your first song details from Artist Studio.
            </Text>
          </View>
        ) : (
          songs.map((song, index) => (
            <View
              style={styles.songCard}
              key={String(song.id || `${song.title}-${index}`)}
            >
              <View style={styles.songArtwork}>
                <Text style={styles.artworkText}>♫</Text>
              </View>

              <View style={styles.songInfo}>
                <Text style={styles.cardTitle}>
                  {song.title || "Untitled song"}
                </Text>
                <Text style={styles.mutedText}>
                  {song.artist_name || song.artist || "VoiceStar Artist"}
                </Text>
                <Text style={styles.genreText}>
                  {song.genre || "Music"}
                </Text>
              </View>

              <TouchableOpacity onPress={() => toggleLike(String(song.id))}>
                <Text style={styles.heart}>
                  {likedSongs.includes(String(song.id)) ? "♥" : "♡"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={styles.quickGrid}>
          {[
            { title: "Record", subtitle: "Create music", icon: "🎙", tab: "Studio" },
            { title: "Live Rooms", subtitle: "Perform live", icon: "♫", tab: "Live" },
            { title: "Discover", subtitle: "Find new talent", icon: "✧", tab: "Discover" },
            { title: "My Profile", subtitle: "Your journey", icon: "★", tab: "Profile" },
          ].map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.quickCard}
              onPress={() => {
                if (item.tab === "Live") {
                  Alert.alert(
                    "Live Rooms",
                    "Live streaming needs a live-streaming service before it can go live."
                  );
                } else {
                  setActiveTab(item.tab);
                }
              }}
            >
              <Text style={styles.quickIcon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.mutedText}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  }

  function renderDiscover() {
    const filteredArtists = artists.filter((artist) =>
      `${artist.name || ""} ${artist.genre || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    return (
      <>
        <Text style={styles.pageTitle}>Discover</Text>
        <Text style={styles.bodyText}>
          Find artists and explore their musical styles.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Search artists or genres..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>VoiceStar Artists</Text>
          <TouchableOpacity onPress={loadVoiceStar}>
            <Text style={styles.followText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={C.pink} size="large" />
        ) : filteredArtists.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No artists found yet</Text>
            <Text style={styles.bodyText}>
              Try another search or create an artist profile by publishing a
              song from Artist Studio.
            </Text>
          </View>
        ) : (
          filteredArtists.map((artist, index) => {
            const name = artist.name || "VoiceStar Artist";

            return (
              <View
                style={styles.artistCard}
                key={String(artist.id || `${name}-${index}`)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.songInfo}>
                  <Text style={styles.cardTitle}>{name}</Text>
                  <Text style={styles.mutedText}>
                    {artist.genre || "Upcoming Artist"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => toggleFollow(name)}
                >
                  <Text style={styles.followText}>
                    {following.includes(name) ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </>
    );
  }

  function renderStudio() {
    return (
      <>
        <Text style={styles.pageTitle}>Artist Studio</Text>
        <Text style={styles.bodyText}>
          Record your voice and prepare your next release.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recording Studio</Text>

          <View style={styles.recordCircle}>
            <Text style={styles.recordIcon}>{recording ? "■" : "🎙"}</Text>
          </View>

          <Text style={styles.bodyText}>
            Use your phone microphone to record a take. Recording is saved
            locally; uploading the audio to make it playable for everyone is a
            separate step.
          </Text>

          {recording ? (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleStopRecording}
            >
              <Text style={styles.primaryButtonText}>■ Stop Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartRecording}
            >
              <Text style={styles.primaryButtonText}>● Start Recording</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Publish Song Details</Text>

          <Text style={styles.fieldLabel}>Artist Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your artist name"
            placeholderTextColor={C.muted}
            value={artistName}
            onChangeText={setArtistName}
          />

          <Text style={styles.fieldLabel}>Song Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your song title"
            placeholderTextColor={C.muted}
            value={songTitle}
            onChangeText={setSongTitle}
          />

          <Text style={styles.fieldLabel}>Genre</Text>
          <View style={styles.genreChoices}>
            {["Afrobeats", "Gospel", "R&B", "Hip-Hop", "Pop"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.genreChip,
                  genre === item && styles.genreChipSelected,
                ]}
                onPress={() => setGenre(item)}
              >
                <Text
                  style={[
                    styles.genreChipText,
                    genre === item && styles.genreChipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Tell listeners about your song"
            placeholderTextColor={C.muted}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.disabledButton]}
            disabled={saving}
            onPress={handlePublishSong}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? "Saving..." : "♫ Publish Song Details"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Song details are sent to Supabase. Cover art, recorded audio
            uploads, audio playback, and public audio publishing still require
            their storage and playback connections.
          </Text>
        </View>
      </>
    );
  }

  function renderProfile() {
    return (
      <>
        <Text style={styles.pageTitle}>Artist Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {artistName.trim()
                ? artistName.trim().charAt(0).toUpperCase()
                : "★"}
            </Text>
          </View>

          <Text style={styles.profileName}>
            {artistName.trim() || "Your Artist Name"}
          </Text>
          <Text style={styles.mutedText}>Upcoming Artist</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{songs.length}</Text>
              <Text style={styles.mutedText}>Songs</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{following.length}</Text>
              <Text style={styles.mutedText}>Following</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{likedSongs.length}</Text>
              <Text style={styles.mutedText}>Liked</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your VoiceStar Journey</Text>
          <Text style={styles.bodyText}>
            Create music, discover other artists, and build your artist
            identity.
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setActiveTab("Studio")}
          >
            <Text style={styles.secondaryButtonText}>Open Artist Studio</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  function renderLive() {
    return (
      <>
        <Text style={styles.pageTitle}>Live Rooms</Text>
        <View style={styles.card}>
          <Text style={styles.emptyIcon}>♫</Text>
          <Text style={styles.cardTitle}>Your stage, live</Text>
          <Text style={styles.bodyText}>
            The live room screen is ready for the next integration. Real-time
            audio/video, guest seats, room chat, gifts, and live viewer counts
            need a live service and backend support.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              Alert.alert(
                "Live streaming",
                "Live streaming is not active yet. This button will be connected when the live service is implemented."
              )
            }
          >
            <Text style={styles.primaryButtonText}>Go Live</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {renderHeader()}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "Home" && renderHome()}
        {activeTab === "Discover" && renderDiscover()}
        {activeTab === "Studio" && renderStudio()}
        {activeTab === "Live" && renderLive()}
        {activeTab === "Profile" && renderProfile()}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[...TABS.slice(0, 3), "Live", "Profile"].map((tab) => {
          const selected = activeTab === tab;
          const icons = {
            Home: "⌂",
            Discover: "⌕",
            Studio: "♫",
            Live: "●",
            Profile: "◉",
          };

          return (
            <TouchableOpacity
              key={tab}
              style={styles.navItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.navIcon, selected && styles.navSelected]}>
                {icons[tab]}
              </Text>
              <Text style={[styles.navLabel, selected && styles.navSelected]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  logo: { fontSize: 27, fontWeight: "900", color: C.white },
  logoAccent: { color: C.pink },
  tagline: { fontSize: 10, color: C.muted, marginTop: 3 },
  liveButton: {
    backgroundColor: "#35152D",
    borderWidth: 1,
    borderColor: C.pink,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  liveButtonText: { color: C.pink, fontWeight: "800", fontSize: 12 },
  content: { flex: 1 },
  contentContainer: { padding: 18, paddingBottom: 28 },
  hero: {
    backgroundColor: C.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    padding: 21,
    marginBottom: 25,
  },
  eyebrow: {
    color: C.purple,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 13,
  },
  heroTitle: {
    color: C.white,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 39,
  },
  pinkText: { color: C.pink },
  bodyText: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
    marginBottom: 13,
  },
  primaryButton: {
    backgroundColor: C.purple,
    borderRadius: 13,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: { color: C.white, fontSize: 14, fontWeight: "800" },
  disabledButton: { opacity: 0.6 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: C.purple,
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: C.white,
    fontWeight: "700",
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  mutedText: { color: C.muted, fontSize: 11 },
  card: {
    backgroundColor: C.card,
    borderRadius: 17,
    padding: 17,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  warningCard: {
    backgroundColor: "#352018",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#9C5B35",
    marginBottom: 18,
  },
  warningTitle: {
    color: "#FFD3A6",
    fontSize: 14,
    fontWeight: "800",
  },
  emptyIcon: { color: C.pink, fontSize: 35, marginBottom: 8 },
  cardTitle: { color: C.white, fontSize: 14, fontWeight: "800" },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickCard: {
    width: "48%",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },
  quickIcon: { fontSize: 25, marginBottom: 11 },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  songArtwork: {
    width: 47,
    height: 47,
    backgroundColor: "#392052",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  artworkText: { color: C.pink, fontSize: 26 },
  songInfo: { flex: 1 },
  genreText: { color: C.purple, fontSize: 10, marginTop: 4 },
  heart: { color: C.pink, fontSize: 27, paddingHorizontal: 5 },
  pageTitle: {
    color: C.white,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 6,
    marginTop: 6,
  },
  input: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: C.white,
    fontSize: 14,
    marginBottom: 16,
  },
  descriptionInput: { minHeight: 90, textAlignVertical: "top" },
  artistCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#482461",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: C.white, fontSize: 19, fontWeight: "900" },
  followButton: {
    borderWidth: 1,
    borderColor: C.purple,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  followText: { color: C.white, fontSize: 11, fontWeight: "700" },
  fieldLabel: {
    color: C.white,
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 8,
  },
  genreChoices: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  genreChip: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 11,
    marginRight: 7,
    marginBottom: 7,
  },
  genreChipSelected: {
    backgroundColor: "#482461",
    borderColor: C.pink,
  },
  genreChipText: { color: C.muted, fontSize: 11 },
  genreChipTextSelected: { color: C.white, fontWeight: "800" },
  stopButton: {
    backgroundColor: "#7B244D",
    borderRadius: 13,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  recordCircle: {
    alignSelf: "center",
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#392052",
    borderWidth: 2,
    borderColor: C.pink,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  recordIcon: { fontSize: 30, color: C.white },
  note: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 12 },
  profileCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 18,
  },
  profileAvatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#482461",
    borderWidth: 2,
    borderColor: C.pink,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  profileAvatarText: { color: C.white, fontSize: 32, fontWeight: "900" },
  profileName: {
    color: C.white,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 24,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  stat: { alignItems: "center" },
  statNumber: {
    color: C.pink,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#181024",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
    paddingBottom: 8,
  },
  navItem: { flex: 1, alignItems: "center", paddingVertical: 4 },
  navIcon: { color: C.muted, fontSize: 22, marginBottom: 4 },
  navLabel: { color: C.muted, fontSize: 9, fontWeight: "600" },
  navSelected: { color: C.pink, fontWeight: "900" },
});