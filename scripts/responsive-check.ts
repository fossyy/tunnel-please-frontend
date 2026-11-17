import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5173'
const widths = [320, 375, 414, 768, 1024, 1280, 1440]
const results: string[] = []
let failures = 0

function check(label: string, ok: boolean, detail = '') {
  if (!ok) failures++
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ' — ' + detail : ''}`)
}

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(BASE, { waitUntil: 'networkidle' })

for (const width of widths) {
  await page.setViewportSize({ width, height: 900 })
  await page.waitForTimeout(320)
  const m = await page.evaluate(() => {
    const html = document.documentElement
    const desktopNav = document.querySelector('nav[aria-label="Main"]')
    const menu = document.querySelector('details')
    const h1 = document.querySelector('h1')
    const mapEl = document.querySelector('#configure svg')!.parentElement!
    const map = mapEl.getBoundingClientRect()
    const markers = [...mapEl.querySelectorAll(':scope > span')].map((el) => el.getBoundingClientRect())
    return {
      scrollW: html.scrollWidth,
      clientW: html.clientWidth,
      desktopNavDisplay: desktopNav ? getComputedStyle(desktopNav).display : 'missing',
      menuDisplay: menu ? getComputedStyle(menu).display : 'missing',
      h1Size: h1 ? getComputedStyle(h1).fontSize : null,
      markersInside: markers.every(
        (r) => r.left >= map.left - 1 && r.right <= map.right + 1 && r.top >= map.top - 1 && r.bottom <= map.bottom + 1,
      ),
    }
  })
  check(`${width}px: no horizontal overflow`, m.scrollW <= m.clientW + 1, `scrollW=${m.scrollW} clientW=${m.clientW}`)
  check(
    `${width}px: navigation switches at md`,
    width >= 768 ? m.desktopNavDisplay !== 'none' : m.menuDisplay !== 'none',
    `desktop=${m.desktopNavDisplay} mobileMenu=${m.menuDisplay}`,
  )
  check(`${width}px: map markers stay inside the map`, m.markersInside === true)
  console.log(`${width}px  h1=${m.h1Size}`)
}

await page.setViewportSize({ width: 1440, height: 900 })
const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
await page.getByRole('button', { name: 'Switch to dark mode' }).click()
// 300ms: the global theme cross-fade runs 160ms, so sample after it settles.
await page.waitForTimeout(300)
const dark = await page.evaluate(() => ({
  bg: getComputedStyle(document.body).backgroundColor,
  cls: document.documentElement.className,
  stored: localStorage.getItem('tunel-theme'),
  label: document.querySelector('header button[aria-label]')?.getAttribute('aria-label'),
}))
check('theme switches to dark', dark.cls.includes('dark') && dark.bg === 'rgb(14, 26, 30)', `${lightBg} -> ${dark.bg}`)
check('theme choice persists', dark.stored === 'dark', `tunel-theme=${dark.stored}`)
check('toggle labels the next action', dark.label === 'Switch to light mode', dark.label ?? '')
await page.screenshot({ path: '/tmp/opencode/shots/landing-1440-dark.png', fullPage: true })
await page.getByRole('button', { name: 'Switch to light mode' }).click()
await page.waitForTimeout(320)
await page.screenshot({ path: '/tmp/opencode/shots/landing-1440-light.png', fullPage: true })

await page.setViewportSize({ width: 375, height: 812 })
await page.getByText('Menu', { exact: true }).click()
const menuLinks = await page.evaluate(() => {
  const details = document.querySelector('details[open]')
  return details ? [...details.querySelectorAll('a')].map((a) => a.textContent.trim()) : []
})
check('mobile menu lists navigation', menuLinks.includes('Configure') && menuLinks.includes('Self-host'), menuLinks.join(','))
await page.screenshot({ path: '/tmp/opencode/shots/landing-375-menu.png' })

await page.goto(`${BASE}/#configure`, { waitUntil: 'networkidle' })
await page.locator('#configure .terminal').scrollIntoViewIfNeeded()
await page.waitForFunction(() => document.querySelector('#configure pre code')?.textContent.includes('localhost:8000'))
await page.getByText('Frankfurt, Germany').click()
await page.waitForFunction(() => !document.querySelector('#configure pre code .caret'))
const command = await page.locator('pre code').first().textContent()
check('choosing a server updates the command', (command ?? '').includes('eu.tunel.live'), command ?? '')

await page.getByText('TCP', { exact: true }).click()
check('TCP exposes a server port field', (await page.locator('#server-port').count()) === 1)

await page.fill('#local-port', '0')
const copyDisabled = await page.getByRole('button', { name: 'Copy command' }).isDisabled()
check('invalid port disables copy', copyDisabled === true)
check('invalid port keeps the previous command', (await page.locator('pre code').first().textContent() ?? '').includes('localhost'))

await page.fill('#local-port', '8000')
await page.getByRole('button', { name: 'Copy command' }).click()
await page.waitForTimeout(400)
const toast = await page.evaluate(() => {
  const el = document.querySelector('[aria-live="polite"]')
  const rect = el?.getBoundingClientRect()
  return el && {
    title: el.querySelector('p')?.textContent.trim(),
    command: el.querySelectorAll('p')[1]?.textContent,
    focused: document.activeElement?.textContent?.trim(),
    rect: rect && { left: rect.left, right: rect.right, bottom: rect.bottom },
  }
})
check('copy shows the confirmation toast', toast?.title === 'Command copied', toast?.title)
const visibleCommand = (await page.locator('#configure pre code').innerText()).replace(/^\$\s*/, '').trim()
check('toast shows the copied command', toast?.command?.trim() === visibleCommand, toast?.command)
check('toast does not steal focus', toast?.focused === 'Copy command', toast?.focused)
const inside = toast?.rect && toast.rect.left >= 0 && toast.rect.right <= 375 && toast.rect.bottom <= 812
check('toast fits inside the viewport', Boolean(inside), toast?.rect ? `${Math.round(toast.rect.left)}..${Math.round(toast.rect.right)}` : '')
await page.waitForTimeout(4400)
check('toast dismisses itself', (await page.locator('[aria-live="polite"]').count()) === 0)

await page.setViewportSize({ width: 768, height: 1000 })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.screenshot({ path: '/tmp/opencode/shots/landing-768.png', fullPage: true })
await page.setViewportSize({ width: 375, height: 812 })
await page.waitForTimeout(150)
await page.screenshot({ path: '/tmp/opencode/shots/landing-375.png', fullPage: true })
await page.setViewportSize({ width: 320, height: 900 })
await page.screenshot({ path: '/tmp/opencode/shots/landing-320.png', fullPage: true })

await browser.close()
console.log('\n' + results.join('\n'))
console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`)
process.exit(failures === 0 ? 0 : 1)
