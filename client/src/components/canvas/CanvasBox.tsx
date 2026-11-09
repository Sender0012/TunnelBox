import type { PointerEventHandler, ReactNode } from 'react'
import { validationStages, nextValidationStage } from './validationStages'
import { BOX_WIDTH, BOX_HEIGHT, canvasBlockTypes } from './canvasTypes'
import type { CanvasBoxData } from './canvasTypes'

export interface CanvasBoxProps {
  box: CanvasBoxData
  onDragStart: PointerEventHandler<HTMLButtonElement>
  onResizeStart: PointerEventHandler<HTMLButtonElement>
  onResize: (dx: number, dy: number) => void
  onContentChange: (content: Partial<Pick<CanvasBoxData, 'title' | 'description'>>) => void
  onDetails: () => void
  onStageChange: () => void
  onMove: (dx: number, dy: number) => void
  children?: ReactNode
}

/** Supply children to add editors, metrics, experiments, or other block tools. */
export default function CanvasBox({ box, onDragStart, onMove, onResizeStart, onResize, onStageChange, onContentChange, onDetails, children }: CanvasBoxProps) {
  const blockName = canvasBlockTypes.find((block) => block.id === box.type)!.name
  const title = box.title.trim() || blockName
  const stageColors = { hypothesis: 'var(--stage-hypothesis)', metric: 'var(--stage-metric)', experiment: 'var(--stage-experiment)', decision: 'var(--stage-decision)' }
  const stageColor = stageColors[box.stage]
  const stage = validationStages.find((item) => item.id === box.stage)!
  const nextStage = validationStages.find((item) => item.id === nextValidationStage(box.stage))!
  const fontSize = Math.min(28, Math.max(14, 14 * Math.min(box.width / BOX_WIDTH, box.height / BOX_HEIGHT)))
  return (
    <article aria-label={`${title} box`} className="absolute flex flex-col rounded-lg border-2 text-foreground shadow-sm" style={{ left: box.x, top: box.y, width: box.width, height: box.height, fontSize, lineHeight: 1.5, backgroundColor: 'color-mix(in oklab, var(--muted) 30%, var(--background))', borderColor: stageColor }}>
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-current/15 px-3 py-2">
        <input aria-label="Box title" value={box.title} maxLength={120} onChange={(event) => onContentChange({ title: event.target.value })} placeholder={blockName} className="min-w-0 flex-1 basis-24 rounded-md border border-transparent bg-transparent px-1 font-semibold text-inherit hover:border-current/30 focus-visible:ring-2 focus-visible:ring-ring" />
        <button type="button" onClick={onStageChange} aria-label={`Change ${title} stage from ${stage.name} to ${nextStage.name}`} title={`Next stage: ${nextStage.name}`} className="cursor-pointer rounded-md border border-current/20 px-2 py-1 text-[0.8em] font-medium hover:bg-card/40 focus-visible:ring-2 focus-visible:ring-ring">
          <span aria-live="polite">{stage.name}</span><span aria-hidden="true" className="ml-1">↻</span>
        </button>
      <button type="button" aria-label={`Move ${title} box. Use arrow keys to move.`} onPointerDown={onDragStart} onKeyDown={(event) => {
        const offsets: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
        const offset = offsets[event.key]
        if (!offset) return
        event.preventDefault()
        event.stopPropagation()
        const step = event.shiftKey ? 50 : 10
        onMove(offset[0] * step, offset[1] * step)
      }} className="shrink-0 touch-none cursor-grab rounded-md px-2 py-1 active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring">
        <span aria-hidden="true">⠿</span>
      </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4 pb-8 [overflow-wrap:anywhere]">
        <textarea aria-label="Box description" value={box.description} maxLength={10000} onChange={(event) => onContentChange({ description: event.target.value })} placeholder={stage.prompt} className="block h-full min-h-12 w-full resize-none rounded-md border border-transparent bg-transparent p-1 text-inherit leading-inherit placeholder:text-current/65 hover:border-current/30 focus-visible:ring-2 focus-visible:ring-ring" />
        {children}
      </div>
      <div className="shrink-0 px-3 pb-2 pr-10">
        <button type="button" onClick={onDetails} aria-label={`Details for ${title}`} className="rounded-md border border-current/20 px-2 py-1 text-[0.85em] font-medium hover:bg-card/40 focus-visible:ring-2 focus-visible:ring-ring">Details</button>
      </div>
      <button type="button" aria-label={`Resize ${title} box. Use arrow keys to change size.`} title="Drag to resize, or use arrow keys" onPointerDown={onResizeStart} onKeyDown={(event) => {
        const offsets: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
        const offset = offsets[event.key]
        if (!offset) return
        event.preventDefault()
        event.stopPropagation()
        const step = event.shiftKey ? 50 : 10
        onResize(offset[0] * step, offset[1] * step)
      }} className="absolute right-0 bottom-0 flex size-8 touch-none cursor-se-resize items-center justify-center rounded-br-lg bg-transparent text-inherit hover:bg-card/40 focus-visible:ring-2 focus-visible:ring-ring">
        <span aria-hidden="true">◢</span>
      </button>
    </article>
  )
}
