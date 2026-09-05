# Graph Report - .  (2026-09-05)

## Corpus Check
- Corpus is ~8,622 words - fits in a single context window. You may not need a graph.

## Summary
- 47 nodes · 53 edges · 12 communities (7 shown, 5 thin omitted)
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.92)
- Token cost: 2,400 input · 950 output

## Community Hubs (Navigation)
- Birthday Celebration & Stage
- Storm Transition Controller
- Application Shell & Navigation
- Creative Direction & Opening
- Quiz Game Experience
- Final Letter Experience
- Secret Vault Experience
- Story Timeline Experience
- Volumetric Cloud Simulation

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

## Communities (12 total, 5 thin omitted)

### Community 0 - "Birthday Celebration & Stage"
Cohesion: 0.33
Nodes (4): Page 4: Birthday Celebration DOM, Stage Viewport, Storm Canvas Overlay, Design Spec: Page 04 Birthday

### Community 1 - "Storm Transition Controller"
Cohesion: 0.60
Nodes (5): Storm Cloud Transition Spec, initStormClouds(), initStormTransition(), playCloudTransition(), resizeStormCanvas()

### Community 2 - "Application Shell & Navigation"
Cohesion: 0.50
Nodes (3): Progress Petals & Audio Control, goTo(), updateProgress()

### Community 3 - "Creative Direction & Opening"
Cohesion: 0.40
Nodes (5): Page 1: Opening Scene DOM, Pastel Color Palette Spec, Japanese Pastel Creative Direction, Design Spec: Page 01 Opening, Typography & Serif Spec

## Knowledge Gaps
- **4 isolated node(s):** `Progress Petals & Audio Control`, `Pastel Color Palette Spec`, `Typography & Serif Spec`, `Storm Cloud Transition Spec`
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Stage Viewport` connect `Birthday Celebration & Stage` to `Application Shell & Navigation`, `Creative Direction & Opening`, `Quiz Game Experience`, `Final Letter Experience`, `Secret Vault Experience`, `Story Timeline Experience`?**
  _High betweenness centrality (0.580) - this node is a cross-community bridge._
- **Why does `Storm Canvas Overlay` connect `Birthday Celebration & Stage` to `Storm Transition Controller`?**
  _High betweenness centrality (0.300) - this node is a cross-community bridge._
- **Why does `Japanese Pastel Creative Direction` connect `Creative Direction & Opening` to `Birthday Celebration & Stage`, `Quiz Game Experience`, `Final Letter Experience`, `Secret Vault Experience`, `Story Timeline Experience`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **What connects `Progress Petals & Audio Control`, `Pastel Color Palette Spec`, `Typography & Serif Spec` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._