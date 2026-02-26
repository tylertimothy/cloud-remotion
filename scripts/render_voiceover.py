#!/usr/bin/env python3
"""
Generate timed voiceover for the IceCubePromo video using ElevenLabs.
Sections are timed to match the 6-scene composition (18.3s at 30fps).
"""

import urllib.request
import json
import subprocess
import os
import sys

API_KEY = os.environ.get("ELEVEN_LABS_API_KEY")
VOICE_ID = "cjVigY5qzO86Huf0OWal"  # Eric - Smooth, Trustworthy, Cool
VIDEO_DURATION = 19
OUTPUT_FILE = "voiceover.mp3"

VOICE_SETTINGS = {
    "stability": 0.55,
    "similarity_boost": 0.80,
    "style": 0.35,
    "use_speaker_boost": True,
}

sections = [
    (0.8, "Time... but not like you know it."),
    (3.5, "Introducing Ice Chronos."),
    (6.5, "A clock app carved from ice. Beautiful. Minimal. Yours."),
    (10.0, "Smart alarms. Precision timers. World clock."),
    (13.2, "Four point nine stars. Half a million downloads."),
    (15.8, "Ice Chronos. A cooler way to keep time."),
]


def check_requirements():
    if not API_KEY:
        print("Error: ELEVEN_LABS_API_KEY not set", file=sys.stderr)
        sys.exit(1)
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Error: ffmpeg not found", file=sys.stderr)
        sys.exit(1)


def generate_audio(text, filename):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": VOICE_SETTINGS,
    }
    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
    req = urllib.request.Request(
        url, data=json.dumps(data).encode("utf-8"), headers=headers, method="POST"
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        with open(filename, "wb") as f:
            f.write(response.read())
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", filename],
        capture_output=True, text=True,
    )
    return float(result.stdout.strip())


def create_silence(duration, filename):
    subprocess.run(
        ["ffmpeg", "-y", "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=mono",
         "-t", str(duration), "-q:a", "9", "-acodec", "libmp3lame", filename],
        capture_output=True,
    )


def combine_sections(section_files, start_times, output):
    inputs = ["-i", "silence_base.mp3"]
    filter_parts = []
    for i, (filename, start_time) in enumerate(zip(section_files, start_times)):
        inputs.extend(["-i", filename])
        delay_ms = int(start_time * 1000)
        filter_parts.append(f"[{i+1}]adelay={delay_ms}|{delay_ms}[d{i}]")
    mix_inputs = "[0]" + "".join(f"[d{i}]" for i in range(len(section_files)))
    filter_str = ";".join(filter_parts) + f";{mix_inputs}amix=inputs={len(section_files)+1}:duration=first"
    cmd = ["ffmpeg", "-y"] + inputs + ["-filter_complex", filter_str, output]
    subprocess.run(cmd, capture_output=True)


def normalize_audio(input_file, output_file):
    subprocess.run(
        ["ffmpeg", "-y", "-i", input_file,
         "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", output_file],
        capture_output=True,
    )


def main():
    check_requirements()
    total_chars = sum(len(text) for _, text in sections)
    print(f"Generating voiceover: {len(sections)} sections, {total_chars} characters")
    print(f"Voice: Eric (smooth, cool)\n")

    section_files = []
    start_times = []
    temp_files = ["silence_base.mp3"]

    for i, (start_time, text) in enumerate(sections):
        filename = f"section_{i:02d}.mp3"
        section_files.append(filename)
        start_times.append(start_time)
        temp_files.append(filename)
        print(f"  [{start_time:5.1f}s] {text}")
        duration = generate_audio(text, filename)
        print(f"          -> {duration:.1f}s audio")
        if i + 1 < len(sections):
            next_start = sections[i + 1][0]
            if start_time + duration > next_start:
                print(f"          WARNING: overlaps next section (ends {start_time + duration:.1f}s, next at {next_start}s)")

    print("\nCreating silence base...")
    create_silence(VIDEO_DURATION, "silence_base.mp3")

    print("Combining sections...")
    combine_sections(section_files, start_times, "voiceover_raw.mp3")
    temp_files.append("voiceover_raw.mp3")

    print("Normalizing audio...")
    normalize_audio("voiceover_raw.mp3", OUTPUT_FILE)

    for f in temp_files:
        try:
            os.remove(f)
        except OSError:
            pass

    print(f"\nSaved: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
