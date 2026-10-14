import { PermissionsAndroid, Platform } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

const recorder = new AudioRecorderPlayer();
let isRecording = false;

async function requestMicrophonePermission() {
if (Platform.OS !== "android" || Number(Platform.Version) < 23) {
return true;
}

const result = await PermissionsAndroid.request(
PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
{
title: "VoiceStar Microphone Permission",
message:
"VoiceStar needs microphone access so you can record your singing.",
buttonPositive: "Allow",
buttonNegative: "Cancel",
}
);

return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function startRecording() {
if (isRecording) {
throw new Error("Recording is already in progress.");
}

const permissionGranted = await requestMicrophonePermission();

if (!permissionGranted) {
throw new Error(
"Microphone permission denied. Allow microphone access and try again."
);
}

const path = await recorder.startRecorder();
isRecording = true;

return { path };
}

export async function stopRecording() {
if (!isRecording) {
throw new Error("There is no recording in progress.");
}

try {
const path = await recorder.stopRecorder();
return { path: path || null };
} finally {
isRecording = false;
}
}
