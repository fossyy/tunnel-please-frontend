import type { Route } from './+types/not-found'
import NotFound from '../pages/NotFound'
export function meta({}: Route.MetaArgs) { return [{ title: 'Page not found | tunel.live' }, { name: 'description', content: 'That address does not exist on tunel.live.' }] }
export default NotFound
