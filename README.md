# MarcLlobet.github.io – Project Summary

## 🚀 Motivation
This project is a modern, performant, and visually engaging personal portfolio and playground. The main goal is to showcase projects, technical skills, and creative UI/UX solutions using the latest web technologies, with a strong focus on animation, interactivity, and code quality.

## 🎨 Design Decisions
- **Minimalist & Responsive UI:** The layout is clean, with a focus on readability and accessibility. Responsive design ensures a great experience on all devices.
- **Section-based Navigation:** Each project is presented in a full-page section, with smooth scroll and snap alignment for a native-app feel.
- **Animated Hero & SVG Morphing:** The hero section features animated text and a morphing SVG shape (circle ↔️ triangle) to add personality and demonstrate advanced SVG/React animation techniques.
- **Grid Layout for Projects:** Project sections use CSS Grid to adapt content layout for mobile and desktop, keeping visuals and text balanced.

## 🛠️ Technical Decisions
- **React + Vite:** Chosen for fast development, hot reload, and modern build tooling.
- **TypeScript:** Ensures type safety and maintainability across all components and services.
- **Styled-components:** Enables scoped, dynamic, and themeable CSS with JS logic, supporting responsive and animated styles.
- **SVG <animate> API:** Used for the MorphShape component to achieve smooth, hardware-accelerated morphing animations without React state or timers, leveraging native SVG features.
- **Imperative Animation API:** MorphShape exposes a ref-based API (`morph`, `reset`) for full external control, but also supports infinite animation via a prop, encapsulating all logic inside the component.
- **GitHub Actions + GitHub Pages:** Automated CI/CD pipeline for secure, zero-downtime deploys directly from the main branch.
- **Environment Variables:** Uses Vite's `VITE_`-prefixed env vars for secure API access and configuration.
- **Performance Optimizations:** Includes memoization, event delegation, and scroll throttling for smooth UX even with many sections.



## 🔗 Data Source

- Project and repository data is fetched from my github repositories using the GitHub API. This ensures the portfolio always displays up-to-date information about public projects, languages, and demos.
- I used a .github/preview.png naming convention for images of each project.

## TODOs
- Improve CI. Add a workflow_dispatch option
- Add precommit hooks with husky
- Update the design system with components and documention and deploy it
- Add user and e2e testing
- Improve UI for mobile devices
- Review accessibility
- Rewrite components to avoid rerenders and improve composing
- Generate links and previews for missing projects

---

> Made with ❤️ by Marc Llobet
