import BoxDetails from './BoxDetails'
import { nextValidationStage } from './validationStages'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import CanvasBox from './CanvasBox'
import CanvasToolbar from './CanvasToolbar'
import { canvasBlockTypes, BOX_WIDTH, BOX_HEIGHT, MIN_BOX_WIDTH, MIN_BOX_HEIGHT, MAX_ZOOM, MIN_ZOOM } from './canvasTypes'
import type { CanvasBlockType, CanvasBoxData, CanvasViewport } from './canvasTypes'

export interface CanvasProps {
  name?: string
  /** Default box type for this independent workspace. */
  initialBoxType?: CanvasBlockType
  /** Additional actions displayed in the top toolbar. */
  toolbarActions?: ReactNode
  /** Add application-specific functionality inside each box. */
  renderBox?: (box: CanvasBoxData) => ReactNode
}

type Gesture = { pointerId: number; x: number; y: number; boxId?: string; resize?: boolean }
const initialViewport: CanvasViewport = { x: 0, y: 0, zoom: 1 }

export default function Canvas({ name = 'Lean Canvas', initialBoxType = 'problem', toolbarActions, renderBox }: CanvasProps) {
  const [viewport, setViewport] = useState(initialViewport)
  const [boxes, setBoxes] = useState<CanvasBoxData[]>([])
  const [detailsId, setDetailsId] = useState<string | null>(null)
  const detailsBox = boxes.find((box) => box.id === detailsId)
  const [boxType, setBoxType] = useState<CanvasBlockType>(initialBoxType)
  const surface = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)

  function zoomAt(factor: number, x: number, y: number) {
    setViewport((current) => {
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.zoom * factor))
      return { zoom, x: x - (x - current.x) * zoom / current.zoom, y: y - (y - current.y) * zoom / current.zoom }
    })
  }

  useEffect(() => {
    const element = surface.current
    if (!element) return
    function wheel(event: WheelEvent) {
      if ((event.target as HTMLElement).closest('article')) return
      event.preventDefault()
      if (gesture.current) return
      const bounds = element!.getBoundingClientRect()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1
      zoomAt(Math.exp(-event.deltaY * unit * 0.002), event.clientX - bounds.left, event.clientY - bounds.top)
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [])

  function startDrag(event: PointerEvent<HTMLElement>, boxId?: string, resize = false) {
    if (event.button !== 0 || gesture.current) return
    event.preventDefault()
    event.currentTarget.focus()
    gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, boxId, resize }
    surface.current?.setPointerCapture(event.pointerId)
  }

  function moveBox(id: string, dx: number, dy: number) {
    setBoxes((current) => current.map((box) => box.id === id ? { ...box, x: box.x + dx, y: box.y + dy } : box))
  }

  function resizeBox(id: string, dx: number, dy: number) {
    setBoxes((current) => current.map((box) => box.id === id ? {
      ...box,
      width: Math.max(MIN_BOX_WIDTH, box.width + dx),
      height: Math.max(MIN_BOX_HEIGHT, box.height + dy),
    } : box))
  }

  function goToBox(id: string) {
    const box = boxes.find((item) => item.id === id)
    const bounds = surface.current?.getBoundingClientRect()
    if (!box || !bounds || bounds.width <= 0 || bounds.height <= 0) return
    setViewport((current) => {
      // Keep the current zoom unless the destination needs more room.
      const zoom = Math.max(MIN_ZOOM, Math.min(current.zoom, (bounds.width - 48) / box.width, (bounds.height - 48) / box.height))
      return { zoom, x: bounds.width / 2 - (box.x + box.width / 2) * zoom, y: bounds.height / 2 - (box.y + box.height / 2) * zoom }
    })
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (gesture.current?.pointerId !== event.pointerId) return
    gesture.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <>
      {detailsBox && <BoxDetails box={detailsBox} onBack={() => setDetailsId(null)} onContentChange={(content) => setBoxes((current) => current.map((box) => box.id === detailsBox.id ? { ...box, ...content } : box))} onPhaseChange={(stage, field, value) => setBoxes((current) => current.map((box) => box.id === detailsBox.id ? { ...box, phases: { ...box.phases, [stage]: { ...box.phases[stage], [field]: value } } } : box))} />}
    <section aria-label={`${name} canvas`} hidden={!!detailsBox} className={detailsBox ? 'hidden' : 'flex min-h-0 flex-1 flex-col overflow-hidden bg-background text-foreground'}>
      <h2 className="shrink-0 border-b border-border bg-card px-4 py-3 text-lg font-semibold text-card-foreground">{name}</h2>
      <CanvasToolbar boxes={boxes} onGoToBox={goToBox} boxType={boxType} zoom={viewport.zoom} onBoxTypeChange={setBoxType} onAddBox={() => {
        const bounds = surface.current?.getBoundingClientRect()
        if (!bounds) return
        const box: CanvasBoxData = { id: crypto.randomUUID(), type: boxType, stage: 'hypothesis', title: canvasBlockTypes.find((block) => block.id === boxType)!.name, description: '', phases: { hypothesis: { conclusions: '', notes: '' }, metric: { conclusions: '', notes: '' }, experiment: { conclusions: '', notes: '' }, decision: { conclusions: '', notes: '' } }, width: BOX_WIDTH, height: BOX_HEIGHT, x: (bounds.width / 2 - viewport.x) / viewport.zoom - BOX_WIDTH / 2, y: (bounds.height / 2 - viewport.y) / viewport.zoom - BOX_HEIGHT / 2 }
        setBoxes((current) => [...current, box])
      }} onZoom={(factor) => {
        const bounds = surface.current?.getBoundingClientRect()
        if (bounds) zoomAt(factor, bounds.width / 2, bounds.height / 2)
      }} onReset={() => setViewport(initialViewport)}>{toolbarActions}</CanvasToolbar>
      <div ref={surface} role="region" aria-label="Canvas. Drag the background to pan, scroll to zoom, or use arrow keys to pan." tabIndex={0}
        onPointerDown={(event) => { if (!(event.target as HTMLElement).closest('article')) startDrag(event) }}
        onPointerMove={(event) => {
          const active = gesture.current
          if (!active || active.pointerId !== event.pointerId) return
          const dx = event.clientX - active.x
          const dy = event.clientY - active.y
          active.x = event.clientX
          active.y = event.clientY
          if (active.boxId && active.resize) resizeBox(active.boxId, dx / viewport.zoom, dy / viewport.zoom)
          else if (active.boxId) moveBox(active.boxId, dx / viewport.zoom, dy / viewport.zoom)
          else setViewport((current) => ({ ...current, x: current.x + dx, y: current.y + dy }))
        }} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { gesture.current = null }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          const offsets: Record<string, [number, number]> = { ArrowLeft: [50, 0], ArrowRight: [-50, 0], ArrowUp: [0, 50], ArrowDown: [0, -50] }
          const offset = offsets[event.key]
          if (!offset) return
          event.preventDefault()
          setViewport((current) => ({ ...current, x: current.x + offset[0], y: current.y + offset[1] }))
        }}
        className="relative min-h-0 flex-1 touch-none overflow-hidden bg-muted/30 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: `${24 * viewport.zoom}px ${24 * viewport.zoom}px`, backgroundPosition: `${viewport.x}px ${viewport.y}px` }}>
        {boxes.length === 0 && <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center"><h2 className="text-lg font-semibold">Give your idea room to grow</h2><p className="text-sm text-muted-foreground">Choose a block type above and add your first box.</p></div>}
        <div className="absolute top-0 left-0 h-0 w-0 origin-top-left" style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})` }}>
          {boxes.map((box) => <CanvasBox key={box.id} box={box} onDetails={() => setDetailsId(box.id)} onContentChange={(content) => setBoxes((current) => current.map((item) => item.id === box.id ? { ...item, ...content } : item))} onDragStart={(event) => startDrag(event, box.id)} onStageChange={() => setBoxes((current) => current.map((item) => item.id === box.id ? { ...item, stage: nextValidationStage(item.stage) } : item))} onMove={(dx, dy) => moveBox(box.id, dx, dy)} onResizeStart={(event) => startDrag(event, box.id, true)} onResize={(dx, dy) => resizeBox(box.id, dx, dy)}>{renderBox?.(box)}</CanvasBox>)}
        </div>
      </div>
      <p className="border-t border-border bg-card px-3 py-2 text-xs text-muted-foreground">Drag background to pan · Scroll to zoom · Drag box headers to move · Drag bottom-right corners to resize · Changes last until you leave this project</p>
    </section>
    </>
  )
}
