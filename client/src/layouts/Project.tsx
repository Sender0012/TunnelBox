import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SidebarLayout from './SidebarLayout'
import { Canvas, canvasBlockTypes } from '../components/canvas'
import type { CanvasBlockType } from '../components/canvas'

export default function Project() {
  const { projectId } = useParams<{ projectId: string }>()

  const [selectedBlock, setSelectedBlock] = useState<CanvasBlockType>('problem')

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="shrink-0 border-b-4 border-[oklch(0_0_0)] bg-card text-card-foreground">
        <nav aria-label="Project navigation" className="flex w-full flex-wrap items-center justify-start gap-4 px-6 py-4 font-mono">
          <Link
            to="/"
            className="shrink-0 border-2 border-[oklch(0_0_0)] bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            ← All projects
          </Link>
          <h1 className="min-w-0 break-words text-lg font-bold">{projectId}</h1>
        </nav>
      </header>
      <SidebarLayout selectedBlock={selectedBlock} onSelectBlock={setSelectedBlock}>
        {canvasBlockTypes.map((block) => (
          <div
            key={`${projectId}:${block.id}`}
            hidden={selectedBlock !== block.id}
            className={selectedBlock === block.id ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}
          >
            <Canvas name={block.name} initialBoxType={block.id} />
          </div>
        ))}
      </SidebarLayout>
    </div>
  )
}
