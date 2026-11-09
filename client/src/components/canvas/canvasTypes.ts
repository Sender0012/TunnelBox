import type { ValidationStage } from './validationStages'

export const canvasBlockTypes = [
  { id: 'problem', name: 'Problem' },
  { id: 'segments', name: 'Customer Segments' },
  { id: 'uvp', name: 'Unique Value Proposition' },
  { id: 'solution', name: 'Solution' },
  { id: 'channels', name: 'Channels' },
  { id: 'revenue', name: 'Revenue Streams' },
  { id: 'costs', name: 'Cost Structure' },
  { id: 'metrics', name: 'Key Metrics' },
  { id: 'unfair_advantage', name: 'Unfair Advantage' },
] as const

export type CanvasBlockType = typeof canvasBlockTypes[number]['id']
export interface CanvasBoxData {
  id: string
  type: CanvasBlockType
  stage: ValidationStage
  title: string
  description: string
  phases: Record<ValidationStage, { conclusions: string; notes: string }>
  x: number
  y: number
  width: number
  height: number
}
export interface CanvasViewport { x: number; y: number; zoom: number }
export const MIN_ZOOM = 0.25
export const MAX_ZOOM = 2
export const BOX_WIDTH = 288

export const BOX_HEIGHT = 208
export const MIN_BOX_WIDTH = 224
export const MIN_BOX_HEIGHT = 160
