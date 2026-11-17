---
version: alpha
name: tunel.live / Field Guide
description: Light-first design system for the hosted tunel.live service, with a working SSH command builder, real regional choices, and a restrained self-hosting path.
colors:
  primary: "#16323C"
  primary-hover: "#214B57"
  on-primary: "#FFFFFF"
  body: "#334E58"
  muted: "#586C72"
  canvas: "#F4F7F6"
  surface: "#FFFFFF"
  surface-subtle: "#E7EFED"
  border: "#C7D3D0"
  action: "#006B7D"
  go-blue: "#00ADD8"
  safety-orange: "#F28C28"
  accent-soft: "#FDF0DF"
  terminal-bg: "#102930"
  terminal-text: "#EAF6FA"
  success: "#1F6B4F"
  success-bg: "#E5F3EB"
  warning: "#7A430C"
  warning-bg: "#FFF0DC"
  error: "#A52A45"
  error-bg: "#F9E8EC"
typography:
  h1:
    fontFamily: IBM Plex Sans
    fontSize: 64px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.03em
  h1-small-screen:
    fontFamily: IBM Plex Sans
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.025em
  h2:
    fontFamily: IBM Plex Sans
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.025em
  h3:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.015em
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  navigation:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0em
  button:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0em
  code:
    fontFamily: IBM Plex Mono
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  caption:
    fontFamily: IBM Plex Sans
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  2xs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section: 96px
  gutter: 24px
components:
  page:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 12px
  navigation-link:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.navigation}"
    rounded: "{rounded.sm}"
    padding: 12px
  text-link:
    textColor: "{colors.action}"
    typography: "{typography.body-md}"
  selection:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-primary}"
  content-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 32px
  quiet-panel:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.body}"
    rounded: "{rounded.md}"
    padding: 24px
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px
  segmented-control:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.body}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 4px
  segment-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 12px
  server-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    rounded: "{rounded.md}"
    padding: 16px
  server-option-selected:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 16px
  terminal:
    backgroundColor: "{colors.terminal-bg}"
    textColor: "{colors.terminal-text}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: 24px
  route-connector:
    backgroundColor: "{colors.action}"
    height: 2px
  route-endpoint:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    size: 8px
  brand-accent:
    backgroundColor: "{colors.go-blue}"
    size: 8px
  mascot-accent:
    backgroundColor: "{colors.safety-orange}"
    size: 8px
  mascot-note:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: 24px
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  status-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
  status-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
  status-error:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px
---

# tunel.live website design system

This file governs the **hosted tunel.live website** and its landing-page command configurator. The hosted service is the primary path. The separately deployable **Tunnel Please** server remains available as a secondary self-hosting path.

The current `https://tunel.live/` site is a functional and content reference, **not** a visual reference. Preserve its useful command-building workflow, free/no-registration access, location choices, protocol choices, and optional sign-in. Replace its dark Geist/emerald template, centered presentation, generic feature cards, unsupported trust claims, and stale navigation/content rather than reskinning them.

This file does not prescribe a signed-in dashboard redesign or invent paid plans.

## Overview

**Design direction: a useful network utility presented like a well-made technical field guide.** The visitor should be able to configure and copy a valid SSH command without first reading a long sales pitch. The visual identity comes from exact controls, readable output, clear routes, and a restrained miner-gopher/Go-blue connection to the underlying project.

The primary audience is developers and technical small teams who need a hosted public endpoint for a local service. A secondary audience wants to deploy the Tunnel Please server on its own infrastructure.

The first screen must answer:

1. What is it? A free hosted SSH reverse-tunnel service at tunel.live.
2. What can I do? Give a local app an HTTP/HTTPS address or forward a supported TCP port.
3. Do I need an account? Not for ordinary HTTP/HTTPS or TCP tunnels. Custom domains and signed-in features require authentication; saved-configuration/history benefits must be verified before being promoted.
4. What happens next? Choose a server and guest-supported forwarding mode, enter the local port, copy the generated command, run it, then use the public address shown in the terminal.

### Experience principles

- **The tool is the hero.** The command builder is authentic product evidence. Do not replace it with decorative network art or a fictional dashboard.
- **Hosted first, self-hosted second.** The main action is **Configure a tunnel**. Self-hosting remains visible but does not compete with trying tunel.live.
- **No registration wall for core tunnels.** Keep HTTP/HTTPS and TCP configuration and command copying available to guests. Custom domain selection has a clear sign-in requirement, not a surprise interstitial after configuration.
- **Real choices, not fake metrics.** Use a verified, maintained source for server names, protocols, and port ranges. The current browser bundle contains a static 3-server snapshot behind an artificial delay; do not present that as a live inventory response. Latency is actually measured in the visitor's browser or honestly marked unavailable.
- **Plain-language trust.** Explain what SSH and HTTPS protect without claiming universal end-to-end encryption, anonymity, private tunnels, or guaranteed reliability.
- **Progressive disclosure.** Show only fields relevant to the selected forwarding mode. Keep advanced deployment and controller details out of the landing page.
- **One recognizable motif.** A simple labeled route line explains the relationship between a visitor, the selected tunel.live server, the SSH connection, and the local app.
- **Restrained character.** The existing miner gopher may appear once beside a useful instruction. It is not a substitute for the configurator.

The desired impression is **direct, competent, approachable, and operational**. A visitor should think “I can run this now,” not “this is another generated SaaS template.”

## Colors

The palette comes from the Tunnel Please terminal and miner-gopher artwork: Go blue, safety orange, deep petroleum ink, and cool mineral neutrals. It deliberately replaces the current site's dark-gray/emerald/Geist appearance and avoids purple gradients, gradient text, glowing cyan, and decorative grids.

Most of the page is canvas, white surface, and ink. Blue and orange are small accents. Orange is not a default button color, and bright Go blue is never body text on a light background.

### Core roles

- **Primary** ({colors.primary} — #16323C): Headings, wordmark, primary-button fill, selected segments, and high-emphasis content.
- **Primary hover** ({colors.primary-hover} — #214B57): Primary-button hover. Lighten without moving or scaling the control.
- **On primary** ({colors.on-primary} — #FFFFFF): Text on primary and selected controls.
- **Body** ({colors.body} — #334E58): Paragraphs, field values, radio descriptions, and longer copy.
- **Muted** ({colors.muted} — #586C72): Captions, inactive navigation, secondary metadata, and form-control borders. At full strength it has sufficient contrast; never fade it into unreadability.
- **Canvas** ({colors.canvas} — #F4F7F6): Default page floor. Cool mineral, not generic cream/beige.
- **Surface** ({colors.surface} — #FFFFFF): Configurator, fields, location options, and the existing white-background mascot asset.
- **Subtle surface** ({colors.surface-subtle} — #E7EFED): Selected location background, segmented-control track, and quiet grouped content.
- **Border** ({colors.border} — #C7D3D0): Non-interactive separators only. It is too faint to be the sole indicator of a field, selected option, focus, or status.

### Brand and interaction roles

- **Action** ({colors.action} — #006B7D): Links, selected-option outlines, meaningful route lines, and keyboard focus.
- **Go blue** ({colors.go-blue} — #00ADD8): Small brand details on light surfaces, where its 2.45:1 canvas contrast means it cannot carry information by itself. It is also the focus-ring color on `terminal-bg`, where its 5.77:1 contrast makes focus visible.
- **Safety orange** ({colors.safety-orange} — #F28C28): A tiny decorative echo of the gopher's helmet and vest. Do not use it as the sole status indicator, a glow, or a stripe on every card.
- **Soft accent** ({colors.accent-soft} — #FDF0DF): Background for the optional single mascot note.

### Terminal and semantic roles

- **Terminal background** ({colors.terminal-bg} — #102930): Generated SSH command blocks only; the whole marketing page does not become a dark terminal theme.
- **Terminal text** ({colors.terminal-text} — #EAF6FA): Command and endpoint content.
- **Success / warning / error** ({colors.success}, {colors.warning}, {colors.error}): Text paired with their corresponding backgrounds. Status always includes words or an icon as well as color.
- **Success / warning / error backgrounds** ({colors.success-bg}, {colors.warning-bg}, {colors.error-bg}): Real validation, connection, or copy feedback only. Never reuse these as generic feature-card backgrounds.

Verified pairs include white on primary (13.50:1), body on canvas (8.22:1), muted on canvas (5.12:1), action on canvas (5.73:1), terminal text on terminal background (13.79:1), and primary on safety orange (5.50:1). Re-check every new pairing.

## Typography

Use **IBM Plex Sans** for reading, controls, and UI and **IBM Plex Mono** only for generated commands, hostnames, addresses, ports, and values people copy. Do not reuse the current Geist/Geist Mono pairing or substitute Inter, Space Grotesk, or an italic serif accent.

Self-host the required WOFF2 subsets where licensing permits, preload only the primary regular face, and use `font-display: swap`. Suitable fallbacks are `"IBM Plex Sans", "Segoe UI", sans-serif` and `"IBM Plex Mono", "SFMono-Regular", Consolas, monospace`.

### Hierarchy rules

- Use {typography.h1} once on the page and {typography.h1-small-screen} below 640px.
- Use {typography.h2} for major sections and {typography.h3} for form groups and subsections. Small-screen h2 may render at 32px.
- Use {typography.body-lg} for hero support and {typography.body-md} for controls and normal content.
- Keep explanatory text around 60–75 characters per line. Left-align; never justify.
- Use only 400, 500, and 600 weights. Prefer hierarchy through size, placement, and spacing over extra-bold text.
- Use sentence case. No all-caps eyebrows, tiny section numbers, random badges, or crushed tracking.
- Use `text-wrap: balance` for short headings and `text-wrap: pretty` for paragraphs as progressive enhancements.
- Monospace is for technical values, not a general developer aesthetic. Navigation, field labels, buttons, and helper text stay in Plex Sans.
- Tabular technical values such as ports and latency use appropriate numeric font features. Do not use tiny text to fit them.
- Layouts must survive 200% text zoom and user line-height overrides without overlap or clipping.

## Layout

Use a fluid grid inside a **1200px maximum container**. The configurator may use approximately 1080px; explanatory reading stays around 680px.

- **Desktop:** 12 columns, 24px gutters, 32–48px page gutters.
- **Tablet:** 8 columns, 20px gutters, 32px page gutters.
- **Mobile:** one content column, 16px internal gaps, 20px page gutters.
- **Sections:** {spacing.section} (96px) on large screens and {spacing.3xl} (64px) on small screens.
- **Scale:** only {spacing.2xs} through {spacing.section}, plus content-driven gutters. Related controls stay closer than separate groups.

Design and inspect at 375px, 768px, 1024px, and 1440px. Reflow around 768px and 1024px as the content requires. Support 320px without horizontal page scrolling.

### Composition

- **Hero:** a compact asymmetric text composition with proposition/actions on the left and a short orientation note on the right. The actual configurator begins in the opening desktop viewport. Do not repeat the same command in a decorative hero card and again in the form.
- **Configurator:** the first major visual and the core of the opening composition—a white working surface with controls on the left and generated command on the right on wide screens. On mobile, controls come first and command output follows; no sticky output covers fields or focused content.
- **Location options:** 3 selectable options on wide screens, one column on mobile. They are functional radio controls, not decorative feature cards.
- **Form groups:** use labels, spacing, and restrained dividers before adding panels. No nested cards inside cards.
- **How it works:** a readable route explanation and security notes share the same section so the visitor sees operational consequences in context.
- **Self-hosting:** a short secondary band aligned to the same grid, not a competing enterprise CTA.
- **Alignment:** labels, fields, route text, and command output share visible edges. No arbitrary floating overlap.

The header is static by default. If sticky behavior is later justified, use a solid surface, add `scroll-margin` to anchored sections, and keep all focused content visible below it. No glass-blur header.

## Elevation & Depth

The system is predominantly flat. Hierarchy comes from typography, spacing, contrast, and selected states.

- Standard content and configurator surfaces use 1px {colors.border} and **no shadow**.
- Interactive field borders use {colors.muted}; selected/focused borders use {colors.action}. Do not rely on the faint decorative border token for control identification.
- Use either an outline or a shadow, not both as a styling recipe.
- The only shadow allowed is for a real overlay such as a small menu: `0 8px 30px rgb(22 50 60 / 12%)`.
- No glow, neon edges, ambient spotlights, hard offset shadows, floating orbs, or soft shadows around every option.
- Dark command output represents a terminal. It is not decorative elevation.

## Shapes

The shape language is **workmanlike and slightly softened**.

- Inputs, buttons, segmented controls: {rounded.sm} (4px).
- Configurator, location options, and terminal output: {rounded.md} (8px).
- Optional mascot note: {rounded.lg} (12px).
- Dividers and route lines: {rounded.none} with square ends.
- Do not give every element the same radius; controls, panels, and terminal output need distinct roles.
- Avoid pill-shaped containers around every label, 24–32px card radii, decorative side tabs, and circular icon tiles.

The route motif uses a 2px {colors.action} connector and {colors.primary} endpoints. Go-blue/orange details are decorative and redundant. No decorative grid, circuitry, or animated packet field.

## Components

### Wordmark and navigation

Use **tunel.live** as the public hosted-service wordmark in IBM Plex Sans 600. Keep `tunel` and `.live` the same solid color; no gradient or green/emerald carryover is required. The underlying project name **Tunnel Please** belongs in self-hosting and source content.

Desktop navigation:

- **Product** → `/#product`
- **Configure** → `/#configure`
- **How it works** → `/#how-it-works`
- **Self-host** → `/#self-host`
- **Source** → `https://git.fossy.my.id/bagas/tunnel-please`
- **Sign in** → `/login`, as a quiet text/secondary action rather than the loudest button

Do not add Pricing, Customers, Dashboard, Terms, Privacy, or Support links until their real destinations and content exist. Current 404 destinations must not be reproduced as finished navigation.

Mobile uses a Menu button with `aria-expanded` and `aria-controls`, an inline expanding region, Escape support, logical focus order, and 44×44px minimum targets.

### Hero actions

- Primary: **Configure a tunnel** → `/#configure`.
- Secondary text link: **Self-host the server** → `/#self-host`.
- Do not add a second filled CTA beside the primary action.
- Buttons, fields, and segmented controls use a **minimum** height of 48px, never a fixed height; text zoom and helper/error content must allow them to grow.
- Hover changes color without moving the control. Focus uses a visible 2px {colors.action} ring with a 3px offset on light surfaces and a 2px {colors.go-blue} ring on `terminal-bg`.
- Text links stay underlined. Sign in is not required before accessing HTTP/HTTPS or TCP configuration.

### Tunnel configurator

The configurator is the core workflow and must remain usable to guests.

#### 1. Server location

Present real location options as a labeled radio group. At the time of research, the deployed configurator exposed:

- Chicago, United States — `us.tunel.live`
- Frankfurt, Germany — `eu.tunel.live`
- Singapore, Singapore — `sgp.tunel.live`

The current public bundle returns these 3 entries from a hardcoded array after an artificial 2-second delay; no inventory API was identified during research. Remove the fake delay. Prefer one maintained service configuration shared by frontend and backend. If that source is not available for this redesign, use a clearly maintained static snapshot like the verified list above and do not call it a live response or display fictitious fetch/loading states. Do not repeat the stale Indonesia claim unless that location is actually supported and selectable.

Each option shows city, country, hostname, supported protocols, and real latency state. Selection uses a 2px {colors.action} outline, subtle surface, and the word **Selected** or a labeled check icon. Do not use a green dot alone.

Latency rules:

- Measure from the visitor's browser to the selected endpoint using the deployed mechanism.
- Show **Checking latency…** while measuring and **Latency unavailable** on failure.
- Never fabricate millisecond values, “Excellent/Poor” scores, or a recommended location from static mock data.
- If locality guidance is useful, explain that lower measured delay is one factor; do not promise tunnel throughput from a single ping.

#### 2. Forwarding mode

Use a segmented or radio control for **HTTP/HTTPS**, **TCP**, and **Custom domain**.

- HTTP/HTTPS and TCP remain usable by guests. HTTP/HTTPS exposes server port **443 (HTTPS)** or **80 (HTTP)**.
- TCP exposes a supported remote server port and requires the configured local destination port. The observed static range was `20000–21000`; maintain/verify this configuration rather than presenting it as an API-discovered fact.
- The current guest behavior for Custom domain is an authentication gate, not another domain form. When a guest selects it, show **Custom Domain Requires Sign In**, explain that domain ownership verification/DNS management requires an account, keep their existing HTTP/TCP selections intact, and provide **Sign in to use custom domains** → `/login`. Signed-in selection continues to `/custom-domain`, the existing deployed route.
- Do not show an unauthenticated Domain field, silently substitute custom subdomains, invent automatic DNS setup, or force sign in for ordinary HTTP/HTTPS and TCP tunnels.
- Use descriptive helper text. HTTP is not encrypted, and raw TCP receives no automatic TLS wrapper.

#### 3. Local service details

- Use persistent visible labels such as **Local port** and, for guest TCP configuration, **Server port**. Custom-domain inputs belong on the authenticated `/custom-domain` route, outside this guest flow.
- `8000` may be shown as an example/default consistent with the deployed configurator, but the user must be able to change it.
- Validate numeric ports as integers in the appropriate allowed range. Put specific errors beside the field and retain valid inputs.
- On invalid input, retain but visibly label the **Previous valid command**, explain that it does not include the invalid edits, and disable copying until corrected. Never silently copy a stale or newly invalid command.
- Placeholder text never replaces a label.
- Use actual input types, keyboard operation, and accessible descriptions, not clickable generic divs.
- Reveal only fields relevant to the chosen guest mode; do not hide essential explanation in an info-icon tooltip.

#### 4. Generated command

Display the resulting SSH command immediately as real selectable text in {components.terminal}. The default illustrative state may use:

```bash
ssh sgp.tunel.live -p 2200 -R 443:localhost:8000
```

Label it **Singapore · HTTPS · local port 8000** so the example is not mistaken for every user's final configuration. Update host, server port, and local port from the actual selections. For signed-in HTTP/HTTPS/TCP users, retain the deployed generator's authenticated destination form: `ssh <SSH_IDENTIFIER>@<HOST> -p 2200 -R <SERVER_PORT>:localhost:<LOCAL_PORT>`, using the real session's `sshIdentifier`. Never hardcode a guest destination for an authenticated session or invent an identifier.

Include:

- **Copy command** with a visible text label.
- A polite **Copied** confirmation after success and a useful failure fallback that keeps the text selectable.
- Use the assigned public address, not the bare SSH host, and derive scheme/authority from the actual selections: HTTPS/443 → `Internet → https://<assigned-subdomain>.<HOST> → localhost:8000`; HTTP/80 → `Internet → http://<assigned-subdomain>.<HOST> → localhost:8000`; TCP → `Internet → <HOST>:<TCP_PORT> → localhost:8000`. For the default Singapore/HTTPS example, `<HOST>` is `sgp.tunel.live`.
- The reminder **Run this in your terminal and keep the SSH session open while using the tunnel.**
- A post-command step: **Use the public URL or endpoint shown in your terminal after connecting.** For HTTP tunnels, that is the assigned subdomain, not merely `sgp.tunel.live:443`.

Do not show **Start tunnel** unless the website itself can actually perform that operation. Copying a command is the action; never fake deployment progress, an assigned URL before the server issues one, or a connected state.

On mobile, use a contained, keyboard-reachable horizontal code scroller if needed. Keep the copy button outside it.

#### Loading, empty, and failure states

- Do not reproduce the bundle's artificial 2-second loading state. If the implementation later fetches a real inventory/configuration endpoint, then show stable lightweight field skeletons and **Loading available servers…**, not a full-screen spinner.
- A real inventory request failure should say locations could not be loaded, provide **Try again**, and retain valid selections. A maintained static snapshot needs no fabricated network-error state.
- If JavaScript is unavailable, keep the static server details, an illustrative guest command, and self-host source link readable. Do not leave a blank configuration card.
- Do not report a live tunnel or connected server merely because the form loaded successfully. Actual browser latency checks still have their own honest checking/failure states.

### Optional sign-in explanation

Place one quiet sentence near the configurator or header:

> HTTP/HTTPS and TCP tunnels need no registration. Sign in to use custom domains or access account features.

The current hosted site claims saved configurations and history; verify that functionality and its authenticated command behavior before adding those specific benefits back to public copy. Never expand into usage statistics, sync, premium, or priority support without evidence. Do not show a fake dashboard preview or paid-plan upsell.

### Route explanation

Use 3 labeled locations: visitor/webhook provider, selected tunel.live server/public endpoint, and developer's machine/local app. Explain **setup separately from traffic**:

1. **Setup:** the developer's SSH client establishes an outbound connection to the selected tunel.live server and requests remote forwarding. It must stay open.
2. **Incoming request:** the visitor connects to the assigned public HTTP subdomain or selected TCP endpoint.
3. **Forwarding:** the server forwards the request through the existing SSH connection to the local app; responses return in the opposite direction.

Do not draw SSH as a separate network hop, and do not imply requests originate at the local app. Provide the complete explanation as adjacent text. Meaningful connectors and endpoints meet 3:1 non-text contrast.

### Security notes

Use a quiet but visible note in the How-it-works section, not a tooltip or footer disclaimer:

- A tunnel can make an app reachable to others. Protect sensitive applications with their own authorization.
- SSH encrypts the connection between the local machine and the tunnel server. This is not a blanket promise of end-to-end encryption between every visitor and local app.
- Choose HTTPS for encrypted visitor connections where supported. HTTP and raw TCP need separate protection.
- Closing the SSH session removes the connection-scoped tunnel.
- The hosted service intentionally allows tunnel creation without registration; do not imply that a public address is private or authenticated.

The self-host section additionally warns:

> Standalone interactive SSH forwarding currently accepts connections without SSH account authentication. Restrict a self-hosted server's SSH port to trusted networks and clients with deployment-level controls; do not expose it to untrusted networks. Review node/controller deployments separately before making them reachable.

### Mascot note

The existing `docs/images/gopher.png` may appear once beside **Keep the terminal open while your tunnel is connected.** Use a modest size, preserve its aspect ratio, and place the current white-background asset on {colors.surface}. Do not recolor, AI-redraw, shrink it into a logo, or put it on serious security/error messaging. Omit it when it adds no useful information.

### Footer

Use concise groups:

- **Product:** Configure (`/#configure`), How it works (`/#how-it-works`), Self-host (`/#self-host`), Sign in (`/login`).
- **Project:** Source (`https://git.fossy.my.id/bagas/tunnel-please`), Issues (`https://git.fossy.my.id/bagas/tunnel-please/issues`), License (`https://git.fossy.my.id/bagas/tunnel-please/src/branch/main/LICENSE.md`).
- **Service:** include this group only when the external status page is operational; then link **Status** to `https://status.fossy.my.id/status/services`. Otherwise omit the entire group rather than render an empty heading or dead link.

Do not add dead Terms/Privacy/Support links, a newsletter form, social-icon cloud, customer logos, or repetitive final-signup banner.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Put the working command builder and real hosted workflow at the center. | Replace the tool with generic 3D network art or a fictional dashboard. |
| Say the current service is free and requires no registration for basic use. | Invent pricing, paid tiers, trials, premium benefits, or a signup wall. |
| Show actual location inventory and honest measured/unavailable latency. | Use random ping values, fake speed scores, or unsupported global-performance claims. |
| Explain SSH, HTTPS, public reachability, and session lifetime precisely. | Say “secure by default,” “end-to-end encrypted,” “private,” or “zero logs” as blanket promises. |
| Use cool neutral surfaces, IBM Plex, small radii, and restrained brand accents. | Preserve the current dark Geist/emerald theme or add purple gradients, glow, neon, glass, or decorative grids. |
| Use labels, proximity, and dividers to organize the configurator. | Add icon-tile feature cards, nested cards, side stripes, or a shadow to every control. |
| Use the gopher once beside a useful terminal instruction, if at all. | Generate a replacement mascot or scatter gopher art across every section. |
| Use direct, concrete copy and functional status messages. | Use “fast and reliable,” “next-gen,” “seamless,” “supercharge,” or meaningless “LIVE” pills. |
| Keep all user-entered values after validation and service errors. | Clear the form, hide the command, or pretend a failure is a successful connection. |
| Link only to real, working destinations. | Reproduce the current dead Terms, Privacy, Support, or fallback Dashboard links as finished features. |
| Let content stay visible without animation or JavaScript where practical. | Use scroll reveals, marquees, decorative terminal typing, pulsing dots, or bouncing controls. |
| Publish only attributable product evidence. | Add fake customers, avatars, GitHub counts, SLA numbers, usage stats, or testimonials. |

## Website scope and information architecture

The initial hosted website needs:

- **Landing/configurator (`/`):** understand the hosted offer, configure a command, learn how routing works, and find the self-host option.
- **Sign in (`/login`):** retain the existing optional account entry. Its visual redesign is a separate task.
- **Tunnel unavailable (`/tunnel-not-found`):** support the server's `?slug=<slug>` redirect contract.
- **Not found:** an ordinary 404 with links to Home and the configurator.
- **Self-host/source:** link to the real Tunnel Please repository rather than inventing a hosted documentation portal in this design pass.

Do not create a browser tunnel dashboard, pricing flow, traffic inspector, request replay UI, analytics screen, or admin console as part of this landing-page redesign.

### Landing-page sequence

1. **Header:** tunel.live wordmark, mapped navigation, Source, Sign in.
2. **Compact hero (`#product`):** hosted-service proposition and orientation only, with the configurator beginning in the opening desktop viewport. Primary action moves focus to it; self-host is the quiet alternative. Do not repeat a decorative command card.
3. **Configurator (`#configure`):** verified location configuration, guest HTTP/HTTPS/TCP modes, custom-domain sign-in gate, local-service fields, live command output, copy interaction, post-command URL guidance, and honest latency states.
4. **How it works (`#how-it-works`):** accurate route diagram, session lifetime, and security notes. No separate generic feature-card grid.
5. **Self-host (`#self-host`):** concise Tunnel Please deployment path, domain requirement, Compose availability, source link, and standalone access warning.
6. **Footer:** concise working links only. No repetitive CTA banner.

Do not add a separate “Global Network,” “Flexible Configuration,” or “100% Free Service” card section just to repeat what the hero and configurator already demonstrate.

## Starting copy

**Page title:** `tunel.live | Free SSH tunnels for local development`

**Meta description:** `Create an HTTP/HTTPS or TCP tunnel to your local service with one SSH command. Free hosted servers, no registration required, or self-host Tunnel Please.`

**Hero heading:**

> One SSH command. Your app, online.

**Supporting text:**

> tunel.live gives your local app a public HTTP/HTTPS address or TCP endpoint through a free hosted Tunnel Please server. No registration required.

**Primary action:** `Configure a tunnel` → `/#configure`

**Secondary action:** `Self-host the server` → `/#self-host`

**Configurator heading:** `Build your tunnel command`

**Configurator introduction:**

> Choose a server and forwarding mode, enter your local service details, then run the generated command in your terminal.

**Guest-access note:**

> HTTP/HTTPS and TCP tunnels need no registration. Sign in to use custom domains or access account features.

**Security note:**

> A tunnel can make your app reachable to other people. Protect sensitive applications with their own authorization. SSH secures the connection to the tunnel server; use HTTPS where supported for encrypted visitor connections. HTTP and raw TCP need separate protection.

Copy may be tightened, but claims must not become broader. Avoid the current vague “fast,” “reliable,” and blanket “end-to-end encryption” language unless specific evidence supports a narrower statement.

## Tunnel-not-found experience

The application redirects inactive or unknown subdomains to `/tunnel-not-found?slug=<slug>`.

- Heading: **This tunnel isn't connected.**
- Explanation: “No active tunnel was found for this address. The SSH session may have closed, the HTTP subdomain may have changed, or the link may be incorrect. If someone shared this link with you, ask them to check it or start their tunnel again.”
- Primary action: **Configure a new tunnel** → `/#configure`.
- Secondary action: **Return to tunel.live** → `/`.
- Explain that creating a new tunnel does not restore the content the visitor expected.
- Parse the query with a standard URL query parser. Display the slug as text only, never HTML or an attribute, and only when it is 3–20 lowercase `a-z`/digit/hyphen characters without leading/trailing hyphens. Otherwise omit it.
- Do not claim that the tunnel expired or the server is down. Do not retry forever, show fake loading, or use a joking mascot.

## Interaction and motion

Motion confirms state changes rather than advertising animation.

- Hover/color transitions: 120–180ms `ease-out`.
- Menu and small disclosure transitions: 160–240ms `ease-out`, with faster exits.
- Limit motion to menu state, copy confirmation, selection changes, and genuine validation/loading changes.
- No entrance animation is required. Content is visible immediately and never hidden behind reveal JavaScript.
- Respect `prefers-reduced-motion: reduce` for all non-essential motion.
- No smooth-scroll hijacking, autoplay media, marquees, animated route packets, blinking terminal cursor, parallax, or pulsing status dots.
- Toasts never steal focus. Field errors and copy status remain available as text.

## Accessibility and quality gates

Target **WCAG 2.2 AA** and test the rendered configurator, not just static swatches.

- Semantic landmarks, one h1, sequential heading levels, skip link, and a meaningful page title.
- Use native labels, radio groups, fields, and buttons. Keyboard-test every mode, location, port field, copy action, menu, and code scroller.
- Normal text contrast ≥4.5:1; large text and meaningful non-text indicators ≥3:1. Selection/status never depends on color alone.
- Minimum 44×44 CSS px interactive targets where possible, with spacing that prevents accidental changes.
- Field errors are associated with their controls; invalid submission focuses an error summary or the first invalid field without destroying other values.
- Dynamic copy/loading messages use suitable live regions and do not announce rapid ping fluctuations continuously.
- Meaningful images have alt text; decorative images use empty alt. The route diagram has a complete text equivalent.
- Support 200% text zoom, 400% browser zoom/reflow where applicable, reduced motion, forced-colors mode, and user spacing overrides.
- Declare media dimensions, subset fonts, and keep the example command/source/self-host content useful without JavaScript.
- Aim for LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1 at the 75th percentile. Do not let repeated latency checks cause layout shifts or excessive requests.
- Test guest flow, keyboard-only operation, loading failure, invalid ports, all forwarding modes, 375px, 1440px, reduced motion, and a screen reader.

The page is not complete until a guest can choose a location and mode, correct an invalid port, copy the right command, and understand session lifetime and exposure risk without assistance.

## Content and implementation guardrails

### Supported by the current hosted site

- tunel.live is a hosted SSH tunnel service; current copy says the basic service is free. Ordinary HTTP/HTTPS and TCP tunnels require no registration.
- HTTP/HTTPS and TCP configuration and custom port configuration.
- Custom domain is an authenticated feature: the current guest UI explains the sign-in requirement and `/custom-domain` is the existing signed-in route.
- Optional sign-in currently claims saved configurations and history; verify the live account implementation before promoting those benefits.
- Current selectable locations include Chicago, Frankfurt, and Singapore; the deployed inventory remains the source of truth.
- The Tunnel Please server can also be self-hosted from the supplied source and Compose configurations.

### Claims that require live qualification

- **Locations, protocols, and ranges:** use a maintained shared configuration or an explicitly maintained static snapshot. The researched frontend had no real inventory API and inserted a fake 2-second delay; remove that behavior. Do not repeat Indonesia or preserve `20000–21000` after service configuration changes.
- **Custom domain:** guest selection explains and links to sign in; signed-in users continue to `/custom-domain`. Never present it as a guest mode or as unrelated custom-subdomain behavior.
- **Authenticated commands:** preserve the deployed `sshIdentifier@host` construction using real session data. Verify saved configurations/history before promoting them, and never add statistics, sync, premium features, or support levels without verification.
- **HTTPS:** applies to supported HTTPS endpoint configuration. It does not automatically encrypt HTTP or raw TCP.
- **Public address:** public reachability depends on the selected hosted endpoint and network. The address is not private merely because SSH is used.
- **Live tunnel:** the tunnel exists while its connection/session remains active; loading or copying the command does not prove it connected.
- **Self-hosting:** standalone interactive forwarding currently accepts connections without SSH account authentication. Disclose this with deployment instructions and re-verify when implementation changes.

### Do not claim without new evidence

- Guaranteed speed, low latency, reliability, uptime, SLA, or a globally optimized network.
- Universal end-to-end encryption, private/authenticated public URLs, IP anonymity, zero logging, or zero knowledge.
- Paid plans, trials, premium support, team roles, managed account dashboards, traffic inspection/replay, analytics, or persistent tunnel reservations.
- Customer adoption, usage totals, benchmark results, or testimonial proof.
- Permissive “open source” positioning. The repository uses CC BY-NC-ND 4.0; use precise “source available” wording when discussing its license.

## Current-site corrections behind the redesign

These are observed content/UX issues to fix, not visual details to preserve:

- Replace Geist, dark-gray/emerald surfaces, centered brand hero, circular icon tiles, and repetitive generic feature cards.
- Keep the useful configurator but make its real workflow, loading/error states, and generated output the central experience.
- Resolve the mismatch between stale copy mentioning **Indonesia** and the rendered **Frankfurt** option. Update metadata that currently describes only Singapore.
- Remove the artificial 2-second inventory delay. Use maintained configuration without pretending a hardcoded array is a live API response.
- Scope “no registration” to HTTP/HTTPS and TCP. Preserve Custom domain's actual sign-in gate and signed-in `/custom-domain` route.
- Replace blanket “fast and reliable” and “End-to-end encryption” statements with bounded operational explanations.
- Reconcile “100% Free Service” with sign-in copy promising “premium features and priority support”; omit premium/priority-support language until a real offer exists.
- The audited `/terms`, `/privacy`, and `/support` URLs returned 404. Do not carry them into redesigned navigation or login consent until implemented.
- The audited `/dashboard` URL fell back to the landing page. Do not advertise a finished dashboard until it exists.
- The external status page returned an error during audit. Verify it before presenting status as a reliable service resource.

## Research basis

Reviewed for the hosted-service redesign on 2026-11-14. Sources inform behavior and design decisions; their identities and copy are not to be copied.

### Primary product reference

- [tunel.live](https://tunel.live/): current hosted-service offer, free/no-registration proposition, working command configurator, current location/protocol modes, and optional sign-in entry.
- [tunel.live sign in](https://tunel.live/login): current saved-configuration/history proposition and optional guest path. Its premium/support wording and dead consent/support links require correction rather than promotion.
- [Tunnel Please source](https://git.fossy.my.id/bagas/tunnel-please): self-hosting implementation and project license.

### Format and human-centered design guidance

- [Google Stitch DESIGN.md overview](https://stitch.google.com/docs/design-md/overview) and [official specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md): machine-readable tokens, design rationale, canonical sections, and linting.
- [Figma UI design principles](https://www.figma.com/resource-library/ui-design-principles/): hierarchy, progressive disclosure, consistency, contrast, accessibility, proximity, and alignment.
- [Figma visual hierarchy](https://www.figma.com/resource-library/what-is-visual-hierarchy/): arrange content by user importance and use negative space deliberately.
- [Figma typography fundamentals](https://www.figma.com/resource-library/typography-in-design/): readable body defaults, clear hierarchy, 45–75 character measures, and text resizing.
- [Figma accessibility and inclusion](https://www.figma.com/resource-library/creating-accessible-and-inclusive-design/): people-first content, keyboard access, contrast, alternative text, and testing beyond the designer's own abilities.
- [Figma responsive website design](https://www.figma.com/resource-library/responsive-website-design/): fluid layouts, responsive forms/media/type/navigation, and viewport testing.
- [Figma design tokens](https://www.figma.com/resource-library/design-tokens/): role-based semantic names shared by design and code.

### Competitive product patterns

- [ngrok](https://ngrok.com): immediate product definition and task-based routes into documentation; do not inherit its enterprise breadth.
- [LocalCan](https://www.localcan.com/): visible command and concise workflow structure; do not import its stable-URL proposition when tunel.live sessions are connection-scoped.
- [Tailscale](https://tailscale.com/): clear technical resource paths; avoid its sprawling multi-menu structure for this focused service.

### Anti-slop review

- [Impeccable's Slop catalog](https://impeccable.style/slop): avoid cardocalypse, default-font sameness, meaningless badges, decorative grids, glass/glow, low contrast, generic copy, and meaningless motion.
- [Paralect's signs of AI slop](https://www.paralect.com/blog/signs-of-ai-slop-in-design): avoid generic claims, placeholders, fake proof, repeated icon cards, overstyled radii, fake demos, and scroll reveal on every block.
- [DesignCode: Avoid AI Slop in Vibe-Coded Landing Pages](https://www.youtube.com/watch?v=M4DNgmI7MIM): audit selected states, weak content, random status pills, generic illustrations, glow effects, and product-disconnected visuals.

The anti-slop rule is not “make it strange.” It is **build around the real hosted workflow, use authentic service data, and remove anything that does not help the visitor configure or understand a tunnel**.
