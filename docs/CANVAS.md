# Canvas workspace

The project page keeps a separate `client/src/components/canvas/Canvas.tsx` instance
for each of the nine sidebar blocks, displaying only the selected workspace.
The top toolbar creates boxes for the nine Lean Canvas block types and provides
25–200% zoom and a reset to the original view. Drag empty space to pan, scroll over
empty space to zoom around the pointer, or drag a box header to move it. Focus the
canvas and use arrow keys to pan. Focus a box header and use arrows to move it by
10 canvas pixels (50 with Shift). Touch dragging is supported.

Boxes and viewport are local UI state and reset on leaving or switching projects;
there is no persistence or validation transition. Adding a box places it at the
visible center. Reset view resets pan and zoom without removing boxes.

`CanvasToolbar`, `CanvasBox`, and their types are exported from the canvas folder.
Use `Canvas.toolbarActions` for additional top-bar controls and `Canvas.renderBox`
for interactive box content. The block list in `canvasTypes.ts` is shared with the
sidebar. Box creation and movement do not complete any validation stage. The
validation loop remains Hypothesis → Metric → Experiment → Decision.

Verify with `bun run --filter client build` and `bun run --filter client lint`.

The canvas fills all available workspace beside the sidebar, below the project
header. Clicking a sidebar block updates the canvas heading and highlights the
active block and switches to its independent canvas. Each canvas retains its own
boxes, positions, dimensions, pan, zoom, and toolbar selection while switching
between blocks. The initial box type matches the sidebar block. Hidden canvases
remain mounted so custom content supplied through `renderBox` retains its own
component state too. State resets when leaving or switching projects; it does
not survive a page reload.

Boxes have explicit width and height (initially 288 × 208 canvas pixels). Drag
the bottom-right handle to resize at any zoom level, or focus it and use arrow
keys (10 pixels, or 50 with Shift). Minimum size is 224 × 160 pixels; content
scrolls inside smaller boxes. Resizing changes presentation only.

Box typography grows with both width and height, from 14 to 28 canvas pixels.
Headers, stage prompts, and controls inherit the scale; text wraps and the body
scrolls when space is limited. Custom `renderBox` content can inherit this font
size too; explicit font sizes in custom content override it.

Each box starts at Hypothesis. Its clickable stage badge beside the title cycles the displayed stage in
order: Hypothesis → Metric → Experiment → Decision → Hypothesis. The stage is
stored independently on that box and survives sidebar navigation. Stage prompts
come from `validationStages.ts`. This is presentation navigation: it does not
validate data, mark stages complete, or record PASS/FAIL/PIVOT. Decision outcomes
still require evidence and explicit validation before they can affect progress.

Each box stores an editable `title` (up to 120 characters) and `description`
(up to 10,000 characters). Edit them directly in the header and body. Changes
remain in that canvas's memory when switching sidebar blocks. Text stays plain
text; it is never interpreted as HTML or instructions. Stage changes preserve
both fields, and the description placeholder provides guidance for the current
stage. The stage badge sits beside the title; the separate grip moves the box.

Boxes match the canvas background (30% muted over background), with normal
foreground text. Their 2px borders show stage progress: Hypothesis amber,
Metric blue, Experiment violet, and Decision green. Semantic `--stage-*` tokens
in `global.css` provide light and dark variants. Green denotes the Decision
stage rather than a PASS result. The header badge is the only stage control; there
is no footer stage button.
The stage label also identifies the stage independently of color. Custom
`renderBox` content appears below the description editor.


The toolbar's “Go to box” dropdown lists titles from the active canvas and
updates as titles change. Duplicate titles include their creation-order number;
blank titles fall back to the block name. Selecting a box centers it in the
workspace, zooming out if needed to fit within the supported zoom range. The
selector resets after navigation so the same box can be chosen again after
panning. It is disabled when the canvas is empty.

Each box has a Details button that replaces the canvas workspace with a dedicated
scrollable editor. It includes the shared title and description, then four phase
sections in validation order. Each section lists an editable conclusions field
before its editable supporting notes. These are draft plain-text fields limited
to 10,000 characters each, stored in the box's `phases` record by stage ID. They
do not validate evidence or record decisions. Edits update immediately in memory.
Back to canvas restores the same boxes, positions, sizes, pan, and zoom; the
canvas remains mounted while details are displayed. Sidebar switching also keeps
each workspace's current detail view. Drafts reset on leaving the project/reload.
