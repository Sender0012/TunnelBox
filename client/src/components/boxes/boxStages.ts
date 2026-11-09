export const boxStages = ['ideas', 'validating', 'working', 'finished'] as const
export type BoxStage = typeof boxStages[number]
