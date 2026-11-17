import type { Route } from './+types/home'
import Landing from '../pages/Landing'
export const SITE_TITLE = 'tunel.live | Free SSH tunnels for local development'
export const SITE_DESCRIPTION = 'Create an HTTP/HTTPS or TCP tunnel to your local service with one SSH command. Free hosted servers, no registration required, or self-host Tunnel Please.'
export function meta({}: Route.MetaArgs) { return [{ title: SITE_TITLE }, { name: 'description', content: SITE_DESCRIPTION }] }
export default Landing
