import { useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'

import type { CanvasBlockType } from '../components/canvas/canvasTypes'
import { canvasBlockTypes } from '../components/canvas/canvasTypes'

interface SidebarLayoutProps {
  selectedBlock: CanvasBlockType
  onSelectBlock: (block: CanvasBlockType) => void
  children?: ReactNode
}

export default function SidebarLayout({ children, selectedBlock, onSelectBlock }: SidebarLayoutProps) {
  const [width, setWidth] = useState(25)
  const lastWidth = useRef(25)
  const container = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const hidden = width === 0

  function resize(nextWidth: number) {
    const next = nextWidth < 8 ? 0 : Math.min(70, Math.max(15, nextWidth))
    setWidth(next)
    if (next > 0) lastWidth.current = next
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !container.current) return
    const bounds = container.current.getBoundingClientRect()
    resize(((event.clientX - bounds.left) / bounds.width) * 100)
  }

  return (
    <div ref={container} className="flex min-h-0 flex-1">
      <aside id="project-sidebar" hidden={hidden} style={{ width: `${width}%` }} aria-labelledby="canvas-blocks-heading" className="shrink-0 overflow-y-auto overflow-x-hidden bg-sidebar p-3 font-mono text-sidebar-foreground sm:p-6">
        <h2 id="canvas-blocks-heading" className="mb-4 text-lg font-bold">Canvas blocks</h2>
        <ol className="flex flex-col divide-y divide-sidebar-border">
          {canvasBlockTypes.map((block, index) => (
            <li key={block.id}>
              <button type="button" aria-current={selectedBlock === block.id ? 'true' : undefined} onClick={() => onSelectBlock(block.id)} className={`flex w-full gap-3 rounded-md px-2 py-3 text-left font-bold focus-visible:ring-2 focus-visible:ring-sidebar-ring ${selectedBlock === block.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}>
              <span aria-hidden="true" className="shrink-0 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              <span className="min-w-0 break-words">{block.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </aside>
      <div className="relative w-4 shrink-0">
        <div
          role="separator"
          tabIndex={0}
          aria-label="Resize sidebar"
          aria-controls="project-sidebar"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={70}
          aria-valuenow={Math.round(width)}
          aria-valuetext={hidden ? 'Sidebar hidden' : `${Math.round(width)} percent`}
          onPointerDown={(event) => {
            if (event.button !== 0) return
            dragging.current = true
            event.currentTarget.setPointerCapture(event.pointerId)
            event.currentTarget.focus()
          }}
          onPointerMove={drag}
          onPointerUp={(event) => {
            dragging.current = false
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId)
            }
          }}
          onPointerCancel={() => { dragging.current = false }}
          onLostPointerCapture={() => { dragging.current = false }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              resize(width + (event.key === 'ArrowRight' ? (hidden ? 15 : 5) : width <= 15 ? -15 : -5))
            } else if (event.key === 'Home' || event.key === 'End') {
              event.preventDefault()
              resize(event.key === 'Home' ? 0 : 70)
            }
          }}
          className="absolute inset-0 cursor-col-resize touch-none select-none before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:border-l-4 before:border-[oklch(0_0_0)] hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-ring"
        />
        <button
          type="button"
          aria-label={hidden ? 'Show sidebar' : 'Hide sidebar'}
          aria-expanded={!hidden}
          aria-controls="project-sidebar"
          onClick={() => setWidth(hidden ? lastWidth.current : 0)}
          className={`absolute top-1/2 left-1/2 z-9 flex h-12 w-4 -translate-y-1/2 cursor-pointer items-center justify-center text-sidebar-foreground hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring ${hidden ? '' : '-translate-x-full'}`}
        >
          <svg aria-hidden="true" viewBox="0 0 16 24" className="h-6 w-4 fill-current">
            <path d={hidden ? 'M0 0 L16 12 L0 24 Z' : 'M16 0 L0 12 L16 24 Z'} />
          </svg>
        </button>
      </div>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
    </div>
  )
}
