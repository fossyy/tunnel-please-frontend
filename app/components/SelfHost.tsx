import { LICENSE, SOURCE } from '../data/servers'
import { CONTAINER, SECTION, TEXT_LINK } from '../lib/ui'

const FACTS = [
  ['Docker Compose', 'HTTP/HTTPS-only and controlled TCP deployments ship with the repository.'],
  ['Domain', 'Required for subdomain routing.'],
]

export default function SelfHost() {
  return (
    <section id="self-host">
      <div className={`${CONTAINER} ${SECTION} reveal`}>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:items-start">
          <div>
            <h2 className="text-[28px] font-medium leading-[1.15] tracking-[-0.025em] sm:text-[32px] lg:text-[40px]">
              Prefer to run your own server?
            </h2>
            <p className="mt-4 max-w-[38em] leading-relaxed">
              The same Tunnel Please server behind tunel.live can run on your own machine. You bring a domain for
              the public subdomains, then use the included Docker Compose files for an HTTP/HTTPS server or a
              controlled TCP deployment.
            </p>
            <p className="mt-3 max-w-[38em] leading-relaxed">
              Guests on tunel.live never need this. It is the path for putting the relay on infrastructure you
              control.
            </p>
            <a className={`${TEXT_LINK} mt-5 inline-block`} href={SOURCE} target="_blank" rel="noreferrer">
              View the source and deployment files
            </a>
          </div>

          <div className="rounded-md border border-line bg-surface p-6">
            <dl className="flex flex-col gap-4">
              {FACTS.map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-sm font-semibold text-ink">{term}</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed">{detail}</dd>
                </div>
              ))}
              <div>
                <dt className="text-sm font-semibold text-ink">License</dt>
                <dd className="mt-0.5 text-sm leading-relaxed">
                  Source available under CC BY-NC-ND 4.0. See the{' '}
                  <a className="text-action underline underline-offset-4" href={LICENSE} target="_blank" rel="noreferrer">
                    license file
                  </a>
                  .
                </dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
              Standalone interactive SSH forwarding currently accepts connections without SSH account
              authentication. Restrict the SSH port to trusted networks when you deploy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
