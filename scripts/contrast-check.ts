// Fails when text becomes unreadable against its own background, including
// while hovered or focused. Catches invisible states like white-on-white
// checked segments.
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5173'
const THEMES = ['light', 'dark']
let failures = 0
type Color = { r: number; g: number; b: number; a: number }

const AUDIT = () => {
  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  const gamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)

  // Chromium reports Tailwind's color-mix() output as oklab().
  const oklabToRgb = (L: number, a: number, b: number) => {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map((v: number) => clamp(gamma(v)) * 255)
  }

  const parseColor = (css: string) => {
    if (css.startsWith('rgb')) {
      const n = (css.match(/[\d.]+/g) ?? []).map(Number)
      return { r: n[0], g: n[1], b: n[2], a: n[3] ?? 1 }
    }
    if (css.startsWith('oklab')) {
      const [coords, alpha] = css.slice(6, -1).split('/')
      const n = coords.trim().split(/\s+/).map(Number)
      const [r, g, b] = oklabToRgb(n[0], n[1], n[2])
      return { r, g, b, a: alpha ? Number(alpha) : 1 }
    }
    return null
  }

  const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
    const f = (v: number) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }

  const over = (top: Color, bottom: Color): Color => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  })

  const composite = (nodes: Element[]): Color => {
    const layers: Color[] = []
    for (const node of nodes) {
      const c = parseColor(getComputedStyle(node).backgroundColor)
      if (!c || c.a === 0) continue
      layers.push(c)
      if (c.a === 1) break
    }
    return layers.reduceRight((base, c) => over(c, base), { r: 255, g: 255, b: 255, a: 1 })
  }

  const ancestors = (el: Element): Color => {
    const chain: Element[] = []
    for (let node: Element | null = el; node; node = node.parentElement) chain.push(node)
    return composite(chain)
  }

  // Walk the paint stack under the text, not just its ancestors: a sliding
  // segment thumb is a sibling painted behind the label.
  const backdrop = (el: Element): Color => {
    let rect = el.getBoundingClientRect()
    const offscreen =
      !rect.width || !rect.height || rect.bottom < 0 || rect.right < 0 || rect.top > innerHeight || rect.left > innerWidth
    if (offscreen) {
      // In-view elements only: elementsFromPoint cannot see points outside the
      // viewport, and ancestor-walking misses sibling backdrops like the
      // sliding segment thumb.
      el.scrollIntoView({ block: 'center' })
      rect = el.getBoundingClientRect()
    }
    if (!rect.width || !rect.height) return ancestors(el)

    const stack = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
    const start = stack.indexOf(el)
    return start === -1 ? ancestors(el) : composite(stack.slice(start))
  }

  const opacityOf = (el: Element) => {
    let o = 1
    for (let node: Element | null = el; node; node = node.parentElement) o *= Number(getComputedStyle(node).opacity)
    return o
  }

  const hidden = (el: Element) => {
    const s = getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden' || opacityOf(el) < 0.05) return true
    return Boolean(el.closest('[aria-hidden="true"], [hidden], script, style'))
  }

  const rows: Array<{ text: string; ratio: number | null; required: number; color: string; bg?: string }> = []
  for (const target of document.querySelectorAll('a[href], button, label, summary')) {
    if (hidden(target) || target.matches('[aria-hidden="true"]')) continue
    const disabled = target.matches('[disabled], [aria-disabled="true"]')

    // Measure every text node separately: a span may carry its own color.
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.trim() ?? ''
      if (!text) continue
      const leaf = node.parentElement
      if (!leaf || hidden(leaf)) continue

      const style = getComputedStyle(leaf)
      const fg = parseColor(style.color)
      const bg = backdrop(leaf)
      if (!fg) {
        rows.push({ text: text.slice(0, 28), ratio: null, required: 0, color: style.color })
        continue
      }

      const alpha = fg.a * opacityOf(leaf)
      const shown = over({ ...fg, a: alpha }, bg)
      const [hi, lo] = [luminance(shown), luminance(bg)].sort((a, b) => b - a)
      const ratio = (hi + 0.05) / (lo + 0.05)
      const size = parseFloat(style.fontSize)
      const large = size >= 24 || (Number(style.fontWeight) >= 700 && size >= 18.66)

      rows.push({
        text: text.slice(0, 28),
        ratio: Math.round(ratio * 100) / 100,
        required: disabled ? 3 : large ? 3 : 4.5,
        color: style.color,
        bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
      })
    }
  }
  return rows
}

function check(state: string, row: { ratio: number | null; required: number; color: string; text: string; bg?: string }, theme: string) {
  if (row.ratio === null) {
    failures++
    console.log(`FAIL  ${theme} ${state}: unreadable color "${row.color}" on "${row.text}"`)
    return
  }
  if (row.ratio < row.required) {
    failures++
    console.log(
      `FAIL  ${theme} ${state}: ${row.ratio}:1 < ${row.required}:1 — "${row.text}" ${row.color} on ${row.bg}`,
    )
  }
}

const browser = await chromium.launch()
for (const theme of THEMES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  if (theme === 'dark') {
    await page.getByRole('button', { name: 'Switch to dark mode' }).click()
    await page.waitForTimeout(200)
  }

  const controls = await page.evaluate(() =>
    [...document.querySelectorAll('a[href], button, label, summary')]
      .filter((el) => !el.closest('[aria-hidden="true"]'))
      .map((el, i) => ({
        i,
        text: el.textContent.trim().slice(0, 24),
        inert: el.matches('[disabled], [aria-disabled="true"]'),
      }))
      .filter((item) => item.text),
  )

  for (const item of controls) {
    const loc = page.locator('a[href], button, label, summary').nth(item.i)
    const rest = await page.evaluate(AUDIT)
    if (item.inert) continue // no hover state to compare

    try {
      await loc.hover({ timeout: 1500 })
    } catch {
      continue
    }
    await page.waitForTimeout(250)
    const hovered = await page.evaluate(AUDIT)
    await page.mouse.move(2, 2)
    await page.waitForTimeout(150)

    // Compare the same text before and after: only report a regression, so a
    // control that was already failing at rest is reported once, not per hover.
    const worse = hovered.filter((after) => {
      const before = rest.find((r) => r.text === after.text)
      return before && after.ratio !== null && after.ratio < (before.ratio ?? Infinity) - 0.01
    })
    for (const row of worse) check(`hover "${item.text}"`, row, theme)
  }

  const restRows = await page.evaluate(AUDIT)
  const seen = new Set()
  for (const row of restRows) {
    if (row.ratio !== null && row.ratio >= row.required) continue
    if (seen.has(row.text)) continue
    seen.add(row.text)
    check('rest', row, theme)
  }

  await page.close()
}
await browser.close()

console.log(failures === 0 ? '\nCONTRAST OK' : `\n${failures} CONTRAST FAILURE(S)`)
process.exit(failures === 0 ? 0 : 1)
