# MarcLlobet.github.io

## 🚀 Motivation

This project is a modern, performant, and visually engaging personal portfolio and playground. The main goal is to showcase projects, technical skills, and creative UI/UX solutions using the latest web technologies, with a strong focus on animation, interactivity, and code quality.

## 🔗 Data Source

I used GitHub API as a single source of truth:

- Repository data is fetched from my github repositories
  - Public repos
  - Only repos with `demo` topic are displayed
  - Sorted by creation date
- Images are fetched from `.github/preview.png` from each repo
  - OpenGraph social preview was not working as expected
- Github user bio is displayed in about section

Codepen's data is also fetched (not yet introduced).

## 💅 Design

### Color palette

The color palette is built around a deep, near-black background to create visual depth and reduce distraction, allowing typography to take a leading role. Warm, light-infused tones are used for headings to introduce each project as a clear visual statement, while restrained neutrals support body text and maintain readability. Accent color is applied sparingly to add contrast and guide interaction without overwhelming the content, reinforcing an editorial, intentional approach to color.

Here's more details about [typography decisions](./src/fonts/README.md) and the [color palette](./src/theme/README.md).

It has support for both light and dark (default) themes.

## TODOs
- See how to trigger deploys from other github pages updates
- Add precommit hooks with husky
- Update the design system with components and documention and deploy it
- Add e2e testing
- Review accessibility (html-validate added)
- Add contact details
- Improve SEO metrics with lighthouse adn speedInsights
- Review possibilities with new codepen's data

### Todos updates

### Done
- Improve CI
- Improve UI for mobile devices
- Unit tests
- Improve UI for mobile devices
- Generate links and previews for missing projects
- Wrap state in a higher component manager
- Insert a 'scroll to top' feature


#### Added codepen source

Added codepen.io source to fetch pens with pen data.

#### Rethink how "topics" can be used in github projects (plus study other API options)

Currently `demo` topic in the repo means it will be displayed (instead of archived / naming convention).

Plus, topics could generate pages dynamically, meaning for example, by having 'ui', 'algorithms', 'tools' tags I could create three pages with that names and its respective respositories.

---

> Made with ❤️ by Marc Llobet
