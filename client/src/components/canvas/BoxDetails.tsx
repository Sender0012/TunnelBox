import { useId } from 'react'
import { canvasBlockTypes } from './canvasTypes'
import type { CanvasBoxData } from './canvasTypes'
import { validationStages } from './validationStages'
import type { ValidationStage } from './validationStages'

interface BoxDetailsProps {
  box: CanvasBoxData
  onBack: () => void
  onContentChange: (content: Partial<Pick<CanvasBoxData, 'title' | 'description'>>) => void
  onPhaseChange: (stage: ValidationStage, field: 'conclusions' | 'notes', value: string) => void
}

const fieldClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring'

export default function BoxDetails({ box, onBack, onContentChange, onPhaseChange }: BoxDetailsProps) {
  const prefix = useId()
  const blockName = canvasBlockTypes.find((block) => block.id === box.type)!.name
  return (
    <section aria-label="Box details" className="min-h-0 flex-1 overflow-y-auto bg-background text-foreground">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-border bg-card p-4 text-card-foreground">
        <button type="button" onClick={onBack} className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">← Back to canvas</button>
        <h2 className="min-w-0 break-words text-lg font-semibold">{box.title.trim() || blockName} — Details</h2>
      </header>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">Title
            <input value={box.title} maxLength={120} onChange={(event) => onContentChange({ title: event.target.value })} className={fieldClass} />
          </label>
          <label className="grid gap-2 text-sm font-medium">Description
            <textarea rows={3} value={box.description} maxLength={10000} onChange={(event) => onContentChange({ description: event.target.value })} className={fieldClass} />
          </label>
        </div>
        <p className="text-sm text-muted-foreground">Write your conclusions first, then add the supporting notes for each phase. Your drafts are kept while you work in this project.</p>
        {validationStages.map((stage, index) => (
          <section key={stage.id} aria-labelledby={`${prefix}-${stage.id}`} className="grid gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground sm:p-6">
            <h3 id={`${prefix}-${stage.id}`} className="text-lg font-semibold">{index + 1}. {stage.name}</h3>
            <label className="grid gap-2 text-sm font-medium">{stage.name} conclusions
              <textarea rows={3} maxLength={10000} value={box.phases[stage.id].conclusions} onChange={(event) => onPhaseChange(stage.id, 'conclusions', event.target.value)} placeholder="What have you learned? What does the evidence suggest?" className={fieldClass} />
            </label>
            <label className="grid gap-2 text-sm font-medium">{stage.name} notes
              <textarea rows={4} maxLength={10000} value={box.phases[stage.id].notes} onChange={(event) => onPhaseChange(stage.id, 'notes', event.target.value)} placeholder={stage.prompt} className={fieldClass} />
            </label>
          </section>
        ))}
      </div>
    </section>
  )
}
