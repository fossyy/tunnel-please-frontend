export const SSH_PORT = 2200
export const TCP_MIN = 20000
export const TCP_MAX = 21000

/** Returns the port as a number, or null when it is not a valid integer in range. */
export function parsePort(value: unknown, min = 1, max = 65535): number | null {
  const text = String(value ?? '').trim()
  if (!/^\d+$/.test(text)) return null
  const port = Number(text)
  return port >= min && port <= max ? port : null
}

/** The SSH command for the selected guest mode, or null while inputs are invalid. */
export function buildCommand({ host, mode, webPort = 443, serverPort, localPort }: { host: string; mode: string; webPort?: number | string; serverPort?: number | string; localPort: number | string }): string | null {
  const local = parsePort(localPort)
  if (!host || !local || mode === 'custom') return null

  if (mode === 'http') {
    return `ssh ${host} -p ${SSH_PORT} -R ${webPort}:localhost:${local}`
  }
  if (mode === 'tcp') {
    const remote = parsePort(serverPort, TCP_MIN, TCP_MAX)
    if (!remote) return null
    return `ssh ${host} -p ${SSH_PORT} -R ${remote}:localhost:${local}`
  }
  return null
}
