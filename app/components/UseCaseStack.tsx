import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

const CARDS = [
  {
    title: 'Share a local web app',
    body: 'Open it from another device, or send the address to a teammate.',
    code: 'https://<assigned>.sgp.tunel.live',
  },
  {
    title: 'Receive webhooks',
    body: 'Point a service like Stripe or GitHub at a port on your machine.',
    code: 'https://<assigned>.sgp.tunel.live → localhost:8000',
  },
  {
    title: 'Reach a local database or game server',
    body: 'Forward a TCP port when the client needs a raw socket.',
    code: 'sgp.tunel.live:20443 → localhost:5432',
  },
]

const AUTOPLAY_MS = 4000
const DRAG_THRESHOLD = 56

const POSITION = [
  'translate-x-0 translate-y-0 opacity-100',
  'translate-x-2 -translate-y-2 opacity-55 lg:translate-x-3.5 lg:-translate-y-3.5',
  'translate-x-4 -translate-y-4 opacity-30 lg:translate-x-7 lg:-translate-y-7',
]

export default function UseCaseStack() {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (hovered || reduced || dragging) return
    const timer = setInterval(() => setActive((index) => (index + 1) % CARDS.length), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [hovered, reduced, dragging])

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    startX.current = event.clientX
    setDragging(true)
    setDragX(0)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return
    setDragX(event.clientX - startX.current)
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return
    const delta = event.clientX - startX.current
    startX.current = null
    setDragging(false)
    setDragX(0)
    // Both directions advance: the card peeking up-right behind the front is
    // the one the drag exposes either way, so it always becomes the new front.
    if (Math.abs(delta) > DRAG_THRESHOLD) {
      setActive((index) => (index + 1) % CARDS.length)
    }
  }

  return (
    <section className="flex flex-col gap-3" aria-label="What you can do with a tunnel">
      <div
        className={`relative h-[300px] touch-pan-y sm:h-[280px] lg:h-[300px] ${
          dragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false)
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        {CARDS.map((card, index) => {
          const position = (index - active + CARDS.length) % CARDS.length
          const isFront = position === 0
          return (
            <article
              key={card.title}
              aria-hidden={!isFront}
              style={{
                zIndex: CARDS.length - position,
                ...(isFront && dragging ? { translate: `${dragX}px 0px`, transitionDuration: '0s' } : null),
              }}
              className={`absolute inset-x-0 bottom-0 top-8 rounded-md border border-line bg-surface p-5 transition-[translate,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[translate,opacity] sm:p-6 ${POSITION[position]}`}
            >
              <h2 className="text-[19px] font-medium leading-snug tracking-[-0.01em]">{card.title}</h2>
              <p className="mt-2 max-w-[30em] text-[15px] leading-relaxed text-body">{card.body}</p>
              <code className="mt-4 block overflow-x-auto whitespace-nowrap rounded-sm bg-subtle px-2.5 py-2 font-mono text-[12.5px] text-ink">
                {card.code}
              </code>
            </article>
          )
        })}
      </div>

      <div className="flex items-center gap-1 pl-0.5">
        {CARDS.map((card, index) => (
          <button
            key={card.title}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show: ${card.title}`}
            aria-current={index === active ? 'true' : undefined}
            className="group inline-flex min-h-11 items-center rounded-sm px-1.5"
          >
            <span
              className={`h-[3px] w-4 transition-colors duration-500 ${
                index === active ? 'bg-action' : 'bg-line group-hover:bg-muted'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
