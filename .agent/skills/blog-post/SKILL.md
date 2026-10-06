---
name: create_blog_post
description: Create an essay for The Spiritist Essays Quarto site, using NotebookLM sources for citations and generating a consistent feature image.
---

# Objective
Create a fully cited, publication-ready essay for **The Spiritist Essays** Quarto site located at `/Users/ovandef/webdev/github/kone`. Each post must use NotebookLM (NBLM MCP) as its primary research engine, include proper in-text citations (direct quotes and paraphrases), update the project `references.bib`, generate a feature image, and include tags and a description.

# Context & Source Materials
- **Site Root:** `/Users/ovandef/webdev/github/kone`
- **Posts Directory:** `/Users/ovandef/webdev/github/kone/posts/`
- **References File:** `/Users/ovandef/webdev/github/kone/references.bib`
- **NotebookLM Notebook ID:** `ea6bcf65-eeba-47b5-ae8f-3da7ab6b0d56` (Title: `kOne-AndreLuis`)
  - Contains 85 sources including André Luiz book PDFs and peer-reviewed scientific articles on consciousness, near-death experiences, neuroscience of spirituality, quantum consciousness, and related topics.
- **Posts Metadata Template:** `/Users/ovandef/webdev/github/kone/posts/_metadata.yml` (applies `freeze: true` and `title-block-banner: true` to all posts automatically).

# User Rules
- When creating slides, if the source material mentions graphs or illustrations for a research study related to an objective, indicate the figure number in the slide.

# Editorial Philosophy
Every article must be **rooted in the Spiritist literature** — primarily the André Luiz book series (sources `01-nossolar.pdf` through `13-eavidacontinua.pdf` in the notebook). These books form the doctrinal and narrative foundation of each post. The scientific and peer-reviewed articles in the notebook serve a **complementary and confirmatory role**: they are used to show that modern science is arriving at conclusions the Spiritist doctrine has long articulated. Structure posts so that the Spiritist teaching is presented first, then supported or echoed by scientific findings.

# Instructions

## Step 1: Topic Research via NotebookLM
1. Confirm the article topic with the user (e.g., "The Physics of Thought," "Near-Death Experiences," "The Perispirit").
2. Use `notebook_query` (notebook_id: `ea6bcf65-eeba-47b5-ae8f-3da7ab6b0d56`) to research the topic. Run **multiple queries** to gather comprehensive material:
   - **Primary (Spiritist books):** Query the Spiritist book sources first (e.g., "What does André Luiz describe about the nature of thought as energy?"). These form the backbone of the post.
   - **Direct quotes from books:** Target exact passages (e.g., "Provide direct quotes from the André Luiz books about mental matter and thought vibrations").
   - **Complementary (scientific articles):** Then query the scientific sources to find modern research that echoes or confirms the Spiritist perspective (e.g., "What scientific studies support the idea of consciousness beyond the brain?").
3. Use `source_describe` or `source_get_content` on specific source IDs returned in citations to extract additional context, exact wording for direct quotes, and full bibliographic details.
4. Collect and organize:
   - **Direct long quotes from Spiritist books** (40+ words) — these will be formatted as block quotes with chapter references. These are the centerpiece of the post.
   - **Paraphrased Spiritist content** — key doctrinal ideas restated in original language with in-text citations.
   - **Scientific corroboration** — findings from peer-reviewed articles that align with or confirm the Spiritist teachings, cited as supporting evidence.
   - **Key themes and arguments** — to structure the post logically, leading with doctrine and following with science.

## Step 2: Create Post Directory and Slug
1. Generate a URL-friendly slug from the post title (e.g., `the-physics-of-thought`).
2. Create the directory: `/Users/ovandef/webdev/github/kone/posts/<slug>/`

## Step 3: Generate Feature Image
1. Use `generate_image` to create a feature image for the post.
2. **Consistent Style Guidelines** — Every image must follow this style to maintain visual coherence across the site:
   - **Style:** Dark, cosmic, ethereal digital art with deep blues, purples, and gold/white luminous accents.
   - **Mood:** Mystical yet scientific — blending spirituality with a sense of structured, intelligent design.
   - **Elements:** Include symbolic elements related to the post topic (e.g., radiant energy waves for thought, anatomical overlays for the perispirit, light tunnels for NDEs).
   - **Composition:** Centered focal point with radiating energy or light. No text overlays on the image.
   - **Aspect ratio feel:** Landscape-oriented (wider than tall) to work well as an article banner.
3. Save the image as `/Users/ovandef/webdev/github/kone/posts/<slug>/feature.webp` (or `.png` if webp is not supported by the generation tool).

## Step 4: Write the Article (`index.qmd`)
Create the file at `/Users/ovandef/webdev/github/kone/posts/<slug>/index.qmd` with the following structure:

### YAML Frontmatter
```yaml
---
title: "Post Title Here"
description: "A concise 1-2 sentence summary of the post for SEO and RSS feeds."
author: "Ovande Furtado Jr."
date: "YYYY-MM-DD"
categories: [tag1, tag2, tag3]
image: "feature.webp"
bibliography: ../../references.bib
csl: ../../apa.csl
nocite: ""
---
```

**Rules for frontmatter:**
- `date`: Use the current date at time of creation.
- `categories`: Choose 2-5 tags from this curated list (create new ones sparingly):
  - `consciousness`, `mediumship`, `perispirit`, `reincarnation`, `nde`, `thought`, `evolution`, `health`, `pineal-gland`, `spiritual-world`, `science`, `neuroscience`, `quantum`, `prayer`, `meditation`, `andre-luiz`, `kardec`, `ethics`, `spiritual-body`
- `description`: Must be compelling and informative (used in listing cards and RSS).
- `bibliography`: Always point to `../../references.bib` (relative path from post directory).

### Post Body Structure
The post body should follow this general structure (adapt as appropriate to the topic):

```markdown
## Introduction
<!-- Hook the reader. State the central question or theme. 1-2 paragraphs. -->

## Section 1: [Descriptive Heading]
<!-- Develop the first major point. Mix paraphrases and direct quotes. -->

## Section 2: [Descriptive Heading]
<!-- Develop the second major point. -->

## Section 3: [Descriptive Heading] (optional, as needed)
<!-- Additional sections as the topic demands. -->

## Conclusion
<!-- Synthesize the key insights. End with a reflective or forward-looking statement. -->

## References
::: {#refs}
:::
```

### Citation Format Rules (Quarto/Pandoc)

**Paraphrased in-text citations:**
```markdown
The perispirit functions as an electromagnetic mold that pre-exists the physical body [@luiz1959evolution].
```

**Multiple sources:**
```markdown
Research on near-death experiences has consistently shown patterns of veridical perception [@luiz1955realms; @vanLommel2001].
```

**Narrative citations (author as part of sentence):**
```markdown
@luiz1944nosso describes the spiritual colony of Nosso Lar as a highly organized community.
```

**Direct short quotes (under 40 words) — inline:**
```markdown
As described in the text, the perispirit is "the intermediary between the spirit and the body" [@luiz1959evolution, p. 45].
```

**Direct long quotes (40+ words) — block quote:**
```markdown
As the source explains:

> The mind is the basis of all mediumistic phenomena. Thought is not merely an abstraction but constitutes actual mental matter—a continuous flow of electromagnetic energy capable of creating, transforming, and associating with other minds across vast distances in the universe. [@luiz1960mechanics, Ch. 3]
```

**CRITICAL:** Every factual claim, insight, or quote MUST have a citation. Uncited assertions are not acceptable on this site.

## Step 5: Update `references.bib`
1. After writing the post, identify ALL citation keys used in the post (e.g., `@luiz1959evolution`, `@vanLommel2001`).
2. Read the current `/Users/ovandef/webdev/github/kone/references.bib`.
3. For each citation key used in the post:
   - If the entry **already exists** in `references.bib` → do nothing.
   - If the entry **does not exist** → create a proper BibTeX entry and **append** it to the file.
4. For new entries sourced from NotebookLM, use `source_get_content` or `source_describe` to extract accurate bibliographic metadata (authors, title, year, journal/publisher, DOI if available).
5. Use consistent BibTeX key naming: `authorYYYYkeyword` (e.g., `vanLommel2001nde`, `luiz1959evolution`).

### BibTeX Entry Templates

**Book:**
```bibtex
@book{luiz1959evolution,
  author = {Luiz, André},
  title = {Evolution in Two Worlds},
  year = {1959},
  publisher = {FEB},
  address = {Rio de Janeiro}
}
```

**Journal Article:**
```bibtex
@article{vanLommel2001nde,
  author = {van Lommel, Pim and van Wees, Ruud and Meyers, Vincent and Greyson, Bruce},
  title = {Near-death experience in survivors of cardiac arrest: a prospective study in the Netherlands},
  journal = {The Lancet},
  year = {2001},
  volume = {358},
  number = {9298},
  pages = {2039--2045},
  doi = {10.1016/S0140-6736(01)07100-8}
}
```

**Web / Online Source:**
```bibtex
@online{newberg2023research,
  author = {Newberg, Andrew},
  title = {Research Overview},
  year = {2023},
  url = {http://www.andrewnewberg.com/research},
  urldate = {2026-03-04}
}
```

## Step 6: Render and Verify
1. Run `quarto render` from the site root to compile the entire site.
2. Check the terminal output for:
   - Citation warnings (undefined references indicate missing BibTeX entries).
   - Rendering errors in the new post.
3. Fix any issues before considering the post complete.

# Quality Checklist
Before marking a post as complete, verify:
- [ ] YAML frontmatter includes: title, description, author, date, categories, image, bibliography
- [ ] Feature image generated with consistent dark/cosmic/ethereal style
- [ ] At least 3 direct quotes (block or inline) with citations
- [ ] All paraphrased claims have in-text citations
- [ ] References section present at end of post with `{#refs}` div
- [ ] All citation keys exist in `references.bib`
- [ ] `quarto render` completes without citation warnings
- [ ] Categories use the curated tag list (or sensible new additions)
- [ ] Post reads as a cohesive, well-structured essay (not a list of quotes)

# Example Post Frontmatter
```yaml
---
title: "The Physics of Thought: How Mental Matter Shapes Reality"
description: "An exploration of how thought operates as electromagnetic energy, capable of creating, transforming, and connecting minds across the universe."
author: "Ovande Furtado Jr."
date: "2026-03-04"
categories: [thought, consciousness, science, mediumship]
image: "feature.webp"
bibliography: ../../references.bib
csl: ../../apa.csl
nocite: ""
---
```
