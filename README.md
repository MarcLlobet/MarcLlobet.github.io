# MarcLlobet.github.io

## Motivation

This project is a modern, performant, and visually engaging personal portfolio and playground. The main goal is to showcase projects, technical skills, and creative UI/UX solutions using the latest web technologies, with a strong focus on animation, interactivity, and code quality.

## Development

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm test         # Run tests
pnpm storybook    # Start Storybook
pnpm fetch-data   # Fetch GitHub and Codepen data
```

## Data Source

GitHub API serves as the single source of truth:

- **Repository data** is fetched from my GitHub repositories
  - Public repos only
  - Only repos with the `demo` topic are displayed
  - Sorted by creation date
- **Preview images** are fetched from `.github/preview.png` in each repo
  - OpenGraph social preview wasn't working as expected
- **User bio** is displayed in the about section
- **Codepen pens** are fetched (not yet in use)
  - Only pens with the `demo` tag
  - Descriptions are included
  - Data is scraped using Playwright

## Design

### Color Palette

The color palette is built around a deep, near-black background to create visual depth and reduce distraction, allowing typography to take a leading role. Warm, light-infused tones are used for headings to introduce each project as a clear visual statement, while restrained neutrals support body text and maintain readability. Accent color is applied sparingly to add contrast and guide interaction without overwhelming the content, reinforcing an editorial, intentional approach to color.

The site supports both light and dark (default) themes.

## Roadmap

### To Do

- Trigger deploys from other GitHub Pages updates
- Add e2e testing
- Add contact details
- Improve SEO metrics with Lighthouse and SpeedInsights
- Explore possibilities with Codepen data

#### Ideas

**Dynamic topic-based pages**: The `demo` topic currently determines which repos are displayed. This could be extended so that topics like `ui`, `algorithms`, or `tools` generate dedicated pages dynamically, each showing their respective repositories.

### Done

- Review accessibility (html-validate added)
- Migrate from Vite to Next.js (App Router)
- Component architecture with co-located styles, stories, and tests
- Custom Storybook theme
- Design system showcase page (`/design-system`)
- SSR support for Styled Components
- Support for horizontal viewport
- Custom favicon
- Improved CI pipeline
- Mobile-responsive UI
- Unit testing setup
- Preview images for all projects
- State management architecture
- Scroll-to-top feature
- Pre-commit hooks with Husky
- Data persistence between builds
- Codepen data fetching

---

> Made with care by Marc Llobet
