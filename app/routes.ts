import { layout, index, route, type RouteConfig } from '@react-router/dev/routes'
export default [layout('routes/layout.tsx', [index('routes/home.tsx'), route('*', 'routes/not-found.tsx')])] satisfies RouteConfig
