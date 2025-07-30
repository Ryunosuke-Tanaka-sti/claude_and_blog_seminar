# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a documentation repository focused on Claude AI utilization techniques for technical blog writing. The repository contains comprehensive guides and resources for improving technical writing workflows using AI.

## Directory Structure

- `doc/` - Main documentation directory containing guides organized by topic
  - `seminar/` - Seminar materials for Claude utilization workshops
  - `NotionMCP/` - Notion integration guides using Model Context Protocol
  - `タイトル・メタディスクリプション生成/` - SEO title and meta description generation
  - `ブログ執筆全体感/` - Overall technical blog writing workflow
  - `プロンプト抑制術/` - Claude prompt control techniques
  - `図作成：Mermaid/` - Automated diagram creation with Mermaid
  - `執筆後評価/` - Post-writing quality evaluation
  - `校閲・文体統一/` - Proofreading and style consistency

## Key Documentation Patterns

### File Naming Convention
- Japanese documentation uses descriptive titles with spaces and Japanese characters
- Image files follow the pattern: `[topic].png` or `[topic]-[variant].png`
- Markdown files may include unique identifiers at the end (likely from Notion exports)

### Content Focus Areas
1. **AI-Assisted Writing Workflows** - Documentation covers complete writing processes from ideation to publication
2. **Prompt Engineering** - Specific templates and techniques for effective Claude interaction
3. **Tool Integration** - Guides for combining Claude with other tools (Notion, Mermaid, etc.)
4. **Quality Control** - Multi-stage review processes using AI
5. **Training Materials** - Structured seminar content for teaching these techniques

### Seminar Materials Structure
The `seminar/` directory contains a complete 45-minute workshop structure:
- `seminar_structure.md` - Overall seminar timeline and agenda
- `introduction_script.md` - Speaker notes for beginner-friendly introduction
- `demo_scenarios.md` - Live demonstration scenarios
- `prompt_templates.md` - Reusable prompt templates for participants
- `quick_start_guide.md` - Immediate action items for participants
- `practice_checklist.md` - Follow-up practice exercises

## Working with This Repository

### Content Creation Guidelines
- Documentation should focus on practical, actionable techniques
- Include specific prompt templates that users can copy and use
- Provide before/after examples showing efficiency gains
- Use Japanese language for primary content targeting Japanese technical bloggers

### Image Handling
- Screenshots and diagrams are stored alongside related markdown files
- Mermaid diagrams are frequently used and should be compatible with Mermaid Live Editor
- Images include both instructional screenshots and generated diagram examples

### Quality Standards
- All techniques should be tested and validated with actual time savings
- Content should be accessible to AI beginners while providing value to intermediate users
- Prompt templates must work with free-tier Claude access when possible

## Development Workflow

### Presentation Generation with Marp
This repository uses Marp (Markdown Presentation Ecosystem) to generate HTML presentations from Markdown files:

```bash
# Build specific presentation
npm run build:notion

# Manual build commands for other presentations
marp seminar/claude_seminar_slides.md --html --theme ./seminar/theme/canyon-custom.css --output ./src/claude_seminar_slides.html
marp seminar/claude_seminar_slides.md --html --theme ./seminar/theme/github-dark.css --output ./src/claude_seminar_slides_dark.html
```

### Available Themes
- `canyon-custom.css` - Original bright theme with yellow/cyan accents
- `github-dark.css` - GitHub-inspired dark theme with modern styling

### Marp Configuration Structure
All presentation files use YAML frontmatter with:
- `marp: true` - Enable Marp processing
- `theme: [theme-name]` - Reference to CSS theme file
- `paginate: true` - Add page numbers
- `size: 16:9` - Widescreen format
- Custom CSS in `style:` block for per-presentation adjustments

## Architecture Notes

### Seminar Content Architecture
The seminar materials follow a layered approach:
1. **Content Layer** (`*.md`) - Markdown source with Marp syntax
2. **Theme Layer** (`theme/*.css`) - Visual styling and component definitions
3. **Asset Layer** (`assets/`) - Images, SVG icons, and interactive HTML components
4. **Output Layer** (`src/`, `docs/`) - Generated HTML presentations

### Documentation Cross-References
Most documentation files in `doc/` directories reference published blog posts via URLs in the format:
- Pattern: `https://tech-lab.sios.jp/archives/{post-id}`
- These serve as external validation and detailed explanations of techniques

### Multi-Language Considerations
- Primary content is in Japanese targeting Japanese technical bloggers
- File paths and directory names use Japanese characters (UTF-8)
- English README.md provides international accessibility
- Presentation themes support both Latin and Japanese typography