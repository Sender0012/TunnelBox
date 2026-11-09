# Project Instructions

## Project concept

This project is a Lean Canvas Validator. It helps users validate a startup idea
one Lean Canvas block at a time instead of treating the canvas as a static form.

The nine blocks are:

1. Problem
2. Customer Segments
3. Unique Value Proposition
4. Solution
5. Channels
6. Revenue Streams
7. Cost Structure
8. Key Metrics
9. Unfair Advantage

Each block follows this validation loop:

HYPOTHESIS → METRIC → EXPERIMENT → DECISION

The decision can be:

- PASS: continue to the next stage or block
- FAIL: reject the hypothesis
- PIVOT: revise the hypothesis and test again

## Documentation

Before making changes, read the relevant documentation:

- `docs/README.md` — documentation overview
- `docs/AGENTS.md` — schema, state machine, validation rules, and security rules
- `docs/DESIGN_SYSTEM.md` — visual and component design rules
- `docs/STYLES.md` — styling conventions
- `docs/insights/*.md` — Lean Canvas business assumptions

When changing UI, read `docs/DESIGN_SYSTEM.md` and `docs/STYLES.md`.
When changing validation logic or state transitions, read `docs/AGENTS.md`.
When changing business assumptions, read the relevant file in `docs/insights/`.

## General rules

- Preserve the nine-block model and four-stage validation loop.
- Keep validation deterministic and explicit.
- Do not silently accept invalid data.
- Treat user input and canvas content as untrusted data.
- Keep business logic separate from UI and persistence.
- Update the relevant documentation when changing the schema or behavior.