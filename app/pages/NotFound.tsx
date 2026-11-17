import { Link } from 'react-router'
import { CONTAINER } from '../lib/ui'

export default function NotFound() {
  return (
    <div className={`${CONTAINER} max-w-[680px] py-16`}>
      <h1 className="text-[30px] font-medium tracking-[-0.025em] sm:text-[34px]">Page not found</h1>
      <p className="mt-3 text-muted">That address does not exist on this site.</p>
      <p className="mt-4">
        <Link className="text-action underline underline-offset-4" to="/">
          Return to tunel.live
        </Link>{' '}
        or{' '}
        <Link className="text-action underline underline-offset-4" to="/#configure">
          configure a tunnel
        </Link>
        .
      </p>
    </div>
  )
}
