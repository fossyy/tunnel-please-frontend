import { Link } from 'react-router-dom'
import UseCaseStack from '../components/UseCaseStack'
import Configurator from '../components/Configurator'
import SelfHost from '../components/SelfHost'
import { BTN, CONTAINER, H1, TEXT_LINK } from '../lib/ui'
import { usePageMeta } from '../lib/meta'

export default function Landing() {
  usePageMeta()

  return (
    <>
      <section id="product" className="border-b border-line">
        {/* shortcut: 4.3125rem is the header height; update it if the header grows. */}
        <div className={`${CONTAINER} reveal grid min-h-[calc(100dvh-4.3125rem)] content-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16`}>
          <div className="flex flex-col items-start">
            <h1 className={H1}>
              One SSH command.
              <br />
              Your app, online.
            </h1>
            <p className="mt-5 max-w-[32em] text-lg leading-relaxed text-body">
              tunel.live gives your local app a public HTTP/HTTPS address or TCP endpoint through a free hosted
              Tunnel Please server. No registration required for standard tunnels.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link className={BTN} to="/#configure">
                Configure a tunnel
              </Link>
              <Link className={TEXT_LINK} to="/#self-host">
                Self-host the server
              </Link>
            </div>
          </div>

          <UseCaseStack />
        </div>
      </section>

      <Configurator />
      <SelfHost />
    </>
  )
}
