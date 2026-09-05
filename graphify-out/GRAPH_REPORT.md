# Graph Report - Her  (2026-09-05)

## Corpus Check
- 14 files · ~9,112 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 56 nodes · 59 edges · 14 communities (8 shown, 6 thin omitted)
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `336444ca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Page 4: Birthday Celebration DOM
- storm-transition.js
- index.html
- 1. Graphify Mandatory Graph-First Policy
- Stage Viewport
- Page 5: Personal Letter DOM
- Page 6: Secret Vault DOM
- Japanese Pastel Creative Direction
- VolumetricDarkCloud
- Graphify Mandatory Graph-First Investigation Rule
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `Stage Viewport` - 8 edges
2. `Japanese Pastel Creative Direction` - 8 edges
3. `VolumetricDarkCloud()` - 4 edges
4. `playCloudTransition()` - 4 edges
5. `resizeStormCanvas()` - 3 edges
6. `initStormTransition()` - 3 edges
7. `Page 2: Story Journey DOM` - 3 edges
8. `Page 3: Quiz Game DOM` - 3 edges
9. `Page 4: Birthday Celebration DOM` - 3 edges
10. `Page 5: Personal Letter DOM` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Page 1: Opening Scene DOM` --implements--> `Design Spec: Page 01 Opening`  [INFERRED]
  index.html → japanese_pastel_girlfriend_birthday_website(1).md
- `Page 2: Story Journey DOM` --implements--> `Design Spec: Page 02 Story`  [INFERRED]
  index.html → japanese_pastel_girlfriend_birthday_website(1).md
- `Page 3: Quiz Game DOM` --implements--> `Design Spec: Page 03 Game`  [INFERRED]
  index.html → japanese_pastel_girlfriend_birthday_website(1).md
- `Page 4: Birthday Celebration DOM` --implements--> `Design Spec: Page 04 Birthday`  [INFERRED]
  index.html → japanese_pastel_girlfriend_birthday_website(1).md
- `Page 5: Personal Letter DOM` --implements--> `Design Spec: Page 05 Letter`  [INFERRED]
  index.html → japanese_pastel_girlfriend_birthday_website(1).md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **6-Page Interactive Storyline Sequence** — index_page_opening, index_page_story, index_page_game, index_page_bday, index_page_letter, index_page_secret [EXTRACTED 0.95]

## Communities (14 total, 6 thin omitted)

### Community 1 - "storm-transition.js"
Cohesion: 0.60
Nodes (5): Storm Cloud Transition Spec, initStormClouds(), initStormTransition(), playCloudTransition(), resizeStormCanvas()

### Community 2 - "index.html"
Cohesion: 0.50
Nodes (3): Progress Petals & Audio Control, goTo(), updateProgress()

### Community 3 - "1. Graphify Mandatory Graph-First Policy"
Cohesion: 0.50
Nodes (3): 1. Graphify Mandatory Graph-First Policy, Mandatory Rules (Zero Exceptions):, Workspace Project Rules

### Community 4 - "Stage Viewport"
Cohesion: 0.25
Nodes (6): Page 3: Quiz Game DOM, Page 1: Opening Scene DOM, Stage Viewport, Storm Canvas Overlay, Design Spec: Page 01 Opening, Design Spec: Page 03 Game

### Community 7 - "Japanese Pastel Creative Direction"
Cohesion: 0.29
Nodes (5): Page 2: Story Journey DOM, Pastel Color Palette Spec, Japanese Pastel Creative Direction, Design Spec: Page 02 Story, Typography & Serif Spec

## Knowledge Gaps
- **7 isolated node(s):** `Mandatory Rules (Zero Exceptions):`, `Workflow: graphify`, `Mandatory Rules (Zero Exceptions):`, `Progress Petals & Audio Control`, `Pastel Color Palette Spec` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Stage Viewport` connect `Stage Viewport` to `Page 4: Birthday Celebration DOM`, `index.html`, `Page 5: Personal Letter DOM`, `Page 6: Secret Vault DOM`, `Japanese Pastel Creative Direction`?**
  _High betweenness centrality (0.404) - this node is a cross-community bridge._
- **Why does `Storm Canvas Overlay` connect `Stage Viewport` to `storm-transition.js`?**
  _High betweenness centrality (0.209) - this node is a cross-community bridge._
- **Why does `Japanese Pastel Creative Direction` connect `Japanese Pastel Creative Direction` to `Page 4: Birthday Celebration DOM`, `Stage Viewport`, `Page 5: Personal Letter DOM`, `Page 6: Secret Vault DOM`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **What connects `Mandatory Rules (Zero Exceptions):`, `Workflow: graphify`, `Mandatory Rules (Zero Exceptions):` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._