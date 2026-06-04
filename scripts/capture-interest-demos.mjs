/**
 * Captures silent site demos for the interests section (Playwright + ffmpeg).
 * Prefer Reelify MCP when available; use this when Reelify plan handoff fails.
 */
import { chromium } from 'playwright'
import { mkdir, readdir, unlink } from 'fs/promises'
import { execFileSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/interests/videos')
const tmpDir = path.join(__dirname, '../.tmp-interest-capture')

const DEMOS = [
  {
    name: 'hermes',
    url: 'https://hermes-agent.nousresearch.com/',
    durationMs: 10_000,
  },
  {
    name: 'ollama',
    url: 'https://ollama.com/',
    durationMs: 10_000,
  },
  {
    name: 'mcp',
    url: 'https://modelcontextprotocol.io/',
    durationMs: 10_000,
  },
  {
    name: 'playwright',
    url: 'https://playwright.dev/',
    durationMs: 10_000,
  },
]

async function smoothScroll(page, durationMs) {
  await page.evaluate(async (ms) => {
    const delay = (n) => new Promise((r) => setTimeout(r, n))
    const max = Math.max(0, document.body.scrollHeight - window.innerHeight)
    const steps = Math.max(6, Math.floor(ms / 500))
    for (let i = 0; i <= steps; i++) {
      window.scrollTo({ top: (max * i) / steps, behavior: 'instant' })
      await delay(ms / steps)
    }
  }, durationMs)
}

async function captureOne({ name, url, durationMs }) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    recordVideo: { dir: tmpDir, size: { width: 1280, height: 800 } },
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.waitForTimeout(1200)
  await smoothScroll(page, durationMs - 2200)
  await page.waitForTimeout(800)
  const video = page.video()
  await context.close()
  await browser.close()

  if (!video) throw new Error(`No recording for ${name}`)
  const webmPath = await video.path()
  const mp4Path = path.join(outDir, `${name}.mp4`)
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      webmPath,
      '-an',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-vf',
      'scale=1280:800:force_original_aspect_ratio=increase,crop=1280:800',
      mp4Path,
    ],
    { stdio: 'inherit' },
  )
  await unlink(webmPath).catch(() => {})
  console.log(`Wrote ${mp4Path}`)
}

await mkdir(outDir, { recursive: true })
await mkdir(tmpDir, { recursive: true })

for (const demo of DEMOS) {
  console.log(`Capturing ${demo.name}…`)
  await captureOne(demo)
}

const leftover = await readdir(tmpDir)
for (const f of leftover) await unlink(path.join(tmpDir, f)).catch(() => {})

console.log('Done.')
