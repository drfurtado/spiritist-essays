---
name: site-rendering
description: Build and preview the Kardec.ONE multilingual Quarto website. ALWAYS use this skill when asked to render, build, rebuild, or preview the site after making any changes.
---

# Objective
Correctly build and optionally preview the **Kardec.ONE** multilingual Quarto website located at `/Users/ovandef/webdev/github/kone`. This site uses [babelquarto](https://docs.ropensci.org/babelquarto/) to generate both English (`.html`) and Portuguese BR (`.pt.html`) pages from paired `.qmd` / `.pt.qmd` source files.

# Critical Rule — Never Use Plain `quarto render`
**NEVER run `quarto render` or `quarto render <file>` to build this project.**  
Plain Quarto does not process the multilingual layer and will silently skip all `.pt.qmd` sources, leaving the Portuguese pages stale or missing. Always use the BabelQuarto build command below.

# How to Build the Site

## Option 1 — VS Code task (preferred)
Instruct the user to press **`⌘ Shift B`** in VS Code. This runs the default build task "Render BabelQuarto Website".

## Option 2 — Run the task programmatically
Use the `run_task` tool with:
- `id`: `shell: Render BabelQuarto Website`
- `workspaceFolder`: `/Users/ovandef/webdev/github/kone`

## Option 3 — Terminal command
```sh
cd /Users/ovandef/webdev/github/kone
Rscript -e 'babelquarto::render_website()'
```

# How to Preview the Site
After a successful build, the site is in `_site/`. Start a local dev server with:
```sh
cd /Users/ovandef/webdev/github/kone
quarto preview
```
Or open `_site/index.html` directly in a browser — no server required.

> **Note:** `quarto preview`'s auto-reload only re-renders English pages on file save. After editing any `.pt.qmd` file always do a full BabelQuarto build before previewing.

# Build Output Structure
- English pages: `_site/<page>.html`
- Portuguese pages: `_site/<page>.pt.html`
- Posts: `_site/posts/<slug>/index.html` and `_site/posts/<slug>/index.pt.html`

# Language Switcher Maintenance
The navbar switcher is critical for the bilingual experience. Logic lives in `_babelquarto-fixes.html`. 

**Instructions for AI Assistants:**
- **NEVER** modify `_babelquarto-fixes.html` unless specifically fixing a language mapping bug.
- Avoid adding inline scripts to `.qmd` or `.html` files that might conflict with the switcher.
- Ensure all PT `.qmd` files have `lang: pt-BR` in the frontmatter; this is used by the JS logic to detect the current language.
- The switcher expects the `/pt/` folder structure. If the directory structure changes, the JS regex in `_babelquarto-fixes.html` MUST be updated simultaneously.
- If you add new navbar items to `_quarto.yml`, you **MUST** also add their Portuguese translations to the `translations` object in `_babelquarto-fixes.html`.

