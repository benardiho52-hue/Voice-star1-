import React, { useState } from "react";
import {
SafeAreaView,
View,
Text,
TouchableOpacity,
ScrollView,
StatusBar,
StyleSheet,
} from "react-native";

const PURPLE = "#A855F7";
const BG = "#0D0915";
const CARD = "#1B1427";
const MUTED = "#B8AFC6";

export default function App() {
const [tab, setTab] = useState("Home");

const tabs = [
{ name: "Home", icon: "⌂" },
{ name: "Discover", icon: "◎" },
{ name: "Studio", icon: "🎙" },
{ name: "Profile", icon: "♙" },
];

function feature(title, subtitle, icon, action) {
return (
<TouchableOpacity
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

return (
<SafeAreaView style={styles.safe}>
<StatusBar barStyle="light-content" backgroundColor={BG} />
<View style={styles.header}>
<View>
<Text style={styles.logo}>VoiceStar<Text style={{ color: "#EC4899" }}> ✦</Text></Text>
<Text style={styles.tagline}>YOUR STAGE. YOUR VOICE. YOUR STAR POWER!</Text>
</View>
<TouchableOpacity onPress={() => setTab("Profile")} style={styles.avatar}>
<Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>VS</Text>
</TouchableOpacity>
</View>

  <ScrollView contentContainerStyle={styles.content}>
    {tab === "Home" && (
      <>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>WELCOME TO YOUR STAGE</Text>
          <Text style={styles.heroTitle}>Your voice{"\n"}deserves to be heard.</Text>
          <Text style={styles.heroText}>
            Create music, meet artists and let the world hear you.
          </Text>
          <TouchableOpacity style={styles.primary}
            onPress={() => setTab("Studio")}>
            <Text style={styles.primaryText}>🎙  Enter Artist Studio</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.section}>Your Music World</Text>
        {feature("Artist Studio", "Create your next hit", "🎧",
          () => setTab("Studio"))}
        {feature("Discover Artists", "Find new voices and songs", "🎵",
          () => setTab("Discover"))}
        {feature("Live Rooms", "Your stage for live performances", "🔴",
          () => setTab("Live"))}
        {feature("Publish Song", "Share your music with the world", "🎼",
          () => setTab("Publish"))}

        <Text style={styles.section}>The VoiceStar Journey</Text>
        <View style={styles.infoCard}>
          <Text style={styles.featureTitle}>Every star starts somewhere.</Text>
          <Text style={styles.muted}>
            Build your artist profile, prepare your music and grow your audience.
          </Text>
        </View>
      </>
    )}

    {tab === "Discover" && (
      <>
        <Text style={styles.pageTitle}>Discover</Text>
        <Text style={styles.muted}>Find your next favourite sound.</Text>
        {feature("New Voices", "Discover emerging artists", "🌟",
          () => {})}
        {feature("Afrobeats", "Feel the rhythm", "🎵", () => {})}
        {feature("Trending Music", "Explore popular sounds", "🔥", () => {})}
        <Text style={styles.muted}>
          Published songs and artist profiles will appear here when connected
          to the music database.
        </Text>
      </>
    )}

    {tab === "Studio" && (
      <>
        <Text style={styles.pageTitle}>Artist Studio</Text>
        <Text style={styles.muted}>Make your next performance yours.</Text>
        {feature("Record Vocals", "Microphone recording", "🎙",
          () => {})}
        {feature("Mix Studio", "Reverb, echo, bass and vocal effects", "🎚",
          () => {})}
        {feature("Beat Library", "Choose a beat for your song", "🥁",
          () => {})}
        {feature("My Songs", "Prepare your music for publishing", "🎶",
          () => setTab("Publish"))}
        <View style={styles.infoCard}>
          <Text style={styles.featureTitle}>Studio setup</Text>
          <Text style={styles.muted}>
            These are interface entry points. Audio recording, effects and
            song saving must be connected before they can work.
          </Text>
        </View>
      </>
    )}

    {tab === "Live" && (
      <>
        <Text style={styles.pageTitle}>Live Rooms</Text>
        <Text style={styles.muted}>Your stage. Your audience.</Text>
        {feature("Go Live", "Start a live performance", "🔴", () => {})}
        {feature("Join a Room", "Meet other performers", "🎤", () => {})}
        <View style={styles.infoCard}>
          <Text style={styles.featureTitle}>Live streaming setup</Text>
          <Text style={styles.muted}>
            Live audio, audience connections and room controls still need
            a streaming service and backend integration.
          </Text>
        </View>
      </>
    )}

    {tab === "Publish" && (
      <>
        <Text style={styles.pageTitle}>Publish Song</Text>
        <Text style={styles.muted}>Get your music ready for the world.</Text>
        {feature("Prepare a Release", "Song details and cover artwork", "🎼",
          () => {})}
        {feature("My Music", "Your saved recordings", "🎵", () => {})}
        <View style={styles.infoCard}>
          <Text style={styles.featureTitle}>Publishing</Text>
          <Text style={styles.muted}>
            Song uploads, privacy settings and publishing to Discover need
            storage and database connections.
          </Text>
        </View>
      </>
    )}

    {tab === "Profile" && (
      <>
        <Text style={styles.pageTitle}>Artist Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.bigAvatar}><Text style={styles.bigAvatarText}>VS</Text></View>
          <Text style={styles.heroTitle}>Your Artist Journey</Text>
          <Text style={styles.muted}>
            Your artist name, biography, songs and followers will appear here.
          </Text>
        </View>
        {feature("My Songs", "Your music catalogue", "🎵",
          () => setTab("Publish"))}
        {feature("Achievements", "Celebrate your progress", "🏆", () => {})}
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
        <Text style={[
          styles.navIcon,
          tab === item.name && styles.activeText,
        ]}>{item.icon}</Text>
        <Text style={[
          styles.navLabel,
          tab === item.name && styles.activeText,
        ]}>{item.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
</SafeAreaView>

);
}

const styles = StyleSheet.create({
safe: { flex: 1, backgroundColor: BG },
header: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
paddingHorizontal: 20,
paddingVertical: 15,
borderBottomWidth: 1,
borderBottomColor: "#30223F",
},
logo: { fontSize: 25, fontWeight: "900", color: "#FFFFFF" },
tagline: { fontSize: 8, color: "#D8B4FE", marginTop: 4 },
avatar: {
width: 42, height: 42, borderRadius: 21,
backgroundColor: PURPLE, alignItems: "center", justifyContent: "center",
},
content: { padding: 18, paddingBottom: 28 },
hero: {
backgroundColor: "#28133E",
borderRadius: 22,
padding: 22,
marginBottom: 24,
borderWidth: 1,
borderColor: "#663399",
},
eyebrow: { color: "#E9D5FF", fontSize: 10, fontWeight: "bold", letterSpacing: 1 },
heroTitle: { color: "#FFFFFF", fontSize: 27, fontWeight: "900", marginTop: 12 },
heroText: { color: "#E9D5FF", fontSize: 13, lineHeight: 20, marginTop: 10 },
primary: {
backgroundColor: PURPLE, borderRadius: 12, padding: 14,
alignItems: "center", marginTop: 20,
},
primaryText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
section: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginBottom: 12, marginTop: 5 },
pageTitle: { color: "#FFFFFF", fontSize: 27, fontWeight: "900", marginBottom: 8 },
muted: { color: MUTED, fontSize: 12, lineHeight: 19 },
feature: {
flexDirection: "row", alignItems: "center",
backgroundColor: CARD, padding: 15, borderRadius: 15,
marginBottom: 10, borderWidth: 1, borderColor: "#30223F",
},
featureIcon: { fontSize: 25, marginRight: 14 },
featureTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold", marginBottom: 4 },
arrow: { color: "#D8B4FE", fontSize: 27, marginLeft: 8 },
infoCard: {
backgroundColor: CARD, padding: 18, borderRadius: 15,
marginTop: 8, marginBottom: 16, borderWidth: 1, borderColor: "#30223F",
},
profileCard: {
alignItems: "center", backgroundColor: CARD,
padding: 24, borderRadius: 18, marginTop: 15, marginBottom: 18,
},
bigAvatar: {
width: 80, height: 80, borderRadius: 40,
backgroundColor: PURPLE, alignItems: "center", justifyContent: "center",
marginBottom: 12,
},
bigAvatarText: { color: "#FFFFFF", fontSize: 25, fontWeight: "900" },
nav: {
flexDirection: "row", justifyContent: "space-around",
backgroundColor: "#181024", paddingTop: 10, paddingBottom: 8,
borderTopWidth: 1, borderTopColor: "#30223F",
},
navItem: { alignItems: "center", minWidth: 58 },
navIcon: { color: MUTED, fontSize: 20, marginBottom: 3 },
navLabel: { color: MUTED, fontSize: 10 },
activeText: { color: "#D8B4FE", fontWeight: "bold" },
});
