import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import BoxesGrid from '../components/boxes/BoxesGrid'
import type { ProjectBox } from '../components/boxes/BoxesGrid'
import { boxStages } from '../components/boxes/boxStages'
import type { BoxStage } from '../components/boxes/boxStages'

const storageKey = 'tunnelbox.boxes'
const legacyStorageKey = 'project-validator.boxes'
const initialBoxes: ProjectBox[] = [
  { id: 'project-1' },
  { id: 'project-2' },
  { id: 'project-3' },
]

function loadBoxes(): ProjectBox[] {
  try {
    const savedValue = localStorage.getItem(storageKey) ?? localStorage.getItem(legacyStorageKey)
    const saved: unknown = JSON.parse(savedValue ?? 'null')
    if (Array.isArray(saved)) {
      const restored: ProjectBox[] = []
      for (const entry of saved) {
        // Migrate previously saved names into the Ideas grid.
        const box = typeof entry === 'string' ? { id: entry } : entry
        if (!box || typeof box.id !== 'string' || !box.id.trim()) continue
        if (restored.some((item) => item.id.toLowerCase() === box.id.toLowerCase())) continue
        restored.push({
          id: box.id,
          stage: boxStages.includes(box.stage) ? box.stage : 'ideas',
        })
      }
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, JSON.stringify(restored))
      }
      return restored
    }
  } catch {
    // Keep the grid usable if browser storage is unavailable or invalid.
  }
  return initialBoxes
}

export default function Home() {
  const [boxes, setBoxes] = useState(loadBoxes)
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const addButton = useRef<HTMLButtonElement>(null)

  function closeForm() {
    setIsCreating(false)
    setName('')
    setError('')
    addButton.current?.focus()
  }

  function createBox(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = name.trim()
    if (!id) {
      setError('Enter a name for the box.')
      return
    }
    if (boxes.some((box) => box.id.toLowerCase() === id.toLowerCase())) {
      setError('A box with this name already exists.')
      return
    }

    const nextBoxes: ProjectBox[] = [...boxes, { id, stage: 'ideas' }]
    saveBoxes(nextBoxes, `Created ${id} in Ideas.`)
    closeForm()
  }

  function saveBoxes(nextBoxes: ProjectBox[], message: string) {
    setBoxes(nextBoxes)
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextBoxes))
      setNotice(message)
    } catch {
      setNotice(`${message} Browser storage is unavailable, so changes will not be saved after leaving this page.`)
    }
  }

  function moveBox(id: string, stage: BoxStage) {
    saveBoxes(boxes.map((box) => box.id === id ? { ...box, stage } : box), `Moved ${id} to ${stage}.`)
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl">TunnelBox</h1>
      <button
        ref={addButton}
        type="button"
        aria-expanded={isCreating}
        aria-controls="create-box-form"
        onClick={() => setIsCreating(true)}
        className="self-start border-4 border-[oklch(0_0_0)] bg-primary px-4 py-2 font-mono font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Create project
      </button>

      {isCreating && (
        <form id="create-box-form" onSubmit={createBox} className="flex flex-col gap-4 border-4 border-[oklch(0_0_0)] bg-card p-6 text-card-foreground">
          <label htmlFor="box-name" className="font-mono font-bold">Project name</label>
          <p id="box-name-help" className="text-sm text-muted-foreground">Choose a permanent name. New projects start in Ideas.</p>
          <input
            autoFocus
            id="box-name"
            value={name}
            onChange={(event) => { setName(event.target.value); setError('') }}
            aria-describedby={error ? 'box-name-help box-name-error' : 'box-name-help'}
            aria-invalid={Boolean(error)}
            className="min-w-0 border-2 border-input bg-background px-3 py-2 font-mono text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
          />
          {error && <p id="box-name-error" role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="border-2 border-[oklch(0_0_0)] bg-primary px-4 py-2 font-mono font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring">
              Create project
            </button>
            <button type="button" onClick={closeForm} className="border-2 border-border bg-secondary px-4 py-2 font-mono font-bold text-secondary-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
              Cancel
            </button>
          </div>
        </form>
      )}

      <p role="status" className="text-sm text-muted-foreground empty:hidden">{notice}</p>
      <BoxesGrid boxes={boxes} onMove={moveBox} />
    </main>
  )
}
