#!/usr/bin/env python3
"""
Loop the first N seconds of an audio file.

Usage:
    python loop_intro.py bunny.mp3                      # first 8s, repeated 4 times
    python loop_intro.py bunny.mp3 -r 10                # repeated 10 times
    python loop_intro.py bunny.mp3 -d 60                # loop until 60s long
    python loop_intro.py bunny.mp3 -s 5 -o out.mp3      # first 5s instead of 8

Requires ffmpeg on your PATH (https://ffmpeg.org/download.html).
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile


def run(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        sys.exit(f"ffmpeg failed:\n{result.stderr}")


def main():
    p = argparse.ArgumentParser(description="Loop the first N seconds of an audio file.")
    p.add_argument("input", help="input audio file, e.g. bunny.mp3")
    p.add_argument("-o", "--output", help="output file (default: <input>_looped.mp3)")
    p.add_argument("-s", "--seconds", type=float, default=8.0, help="length of the loop (default 8)")
    group = p.add_mutually_exclusive_group()
    group.add_argument("-r", "--repeats", type=int, default=4, help="times to play the clip (default 4)")
    group.add_argument("-d", "--duration", type=float, help="total output length in seconds instead of a repeat count")
    p.add_argument("-b", "--bitrate", default="192k", help="mp3 bitrate (default 192k)")
    args = p.parse_args()

    if shutil.which("ffmpeg") is None:
        sys.exit("ffmpeg not found. Install it and make sure it's on your PATH.")
    if not os.path.isfile(args.input):
        sys.exit(f"File not found: {args.input}")

    output = args.output or os.path.splitext(args.input)[0] + "_looped.mp3"

    with tempfile.TemporaryDirectory() as tmp:
        # 1. Cut the first N seconds to lossless WAV, so we only re-encode to mp3 once.
        clip = os.path.join(tmp, "clip.wav")
        run(["ffmpeg", "-y", "-i", args.input, "-t", str(args.seconds), "-vn", clip])

        # 2. Loop the clip and encode to mp3.
        #    -stream_loop N plays the input N extra times (-1 = forever, cut off by -t).
        if args.duration:
            loop_args = ["-stream_loop", "-1", "-i", clip, "-t", str(args.duration)]
        else:
            loop_args = ["-stream_loop", str(max(args.repeats - 1, 0)), "-i", clip]

        run(["ffmpeg", "-y", *loop_args, "-c:a", "libmp3lame", "-b:a", args.bitrate, output])

    print(f"Saved {output}")


if __name__ == "__main__":
    main()
