import { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from './Box'
import type { BoxProps } from './Box'
import { boxStages } from './boxStages'
import type { BoxStage } from './boxStages'

export interface ProjectBox {
  /** Unique project ID, also displayed as the box name. */
  id: string
  stage?: BoxStage
  boxLayoutId?: BoxProps['boxLayoutId']
  hoverColor?: BoxProps['hoverColor']
  hoverForegroundColor?: BoxProps['hoverForegroundColor']
}

export interface BoxesGridProps {
  boxes: readonly ProjectBox[]
  onMove: (id: string, stage: BoxStage) => void
}

export default function BoxesGrid({ boxes, onMove }: BoxesGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedBox = boxes.find((box) => box.id === selectedId)

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
      {boxStages.map((stage) => {
        const stageBoxes = boxes.filter((box) => (box.stage ?? 'ideas') === stage)
        return (
          <section key={stage} aria-labelledby={`grid-${stage}`} className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id={`grid-${stage}`} className="font-mono text-lg font-bold capitalize">
                {stage} ({stageBoxes.length})
              </h2>
              <button
                type="button"
                disabled={!selectedBox || (selectedBox.stage ?? 'ideas') === stage}
                aria-label={`Move selected box to ${stage}`}
                onClick={() => { if (selectedBox) onMove(selectedBox.id, stage) }}
                className="border-2 border-[oklch(0_0_0)] bg-primary px-3 py-2 font-mono text-sm font-bold text-primary-foreground enabled:hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                Move here
              </button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-6">
              {stageBoxes.map(({ id, stage: _stage, boxLayoutId = 'stack', ...colors }) => (
                <Box
                  key={id}
                  boxLayoutId={boxLayoutId}
                  {...colors}
                  className={`h-full min-h-40 min-w-0 justify-center break-words text-lg ${selectedId === id ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : ''}`}
                >
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedId === id}
                      onChange={() => setSelectedId(selectedId === id ? null : id)}
                      aria-label={`Select ${id} to move`}
                      className="size-4 focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    {selectedId === id ? 'Selected' : 'Select to move'}
                  </label>
                  <Link
                    to={`/tunnelbox/${encodeURIComponent(id)}`}
                    className="block py-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {id}
                  </Link>
                </Box>
              ))}
            </div>
            {stageBoxes.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
          </section>
        )
      })}
    </div>
  )
}
