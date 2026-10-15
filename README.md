# skills

Skills for AI agents (Claude Code, Codex, Cursor, etc.).

## Install

All skills:

```bash
npx skills add mikeozornin/skills
```

One skill:

```bash
npx skills add mikeozornin/skills --skill mo-build-html-prototype
```

Add `-g` to install globally for all projects. Update with `npx skills update`.

## Skills

| Skill | What it does |
|---|---|
| [mo-build-html-prototype](skills/mo-build-html-prototype/SKILL.md) | A clickable HTML prototype of a UI flow in a single file: screen states, reviewer notes, a screen map and comments. Koobiq design system by default. [Example](examples/mo-build-html-prototype/ipad-prototype.html). |

## License

[CC BY-NC 4.0](LICENSE) © Mike Ozornin.

You may use, copy and adapt these skills with attribution and a link to this repository. You may not use them commercially: no selling them, no bundling them into paid products and no building commercial skills on top of them.

The fonts embedded in `examples/mo-build-html-prototype/ipad-prototype.html` (Martian Grotesk and Martian Mono by Evil Martians) are not covered by CC BY-NC: they are licensed under the [SIL Open Font License 1.1](examples/mo-build-html-prototype/FONTS-OFL.txt).
