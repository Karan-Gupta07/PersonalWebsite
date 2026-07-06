# NERV / MAGI VISUAL REFERENCE (observed from real frames)

Source: hirakujira/MAGI-System `demo.gif` (a screen-accurate recreation of the NGE MAGI
display), frames extracted and directly inspected on 2026-07-05. These are the concrete
visual facts to build against. Colors are eyeballed from the frames — treat as targets, and
reconcile with the site's nerv-ui palette (DESIGN.md §2) where they differ.

## The canonical MAGI diagram (the iconic screen)

Layout on pure black (#000):
- **BALTHASAR·2** — large panel, TOP-CENTER, shaped like a home-plate / downward pentagon
  (flat top, straight sides, angled shoulders coming to a point at the bottom).
- **CASPER·3** — bottom-LEFT, a trapezoid whose right edge angles inward/up toward center.
- **MELCHIOR·1** — bottom-RIGHT, mirror of CASPER, left edge angles inward/up toward center.
- The three panels frame a central hub containing the word **"MAGI"** (heavy orange Mincho).
- **Thick ORANGE connector bars** join each panel to the central hub (a short bar from each).
- Unit labels are large white/bold sans, centered in each panel: "BALTHASAR · 2" etc.

## State colors (KEY — this is the animation language)

- **Idle / nominal**: panels filled a **muted steel-cyan** (~#5BB6C4, desaturated — NOT neon).
- **Deliberating**: a panel goes **empty/black** (hollow, only its outline), flickering between
  fill and empty as it "thinks." Units resolve independently (one at a time).
- **Approved / consensus**: panel fills **bright mint-green** (~#63E38C).
- **Dissent / conflict**: a disagreeing panel fills **deep blood-red / maroon** (~#7E1A1A) with
  its label still legible. (Seen: BALTHASAR red while CASPER + MELCHIOR are green.)

## HUD furniture (the "from the show" details)

Top-LEFT readout stack (all orange, mono/bold-sans, left-aligned):
- `CODE:473`  — large, the hero number of the stack (changes: 473 → 941 …)
- `FILE:MAGI_SYS`
- `EXT:STBY`  (changes to a number when active, e.g. `EXT:9138`)
- `EX_MODE:OFF`
- `PRIORITY:AAA`

Top corners — **heavy orange Mincho kanji pairs**, each sitting under a **green double-rule**
(two thin horizontal green lines):
- Top-left: `提訴` (teiso — "lawsuit/filing")
- Top-right: `決議` (ketsugi — "resolution/vote")
(Per nerv-ui rule "real institutional terms only" — use real, meaningful terms, sparingly.)

Right-side **status box** — a bordered rectangle whose kanji + color track the system state:
- `情報` (cyan border+text) = "information" / idle
- `審議中` (amber/gold border+text) = "under deliberation"
- `承認` (green border+text) = "approved"

Bottom **terminal strip** (thin, full-width, above the base):
- `access code: ••••••••••` (dim dots)
- `question:  <prompt text>` (orange label + input)

## Type (confirmed against the reference + the fontsinuse.com article)

- Kanji + "MAGI" + big display: **heavy compressed Mincho** (Matisse EB / JTC Win M9 in the
  show). Site uses Noto Serif JP @900 squished — correct.
- `CODE:/FILE:/EXT:` labels + unit names: **bold sans** (Helvetica/grotesque in the show).
- Everything mechanically compressed horizontally; sharp corners; hard color boundaries,
  no gradients.

## How we're adapting it for the portfolio

1. **MAGI NAVIGATION HUB** (new hero centerpiece): reuse the triangle diagram as the site's
   primary navigator. Three nodes = **PROJECTS / EXPERIENCE / SKILLS**, connected by orange
   bars to a central **KARAN** leaf node. Each node is a real link/button that smooth-scrolls
   to its section; hover lights it cyan + pulses its connector; shows an item count
   (e.g. "05 UNITS", "07 RECORDS", "38 MODULES"). Keep it tasteful, not full-screen aggressive.
   Uses destination names (not MELCHIOR/BALTHASAR/CASPER) to avoid colliding with the skills
   section, which keeps the three named cores.
2. **HUD furniture site-wide** (restrained): a corner-kanji + green-double-rule motif on major
   section headers; CODE:/FILE:/PRIORITY: readout stacks on key panels; the 情報→審議中→承認
   status-box treatment reused for section/system status; the cyan→green/red state colors as
   the shared "live" language. Restraint is the aesthetic — do NOT put furniture on every panel.

## ADDENDUM — real show frames (user-supplied screenshots, viewed 2026-07-05)

Six genuine NGE screengrabs. These extend/correct the recreation-based notes above.

1. **BATTLE STATIONS / CONDITION ONE (the real red-alert look).** The MAGI diagram
   flips to SOLID RED hexagons: large top hex reads `警報` (stamped, faded) + `第一種戦闘配置`
   (heavy Mincho) / `Battle Stations Conditions One` beneath. Three MAGI hexes below labeled
   `MAGI / Melchior 1`, `MAGI / Balthasar 2`, `MAGI / Casper 3`, each with a small
   `[MODE: Tactics]` tab. FLANKED by tall hexagon towers: `WARNING ▲ / ▼` and `警報 ALERT`
   panels sitting on YELLOW-AND-BLACK diagonal HAZARD STRIPES. → This is what emergency mode
   should aspire to. NOTE: the MAGI units are **HEXAGONS**, not trapezoids.
2. **Bordered label boxes (canonical NERV label chrome).** Orange text inside a thin
   rounded-rectangle outline with small notched end-caps, e.g. `NETWORK STATUS ANALYSIS`,
   `PSYCHOGRAPHIC DISPLAY / Phase 4 Link A`, `DANANG TYPE-B DEFENSE SCREEN`,
   `2ND EXTERNAL NETWORK - RIGHT`, `PROTECT NO. 666`. Use this for section/panel titles.
3. **Chevron data ladders.** Dense columns of `>>>`-style chevrons in phosphor GREEN (nominal)
   and RED (alert), tagged with codes like `MT-01353`, `A0133`, `01011`, `SYNC`. Great as
   background texture / loading fills. Hard-edged, mechanical, repeating.
4. **Corner-anchored HUD + axis rulers.** Labels pinned to all four corners; `+01..+12`
   vertical axis with CYAN tick marks; big counters like `TIME REMAINING TO COLLAPSE 223,229 sec`
   and `TIME SINCE SCREEN RAISED 000,009 sec`. Orange primary, cyan measurement ticks.
5. **Stacked red warnings.** `APPROACHING LIMITS` / `DANGER` as red text in red outline boxes.
   Katakana `ATフィールド` (AT FIELD). `EVA-01 PILOT: SHINJI IKARI / DATA ANALYZED BY CASPER`.
6. **Wireframe motifs.** Orange wireframe globe/sphere with coordinate triplets (`21:27-502`),
   hex-grid ground planes with glowing node markers, "TOWARDS GALACTIC CENTRE" annotations.

Design takeaways to apply:
- MAGI unit shape = **hexagon** (offer as an alternative to the current trapezoid nav nodes).
- Adopt the **bordered label box** as the standard section/panel title chrome.
- Rebuild **emergency mode** toward the real Condition-One screen: red hexes + `第一種戦闘配置`
  + `WARNING ▲▼` towers + yellow/black hazard stripes + `警報 ALERT`.
- Use **chevron ladders** + **corner axis rulers** + **countup/countdown counters** as
  authentic background/HUD texture (sparingly — restraint).
- Katakana `ATフィールド`, coordinate triplets, and `[MODE: ____]` tabs as flavor.

## Sources
- ⚠️ External link — [hirakujira/MAGI-System](https://github.com/hirakujira/MAGI-System) `demo.gif` — accessed 2026-07-05
- User-supplied NGE screengrabs (6), Desktop, viewed 2026-07-05
- ⚠️ External link — [Neon Genesis Evangelion typography (Fonts In Use)](https://fontsinuse.com/uses/28760/neon-genesis-evangelion) — accessed 2026-07-05
- ⚠️ External link — [TheGreatGildo/nerv-ui](https://github.com/TheGreatGildo/nerv-ui) — accessed 2026-07-05
