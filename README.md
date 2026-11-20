# MarcLlobet.github.io

## Motivation

This project is a modern, performant, and visually engaging personal portfolio and playground. The main goal is to showcase projects, technical skills, and creative UI/UX solutions using the latest web technologies, with a strong focus on animation, interactivity, and code quality.

- [Demo](https://marcllobet.github.io/)
- [Design](https://marcllobet.github.io/design) with visual guidelines
- [Storybook](<(https://marcllobet.github.io/storybook)>) with UI components

## Development

```bash
pnpm dev             # Start development server
pnpm build           # Build for production (fetches data from GitHub)
pnpm test            # Run tests
pnpm storybook       # Start Storybook
pnpm lint:css        # Lint the CSS inside styled-components
pnpm install:browser # Install the browser the layout check needs
pnpm check:layout    # After a build: check the layout at 14 viewports
```

### Layout principles

- **Spacing scale**: use the `--space-*` tokens from `GlobalStyles.tsx` (`--space-3xs` to `--space-2xl`, plus the fluid `--space-gutter`, `--space-stack`, `--space-rail`). `--spacing` is a legacy alias of `--space-s`.
- **Logical properties only**: inline/block instead of width/height and left/right, enforced by Stylelint.
- **Navigation works without JavaScript**: the section rail, the skip link and the scroll-to-top button are plain `#anchor` links; `scroll-behavior: smooth` animates them (except with reduced motion), and the scroll-to-top button fades in with a CSS scroll-driven animation. JavaScript only adds the highlight of the current section.
- **Colour contrast**: every text colour meets WCAG AA (4.5:1) in both themes. Use `--color-accent` for shapes and large letters, and `--color-accent-text` when the accent colours normal-size text.

### Layout checks

Two tools keep the layout from breaking on other screens:

- **Stylelint** (`.stylelintrc.json`) lints the CSS written in styled-components. Besides catching invalid or duplicated declarations, it only allows logical properties (`inline-size`, `inset-block-start`, `margin-inline-end`, `text-align: start`…) so the layout works in any writing direction, rejects `100vw`/`100dvw` widths (they include the scrollbar and cause sideways scrolling) and `vh` (use `svh`/`dvh`, which account for the mobile browser bars).
- **Layout check** (`scripts/check-layout.ts`) serves the static build, opens it in Chromium at 14 viewports, from a 320px phone to a 1920px screen, including landscape phones, and fails if the page scrolls sideways, an element sticks out of the screen, a project spills out of its section or is taller than one screen, the name collides with the shape, a touch target is under 24×24px or the About text gets cut. It also checks WCAG AA text contrast, that the section rail keeps its margin, and renders some viewports right-to-left and in the light theme. Screenshots and a report are saved to `layout-report/`.

Both run on every pull request in the **Checks** workflow; the screenshots are attached to the run as the `layout-report` artifact.

## Data Source

GitHub is the single source of truth, read **at build time**: `app/page.tsx` is an async Server Component that calls `getPortfolioData()` (`app/data/github.ts`) while `next build` renders the static export. No JSON files are generated or committed.

- **Repositories**: public, non-fork repos with the `demo` topic, newest first
- **Featured projects**: the repos pinned on the GitHub profile (up to six, in pin order) get a full-screen case; the other `demo` repos are listed in the Archive. Without pins, the six newest are featured.
- **Tagline and detail**: the repo description, split at the first em dash: `Tagline — detail`.
- **Mockups**: drawn in code by the portfolio (`app/mockups`), not taken from each repo. `MOCKUP_BY_REPOSITORY` gives a project its own mockup; otherwise a `mockup-<kind>` topic (`map`, `store`, `matrix`, `terminal`, `tiles`, `graph`) picks one, or one is chosen from the name, so a new repo never breaks the build. Mockups redraw at the exact size of their 2:1 box, build up as the project scrolls in and play a loop on hover.
- **Preview images**: `.github/preview.png` in each repo (the OpenGraph social preview was unreliable); kept in the data for the social card, no longer shown on the page
- **Bio**: the GitHub profile bio, shown in the About overlay

### Motion

`ScrollScene` directs the page from one animation frame loop: it reveals each project (`--p`, `--q`), sets the accent of the project in view, runs the counter and flies the impossible triangle (three real beams drawn with WebGL and a depth buffer, seen from the one angle where they look closed; no 3D library) from the hero to the counter and to the footer. Everything stays still with `prefers-reduced-motion`.

Set `GH_API_TOKEN` (a token that can read public repos) and optionally `GH_API_USERNAME` in `.env.local`, as in `.env.example`. Without a token the build uses `app/data/fixtures/portfolio.json` and says so; the deploy sets `PORTFOLIO_REQUIRE_LIVE_DATA=true`, so it fails rather than publish fixtures.

### When the site rebuilds

The **CI** workflow builds and deploys on every push to `main`, by hand from the Actions tab, and when another repository sends a `refresh-portfolio` event:

```bash
gh api repos/MarcLlobet/MarcLlobet.github.io/dispatches -f event_type=refresh-portfolio
```

Adding that step to a project's own deploy workflow (with a token allowed to dispatch to this repo) puts its changes on the portfolio right away.

## Design

### Color Palette

The color palette is built around a deep, near-black background to create visual depth and reduce distraction, allowing typography to take a leading role. Warm, light-infused tones are used for headings to introduce each project as a clear visual statement, while restrained neutrals support body text and maintain readability. Accent color is applied sparingly to add contrast and guide interaction without overwhelming the content, reinforcing an editorial, intentional approach to color.

The site supports both light and dark (default) themes.

### Typography

Two variable fonts, both under the SIL Open Font License and served from `app/public/fonts`:

- **Space Grotesk** (`--font-sans`, weights 300–700) for names, headings and running text.
- **JetBrains Mono** (`--font-mono`, weights 100–800) for labels, counters and metadata, always in small uppercase.

Use the tokens, never a font name, so a future change happens in one place (`GlobalStyles.tsx`).

## Roadmap

### To Do

- Add e2e testing
- Add contact details
- Improve SEO metrics with Lighthouse and SpeedInsights

#### Ideas

**Dynamic topic-based pages**: The `demo` topic currently determines which repos are displayed. This could be extended so that topics like `ui`, `algorithms`, or `tools` generate dedicated pages dynamically, each showing their respective repositories.

### Done

- Fluid, breakpoint-light responsive layout and automated layout checks
- Build-time data fetching; rebuilds triggered by pushes and other repositories
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

---

> Made with care by Marc Llobet
