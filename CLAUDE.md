# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a documentation repository focused on Claude AI utilization techniques for technical blog writing. The repository contains comprehensive guides and resources for improving technical writing workflows using AI.

## Build and Development Commands

### Presentation Building
```bash
# Build presentations using npm scripts
npm run build:claude    # Claude seminar slides with dark theme → docs/claude_seminar_slides.html
npm run build:notion    # Notion integration guide with bright theme → docs/notion_and_claude_blog_write.html

# Manual Marp commands for custom builds
marp seminar/[filename].md --html --theme ./theme/[theme-name].css --output ./[output-dir]/[filename].html
```

### Web Scraper Utility
```bash
# Run the TypeScript web scraper to fetch and compress blog articles
npm run scraper                     # Run directly with tsx
URL=https://tech-lab.sios.jp/archives/[id] npm run scraper  # Specify URL via environment variable

# Build and run compiled version
npm run scraper:build              # Compile TypeScript to dist/
npm run scraper:run                # Run compiled JavaScript
```

The scraper fetches articles from tech-lab.sios.jp, compresses HTML content, and saves to the `doc/` directory with token usage statistics.

## High-Level Architecture

### Content Generation Pipeline
1. **Source Files** (`seminar/*.md`) - Markdown files with Marp directives
2. **Theme System** (`theme/*.css`) - Reusable presentation themes
   - `canyon-custom.css` - Bright theme with yellow/cyan accents
   - `github-dark.css` - GitHub-inspired dark theme
3. **Assets** (`seminar/assets/`, `seminar/html/`) - SVG diagrams and interactive components
4. **Output** (`docs/`, `src/`) - Generated HTML presentations

### Directory Structure
- `doc/` - Main documentation directory containing guides organized by topic
  - Also serves as cache directory for scraped blog articles
- `seminar/` - Seminar materials for Claude utilization workshops
  - `claude_seminar_slides.md` - Main 45-minute workshop presentation
  - `notion_and_claude_blog_write.md` - Notion×Claude integration guide
  - `assets/` - SVG diagrams and visual resources
  - `html/` - Interactive HTML components for presentations
  - `commpass/` - Additional seminar content
- `src/` - TypeScript utilities
  - `scraper.ts` - Web scraper for blog content extraction
  - `scraper.py` - Python version of the scraper (legacy)
- `theme/` - Marp CSS themes for presentations
- `docs/` - Generated HTML presentations (production output)

### Key Documentation Patterns

#### File Naming Convention
- Japanese documentation uses descriptive titles with spaces and Japanese characters
- Scraped articles: `tech-lab-sios-jp-archives-[id].html`
- Image files: `[topic].png` or `[topic]-[variant].png`
- Markdown files may include unique identifiers (from Notion exports)

#### Content Focus Areas
1. **AI-Assisted Writing Workflows** - Complete writing processes from ideation to publication
2. **Prompt Engineering** - Specific templates and techniques for effective Claude interaction
3. **Tool Integration** - Guides for combining Claude with other tools (Notion, Mermaid, etc.)
4. **Quality Control** - Multi-stage review processes using AI
5. **Training Materials** - Structured seminar content for teaching these techniques

### Marp Presentation System

All presentation files use YAML frontmatter configuration:
- `marp: true` - Enable Marp processing
- `theme: [theme-name]` - Reference to CSS theme file
- `paginate: true` - Add page numbers
- `size: 16:9` - Widescreen format
- Custom CSS in `style:` block for per-presentation adjustments

### TypeScript Configuration
- Target: ES2020, CommonJS modules
- Strict mode enabled
- Output directory: `dist/`
- Source maps and declarations enabled

## Working with This Repository

### Content Creation Guidelines
- Documentation should focus on practical, actionable techniques
- Include specific prompt templates that users can copy and use
- Provide before/after examples showing efficiency gains
- Use Japanese language for primary content targeting Japanese technical bloggers

### Scraped Content Management
The web scraper (`src/scraper.ts`) provides:
- Automatic caching in `doc/` directory
- Token usage estimation for Claude (Japanese text optimized)
- HTML compression with attribute removal
- Detailed compression statistics

### Multi-Language Considerations
- Primary content is in Japanese targeting Japanese technical bloggers
- File paths and directory names use Japanese characters (UTF-8)
- English README.md provides international accessibility
- Presentation themes support both Latin and Japanese typography