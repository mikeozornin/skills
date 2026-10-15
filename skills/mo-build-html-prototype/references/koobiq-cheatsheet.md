# Koobiq cheatsheet for `template.html`

Simulated Koobiq: real `--kbq-*` token names (`@koobiq/design-tokens` 3.20) on `.kbq-light` / `.kbq-dark`, and mini-components with the `k-` prefix. Markup below is what the template's CSS expects. Icons: `${icon('name')}`, list at the end.

Official docs: https://koobiq.io/llms.txt (index; open only the component page you need, e.g. https://koobiq.io/en/components/button/overview). If the `koobiq-implement-design` skill is installed, its `references/koobiq-ui-rules.md` has usage rules (when to use which control).

## Visual rules of thumb

- Font Inter 14/20; titles 20/28 semibold; code and URLs in JetBrains Mono (`.kbq-mono-normal`, `.k-input--mono`).
- Controls are 32px high with an 8px radius. Cards, modals and popovers have a 12px radius.
- One `k-btn--primary` per area (topbar or modal footer). Primary goes **first** in the footer (`Save`, `Cancel`).
- Status uses `k-badge`. Classification uses `k-tag`. Don't put colored text in tables.
- On a page form, errors appear twice: `k-alert--error` on top and `k-hint--error` under the field, with `is-error` on the input. In a side panel or modal, the field error alone is enough. Add a banner there only for errors not tied to a visible field.

## Tokens for custom CSS (section 5)

| Purpose | Tokens |
|---|---|
| Backgrounds | `--kbq-background-bg`, `-bg-secondary`, `-card`, `-contrast-fade`, `-contrast-less`, `-theme`, `-theme-fade`, `-theme-less`, `-error/-success/-warning(-fade/-less)`, `-overlay` |
| Text | `--kbq-foreground-contrast`, `-contrast-secondary`, `-contrast-tertiary`, `-theme`, `-error`, `-success`, `-warning`, `-on-contrast` |
| Icons | `--kbq-icon-contrast`, `-contrast-fade`, `-theme`, `-error`, `-success`, `-warning` |
| Lines | `--kbq-line-contrast-less`, `-contrast-fade`, `-theme-fade`, `-error` |
| States | `--kbq-states-background-transparent-hover/-active`, `-disabled`, `--kbq-states-line-focus` |
| Shadows | `--kbq-shadow-card`, `-popup`, `-overlay` |
| Text classes | `.kbq-text-normal/-big/-compact`, `.kbq-subheading`, `.kbq-title`, `.kbq-headline`, `.kbq-caps-normal`, `.kbq-mono-normal`, `.kbq-secondary`, `.kbq-tertiary`, `.kbq-error/-success/-warning/-theme`, `.kbq-medium`, `.kbq-semibold` |

## Layout

```html
<div class="app-body">${navbar('Rules')}
  <div class="app-main">
    <div class="k-topbar k-topbar--line">
      <div class="k-topbar__pre">                       <!-- optional breadcrumbs above the title -->
        <div class="k-breadcrumbs"><a data-act="goto" data-goto="list/data">Rules</a>${icon('chevron-right')}<span class="is-current">New</span></div>
        <div class="k-topbar__title">New rule</div>
      </div>
      <div class="k-topbar__actions">
        <div class="k-input-wrap w-240">${icon('search')}<input class="k-input" placeholder="Search"></div>
        <button class="k-btn k-btn--primary">${icon('plus')}Create</button>
      </div>
    </div>
    <div class="app-content" data-scroll="main">…</div>  <!-- .app-content--flush = no padding -->
  </div>
  <aside class="app-aside">…</aside>                     <!-- optional right column, 320px -->
</div>
```

- Navbar: `<nav class="k-navbar">` containing `k-navbar__brand` (`<span class="k-logo">`), `<a class="k-navbar__item is-selected">${icon}<span>…</span></a>` and `k-navbar__spacer`.
  - Variants: `k-navbar--collapsed` (icons only) and `k-navbar--horizontal`.
- Utilities:
  - Flex and grid: `row`, `row--wrap`, `row--top`, `col`, `grid-2`, `grid-3`, `gap-4/16/24`.
  - Spacing: `mt-4/8/16/24`, `mb-8/16/24`.
  - Widths: `w-160/240/320/480/640/full`.
  - Other: `k-spacer` (flex:1), `k-nowrap`, `hidden`.

## Buttons

```html
<button class="k-btn k-btn--primary">${icon('plus')}Create</button>   <!-- theme filled -->
<button class="k-btn">Cancel</button>                                  <!-- contrast-fade (secondary) -->
<button class="k-btn k-btn--contrast">…</button>  <button class="k-btn k-btn--outline">…</button>
<button class="k-btn k-btn--outline-theme">…</button>  <button class="k-btn k-btn--transparent">…</button>
<button class="k-btn k-btn--error">Delete</button>  <button class="k-btn k-btn--error-fade">Delete</button>
<button class="k-btn k-btn--theme-fade">…</button>  <button class="k-btn k-btn--compact">…</button>  <!-- 24px -->
<button class="k-btn k-btn--primary" disabled>…</button>   <!-- disabled with a reason → wrap in tip(), see below -->
<span class="k-split"><button class="k-btn k-btn--primary">Run</button><button class="k-btn k-btn--primary">${icon('chevron-down')}</button></span>
<button class="k-icon-btn">${icon('more-horizontal')}</button>   <!-- +k-icon-btn--compact/--fade/--contrast, .is-active -->
<span class="k-link">Link</span> <span class="k-link k-link--contrast k-link--plain">Name</span> <span class="k-pseudo">Pseudo link</span>
```

A disabled button must explain why. `disabled` turns off mouse events on the button itself, so a `title` or your own tooltip will not show. Wrap it in `tip()` instead. The tooltip appears on hover and on keyboard focus:

```js
${noPerm
  ? tip(`<button class="k-btn k-btn--primary" disabled>${icon('plus')}Create</button>`, 'No permission to create. Contact your administrator', 'k-float--right')
  : `<button class="k-btn k-btn--primary" data-act="create">${icon('plus')}Create</button>`}
// position is a starting point: 'k-float--top' (default), 'k-float--right' (right-aligned), 'k-float--center', '' (below).
// On hover the runtime flips it up/down and to the edge so it stays inside the frame.
```

## Form controls

```html
<div class="k-field">                                   <!-- k-field--row: label left -->
  <label class="k-label">Name <span class="req">*</span></label>
  <input class="k-input is-error" placeholder="…" data-model="name" value="${esc(S.name)}">
  <div class="k-hint k-hint--error">Required field</div>   <!-- k-hint = neutral help -->
</div>
<textarea class="k-input k-input--mono" rows="4"></textarea>
<div class="k-input-wrap">${icon('search')}<input class="k-input" placeholder="Search" data-model="q" data-live value="${esc(S.q)}"></div>
<button class="k-select k-select--tags"><span class="k-tag k-tag--theme">T1110<span class="k-tag__x">${icon('x')}</span></span><span class="k-select__value is-placeholder">Add…</span>${icon('chevron-down')}</button>
<label class="k-checkbox is-checked"><span class="k-checkbox__box"></span><span>Create an incident<span class="k-check-sub">Caption</span></span></label>
<!-- checkbox states: is-checked / is-indeterminate / is-disabled -->
<label class="k-radio is-checked"><span class="k-radio__dot"></span>Correlation</label>
<div class="k-check-group k-check-group--row">…radios/checkboxes…</div>
<label class="k-toggle is-checked"><span class="k-toggle__track"></span>Enabled</label>
<div class="k-segment"><button class="is-active">Day</button><button>Week</button></div>
```

The controls are visual only. Toggle `is-checked` from `ACTIONS` and keep the value in `S`.

**Select that opens.** Use the built-in `menu` and `set` acts, with no `ACTIONS` needed. The menu closes on Esc, on an outside click and on any other action:

```js
<div class="k-field"><label class="k-label">Severity</label><span class="k-anchor k-anchor--block">
  <button class="k-select ${S.menu === 'severity' ? 'is-open' : ''}" data-act="menu" data-menu="severity"><span class="k-select__value">${SEVERITY[S.severity]}</span>${icon('chevron-down')}</button>
  ${S.menu === 'severity' ? `<div class="k-dropdown k-float">${Object.entries(SEVERITY).map(([id, title]) =>
    `<div class="k-dropdown__item ${S.severity === id ? 'is-selected' : ''}" data-act="set" data-field="severity" data-value="${id}">${title}</div>`).join('')}</div>` : ''}
</span></div>
```

**Live search or filter.** `data-model="q" data-live` re-renders on every keystroke, and focus and caret stay in the field. Filter with the runtime helper, which ignores case and diacritics, ANDs the words and supports "quoted phrases": `RULES.filter(r => matches(S.q, r.name, r.sub, r.tags))`. Show an empty state when nothing matches.

If the result has its own states (found / nothing found), use `data-live="search"`. It calls `ACTIONS.search` after each input, which keeps the state button in sync. The example below adds a clear button and the seeds for direct open:

```js
<div class="k-input-wrap w-320">${icon('search')}<input class="k-input" placeholder="Search by name and tags" data-model="q" data-live="search" value="${esc(S.q)}">${S.q ? `<button class="k-icon-btn k-icon-btn--compact" data-act="search-clear">${icon('x')}</button>` : ''}</div>
// ACTIONS
'search':       () => goto('list', !S.q.trim() ? 'data' : RULES.some(r => matches(S.q, r.name, r.tags)) ? 'found' : 'none'),
'search-clear': () => goto('list', 'data', { q: '', focus: 'q' }),
// STEPS: { id: 'found', title: 'Search: found', seed: { q: 'rdp' } }, { id: 'none', title: 'Search: empty', seed: { q: 'kerberos' } }
```

**Focus after validation.** `goto('form', 'errors', { focus: 'name' })` moves focus to `[data-model="name"]` once.

## Badges, tags, status

```html
<span class="k-badge">Low</span>  <span class="k-badge k-badge--error">High</span>
<!-- --theme / --success / --warning / --error; --solid (filled), --outline, --compact -->
<span class="k-badge k-badge--success"><i class="k-badge__dot"></i>Active</span>
<span class="k-tags"><span class="k-tag k-tag--plain">RDP</span><span class="k-tag k-tag--theme">T1110</span></span>
<span class="k-kbd">⌘K</span>  <span class="k-avatar">AJ</span>
<div class="k-progress"><i style="--v:60%"></i></div>   <!-- --error / --success -->
<span class="k-spinner"></span> <span class="k-spinner k-spinner--big"></span>
<span class="k-skeleton" style="width:240px"></span>
```

## Tabs, filters, lists, trees

```html
<div class="k-tabs"><button class="k-tab is-active">All <span class="k-badge k-badge--compact">5</span></button><button class="k-tab">Drafts</button></div>
<!-- k-tabs--line = underline style -->
<div class="k-filter-bar"><span class="k-filter k-filter--active"><b>Status:</b> On ${icon('chevron-down')}</span><span class="k-filter">Author ${icon('chevron-down')}</span></div>
<div class="k-list"><div class="k-list__caption">Recent</div><div class="k-list__item is-selected">${icon('file')}Report</div></div>
<div class="k-tree">
  <div class="k-tree__node is-open" style="--lvl:0"><span class="k-tree__toggle">${icon('chevron-right')}</span>${icon('folder', 'k-tree__icon')}Windows</div>
  <div class="k-tree__node is-leaf is-selected" style="--lvl:1"><span class="k-tree__toggle"></span>Authentication</div>
</div>
<div class="k-accordion is-open"><div class="k-accordion__head">${icon('chevron-right')}Details</div><div class="k-accordion__body">…</div></div>
```

## Table

```html
<table class="k-table">                <!-- k-table--compact, k-table--sticky (sticky thead) -->
  <thead><tr>
    <th class="k-cell-check"><span class="k-checkbox is-indeterminate" data-act="select-all"><span class="k-checkbox__box"></span></span></th>
    <th>Name</th><th class="is-sorted">Modified${icon('chevron-down')}</th><th></th>
  </tr></thead>
  <tbody><tr class="is-clickable is-selected" data-act="select-row" data-id="1">
    <td class="k-cell-check"><span class="k-checkbox is-checked"><span class="k-checkbox__box"></span></span></td>
    <td><span class="k-link k-link--contrast k-link--plain">Brute force: RDP</span><span class="k-cell-sub">Windows · Authentication</span></td>
    <td class="kbq-secondary k-nowrap">Yesterday</td>
    <td class="k-cell-actions"><button class="k-icon-btn">${icon('more-horizontal')}</button></td>
  </tr></tbody>
</table>
```

## Floating layers

Anchored dropdowns, popovers and tooltips: wrap the trigger in `.k-anchor` (`--block` for full width; a dropdown inside it stretches to the trigger) and place the layer with `k-float` (`--right`, `--top`, `--center`). Open/closed lives in `S.menu`. Use `data-act="menu" data-menu="id"` to toggle, which closes on Esc, outside click, any other action or a dropdown item. Clicks inside a `k-popover` keep it open, and `data-act="close"` closes it explicitly.

```html
<span class="k-anchor">
  <button class="k-icon-btn ${S.menu === 'row-1' ? 'is-active' : ''}" data-act="menu" data-menu="row-1">${icon('more-horizontal')}</button>
  ${S.menu === 'row-1' ? `<div class="k-dropdown k-float k-float--right">          <!-- k-dropdown--wide -->
    <div class="k-dropdown__search"><input class="k-input" placeholder="Search"></div>
    <div class="k-dropdown__caption">Actions</div>
    <div class="k-dropdown__item is-selected">${icon('edit')}Edit<span class="k-dropdown__hint">⌘E</span></div>
    <div class="k-dropdown__divider"></div>
    <div class="k-dropdown__item is-danger" data-act="delete" data-id="1">${icon('trash')}Delete</div>
  </div>` : ''}
</span>
<div class="k-popover k-float"><div class="k-popover__header"><h3>Title</h3><button class="k-icon-btn">${icon('x')}</button></div><div class="k-popover__body">…</div><div class="k-popover__footer"><button class="k-btn k-btn--primary">OK</button></div></div>
<!-- k-popover--compact (200) / --wide (640) -->
${tip('<span class="k-badge">Draft</span>', 'The rule does not check events')}   <!-- hover/focus tooltip; static: <div class="k-tooltip k-float k-float--top">…</div> (--fade, --error) -->
```

## Overlays (inside `.app`, they cover only the app)

An overlay is drawn over the screen it covers, in the same view: `form/confirm` renders the form plus the modal. While an overlay is open, only the markers of the **top** overlay show, so put the modal's markers inside it.
- The top overlay is the last `.k-overlay` in the DOM. For a modal over a side panel, render the modal after the panel (or inside it).
- In a scrolling `k-modal__body` / `k-sidepanel__body`, a marker defaults to the element's top-right corner (`--y:10px`) so the scroll doesn't clip it.

```html
<div class="k-overlay"><div class="k-modal k-modal--small">      <!-- 400 / default 640 / --large 960 -->
  <div class="k-modal__header">Save the rule?<button class="k-icon-btn k-modal__close" data-act="goto" data-goto="form/new">${icon('x')}</button></div>
  <div class="k-modal__body"><p>Text.</p></div>
  <div class="k-modal__footer"><button class="k-btn k-btn--primary">Save</button><button class="k-btn">Cancel</button></div>
</div></div>
<div class="k-overlay k-overlay--panel"><div class="k-sidepanel">   <!-- --small 400 / default 640 / --large 960 -->
  <div class="k-sidepanel__header">Details<span class="k-spacer"></span><button class="k-icon-btn" data-act="goto" data-goto="list/data">${icon('x')}</button></div>
  <div class="k-sidepanel__body">…</div>
  <div class="k-sidepanel__footer"><button class="k-btn k-btn--primary">Apply</button></div>
</div></div>
<div class="k-loader"><span class="k-spinner k-spinner--big"></span><span class="k-loader__text">Loading…</span></div>
```

Toasts come from the runtime: `toast('Rule saved', { kind: 'success' | 'error' | 'warning' | 'theme', text: '…' })`.

## Messages, empty states, content blocks

```html
<div class="k-alert k-alert--error">${icon('alert-circle')}<div class="k-alert__body"><div class="k-alert__title">Title</div><div>Text</div></div></div>
<!-- --theme / --success / --warning / --error, --compact; actions: <div class="k-alert__actions">…</div> -->
<div class="k-empty k-empty--big">${icon('shield', 'ic--40')}<div class="k-empty__title">No rules yet</div><div class="k-empty__text">…</div><div class="k-empty__actions"><button class="k-btn k-btn--primary">Create</button></div></div>
<div class="k-card k-card--shadow"><div class="k-card__title">Source</div>…</div>
<dl class="k-dl"><dt>Author</dt><dd>Alex Johnson</dd></dl>   <!-- k-dl--vertical -->
<pre class="k-code">event.type == "auth_failure"</pre>
<hr class="k-divider">  <span class="k-divider k-divider--vertical"></span>
```

## Markers

`${marker(N)}` goes inside an element that has `class="changed" data-anchor="note-N"`. By default the marker sits at the top-right corner. Shift it with CSS variables: `marker(4, '--x:100%;--y:50%')`, or `--x:0` for the left edge. For inline text, use `<i class="marker marker--inline" data-note="N">N</i>`. Don't place markers on elements with `overflow:hidden`, because they get clipped; anchor a parent instead.

## Icons

`chevron-down chevron-up chevron-right chevron-left check x plus minus search filter sliders settings more-horizontal more-vertical trash edit copy info help-circle alert-triangle alert-circle check-circle x-circle arrow-left arrow-right external-link link play pause refresh download upload bell user users folder file lock eye calendar clock star tag home list grid columns shield activity database server zap mail sun moon message drag map`

Sizes: `ic--24/32/40`. Colors: `ic--fade/theme/error/success/warning`. To add an icon, put a Feather-style `<symbol id="i-name" viewBox="0 0 24 24">` into the sprite at the top of `<body>`.
