# AGENTS.md

Mike Ozornin's skills for AI agents (Claude Code, Codex, Cursor, etc.). Installed with [`npx skills`](https://github.com/vercel-labs/skills).

## Layout

```
skills/
  mo-<skill-name>/
    SKILL.md        # required, frontmatter with name and description
    references/     # optional
    scripts/        # optional
    assets/         # optional
examples/
  mo-<skill-name>/  # optional examples, not installed with the skill
```

## Rules

- **Every skill in this repo has the `mo-` prefix**, both in its folder name (`skills/mo-build-html-prototype/`) and in the `name` field of its `SKILL.md` frontmatter (`name: mo-build-html-prototype`). The folder and `name` match.
- The prefix keeps these skills from clashing with same-named skills from other sources.
- Each skill is self-contained: everything its `SKILL.md` refers to lives in its folder, with relative paths.
- Examples go to `examples/<skill-name>/` at the repo root, never inside the skill folder: everything in `skills/<skill-name>/` is installed by `npx skills`.
- Add each new skill to the table in `README.md`.
- Check that the CLI sees a skill: `npx skills add ./ --list`.
- The repo is licensed under CC BY-NC 4.0 (`LICENSE`). Don't add third-party code or text under an incompatible license.
