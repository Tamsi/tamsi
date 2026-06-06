/**
 * Downloads showcase videos for the Workflow section.
 * Criteria: motion graphics or product UI only — no talking-head humans.
 * Sources: YouTube via yt-dlp, transcoded to muted 1280×800 MP4 (max 60s).
 */
import { execFileSync } from 'child_process'
import { mkdir, readdir, unlink } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/interests/videos')
const tmpDir = path.join(__dirname, '../.tmp-video-download')

/** @type {{ name: string; url: string; label: string; maxSec: number }[]} */
const VIDEOS = [
  {
    name: 'cursor',
    url: 'https://www.youtube.com/watch?v=JSuS-zXMVwE',
    label: 'Fireship — Cursor 3.0 first look (UI / motion, no presenter)',
    maxSec: 60,
  },
  {
    name: 'ollama',
    url: 'https://www.youtube.com/watch?v=LPZh9BOjkQs',
    label: '3Blue1Brown — Large Language Models explained (animation)',
    maxSec: 60,
  },
  {
    name: 'mcp',
    url: 'https://www.youtube.com/shorts/r2P6-gqs1xg',
    label: 'MCP Explained in 60 Seconds (reference style — keep as-is)',
    maxSec: 60,
    skipIfExists: true,
  },
  {
    name: 'playwright',
    url: 'https://www.youtube.com/watch?v=u6QfIXgjwGQ',
    label: 'Fireship — Software Testing Explained in 100 Seconds',
    maxSec: 60,
  },
  {
    name: 'hermes',
    url: 'https://www.youtube.com/watch?v=jhpFHBqXKn0',
    label: 'Hermes Agent slides — Nous Research overview (no presenter)',
    maxSec: 60,
  },
]

function run(cmd, args) {
  execFileSync(cmd, args, { stdio: 'inherit' })
}

async function downloadOne({ name, url, label, maxSec, skipIfExists = false }) {
  const output = path.join(outDir, `${name}.mp4`)
  if (skipIfExists) {
    try {
      const duration = execFileSync(
        'ffprobe',
        ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', output],
        { encoding: 'utf8' },
      ).trim()
      if (Number(duration) > 0) {
        console.log(`\n↷ ${name}: kept existing (${Number(duration).toFixed(1)}s) — ${label}`)
        return
      }
    } catch {
      // fall through and download
    }
  }

  console.log(`\n▶ ${name}: ${label}`)
  const template = path.join(tmpDir, `${name}.%(ext)s`)

  run('yt-dlp', [
    '-f',
    'bv*[height<=1080]+ba/b',
    '--merge-output-format',
    'mp4',
    '--no-playlist',
    '-o',
    template,
    url,
  ])

  const files = (await readdir(tmpDir)).filter((f) => f.startsWith(`${name}.`))
  if (!files.length) throw new Error(`No download for ${name}`)
  const input = path.join(tmpDir, files[0])

  run('ffmpeg', [
    '-y',
    '-i',
    input,
    '-t',
    String(maxSec),
    '-an',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-vf',
    'scale=1280:800:force_original_aspect_ratio=increase,crop=1280:800',
    output,
  ])

  const duration = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', output],
    { encoding: 'utf8' },
  ).trim()

  console.log(`✓ ${output} (${Number(duration).toFixed(1)}s)`)
  await unlink(input).catch(() => {})
}

await mkdir(outDir, { recursive: true })
await mkdir(tmpDir, { recursive: true })

for (const video of VIDEOS) {
  await downloadOne(video)
}

const leftover = await readdir(tmpDir)
for (const f of leftover) await unlink(path.join(tmpDir, f)).catch(() => {})

console.log('\nDone.')
