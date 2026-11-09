import { useId } from 'react'
import type { ReactNode } from 'react'
import { canvasBlockTypes, MAX_ZOOM, MIN_ZOOM } from './canvasTypes'
import type { CanvasBlockType, CanvasBoxData } from './canvasTypes'

export interface CanvasToolbarProps {
  boxType: CanvasBlockType
  zoom: number
  boxes: readonly CanvasBoxData[]
  onGoToBox: (id: string) => void
  onBoxTypeChange: (type: CanvasBlockType) => void
  onAddBox: () => void
  onZoom: (factor: number) => void
  onReset: () => void
  children?: ReactNode
}

const button = 'rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

export default function CanvasToolbar({ boxType, zoom, boxes, onGoToBox, onBoxTypeChange, onAddBox, onZoom, onReset, children }: CanvasToolbarProps) {
  const typeId = useId()
  const navigationId = useId()
  return (
    <div aria-label="Canvas controls" className="relative z-10 flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-card p-3 text-card-foreground">
      <label htmlFor={typeId} className="text-sm font-medium">Box type</label>
      <select id={typeId} value={boxType} onChange={(event) => {
        const type = canvasBlockTypes.find((block) => block.id === event.target.value)
        if (type) onBoxTypeChange(type.id)
      }} className="min-w-0 max-w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        {canvasBlockTypes.map((block) => <option key={block.id} value={block.id}>{block.name}</option>)}
      </select>
      <button type="button" onClick={onAddBox} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring">+ Add box</button>
      <label htmlFor={navigationId} className="text-sm font-medium">Go to box</label>
      <select id={navigationId} value="" disabled={boxes.length === 0} onChange={(event) => onGoToBox(event.target.value)} className="min-w-0 max-w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
        <option value="" disabled>{boxes.length === 0 ? 'No boxes yet' : 'Choose a box…'}</option>
        {boxes.map((box, index) => {
          const title = box.title.trim() || canvasBlockTypes.find((block) => block.id === box.type)!.name
          const duplicate = boxes.filter((item) => (item.title.trim() || canvasBlockTypes.find((block) => block.id === item.type)!.name) === title).length > 1
          return <option key={box.id} value={box.id}>{title}{duplicate ? ` (${index + 1})` : ''}</option>
        })}
      </select>
      <div className="ml-auto flex items-center gap-2">
        <button type="button" aria-label="Zoom out" disabled={zoom <= MIN_ZOOM} onClick={() => onZoom(1 / 1.2)} className={button}>−</button>
        <output aria-label="Zoom level" className="w-12 text-center text-sm tabular-nums">{Math.round(zoom * 100)}%</output>
        <button type="button" aria-label="Zoom in" disabled={zoom >= MAX_ZOOM} onClick={() => onZoom(1.2)} className={button}>+</button>
        <button type="button" onClick={onReset} className={button}>Reset view</button>
      </div>
      {children}
    </div>
  )
}
