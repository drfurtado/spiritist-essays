# Bilingual Site Maintenance Skill

This skill provides the definitive rules for maintaining the Kardec.ONE multilingual website, which uses `babelquarto` to manage English (EN) and Portuguese (PT) versions.

## Core Architecture
- **Primary Language (EN)**: Files are in the root directory (e.g., `about.qmd`). Rendered to `_site/about.html`.
- **Secondary Language (PT-BR)**: Files have a `.pt.qmd` extension (e.g., `about.pt.qmd`). Rendered to `_site/pt/about.html`.
- **Structure Synchro**: The folder structure in `_site/pt/` mirrors the root structure exactly.

## 1. Rendering Rules (CRITICAL)
- **NEVER** use `quarto render`. It only renders the main language correctly.
- **ALWAYS** use: `Rscript -e 'babelquarto::render_website()'`
- This command ensures that both languages are rendered and the `/pt/` subdirectory is correctly populated.

## 2. Linking Rules
- **Internal Links**: Always link to the **English source file** (`.qmd`). 
  - *Example*: `[Sobre](about.qmd)` instead of `[Sobre](about.pt.qmd)`.
  - `babelquarto` will automatically rewrite this to `about.html` in the English site and `about.html` (within the `/pt/` folder) in the Portuguese site.
- **Absolute Root Links**: For external/standalone apps like the portal, use absolute paths starting with `/` to avoid breaking when navigating from the `/pt/` subfolder.
  - *Example*: `href: /portal/index.html`

## 3. Language Switcher & Navbar
- The language switcher logic and navbar translations are handled in `_babelquarto-fixes.html`.
- If you add a new item to the navbar in `_quarto.yml`, you **MUST** update the `translations` object in `_babelquarto-fixes.html` to ensure it is localized on Portuguese pages.
- The script handles the logic even when viewing local files or via web servers.

## 4. Blog Posts & Listings
- **Translation**: Every post `posts/slug/index.qmd` should have a corresponding `posts/slug/index.pt.qmd`.
- **Listing glob**: Use the English glob in both `index.qmd` and `index.pt.qmd` (e.g., `contents: "posts/*/index.qmd"`). `babelquarto` will swap in the `.pt.qmd` versions during the PT render pass.
- **Post Links**: If you use custom HTML icons for PDF/HTML formats in the post frontmatter, use paths relative to the project root (e.g., `posts/slug/index.pdf`) so they work correctly from both the post page and the home page listing.

## 5. Metadata (YAML Frontmatter)
- All Portuguese files **MUST** have `lang: pt-BR` in their YAML frontmatter.
- Translation is performed using the `_scripts/translate.R` helper script.
