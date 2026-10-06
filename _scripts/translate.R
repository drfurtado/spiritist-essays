#!/usr/bin/env Rscript
# _scripts/translate.R
#
# Translate a .qmd file using DeepL via babeldown, then auto-fix markdown.
#
# Usage (from project root):
#   Rscript _scripts/translate.R posts/my-post/index.qmd        # EN → PT
#   Rscript _scripts/translate.R posts/my-post/index.pt.qmd     # PT → EN
#   Rscript _scripts/translate.R posts/my-post/index.qmd update # EN → PT (update only changed paragraphs)
#
# Requires:
#   install.packages("babeldown")
#   Sys.setenv(DEEPL_API_KEY = "your-key-here")  # or set in .Renviron

suppressPackageStartupMessages(library(babeldown))

args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  cat("Usage: Rscript _scripts/translate.R <path/to/file.qmd> [update]\n")
  cat("  .qmd    -> translates EN -> PT, outputs .pt.qmd\n")
  cat("  .pt.qmd -> translates PT -> EN, outputs .qmd\n")
  cat("  add 'update' as second arg to only re-translate changed paragraphs\n")
  quit(status = 1)
}

# Check for API key early so the error is clear
api_key <- Sys.getenv("DEEPL_API_KEY")
if (nchar(api_key) == 0) {
  stop("DEEPL_API_KEY is not set. Add it to ~/.Renviron and restart R.")
}

input_path  <- args[1]
mode        <- if (length(args) >= 2 && args[2] == "update") "update" else "full"

if (!file.exists(input_path)) stop(paste("File not found:", input_path))

# Auto-detect direction from file extension
is_pt <- grepl("\\.pt\\.qmd$", input_path)

if (is_pt) {
  out_path    <- sub("\\.pt\\.qmd$", ".qmd", input_path)
  source_lang <- "PT"
  target_lang <- "EN-US"
  direction   <- "PT -> EN"
  # DeepL does NOT support formality for English targets — omit it
  formality   <- NULL
} else {
  out_path    <- sub("\\.qmd$", ".pt.qmd", input_path)
  source_lang <- "EN"
  target_lang <- "PT-BR"
  direction   <- "EN -> PT"
  formality   <- "more"
}

cat(sprintf("[translate.R] %s (%s)\n  in:  %s\n  out: %s\n\n", direction, mode, input_path, out_path))

# Run translation
if (mode == "update" && file.exists(out_path)) {
  cat("[translate.R] Running deepl_update() (changed paragraphs only)...\n")
  if (is.null(formality)) {
    deepl_update(
      path        = input_path,
      out_path    = out_path,
      source_lang = source_lang,
      target_lang = target_lang
    )
  } else {
    deepl_update(
      path        = input_path,
      out_path    = out_path,
      source_lang = source_lang,
      target_lang = target_lang,
      formality   = formality
    )
  }
} else {
  cat("[translate.R] Running deepl_translate() (full file)...\n")
  if (is.null(formality)) {
    deepl_translate(
      path        = input_path,
      out_path    = out_path,
      source_lang = source_lang,
      target_lang = target_lang
    )
  } else {
    deepl_translate(
      path        = input_path,
      out_path    = out_path,
      source_lang = source_lang,
      target_lang = target_lang,
      formality   = formality
    )
  }
}

# ── Markdown cleanup ──────────────────────────────────────────────────────────
cat("[translate.R] Applying markdown formatting fixes...\n")
content <- readLines(out_path)

# 1. Fix missing leading asterisk for bold: *word** -> **word**
content <- gsub("([\\s\\(>])\\*([^*\\n]+)\\*\\*", "\\1**\\2**", content, perl = TRUE)
content <- gsub("^\\*([^*\\n]+)\\*\\*", "**\\1**", content, perl = TRUE)

# 2. Fix missing trailing asterisk for bold: **word* -> **word**
content <- gsub("\\*\\*([^*\\n]+)\\*(?!\\*)", "**\\1**", content, perl = TRUE)

# 3. Fix trailing space inside italics: *word * -> *word*
content <- gsub("\\*([^\\*]+) \\*", "*\\1*", content)

# 4. Fix leading space inside italics: * word* -> *word*
content <- gsub("\\* ([^\\*]+)\\*", "*\\1*", content)

# 5. Fix trailing space inside bold: **word ** -> **word**
content <- gsub("\\*\\*([^\\*]+) \\*\\*", "**\\1**", content)

# 6. Fix leading space inside bold: ** word** -> **word**
content <- gsub("\\*\\* ([^\\*]+)\\*\\*", "**\\1**", content)

# 7. Fix triple asterisk touching text: ***word** -> **word**
content <- gsub("\\*\\*\\*([^*]+)\\*\\*", "**\\1**", content, perl = TRUE)

writeLines(content, out_path)
cat(sprintf("[translate.R] Done. Output saved: %s\n", out_path))
cat("[translate.R] Next step: quarto render\n")
