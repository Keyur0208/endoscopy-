/**
 * ffmpeg.ts
 *
 * Thin wrapper around the system `ffmpeg` binary.
 *
 * Responsibilities:
 *  - Concatenate video chunks into a single MP4 (using the concat demuxer).
 *  - Extract a thumbnail JPEG from the first key-frame of a video file.
 *  - Normalise individual MP4 chunks for fragmented-MP4 streams (faststart).
 *
 * Flow diagram:
 *
 *  [Browser chunks (WebM/MP4)]
 *        │
 *        ▼ appendChunk() – each chunk saved to chunks/video_NNN.{ext}
 *  chunks/ dir
 *        │
 *        ▼ stopRecording() calls concatChunks()
 *  FFmpeg concat demuxer → final.mp4
 *        │
 *        ▼ extractThumbnail()
 *  thumbnails/thumb.jpg
 *
 * Requirements:
 *  - `ffmpeg` must be installed and on the system PATH (or set FFMPEG_BIN env var).
 *  - For MP4 chunks: each chunk must be moov-normalised; see normalizeMp4Chunk().
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { env } from '../../config/env';

const FFMPEG_BIN = env.ffmpegBin ?? 'ffmpeg';

// ── Spawn wrapper ─────────────────────────────────────────────────────────────

function spawnFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG_BIN, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stderr = '';
    proc.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}. stderr: ${stderr.slice(-500)}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`ffmpeg spawn error: ${err.message}`));
    });
  });
}

// ── Concat demuxer ────────────────────────────────────────────────────────────

/**
 * Concatenate the given video files into a single MP4.
 *
 * @param chunkPaths - Absolute paths to source chunks, in order.
 * @param outputPath - Destination for the merged MP4.
 */
export async function mergeChunks(
  chunkPaths: string[],
  finalPath: string
): Promise<void> {

  if (!chunkPaths.length) {
    throw new Error('No chunks found');
  }

  // Ensure order
  const sorted = [...chunkPaths].sort();

  // Create temporary merged WEBM
  const sourcePath = finalPath.replace(/\.mp4$/i, '.webm');

  // Clear existing
  await fs.promises.writeFile(
    sourcePath,
    Buffer.alloc(0)
  );

  // Append all chunks
  for (const chunkPath of sorted) {

    const stat =
      await fs.promises.stat(chunkPath);

    if (stat.size <= 0) {
      continue;
    }

    const data =
      await fs.promises.readFile(chunkPath);

    await fs.promises.appendFile(
      sourcePath,
      data
    );
  }

  // Convert WEBM -> MP4
  await spawnFfmpeg([
    '-i',
    sourcePath.replace(/\\/g, '/'),

    '-c:v',
    'libx264',

    '-preset',
    'veryfast',

    '-pix_fmt',
    'yuv420p',

    '-movflags',
    '+faststart',

    '-y',

    finalPath.replace(/\\/g, '/'),
  ]);

  // Optional cleanup
  await fs.promises.unlink(sourcePath)
    .catch(() => undefined);
}

// ── Thumbnail extraction ──────────────────────────────────────────────────────

/**
 * Extract a single JPEG thumbnail from the given video at the first keyframe.
 *
 * @param videoPath     - Source MP4.
 * @param thumbnailPath - Output JPEG path.
 */
export async function extractThumbnail(
  videoPath: string,
  thumbnailPath: string
): Promise<void> {
  await spawnFfmpeg([
    '-i', videoPath,
    '-ss', '00:00:01',
    '-vframes', '1',
    '-q:v', '2',
    '-y',
    thumbnailPath,
  ]);
}

// ── MP4 chunk normaliser ──────────────────────────────────────────────────────

/**
 * Re-mux a fragmented MP4 chunk so the moov atom is at the front.
 * Required when the browser sends fMP4 chunks from MediaRecorder.
 */
export async function normalizeMp4Chunk(chunkPath: string): Promise<void> {
  const parsed = path.parse(chunkPath);
  const tmpPath = path.join(parsed.dir, `${parsed.name}.tmp${parsed.ext}`);

  try {
    await spawnFfmpeg([
      '-i', chunkPath,
      '-c', 'copy',
      '-movflags', '+faststart',
      '-y',
      tmpPath,
    ]);
    await fs.promises.unlink(chunkPath);
    await fs.promises.rename(tmpPath, chunkPath);
  } catch (err) {
    // Clean up temp file if it was created
    await fs.promises.unlink(tmpPath).catch(() => undefined);
    throw err;
  }
}

// ── Health check ──────────────────────────────────────────────────────────────

/**
 * Verify that ffmpeg is reachable.  Resolves with the version string or
 * rejects if the binary cannot be found.
 */
export async function checkFfmpegAvailable(): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG_BIN, ['-version'], { stdio: ['ignore', 'pipe', 'ignore'] });
    let out = '';
    proc.stdout.on('data', (chunk: Buffer) => { out += chunk.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve(out.split('\n')[0] ?? 'ffmpeg available');
      else reject(new Error(`ffmpeg check failed (code ${code})`));
    });
    proc.on('error', (err) =>
      reject(new Error(`ffmpeg not found on PATH (FFMPEG_BIN=${FFMPEG_BIN}): ${err.message}`))
    );
  });
}
