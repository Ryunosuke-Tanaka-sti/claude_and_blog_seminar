# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo documentation repository focused on Claude AI utilization techniques for technical blog writing. The repository contains comprehensive guides, presentation materials, and utility tools for improving technical writing workflows using AI.

## Build and Development Commands

### Build All
```bash
npm run build              # Build both Marp presentations and frontend website
npm run build:marp         # Build only Marp presentations → dist/
npm run build:frontend     # Build only frontend website → dist/
```

### Development
```bash
npm run dev:frontend       # Start Astro dev server for frontend development
npm run scraper            # Run web scraper utility
```

### Workspace-Specific Commands
```bash
# Marp presentations
npm run build --workspace=application/marp

# Frontend website (Astro + React)
npm run dev --workspace=application/frontend
npm run build --workspace=application/frontend

# Tools
npm run scraper --workspace=application/tools
```

## High-Level Architecture

### Monorepo Structure
```
/
├── application/
│   ├── marp/           # Presentation slides (Marp)
│   ├── frontend/       # Website (Astro + React)
│   └── tools/          # Utility tools (scraper, etc.)
├── docs/               # Documentation and data storage
├── dist/               # Build output (GitHub Pages)
└── .claude/            # Claude Code settings and skills
```

### Application Workspaces

#### 1. application/marp
Presentation materials built with Marp:
- **Source Files** (`src/*.md`) - Markdown files with Marp directives
- **Theme System** (`theme/*.css`) - Reusable presentation themes
  - `canyon-custom.css` - Bright theme with yellow/cyan accents
  - `github-dark.css` - GitHub-inspired dark theme
- **Assets** (`src/assets/`, `src/html/`) - SVG diagrams and interactive components
- **Templates** (`templates/`) - Reusable slide templates and components
  - `base/` - Base templates (seminar, technical, workshop)
  - `components/` - Reusable slide components and styles
  - `examples/` - Template usage examples
- **Output** → `dist/*.html`

#### 2. application/frontend
Frontend website built with Astro and React:
- Static site generation (SSG)
- React components for interactive elements
- **Output** → `dist/`

#### 3. application/tools
Utility tools for workspace automation:
- `scraper.ts` - Web scraper for blog content extraction and compression
- **Output** → `docs/data/` (cached article data)

### Directory Structure
- `application/` - Monorepo workspaces (marp, frontend, tools)
- `docs/` - Documentation and specifications (3-phase development)
  - `CLAUDE.md` - Planning phase rules
  - `features/` - Feature specifications (directory-based)
    - `[feature-name]/` - Each feature has its own directory
      - `spec.md` - Specification document
      - `plan.md` - Implementation plan
      - `assets/` - Optional diagrams and images
  - `bugs/` - Bug investigation and fix plans (directory-based)
  - `research/` - Implementation reviews and learnings
  - `data/` - Scraped blog article data (cached HTML files)
  - `templates/` - Specification templates
- `dist/` - Build output for GitHub Pages (git-ignored)
- `.claude/` - Claude Code configuration
  - `settings.local.json` - Permissions and settings
  - `skills/` - Custom skills for Claude Code

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

### Technology Stack
- **Build System**: npm workspaces (monorepo)
- **Presentations**: Marp CLI
- **Frontend**: Astro + React
- **Tools**: TypeScript, Node.js
- **TypeScript Config** (`application/tools/`):
  - Target: ES2020, CommonJS modules
  - Strict mode enabled
  - Output directory: `dist/`
  - Source maps and declarations enabled

## Working with This Repository

### Getting Started
```bash
# Install all workspace dependencies
npm install

# Build everything
npm run build

# Run scraper
npm run scraper

# Start frontend dev server
npm run dev:frontend
```

### Content Creation Guidelines
- Documentation should focus on practical, actionable techniques
- Include specific prompt templates that users can copy and use
- Provide before/after examples showing efficiency gains
- Use Japanese language for primary content targeting Japanese technical bloggers

### Multi-Language Considerations
- Primary content is in Japanese targeting Japanese technical bloggers
- File paths and directory names use Japanese characters (UTF-8)
- English README.md provides international accessibility
- Presentation themes support both Latin and Japanese typography

### Deployment
- **GitHub Pages**: Builds are generated in `dist/` directory
- **GitHub Actions**: Automated build process combines Marp presentations and frontend website
- **Output Structure**: All static files are placed in `dist/` for deployment