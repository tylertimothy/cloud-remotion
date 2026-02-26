#!/bin/bash
set -e
cd /workspace

VOICE="en-US-AndrewMultilingualNeural"
MUSIC="plugins/promo-video/skills/promo-video/music/inspired-ambient-141686.mp3"
VIDEO_DURATION=18.4

echo "=== Generating voiceover sections with Edge TTS ==="
echo "Voice: $VOICE (Warm, Confident)"
echo ""

# Scene 1: Hook (0-3s) - speak at 0.8s
echo "[0.8s] Scene 1: Hook"
edge-tts --voice "$VOICE" --rate="-5%" --pitch="-2Hz" \
  --text "Time... but not like you know it." \
  --write-media /tmp/vo_01.mp3 2>/dev/null

# Scene 2: App Reveal (3-6s) - speak at 3.5s
echo "[3.5s] Scene 2: App Reveal"
edge-tts --voice "$VOICE" --rate="-8%" --pitch="-3Hz" \
  --text "Introducing... Ice Chronos." \
  --write-media /tmp/vo_02.mp3 2>/dev/null

# Scene 3: Phone Mockup (6-9.5s) - speak at 6.5s
echo "[6.5s] Scene 3: Phone Mockup"
edge-tts --voice "$VOICE" --rate="+5%" --pitch="-2Hz" \
  --text "A clock carved from ice. Beautiful and minimal." \
  --write-media /tmp/vo_03.mp3 2>/dev/null

# Scene 4: Features (9.5-13s) - speak at 10s
echo "[10.0s] Scene 4: Features"
edge-tts --voice "$VOICE" --rate="+5%" --pitch="-2Hz" \
  --text "Alarms. Timers. World clock." \
  --write-media /tmp/vo_04.mp3 2>/dev/null

# Scene 5: Social Proof (13-15.5s) - speak at 13.2s
echo "[13.2s] Scene 5: Social Proof"
edge-tts --voice "$VOICE" --rate="+5%" --pitch="-2Hz" \
  --text "Rated four point nine. Half a million downloads." \
  --write-media /tmp/vo_05.mp3 2>/dev/null

# Scene 6: CTA (15.5-18.3s) - speak at 15.8s
echo "[15.8s] Scene 6: CTA"
edge-tts --voice "$VOICE" --rate="-5%" --pitch="-3Hz" \
  --text "Ice Chronos. A cooler way to keep time." \
  --write-media /tmp/vo_06.mp3 2>/dev/null

echo ""
echo "=== Section durations ==="
for f in /tmp/vo_0{1,2,3,4,5,6}.mp3; do
  dur=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$f")
  echo "  $(basename $f): ${dur}s"
done

echo ""
echo "=== Creating silence base (${VIDEO_DURATION}s) ==="
ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" \
  -t "$VIDEO_DURATION" -q:a 9 -acodec libmp3lame /tmp/silence.mp3 2>/dev/null

echo "=== Combining voiceover sections with timing ==="
ffmpeg -y \
  -i /tmp/silence.mp3 \
  -i /tmp/vo_01.mp3 \
  -i /tmp/vo_02.mp3 \
  -i /tmp/vo_03.mp3 \
  -i /tmp/vo_04.mp3 \
  -i /tmp/vo_05.mp3 \
  -i /tmp/vo_06.mp3 \
  -filter_complex "\
    [1]adelay=800|800[d0];\
    [2]adelay=3500|3500[d1];\
    [3]adelay=6500|6500[d2];\
    [4]adelay=10000|10000[d3];\
    [5]adelay=13200|13200[d4];\
    [6]adelay=15800|15800[d5];\
    [0][d0][d1][d2][d3][d4][d5]amix=inputs=7:duration=first:normalize=0" \
  /tmp/voiceover_raw.mp3 2>/dev/null

echo "=== Normalizing voiceover ==="
ffmpeg -y -i /tmp/voiceover_raw.mp3 \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" \
  /tmp/voiceover.mp3 2>/dev/null

echo "=== Mixing with background music ==="
ffmpeg -y \
  -i /tmp/voiceover.mp3 \
  -i "$MUSIC" \
  -filter_complex "\
    [1:a]volume=0.08,afade=t=in:st=0:d=1.5,afade=t=out:st=16:d=2.4[music];\
    [0:a][music]amix=inputs=2:duration=first:normalize=0" \
  /tmp/final_audio.mp3 2>/dev/null

dur=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 /tmp/final_audio.mp3)
echo ""
echo "=== Done! Final audio: ${dur}s ==="
ls -lh /tmp/final_audio.mp3
