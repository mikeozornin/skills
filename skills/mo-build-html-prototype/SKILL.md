---
name: mo-build-html-prototype
description: Use when the user asks for an interactive or clickable HTML prototype, mockup, or walkthrough of a product UI flow, screen states, or a feature for reviewers (designers, product managers, developers) — "prototype", "clickable mockup", "show the screen states".
metadata:
  category: design
  tags: [prototype, ui-flow, mockup]
  platforms: [cursor, claude-code, windsurf, kilo-code, codex]
  author: mozornin
---

# Build HTML Prototype

Build every prototype in `assets/template.html` (in this skill's directory): one self-contained HTML file. The template already has the whole shell: header, browser frame, state switcher, notes panel, screen map, reviewer comments, Koobiq tokens with `k-*` components, and the runtime. The shell UI is in English or Russian, picked from the OS/browser language; the prototype's own copy is whatever you write. You write only the PROTOTYPE block (JS) and section `5. PROTOTYPE STYLES` (CSS). Don't break the template: never rebuild, restyle or describe the shell.

## Design before code

A prototype is a tool for one decision, not a gallery of screens. Work through these steps before writing `prototype.js`.

1. **Gather context.** Who the user is (role, expertise), what job they are doing, what triggers it and what "done" looks like for them. If the product exists (repo, screenshots, Figma, docs, an earlier prototype), take its navigation, terms, entities and data from there and design only the change. Don't invent a product around the feature.
2. **Name the question.** One sentence, or several only for a large prototype: what reviewers must decide, or what is most doubtful in the UI (will users find X, understand Y, does Z hold with real data). For each question, note what a reviewer must see to answer it and which state or data could break the design. If the request names no question, take the riskiest decision as one and put it to the author in step 4.
3. **Write the scenario** in the user's words, from trigger to result: "analyst sees a spike → opens the rule → lowers the threshold → sees how many incidents there will be". Then add only the branches the question needs: cancel, validation error, empty or first use, and the hard cases where requirements nobody saw before surface: no permission, a conflict with another object, a limit, a lot of data, an action the object's current state forbids. Steps become `STEPS`, branches become states, and cross-cutting conditions (role, feature flag, data volume) become `SWITCHES`.
4. **Agree with the author** before building. In one short message, send:
   - the question;
   - the scenario with the branches and hard cases you plan to show;
   - everything you guessed rather than took from the request or the product, as a numbered list with one statement per item, so the author can answer by number: "2 — no, a manager's approval is needed".

   Wait for the answer. Skip this step for small edits to an existing prototype. If the author asked not to be asked, build on your guesses and list them in the reply.
5. **Set the depth** of each step × state cell:
   - **full** = on the question's path: clickable, every state, stress data;
   - **plausible** = context: static but realistic;
   - **out** = named in the reply as not covered.

   Use only the states the question needs: ideal, empty or first use, partial, error, no permission, about 6 per step at most. Add loading only when it shows something specific (a long operation, progress, partial results). A failed load is rarely worth a state, but "not allowed in this object's state" usually is. Never fake an outcome that isn't designed.
6. **Design each screen in words first:** its purpose in one phrase, the one primary action, and what the user needs to see to decide here, ordered by importance. Then build it from standard Koobiq patterns (table, form, side panel, modal, empty state). Put novelty only where the question is; everything else looks like the product's usual screens.
   - Every action has a visible outcome: what happened and where the object is now.
   - A destructive action names the object and the consequence. Buttons usually say the verb.
   - An error says how to fix it and keeps the input.
   - One name per thing across screens, breadcrumbs, toasts and the URL. UI copy is in the user's language and follows `ux-write` if it is installed.
7. **Write the data before the views.** Use realistic domain data that stresses the layout: one long name, a 0 / 1 / many count, a rare status. Use fixed dates and values (no `Date.now()` / `Math.random()`) and no lorem ipsum.

**Variants**, only when the question is "which solution". Build 2–3 (max 5) in `VARIANTS` instead of choosing for reviewers.
- They differ in structure (layout, hierarchy, primary action), not in color or copy. If two drafts look alike, redo one with an explicit ban ("no card grid").
- Variants may share data, never layout.
- Give each a `title` and a one-line idea in `text`.
- The best feedback is "header from B, list from C".

## Done when

Check the prototype against each item before replying:

- **Every shown path runs from start to end.** It starts where the user meets the trigger, not at a login or a dashboard. Every shown branch ends, back on the path or at a result. A hand-off to another product or system is a stub with a visible outcome (a toast, or a state like "Task created in Jira"), never a copy of the other UI. A secondary control may do nothing (a menu item can just `close`) as long as no scenario starts from it.
- **What's debatable is marked.** Every changed or debatable element has a note. When the question is which solution to take, there are 2–3 variants that differ in structure.
- **Nothing extra.** Every state, switch and note either helps answer the question or tests a guess about a requirement. Remove the rest.

## Build

1. **Get the editable parts.** With `SKILL_DIR` = this skill's directory, `A=$SKILL_DIR/scripts/assemble.mjs` (run with `node`, no dependencies), work dir e.g. `/tmp/proto-<name>/`:
   - new prototype: `node $A --split $SKILL_DIR/assets/template.html /tmp/proto-<name>`;
   - change an existing one: `node $A --split <file>.html /tmp/proto-<name>`. Re-assembling also upgrades its shell.

   This gives `prototype.js` (demo PROTOTYPE block) and `prototype.css` (section 5).
2. **Rewrite `prototype.js`**, replacing all demo content: `PROTO`, `STEPS`, `SWITCHES`, `S`, `NOTES`, `LINKS` (usually `[]`), data, `VIEWS`, `ACTIONS`. Custom CSS goes to `prototype.css`. Work in passes:
   1. the main path, clickable end to end, in its ideal state;
   2. the other states and branches;
   3. notes;
   4. Verify and Done when.

   Don't polish a screen before the path through it works.
3. **Assemble:** `node $A <target>.html /tmp/proto-<name>/prototype.js /tmp/proto-<name>/prototype.css`. It checks syntax and the required declarations. Deliver only the HTML.
4. **Views:** one `VIEWS[step](S)` per step that returns an HTML string and branches on `S.state` / `S.sw`. Build from `k-*` classes; see `references/koobiq-cheatsheet.md`.
   - **Every state renders fully when opened directly.** A direct open (popover, hash link, map thumbnail, note, ←/→, `protoCheck`) starts from the initial `S` plus the state's `seed`, for example `{ id: 'confirm', title: 'Confirmation', seed: { name: 'Brute force: RDP' } }`. An in-flow `goto()` keeps what the user typed. VIEWS read only `S` and constant data.
   - **Overlays.** A modal or side panel is drawn over the screen it covers, inside the same view. A one-off overlay (a confirm) is a state of that step (`form/confirm`). An overlay with its own sub-flow (form → error → confirm) can be its own step that draws the covered screen underneath. For a modal over a panel, render the modal after the panel: the last `.k-overlay` is the top one, and only its markers show.
   - Wire clicks with `data-act` → `ACTIONS`. Change screens only via `goto(step, state)` / `data-goto`, so the state button, URL bar and hash stay in sync.
5. **Notes (3–7)** go only on the elements the question is about: changed or debatable ones.
   - Put `class="changed" data-anchor="note-N"` on the element and `${marker(N)}` inside it. Wrap void or disabled elements in `<span class="k-anchor changed" data-anchor="note-N">`.
   - Note `text` says what changed and why in 1–2 sentences. For a hypothesis, end it with "Check: …".
   - `try` says what to click to see it.
6. **Screen map** builds itself from the states and transitions. Transitions come from each state's markup: `data-goto`, and literal `goto()` / `openState()` calls in the `ACTIONS` that its enabled controls, menu items and top overlay call (disabled controls give no arrow). A state computed in the same action works if its possible ids appear there as strings: `goto('list', S.q ? 'empty' : 'data')`. A transition behind a helper function, a timer or an event the user doesn't click goes to `LINKS`: `{ from: 'report/building', to: 'report/ready', label: 'Report ready' }`.
7. **Verify** (see Verification). Fix and re-assemble until `protoCheck()` is clean, then check the prototype against Done when.
8. **Reply** with the file path, the step × state table, what is deliberately not covered and any guess made after the agreement. Don't describe the shell.

## Reviewer comments

The user may paste the Markdown from "Copy all". It names the file on the `File:` line. Each `##` is a screen with its hash (`#step/state?switches`); with variants it starts with `Variant B · Cards →` and the hash has `variant=<id>`. The shell writes it in the reviewer's UI language, so it may be Russian instead: `Файл:`, `Вариант B`. Each `###` is an element with its selector inside `#view`, its `data-*` attributes and the linked note number, followed by the comment as a quote.

To apply it, find the element in `VIEWS[step]` / `ACTIONS` of that file (of that variant), then edit through `--split` and re-assemble into the same file: comments live in the browser's localStorage under the file path.

## Shell rules

- **Header = short title only.** No subtitle, caption, legend or "prototype of the flow…" text anywhere above the frame.
- **One state control:** the "Step · State" popover. No prev/next steppers, per-screen segmented controls, tabs over the frame or custom hotkeys (←/→, Esc and the variant picker with 1–9 are built in).
- **Notes live only in `aside#notes`, outside `.browser`.** Inside `.app` there are only numbered markers. Never put note text in `::after` tooltips, overlays or a "review mode" column inside the app.
- **Don't edit RUNTIME**, and don't move or restyle the deck, stage, browser, notes, comments or screen map. Behavior goes in `ACTIONS`.
- **Koobiq by default:** `k-*` classes and `--kbq-*` tokens. No hex/rgb colors, no invented palette (`--bg`, purple accents) and no light-only styling, because the theme toggle must work. For another design system, keep the shell and restyle only the app.
- One file, no external JS.

## PROTOTYPE API

| What | How |
|---|---|
| Title / URL bar | `PROTO.title`, `PROTO.url(S)` |
| Popover grid | `STEPS[{id,title,states[{id,title,seed?}]}]`, `SWITCHES[{id,title,options}]` |
| State | `S.step`, `S.state`, `S.sw[id]`, `S.menu` (open menu id), plus your own fields |
| Navigate | `goto(step, state, patch?)` inside the flow (keeps `S`); markup `data-act="goto" data-goto="form/errors"`. `openState(step, state)` = direct open (initial `S` + `seed`) |
| Actions | `data-act="name"` → `ACTIONS.name(el, e)`; re-renders unless it returns `false` |
| Built-in acts | `goto`; `close` (`S.menu = null`); `menu` + `data-menu="id"` (toggle); `set` + `data-field` + `data-value` (write to `S`, close menu). A menu also closes on Esc, outside click and any other action |
| Inputs | `data-model="field"` writes `S.field`; `data-live` re-renders on input (focus and caret are kept); `data-live="act"` first calls `ACTIONS.act`; `data-scroll="key"` keeps scroll |
| Focus | `goto('form', 'errors', { focus: 'name' })` focuses `[data-model="name"]` once |
| Helpers | `icon('search')`, `marker(n, '--x:100%;--y:50%')`, `tip(html, text, 'k-float--right')`, `matches(S.q, ...fields)`, `toast(title, {kind, text})`, `esc(str)` |
| Notes | `NOTES[{id, step, state, title, text(html), try}]`: `step`/`state` say where the anchor lives |
| Screen map | Built automatically; `LINKS[{from: 'step/state', to: 'step/state', label}]` adds transitions the scan can't see |
| Variants | `VARIANTS[{id, title, text, STEPS?, NOTES?, VIEWS?, ACTIONS?, LINKS?, S?, url?}]`. The global declarations are variant A; a variant overrides only what differs (`S` is merged over the global `S`). Each has its own screen map, notes and comments; `SWITCHES` and back/forward are shared. Picker in the header, keys 1–9 |

## Verification

Serve the folder in the background (`file://` is often blocked) and open the printed URL plus `<file>.html` in the browser tool. Reload after each re-assemble, because a hash-only change doesn't reload the file.

```bash
cd <dir> && node -e "const fs=require('fs'),T={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};require('http').createServer((q,r)=>{const p='.'+decodeURIComponent(new URL(q.url,'http://x').pathname);fs.readFile(p,(e,d)=>{r.writeHead(e?404:200,{'Content-Type':T[require('path').extname(p)]||'application/octet-stream'});r.end(e?'Not found':d)})}).listen(0,'127.0.0.1',function(){console.log('http://127.0.0.1:'+this.address().port+'/')})"
```

1. **Run `protoCheck()`** in the page (console or the browser tool's evaluate) at a window width of 1440 or more. It must return `ok: true`. It opens every step × state × switch combination in both themes and reports render errors, empty screens, overflow, broken markers or notes, unknown `data-act` / `data-goto` / `goto()` / `LINKS` targets, hardcoded colors and template leftovers. Fix each warning (identical states, switches with no effect, nondeterministic data, notes outside 3–7, a step not connected to others) or explain it in the reply.
2. **Look at it** in light and dark: each screen reads as a real product; clicking through keeps the state button in sync; markers ↔ notes highlight each other; the screen map shows every expected transition; menus, tooltips and modals behave.

## Common mistakes

| Mistake | Fix |
|---|---|
| `title` or own tooltip on a disabled button (never shows) | `tip(disabledButton, reason)` |
| `S.state.startsWith('invite')` also catches `invited` | Compare exact ids: `['invite', 'invite-error'].includes(S.state)` |
| Hand-rolled dropdown state that never closes | `data-act="menu"` / `set` |
| Document-level listeners to sync the state with input | `data-live="act"` → `ACTIONS.act` calls `goto()` |
| Template copied by line numbers | `assemble.mjs --split` → edit → assemble |
