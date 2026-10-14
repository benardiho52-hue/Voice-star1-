import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";

const PURPLE = "#A855F7";
const PINK = "#EC4899";
const BG = "#0D0915";
const CARD = "#1B1427";
const MUTED = "#B8AFC6";

export default function App() {
  const [tab, setTab] = useState("Home");
  const [songTitle, setSongTitle] = useState("");
  const [genre, setGenre] = useState("Afrobeats");
  const [description, setDescription] = useState("");
  const [artistName, setArtistName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("Not recording");
  const [songs, setSongs] = useState([]);
  const [effects, setEffects] = useState({
    Reverb: false,
    Echo: false,
    Bass: false,
    Treble: false,
    AutoTune: false,
  });

  const tabs = [
    { name: "Home", icon: "⌂" },
    { name: "Discover", icon: "◎" },
    { name: "Studio", icon: "🎙" },
    { name: "Live", icon: "🔴" },
    { name: "Profile", icon: "♙" },
  ];

  function feature(title, subtitle, icon, action) {
    return (
      <TouchableOpacity
        key={title}
        style={styles.feature}
        onPress={action}
        activeOpacity={0.8}
      >
        <Text style={styles.featureIcon}>{icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.muted}>{subtitle}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  }

  function field(label, value, setter, placeholder, multiline = false) {
    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multiline,
          ]}
          value={value}
          onChangeText={setter}
          placeholder={placeholder}
          placeholderTextColor="#82758F"
          selectionColor={PURPLE}
          multiline={multiline}
        />
      </View>
    );
  }

  function actionButton(label, action, secondary = false) {
    return (
      <TouchableOpacity
        style={[
          styles.primary,
          secondary && styles.secondaryButton,
        ]}
        onPress={action}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  function startRecording() {
    Alert.alert(
      "Microphone recording",
      "The recording screen is ready, but actual audio capture needs a compatible recording package and Android microphone permissions. No audio file has been recorded yet."
    );
    setRecordingStatus("Recording package required");
  }

  function stopRecording() {
    setIsRecording(false);
    setRecordingStatus("Not recording");
    Alert.alert(
      "Recording stopped",
      "No audio file was created because microphone recording has not been connected yet."
    );
  }

  function toggleEffect(name) {
    setEffects((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  }

  function publishSong() {
    if (!songTitle.trim()) {
      Alert.alert("Song title required", "Enter your song title first.");
      return;
    }

    const newSong = {
      id: Date.now().toString(),
      title: songTitle.trim(),
      genre,
      description: description.trim(),
      artist: artistName.trim() || "New Artist",
    };

    setSongs((previous) => [newSong, ...previous]);
    setSongTitle("");
    setDescription("");
    Alert.alert(
      "Saved on this device",
      "Your song details have been added to the local song list. Online publishing and audio uploads still need Supabase integration."
    );
  }

  function toggleLive() {
    if (isLive) {
      setIsLive(false);
      Alert.alert("Room closed", "Your local live-room session has ended.");
      return;
    }

    if (!roomName.trim()) {
      Alert.alert("Room name required", "Enter a name for your room first.");
      return;
    }

    setIsLive(true);
    Alert.alert(
      "Room interface opened",
      "Your room is marked active on this device. Online broadcasting and joining by other users are not connected yet."
    );
  }

  function renderSongs() {
    if (songs.length === 0) {
      return (
        <View style={styles.infoCard}>
          <Text style={styles.featureTitle}>No songs saved yet</Text>
          <Text style={styles.muted}>
            Use Publish Song to add your first song details.
          </Text>
        </View>
      );
    }

    return songs.map((song) => (
      <View key={song.id} style={styles.songCard}>
        <Text style={styles.featureIcon}>🎵</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.featureTitle}>{song.title}</Text>
          <Text style={styles.muted}>
            {song.artist} · {song.genre}
          </Text>
          {!!song.description && (
            <Text style={styles.muted}>{song.description}</Text>
          )}
          <Text style={styles.localLabel}>Saved locally</Text>
        </View>
      </View>
    ));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            VoiceStar<Text style={{ color: PINK }}> ✦</Text>
          </Text>
          <Text style={styles.tagline}>
            YOUR STAGE. YOUR VOICE. YOUR STAR POWER!
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setTab("Profile")}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>VS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {tab === "Home" && (
          <>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>WELCOME TO YOUR STAGE</Text>
              <Text style={styles.heroTitle}>
                Your voice{"\n"}deserves to be heard.
              </Text>
              <Text style={styles.heroText}>
                Create music, meet artists and let the world hear you.
              </Text>
              {actionButton("🎙  Enter Artist Studio", () =>
                setTab("Studio")
              )}
            </View>

            <Text style={styles.section}>Your Music World</Text>
            {feature("Artist Studio", "Create your next hit", "🎧", () =>
              setTab("Studio")
            )}
            {feature("Discover Artists", "Find new voices and songs", "🎵", () =>
              setTab("Discover")
            )}
            {feature("Live Rooms", "Your stage for performances", "🔴", () =>
              setTab("Live")
            )}
            {feature("Publish Song", "Prepare your music release", "🎼", () =>
              setTab("Publish")
            )}

            <Text style={styles.section}>Your Song Library</Text>
            {renderSongs()}
          </>
        )}

        {tab === "Discover" && (
          <>
            <Text style={styles.pageTitle}>Discover</Text>
            <Text style={styles.muted}>
              Find your next favourite sound.
            </Text>
            {feature("New Voices", "Discover emerging artists", "🌟", () =>
              Alert.alert(
                "New Voices",
                "Artist discovery will show online profiles after database integration."
              )
            )}
            {feature("Afrobeats", "Feel the rhythm", "🎵", () =>
              Alert.alert("Afrobeats", "Explore Afrobeats releases here.")
            )}
            {feature("Trending Music", "Explore popular sounds", "🔥", () =>
              Alert.alert(
                "Trending Music",
                "Trending songs need published music data."
              )
            )}

            <Text style={styles.section}>Songs on this device</Text>
            {renderSongs()}
          </>
        )}

        {tab === "Studio" && (
          <>
            <Text style={styles.pageTitle}>Artist Studio</Text>
            <Text style={styles.muted}>
              Make your next performance yours.
            </Text>

            <View style={styles.infoCard}>
              <Text style={styles.featureTitle}>🎙 Vocal Recording</Text>
              <Text style={styles.muted}>
                Status: {recordingStatus}
              </Text>
              <Text style={styles.muted}>
                Recording requires microphone capture integration.
              </Text>
              {actionButton("Start Recording Setup", startRecording)}
              {actionButton("Stop Recording", stopRecording, true)}
            </View>

            <Text style={styles.section}>Mix Studio</Text>
            <Text style={styles.muted}>
              Select the effects you want for your mix.
            </Text>

            {Object.keys(effects).map((effect) => (
              <TouchableOpacity
                key={effect}
                style={styles.effectRow}
                onPress={() => toggleEffect(effect)}
              >
                <Text style={styles.featureTitle}>{effect}</Text>
                <Text
                  style={[
                    styles.effectState,
                    effects[effect] && styles.effectOn,
                  ]}
                >
                  {effects[effect] ? "SELECTED ✓" : "OFF"}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.infoCard}>
              <Text style={styles.featureTitle}>Beat Library 🥁</Text>
              <Text style={styles.muted}>
                Beat playback and importing audio files need an audio player.
                No beats are bundled yet.
              </Text>
            </View>

            {feature("Prepare a Song", "Enter song details", "🎼", () =>
              setTab("Publish")
            )}
          </>
        )}

        {tab === "Live" && (
          <>
            <Text style={styles.pageTitle}>Live Rooms</Text>
            <Text style={styles.muted}>
              Your stage. Your audience.
            </Text>

            {field(
              "Room name",
              roomName,
              setRoomName,
              "e.g. Afrobeats Night"
            )}

            <View style={styles.infoCard}>
              <Text style={styles.featureTitle}>
                {isLive ? "🔴 Room session active" : "🎤 Ready for your stage"}
              </Text>
              <Text style={styles.muted}>
                {isLive
                  ? "This is a local session, not an online broadcast."
                  : "Create a room name and open your session."}
              </Text>
              {actionButton(
                isLive ? "End Room" : "Go Live",
                toggleLive
              )}
            </View>

            {feature("Join a Room", "Connect to other performers", "🎤", () =>
              Alert.alert(
                "Join a Room",
                "Online rooms and live audio require backend and streaming integration."
              )
            )}

            {feature("Room Chat", "Talk to your audience", "💬", () =>
              Alert.alert(
                "Room Chat",
                "Chat needs a connected database or realtime service."
              )
            )}
          </>
        )}

        {tab === "Publish" && (
          <>
            <Text style={styles.pageTitle}>Publish Song</Text>
            <Text style={styles.muted}>
              Prepare your release details.
            </Text>

            {field(
              "Artist name",
              artistName,
              setArtistName,
              "Your stage name"
            )}
            {field(
              "Song title",
              songTitle,
              setSongTitle,
              "Enter your song title"
            )}
            <Text style={styles.fieldLabel}>Genre</Text>

            <View style={styles.genreRow}>
              {["Afrobeats", "Pop", "Gospel", "R&B", "Hip-Hop"].map(
                (item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.genreChip,
                      genre === item && styles.genreSelected,
                    ]}
                    onPress={() => setGenre(item)}
                  >
                    <Text style={styles.genreText}>{item}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            {field(
              "Description",
              description,
              setDescription,
              "Tell listeners about your song",
              true
            )}

            <View style={styles.infoCard}>
              <Text style={styles.featureTitle}>Cover artwork</Text>
              <Text style={styles.muted}>
                Image selection and audio file upload have not been connected.
              </Text>
            </View>

            {actionButton("Save Song Details", publishSong)}
            <Text style={styles.section}>My Songs</Text>
            {renderSongs()}
          </>
        )}

        {tab === "Profile" && (
          <>
            <Text style={styles.pageTitle}>Artist Profile</Text>
            <View style={styles.profileCard}>
              <View style={styles.bigAvatar}>
                <Text style={styles.bigAvatarText}>VS</Text>
              </View>
              <Text style={styles.heroTitle}>
                {artistName || "Your Artist Journey"}
              </Text>
              <Text style={styles.muted}>
                Your artist profile and online followers will appear here
                when account and database services are connected.
              </Text>
            </View>

            {feature("My Songs", "View your song details", "🎵", () =>
              setTab("Publish")
            )}
            {feature("Artist Studio", "Prepare your music", "🎙", () =>
              setTab("Studio")
            )}
            {feature("Achievements", "Celebrate your progress", "🏆", () =>
              Alert.alert(
                "Achievements",
                "Achievement tracking will be connected to your account."
              )
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.nav}>
        {tabs.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => setTab(item.name)}
          >
            <Text
              style={[
                styles.navIcon,
                tab === item.name && styles.activeText,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                styles.navLabel,
                tab === item.name && styles.activeText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#30223F",
  },
  logo: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  tagline: {
    fontSize: 8,
    color: "#D8B4FE",
    marginTop: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  content: {
    padding: 18,
    paddingBottom: 28,
  },
  hero: {
    backgroundColor: "#28133E",
    borderRadius: 22,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#663399",
  },
  eyebrow: {
    color: "#E9D5FF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 12,
  },
  heroText: {
    color: "#E9D5FF",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  primary: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  secondaryButton: {
    backgroundColor: "#30223F",
    borderWidth: 1,
    borderColor: PURPLE,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  section: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 22,
  },
  pageTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginBottom: 8,
  },
  muted: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 19,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#30223F",
  },
  featureIcon: {
    fontSize: 25,
    marginRight: 14,
  },
  featureTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  arrow: {
    color: "#D8B4FE",
    fontSize: 27,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: CARD,
    padding: 18,
    borderRadius: 15,
    marginTop: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#30223F",
  },
  fieldGroup: {
    marginTop: 18,
  },
  fieldLabel: {
    color: "#E9D5FF",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    color: "#FFFFFF",
    backgroundColor: CARD,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#49345F",
    fontSize: 14,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  genreChip: {
    backgroundColor: CARD,
    borderColor: "#49345F",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginRight: 7,
    marginBottom: 8,
  },
  genreSelected: {
    backgroundColor: "#49216A",
    borderColor: PURPLE,
  },
  genreText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  effectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 15,
    marginTop: 9,
    borderWidth: 1,
    borderColor: "#30223F",
  },
  effectState: {
    color: MUTED,
    fontSize: 10,
    fontWeight: "bold",
  },
  effectOn: {
    color: "#E9D5FF",
  },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#30223F",
  },
  localLabel: {
    color: "#D8B4FE",
    fontSize: 10,
    marginTop: 6,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: CARD,
    padding: 24,
    borderRadius: 18,
    marginTop: 15,
    marginBottom: 18,
  },
  bigAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  bigAvatarText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#181024",
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#30223F",
  },
  navItem: {
    alignItems: "center",
    minWidth: 48,
  },
  navIcon: {
    color: MUTED,
    fontSize: 20,
    marginBottom: 3,
  },
  navLabel: {
    color: MUTED,
    fontSize: 10,
  },
  activeText: {
    color: "#D8B4FE",
    fontWeight: "bold",
  },
});
