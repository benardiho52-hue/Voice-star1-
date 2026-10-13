import React, { useState } from "react";
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
} from "react-native";

const C = {
  bg: "#10091B",
  card: "#20132F",
  purple: "#9B4DFF",
  pink: "#FF3DAE",
  white: "#FFFFFF",
  muted: "#B8A9C9",
  border: "#382448",
};

const tabs = ["Home", "Discover", "Studio", "Profile"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [search, setSearch] = useState("");
  const [recording, setRecording] = useState(false);
  const [songs, setSongs] = useState([]);
  const [following, setFollowing] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  function publishSong() {
    if (!songTitle.trim()) {
      Alert.alert("Song title required", "Enter a title for your song.");
      return;
    }

    const song = {
      id: Date.now().toString(),
      title: songTitle.trim(),
      artist: artistName.trim() || "New Artist",
    };

    setSongs((current) => [song, ...current]);
    setSongTitle("");
    setActiveTab("Home");

    Alert.alert(
      "Song added",
      "Your song has been added to this session. Database upload and public publishing are not connected yet."
    );
  }

  function toggleFollow(name) {
    setFollowing((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
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
            Your stage. Your voice. Your star power!
          </Text>
        </View>
        <TouchableOpacity
          style={styles.liveButton}
          onPress={() =>
            Alert.alert(
              "Live Rooms",
              "Live streaming requires a connected live-streaming service."
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
            Discover artists, share your music, and let your talent shine.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setActiveTab("Studio")}
          >
            <Text style={styles.primaryButtonText}>✦ Open Artist Studio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setActiveTab("Discover")}
          >
            <Text style={styles.secondaryButtonText}>Explore Artists</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Music</Text>
          <Text style={styles.mutedText}>{songs.length} songs this session</Text>
        </View>

        {songs.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.emptyIcon}>♫</Text>
            <Text style={styles.cardTitle}>Your stage starts here</Text>
            <Text style={styles.bodyText}>
              Create a song in Artist Studio to see it listed here.
            </Text>
          </View>
        ) : (
          songs.map((song) => (
            <View style={styles.songCard} key={song.id}>
              <View style={styles.songArtwork}>
                <Text style={styles.artworkText}>♫</Text>
              </View>
              <View style={styles.songInfo}>
                <Text style={styles.cardTitle}>{song.title}</Text>
                <Text style={styles.mutedText}>{song.artist}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  setLikedSongs((current) =>
                    current.includes(song.id)
                      ? current.filter((id) => id !== song.id)
                      : [...current, song.id]
                  )
                }
              >
                <Text style={styles.heart}>
                  {likedSongs.includes(song.id) ? "♥" : "♡"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => setActiveTab("Studio")}
          >
            <Text style={styles.quickIcon}>🎙</Text>
            <Text style={styles.cardTitle}>Record</Text>
            <Text style={styles.mutedText}>Create music</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() =>
              Alert.alert(
                "Live Rooms",
                "Connect a live-streaming service to enable live rooms."
              )
            }
          >
            <Text style={styles.quickIcon}>♫</Text>
            <Text style={styles.cardTitle}>Live Rooms</Text>
            <Text style={styles.mutedText}>Perform live</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => setActiveTab("Discover")}
          >
            <Text style={styles.quickIcon}>✧</Text>
            <Text style={styles.cardTitle}>Discover</Text>
            <Text style={styles.mutedText}>Find new talent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={() => setActiveTab("Profile")}
          >
            <Text style={styles.quickIcon}>★</Text>
            <Text style={styles.cardTitle}>My Profile</Text>
            <Text style={styles.mutedText}>Your journey</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  function renderDiscover() {
    const artists = [
      { name: "Rising Star", genre: "Afrobeats" },
      { name: "Melody Queen", genre: "R&B / Soul" },
      { name: "Rhythm Maker", genre: "Hip-Hop" },
      { name: "Golden Voice", genre: "Gospel" },
    ];

    const filtered = artists.filter((artist) =>
      `${artist.name} ${artist.genre}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    return (
      <>
        <Text style={styles.pageTitle}>Discover</Text>
        <Text style={styles.bodyText}>
          Find your next favourite artist.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Search artists or genres..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />

        <Text style={styles.sectionTitle}>Artists to Discover</Text>

        {filtered.map((artist) => (
          <View style={styles.artistCard} key={artist.name}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {artist.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.songInfo}>
              <Text style={styles.cardTitle}>{artist.name}</Text>
              <Text style={styles.mutedText}>{artist.genre}</Text>
            </View>
            <TouchableOpacity
              style={styles.followButton}
              onPress={() => toggleFollow(artist.name)}
            >
              <Text style={styles.followText}>
                {following.includes(artist.name) ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {filtered.length === 0 && (
          <Text style={styles.mutedText}>No matching artists found.</Text>
        )}

        <Text style={styles.note}>
          These are sample artists. Connect Supabase to load real artist
          profiles and songs.
        </Text>
      </>
    );
  }

  function renderStudio() {
    return (
      <>
        <Text style={styles.pageTitle}>Artist Studio</Text>
        <Text style={styles.bodyText}>
          Prepare your next musical release.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recording Studio</Text>
          <Text style={styles.bodyText}>
            This button is a demonstration only. Microphone recording needs an
            audio-recording integration.
          </Text>

          <TouchableOpacity
            style={recording ? styles.stopButton : styles.primaryButton}
            onPress={() => {
              setRecording((current) => !current);
              Alert.alert(
                "Recording demo",
                "No audio is being captured or saved. Connect a recording module to enable real microphone recording."
              );
            }}
          >
            <Text style={styles.primaryButtonText}>
              {recording ? "■ Stop Demo" : "● Start Recording Demo"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Publish Song</Text>

          <Text style={styles.fieldLabel}>Artist Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your artist name"
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

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={publishSong}
          >
            <Text style={styles.primaryButtonText}>♫ Add Song</Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Songs currently stay in app memory. Cover uploads, audio files,
            Supabase storage, and public publishing are not connected yet.
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
            Complete your artist profile and connect your account to save your
            music and activity.
          </Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setActiveTab("Studio")}
          >
            <Text style={styles.secondaryButtonText}>Create Music</Text>
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
        {activeTab === "Profile" && renderProfile()}
      </ScrollView>

      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const selected = activeTab === tab;

          return (
            <TouchableOpacity
              key={tab}
              style={styles.navItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.navIcon, selected && styles.navSelected]}>
                {tab === "Home"
                  ? "⌂"
                  : tab === "Discover"
                  ? "⌕"
                  : tab === "Studio"
                  ? "♫"
                  : "◉"}
              </Text>
              <Text
                style={[
                  styles.navLabel,
                  selected && styles.navSelected,
                ]}
              >
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
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  logo: {
    fontSize: 27,
    fontWeight: "900",
    color: C.white,
  },
  logoAccent: {
    color: C.pink,
  },
  tagline: {
    fontSize: 10,
    color: C.muted,
    marginTop: 3,
  },
  liveButton: {
    backgroundColor: "#35152D",
    borderWidth: 1,
    borderColor: C.pink,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  liveButtonText: {
    color: C.pink,
    fontWeight: "800",
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 28,
  },
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
  pinkText: {
    color: C.pink,
  },
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
  primaryButtonText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
  },
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
  mutedText: {
    color: C.muted,
    fontSize: 11,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 17,
    padding: 17,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  emptyIcon: {
    color: C.pink,
    fontSize: 35,
    marginBottom: 8,
  },
  cardTitle: {
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
  },
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
  quickIcon: {
    fontSize: 25,
    marginBottom: 11,
  },
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
  artworkText: {
    color: C.pink,
    fontSize: 26,
  },
  songInfo: {
    flex: 1,
  },
  heart: {
    color: C.pink,
    fontSize: 27,
    paddingHorizontal: 5,
  },
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
  avatarText: {
    color: C.white,
    fontSize: 19,
    fontWeight: "900",
  },
  followButton: {
    borderWidth: 1,
    borderColor: C.purple,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  followText: {
    color: C.white,
    fontSize: 11,
    fontWeight: "700",
  },
  fieldLabel: {
    color: C.white,
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 8,
  },
  stopButton: {
    backgroundColor: "#7B244D",
    borderRadius: 13,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  note: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },
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
  profileAvatarText: {
    color: C.white,
    fontSize: 32,
    fontWeight: "900",
  },
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
  stat: {
    alignItems: "center",
  },
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
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  navIcon: {
    color: C.muted,
    fontSize: 22,
    marginBottom: 4,
  },
  navLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: "600",
  },
  navSelected: {
    color: C.pink,
    fontWeight: "900",
  },
});