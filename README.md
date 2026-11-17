# tunel.live website

Official React Router 8 framework-mode SSR + Tailwind CSS v4 app for the public tunel.live site. It implements `DESIGN.md` in this folder.

```bash
npm install                  # Node.js 24+
npm run dev      # http://localhost:5173, also on 0.0.0.0
npm test
npm run build
npm run typecheck
npm run start     # production SSR server on port 3000
```

## Framework

Routes are defined in `app/routes.ts`; SSR remains enabled by `react-router.config.ts`. Requires Node.js 24+.

## Routes

- `/` landing page with the tunnel configurator
- `*` not found

## Tailwind

Styling is utilities only, plus one `@theme` block in `app/app.css` that maps the DESIGN.md tokens to semantic names: `canvas`, `surface`, `subtle`, `ink`, `body`, `muted`, `line`, `action`, `go`, `orange`, `term`. Dark mode swaps the CSS variables under `.dark`, so the same utilities work in both themes with no `dark:` duplication.

Breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.

## Responsive check

`scripts/responsive-check` drives Chromium at 320–1440 px and asserts no horizontal overflow, the navigation switch at `md`, map markers staying inside the map, the theme toggle, and the configurator logic.

```bash
npm run dev
npx playwright install chromium   # once
npm run check:responsive
```

## Notes

- No backend and no auth; the site is a single landing page.
- The server list in `app/data/servers` is a maintained snapshot, not a live API response.
- Ping opens a WebSocket handshake to each host and times it. The tunnel hosts answer every HTTP path with a redirect loop, so a `fetch` never settles; the handshake still gives a real TCP + TLS round trip.
- Ping runs once on load and caches the result under `tunel-ping` for 10 minutes, so repeat visits do not re-probe the hosts. The Check ping button bypasses and refreshes the cache.
- Theme is stored under `tunel-theme` and applied in `app/entry.client` before the first render.
- Run as the generated Node SSR server with `npm run start` (port 3000), or use the generated Docker image.
