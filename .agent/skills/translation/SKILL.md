---
name: translation_workflow
description: >
  Translate .qmd articles between English and Portuguese using babeldown + DeepL,
  fix markdown formatting, and rebuild the site. Use this skill whenever the user
  asks to translate an article, post, or page — in either direction (EN→PT or PT→EN).
  Also handles updating an existing translation when the source has changed.
---

# Translation Workflow — Kardec.ONE

This project is bilingual (English primary, Portuguese secondary). Translations are
driven by the **babeldown** R package and the DeepL API, via a helper script at
`_scripts/translate.R`. All translation tasks follow the steps below.

---

## Project Conventions

| File | Language |
|------|----------|
| `posts/<slug>/index.qmd` | English (primary) |
| `posts/<slug>/index.pt.qmd` | Portuguese (secondary) |
| `about.qmd`, `ethics.qmd`, etc. | English (primary) |
| `about.pt.qmd`, `ethics.pt.qmd`, etc. | Portuguese (secondary) |

- PT files **must** have `lang: pt-BR` in their YAML frontmatter.
- EN files must **not** have a `lang:` key (it is set globally in `_quarto.yml`).
- Do not translate YAML keys — only YAML values that are visible to readers
  (title, subtitle, description, category names, field-display-names).

---

## Step 1 — Confirm what to translate and in which direction

Ask the user (or infer from context):
- **Which file?** (e.g. `posts/the-perispirit/index.qmd`)
- **Direction?** EN→PT or PT→EN
- **Full translate or update?** Use *full* for a new translation; use *update* if
  the source has been revised and the translation already exists.

---

## Step 2 — Run the translation script

Execute the helper R script from the project root (`/Users/ovandef/webdev/github/kone`):

```bash
# EN → PT (new translation or first time)
Rscript _scripts/translate.R posts/<slug>/index.qmd

# PT → EN (writing in Portuguese first)
Rscript _scripts/translate.R posts/<slug>/index.pt.qmd

# Update only changed paragraphs (source was revised after initial translation)
Rscript _scripts/translate.R posts/<slug>/index.qmd update
Rscript _scripts/translate.R posts/<slug>/index.pt.qmd update
```

The script:
1. Auto-detects direction from the file extension (`.pt.qmd` = PT source, `.qmd` = EN source).
2. Calls `deepl_translate()` or `deepl_update()` as appropriate.
3. **Automatically applies all markdown formatting fixes** (see §4 below).
4. Prints the output path and confirms completion.

> **Requires:** the `babeldown` R package and `DEEPL_API_KEY` set as an environment
> variable (add `DEEPL_API_KEY=your-key` to `~/.Renviron` so it is always available).

---

## Step 3 — Check the YAML frontmatter of the output file

After the script runs, open the output file and verify:

**If the output is a `.pt.qmd` file**, it must have `lang: pt-BR`:
```yaml
lang: pt-BR
```

**If the output is a `.qmd` file** (translated from PT), it must NOT have `lang:`.
Remove it if DeepL/babeldown left it in.

Also verify that the `bibliography` and `csl` paths are correct relative to the
output file location (they should not have been translated).

---

## Step 4 — Manual verification of markdown formatting

Even though the script auto-fixes common issues, run a quick visual scan for any
remaining broken patterns:

```bash
grep -n "\*\*\*\|\*\*[^ ].*[^ ]\*[^*]" posts/<slug>/index.pt.qmd | head -20
```

Known DeepL markdown bugs and their fixes:

| Bug | Example | Fix |
|-----|---------|-----|
| Missing leading `*` for bold | `*word**` | `**word**` |
| Missing trailing `*` for bold | `**word*` | `**word**` |
| Trailing space inside italics | `*word *` | `*word*` |
| Leading space inside italics | `* word*` | `*word*` |
| Trailing space inside bold | `**word **` | `**word**` |
| Leading space inside bold | `** word**` | `**word**` |
| Triple asterisk | `***word**` | `**word**` |

Fix any remaining issues using the Edit tool before proceeding.

---

## Step 5 — Render the site

**NEVER use `quarto render`.** This project requires `babelquarto` to process both languages.

From the project root:

```bash
Rscript -e 'babelquarto::render_website()'
```

Wait for the build to finish. Check the terminal for citation warnings (undefined BibTeX keys) or rendering errors.


---

## Step 6 — Verify the output in the browser

After rendering, confirm:
- The translated page appears in the correct listing (`/` for EN, `/pt/` for PT).
- The **language switcher button** in the navbar links correctly to the counterpart page.
- Bold, italics, and block quotes render correctly.
- Citations appear in the References section.

---

## Quick Reference

| Task | Command |
|------|---------|
| New EN→PT translation | `Rscript _scripts/translate.R posts/<slug>/index.qmd` |
| New PT→EN translation | `Rscript _scripts/translate.R posts/<slug>/index.pt.qmd` |
| Update after source edit | `Rscript _scripts/translate.R <source-file> update` |
| Render whole site | `Rscript -e 'babelquarto::render_website()'` |


---

## When NOT to use `deepl_translate()` vs `deepl_update()`

- **`deepl_translate()` (full):** The translation does not exist yet, OR the source
  has changed so substantially that a fresh translation is better.
- **`deepl_update()` (update):** The translation already exists and the source has
  minor edits. This is cheaper (fewer DeepL API characters used) and preserves any
  manual corrections already made to the existing translation.

---

## Notes on blog posts

For posts created with the `create_blog_post` skill, the English `index.qmd` is
always created first. To produce the Portuguese version:

```bash
Rscript _scripts/translate.R posts/<slug>/index.qmd
```

Then verify the frontmatter of the resulting `index.pt.qmd`:
- `lang: pt-BR` must be present.
- `listing: {contents: "posts/*/index.pt.qmd"}` is set in `index.pt.qmd` (the PT
  listing page), not in individual post PT files — individual post files just need
  the standard frontmatter fields translated.
