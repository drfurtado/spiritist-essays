# The Spiritist Essays — Developer Notes

> © 2026 Ovande Furtado Jr. All rights reserved. See [LICENSE](LICENSE). The content of this repository is not licensed for reuse.

## Site Architecture

This is a **multilingual Quarto website** powered by [babelquarto](https://docs.ropensci.org/babelquarto/).  
English pages are authored in `.qmd` files; Portuguese (BR) translations live in the matching `.pt.qmd` files.  
The build outputs everything into `_site/`, including both `page.html` (EN) and `page.pt.html` (PT) variants.

---

## Building the Site

**Always use the BabelQuarto render task — never plain `quarto render`.**

Plain `quarto render` does not process the multilingual layer and will only generate English pages, skipping all `.pt.qmd` sources.

### Option 1 — Keyboard shortcut (VS Code)
Press **`⌘ Shift B`** — this runs the default build task "Render BabelQuarto Website".

## Deploying

One command builds both languages and publishes to GitHub Pages:

```sh
_scripts/deploy.sh
```

Or in VS Code: `Terminal → Run Task… → Deploy Website`.

The script does a clean babelquarto render, checks that the EN and PT home pages were built, and force-pushes `_site/` to the `gh-pages` branch. It does not commit your source changes, so commit and push `main` separately.

Live site: https://drfurtado.github.io/spiritist-essays/

---

### Editing Multilingual Content
Each language has its own source file (`about.qmd` / `about.pt.qmd`).  
To keep Portuguese in sync you can either edit both manually **or** use the built‑in DeepL helper script:

```sh
# translate English → Portuguese (update only changed paragraphs)
Rscript _scripts/translate.R about.qmd update

# or full translation
Rscript _scripts/translate.R about.qmd
```

(The script also works PT→EN by passing a `.pt.qmd` file.)

`update` mode requires this project to be a Git repository (`.git` present). If not, use full translation mode.

Remember to set `DEEPL_API_KEY` in your environment before running it.

### Option 2 — VS Code task menu
`Terminal → Run Task… → Render BabelQuarto Website`

### Option 3 — Terminal
```sh
Rscript -e 'babelquarto::render_website()'
```

---

## Previewing the Site

After building, start a local dev server with:

```sh
quarto preview
```

This serves the `_site/` folder and opens the site in your browser.

> **Note:** `quarto preview`'s auto-reload only re-renders English pages on save. After editing `.pt.qmd` files always do a full BabelQuarto build before previewing.

Alternatively, open `_site/index.html` directly in any browser — no server required.

---

## Typical Workflow

1. Edit `.qmd` and/or `.pt.qmd` source files.
2. Press **`⌘ Shift B`** (or run `Rscript -e 'babelquarto::render_website()'`) to rebuild.
3. Run `quarto preview` (or reload the browser if already running) to verify changes.

---

## Language Switcher

The switcher button in the navbar dynamically maps each English page to its Portuguese counterpart (`.html` → `.pt.html`) and vice versa. The logic lives in:

- [`_babelquarto-fixes.html`](_babelquarto-fixes.html) — injected on all pages via `include-after-body`
- [`_babelquarto-inject.html`](_babelquarto-inject.html) — fallback injection for listing/full-layout pages
