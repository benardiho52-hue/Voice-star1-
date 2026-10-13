
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

  card: "#20132F",
  purple: "#9B4DFF",
  pink: "#FF3DAE",
  white: "#FFFFFF",
  muted: "#B8A9C9",
  border: "#382348",
  green: "#75F0B0",
};

const TABS = ["Home", "Discover", "Rooms", "Studio", "Profile"];

function Button({ title, onPress, secondary = false }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[s.button, secondary && s.secondaryButton]}
    >
      <Text style={s.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function Card({ children }) {
  return <View style={s.card}>{children}</View>;
}

function Heading({ children }) {
  return <Text style={s.heading}>{children}</Text>;
}

export default function App() {
  const [tab, setTab] = useState("Home");
  const [mode, setMode] = useState("Audio");
  const [isLive, setIsLive] = useState(false);
  const [battle, setBattle] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState("New Artist");
  const [song, setSong] = useState("");

  function sendComment() {
    const message = comment.trim();
    if (!message) {
      Alert.alert("Comment", "Write a comment first.");
      return;
    }
    setComments((old) => [...old, message]);
    setComment("");
  }

  function renderHome() {
    return (
      <>
        <View style={s.cover}>
          <Text style={s.bigStar}>★</Text>
          <Text style={s.brand}>VoiceStar</Text>
          <Text style={s.tagline}>
            Your stage, your voice, your star power!
          </Text>
          <Button
            title="★ Explore Live Rooms"
            onPress={() => setTab("Rooms")}
          />
        </View>

        <Heading>Your Music World</Heading>
        <View style={s.grid}>
          {[
            ["🎤", "Sing & Record", "Studio"],
            ["🎧", "Discover Songs", "Discover"],
            ["🔴", "Live Streaming", "Rooms"],
            ["⚔️", "Room Battles", "Rooms"],
          ].map(([icon, label, target]) => (
            <TouchableOpacity
              key={label}
              style={s.gridCard}
              onPress={() => setTab(target)}
            >
              <Text style={s.emoji}>{icon}</Text>
              <Text style={s.cardTitle}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Heading>Featured Artists</Heading>
        <Card>
          <Text style={s.cardTitle}>🌟 New Voices</Text>
          <Text style={s.muted}>
            Discover upcoming singers and support their music.
          </Text>
          <Button
            title="Discover Artists"
            secondary
            onPress={() => setTab("Discover")}
          />
        </Card>

        <Heading>Families & Friends</Heading>
        <Card>
          <Text style={s.cardTitle}>👑 VoiceStar Families</Text>
          <Text style={s.muted}>
            Connect with artists, complete family tasks, and
            participate in family battles.
          </Text>
        </Card>
      </>
    );
  }

  function renderDiscover() {
    const categories = [
      ["🔥", "Trending Songs"],
      ["🌟", "New Voices"],
      ["🎵", "Afrobeats"],
      ["🎤", "Duet Partners"],
      ["🎶", "Freestyle Beats"],
    ].filter((item) =>
      item[1].toLowerCase().includes(search.toLowerCase())
    );

    return (
      <>
        <Heading>Discover Music</Heading>
        <Text style={s.muted}>
          Find songs, artists, and singing partners.
        </Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search categories..."
          placeholderTextColor={C.muted}
          style={s.input}
        />
        {categories.map(([icon, title]) => (
          <Card key={title}>
            <Text style={s.cardTitle}>
              {icon} {title}
            </Text>
            <Text style={s.muted}>
              Explore music and connect with the community.
            </Text>
          </Card>
        ))}
        {categories.length === 0 && (
          <Text style={s.muted}>No matching categories.</Text>
        )}
      </>
    );
  }

  function renderRooms() {
    return (
      <>
        <Heading>Live Rooms</Heading>
        <Text style={s.muted}>
          Audio rooms and video live-streaming have separate modes.
        </Text>

        <View style={s.row}>
          <View style={s.flex}>
            <Button
              title="🎙 Audio"
              secondary={mode !== "Audio"}
              onPress={() => setMode("Audio")}
            />
          </View>
          <View style={s.flex}>
            <Button
              title="📹 Video"
              secondary={mode !== "Video"}
              onPress={() => setMode("Video")}
            />
          </View>
        </View>

        <Card>
          <Text style={s.cardTitle}>Create Your Stream</Text>
          <Text style={s.muted}>Selected mode: {mode}</Text>
          <Button
            title={isLive ? "End Demo Stream" : "🔴 Go Live"}
            onPress={() => setIsLive((old) => !old)}
          />
          {isLive && (
            <Text style={s.success}>
              Demo {mode.toLowerCase()} stream is active.
            </Text>
          )}
          <Text style={s.small}>
            Real camera and microphone streaming are not connected.
          </Text>
        </Card>

        <Card>
          <Text style={s.cardTitle}>🎶 Music Room</Text>
          <Text style={s.muted}>
            Host a singing session with friends.
          </Text>
          <Button
            title="Join Demo Room"
            secondary
            onPress={() =>
              Alert.alert(
                "Music Room",
                "Real room creation and joining need a backend."
              )
            }
          />
        </Card>

        <Card>
          <Text style={s.cardTitle}>⚔️ Room Battle</Text>
          <Text style={s.muted}>
            Challenge an artist and plan a battle with participants.
          </Text>
          <Button
            title={battle ? "End Demo Battle" : "Start Demo Battle"}
            onPress={() => setBattle((old) => !old)}
          />
          {battle && (
            <Text style={s.success}>
              Demo battle activated. Online opponents and scoring
              are not connected.
            </Text>
          )}
        </Card>

        <Card>
          <Text style={s.cardTitle}>💬 Comments & Reactions</Text>
          <TouchableOpacity
            style={s.reaction}
            onPress={() => setLiked((old) => !old)}
          >
            <Text style={s.cardTitle}>
              {liked ? "❤️ Liked" : "🤍 Like this room"}
            </Text>
          </TouchableOpacity>

          <View style={s.row}>
            <View style={s.flex}>
              <TextInput
                value={comment}
                onChangeText={setComment}
                onSubmitEditing={sendComment}
                returnKeyType="send"
                placeholder="Write a comment..."
                placeholderTextColor={C.muted}
                style={s.input}
              />
            </View>
            <Button title="Send" onPress={sendComment} />
          </View>

          {comments.map((message, index) => (
            <Text key={`${index}-${message}`} style={s.comment}>
              💬 {message}
            </Text>
          ))}
        </Card>
      </>
    );
  }

  function renderStudio() {
    const effects = [
      "Reverb",
      "Echo",
      "Bass",
      "Treble",
      "Compression",
      "Pitch Correction",
      "Voice Changer",
    ];

    return (
      <>
        <Heading>Artist Studio</Heading>
        <Text style={s.muted}>
          Prepare your next song for the world.
        </Text>

        <Card>
          <Text style={s.cardTitle}>🎤 Recording Studio</Text>
          <Text style={s.muted}>
            Record vocals, preview takes, and prepare songs.
          </Text>
          <Button
            title="Open Recording Tools"
            onPress={() =>
              Alert.alert(
                "Recording",
                "Real microphone recording and audio saving need integration."
              )
            }
          />
        </Card>

        <Card>
          <Text style={s.cardTitle}>🎚️ Mix Studio</Text>
          {effects.map((effect) => (
            <View key={effect} style={s.effectRow}>
              <Text style={s.muted}>{effect}</Text>
              <Text style={s.pinkText}>Not connected</Text>
            </View>
          ))}
          <Text style={s.small}>
            The controls above are labels, not active audio effects.
          </Text>
        </Card>

        <Card>
          <Text style={s.cardTitle}>📀 Publish Song</Text>

          <Text style={s.fieldLabel}>Artist name</Text>
          <TextInput
            value={artist}
            onChangeText={setArtist}
            placeholder="Artist name"
            placeholderTextColor={C.muted}
            style={s.input}
          />

          <Text style={s.fieldLabel}>Song title</Text>
          <TextInput
            value={song}
            onChangeText={setSong}
            placeholder="Song title"
            placeholderTextColor={C.muted}
            style={s.input}
          />

          <Button
            title="Prepare Song"
            onPress={() => {
              if (!artist.trim() || !song.trim()) {
                Alert.alert(
                  "Missing details",
                  "Enter the artist name and song title."
                );
                return;
              }
              Alert.alert(
                "Song Prepared",
                `${song} by ${artist}\n\nUploading and publishing are not connected yet.`
              );
            }}
          />
          <Text style={s.small}>
            Audio upload, cover art, genres, hashtags, privacy,
            and publishing need database and storage integration.
          </Text>
        </Card>
      </>
    );
  }

  function renderProfile() {
    return (
      <>
        <View style={s.profileHeader}>
          <Text style={s.profileStar}>★</Text>
          <Heading>Artist Profile</Heading>
          <Text style={s.muted}>{artist || "New Artist"}</Text>
        </View>

        <View style={s.grid}>
          {[
            ["🎵", "My Songs"],
            ["👥", "Followers"],
            ["🏆", "Achievements"],
            ["👑", "My Family"],
          ].map(([icon, title]) => (
            <TouchableOpacity
              key={title}
              style={s.gridCard}
              onPress={() =>
                Alert.alert(
                  title,
                  "This feature needs account data integration."
                )
              }
            >
              <Text style={s.emoji}>{icon}</Text>
              <Text style={s.cardTitle}>{title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card>
          <Text style={s.cardTitle}>Account & Settings</Text>
          <Text style={s.muted}>
            Profile editing, verification, privacy, and notifications.
          </Text>
        </Card>
      </>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={s.header}>
        <Text style={s.headerStar}>★</Text>
        <Text style={s.headerBrand}>VoiceStar</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Notifications", "Notifications need integration.")
          }
        >
          <Text style={s.notification}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.content}
        contentContainerStyle={s.contentBottom}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {tab === "Home" && renderHome()}
        {tab === "Discover" && renderDiscover()}
        {tab === "Rooms" && renderRooms()}
        {tab === "Studio" && renderStudio()}
        {tab === "Profile" && renderProfile()}
      </ScrollView>

      <View style={s.bottomNav}>
        {TABS.map((name) => (
          <TouchableOpacity
            key={name}
            onPress={() => setTab(name)}
            style={s.navItem}
            accessibilityRole="button"
            accessibilityState={{ selected: tab === name }}
          >
            <Text style={[s.navText, tab === name && s.navActive]}>
              {name}
            </Text>
            {tab === name && <View style={s.navIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerStar: { color: C.pink, fontSize: 29, marginRight: 8 },
  headerBrand: {
    color: C.white,
    fontSize: 21,
    fontWeight: "bold",
    flex: 1,
  },
  notification: { fontSize: 21, padding: 5 },
  content: { flex: 1, paddingHorizontal: 16 },
  contentBottom: { paddingBottom: 28 },
  cover: {
    marginTop: 18,
    padding: 22,
    borderRadius: 22,
    alignItems: "center",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.purple,
  },
  bigStar: { fontSize: 76, color: C.pink },
  brand: { fontSize: 32, fontWeight: "bold", color: C.white },
  tagline: {
    color: C.muted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  heading: {
    color: C.white,
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 8,
  },
  sectionTitle: {
    color: C.white,
    fontSize: 19,
    fontWeight: "bold",
    marginTop: 24,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginTop: 12,
  },
  cardTitle: { color: C.white, fontSize: 15, fontWeight: "bold" },
  muted: { color: C.muted, fontSize: 14, marginTop: 7, lineHeight: 20 },
  small: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 12 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    minHeight: 105,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    marginTop: 10,
  },
  emoji: { fontSize: 27, marginBottom: 8 },
  button: {
    backgroundColor: C.purple,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  secondaryButton: {
    backgroundColor: "#352044",
    borderWidth: 1,
    borderColor: C.purple,
  },
  buttonText: {
    color: C.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  flex: { flex: 1 },
  input: {
    backgroundColor: "#160D20",
    borderWidth: 1,
    borderColor: C.border,
    color: C.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginTop: 10,
  },
  fieldLabel: { color: C.muted, fontSize: 13, marginTop: 14 },
  success: { color: C.green, marginTop: 12, lineHeight: 19 },
  reaction: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#160D20",
    marginTop: 12,
  },
  comment: { color: C.white, marginTop: 12, lineHeight: 19 },
  effectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pinkText: { color: C.pink, fontSize: 11 },
  profileHeader: { alignItems: "center", marginTop: 18 },
  profileStar: { color: C.pink, fontSize: 70 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#181024",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navText: { color: C.muted, fontSize: 10 },
  navActive: { color: C.pink, fontWeight: "bold" },
  navIndicator: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.pink,
    marginTop: 5,
  },
});

