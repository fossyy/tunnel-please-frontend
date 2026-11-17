import { Link } from 'react-router-dom'
import { ISSUES, LICENSE, SOURCE } from '../data/servers'
import { CONTAINER } from '../lib/ui'

const LINK = 'flex min-h-11 items-center text-sm text-muted transition-colors duration-150 hover:text-action hover:underline'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className={`${CONTAINER} flex flex-wrap gap-x-16 gap-y-8 py-10`}>
        <div className="flex min-w-[8rem] flex-col gap-1.5">
          <span className="mb-1 text-sm font-semibold text-ink">Product</span>
          <Link className={LINK} to="/#configure">
            Configure
          </Link>
          <Link className={LINK} to="/#self-host">
            Self-host
          </Link>
        </div>
        <div className="flex min-w-[8rem] flex-col gap-1.5">
          <span className="mb-1 text-sm font-semibold text-ink">Project</span>
          <a className={LINK} href={SOURCE} target="_blank" rel="noreferrer">
            Source
          </a>
          <a className={LINK} href={ISSUES} target="_blank" rel="noreferrer">
            Issues
          </a>
          <a className={LINK} href={LICENSE} target="_blank" rel="noreferrer">
            License
          </a>
        </div>
        <p className="ml-auto self-end text-[13px] text-muted">
          tunel.live · Tunnel Please
        </p>
      </div>
    </footer>
  )
}
