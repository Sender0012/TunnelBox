/** Stage navigation does not validate evidence or record a decision. */
export const validationStages = [
  { id: 'hypothesis', name: 'Hypothesis', prompt: 'IF [action or context] THEN [outcome] BECAUSE [rationale].' },
  { id: 'metric', name: 'Metric', prompt: 'Define a target, a numeric threshold, and a timeframe.' },
  { id: 'experiment', name: 'Experiment', prompt: 'Describe how you will test the hypothesis and measure the result.' },
  { id: 'decision', name: 'Decision', prompt: 'Review the evidence before recording PASS, FAIL, or PIVOT.' },
] as const

export type ValidationStage = typeof validationStages[number]['id']

export function nextValidationStage(stage: ValidationStage): ValidationStage {
  const index = validationStages.findIndex((item) => item.id === stage)
  if (index < 0) throw new Error('Unknown validation stage')
  return validationStages[(index + 1) % validationStages.length]!.id
}
