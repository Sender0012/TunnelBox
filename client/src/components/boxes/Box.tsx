import type { ComponentPropsWithoutRef, CSSProperties } from 'react'

const boxLayouts = {
  stack: 'flex flex-col gap-4',
  row: 'flex flex-col gap-4 sm:flex-row sm:items-center',
  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
} as const

export type BoxLayoutId = keyof typeof boxLayouts

export interface BoxProps extends ComponentPropsWithoutRef<'div'> {
  boxLayoutId: BoxLayoutId
  /** CSS color such as var(--accent) or an oklch(...) value. */
  hoverColor?: CSSProperties['backgroundColor']
  /** Pair custom hover surfaces with a suitable foreground color. */
  hoverForegroundColor?: CSSProperties['color']
}

/** A themed card whose layout arranges the supplied children. */
export function Box({
  boxLayoutId,
  hoverColor = 'var(--accent)',
  hoverForegroundColor = 'var(--accent-foreground)',
  children,
  className,
  style,
  ...props
}: BoxProps) {
  const boxStyle = {
    '--box-hover-color': hoverColor,
    '--box-hover-foreground': hoverForegroundColor,
    ...style,
  } as CSSProperties

  return (
    <div
      {...props}
      data-box-layout={boxLayoutId}
      className={[
        'rounded-none border-4 border-[oklch(0_0_0)] bg-card p-6 font-mono font-bold text-card-foreground',
        'motion-safe:transition-[translate,background-color,color] motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-1',
        'hover:bg-[var(--box-hover-color)] hover:text-[var(--box-hover-foreground)]',
        'focus-within:bg-[var(--box-hover-color)] focus-within:text-[var(--box-hover-foreground)]',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        boxLayouts[boxLayoutId],
        className,
      ].filter(Boolean).join(' ')}
      style={boxStyle}
    >
      {children}
    </div>
  )
}

export default Box
