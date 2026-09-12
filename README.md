# Jupiter Engineering Solutions — website

Marketing site for Jupiter Engineering Solutions (Nashik, India): graphite and
shell & tube heat exchangers, pressure vessels and process equipment.

Vite + React 19 + TypeScript, Tailwind 4, GSAP/ScrollTrigger, Lenis smooth
scroll, three.js, dotLottie.

## Run locally

```
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint` (`tsc --noEmit`),
`npm run clean`.

No environment variables are needed — the site is fully static.

## Structure

```
index.html                      entry + CSP + SEO meta
src/App.tsx                     view switcher (no router; views are local state)
src/components/sections/        SpaceIntro, IntroLoader, Hero, PainPoints,
                                Cases, Services, Testimonials, CTASection,
                                OrderPage, AboutPage, SustainabilityPage,
                                PlaceholderPage
src/components/layout/          Navbar, Footer
src/components/providers/       LanguageContext (en/gu/te), LenisProvider
public/assets/lottie/           intro + hero animations
public/frames/                  132 JPGs scrubbed onto a canvas in Services
public/textures/                jupiter.jpg, stars.jpg for the three.js intro
coming-soon/                    standalone holding page (separate deploy)
```

### Intro sequence

Three gates run before the site is visible, chained by state in `App.tsx`:

1. `SpaceIntro` — three.js Jupiter scene, camera driven by 4×100vh of scroll;
   warps out at 95% progress.
2. `IntroLoader` — fullscreen lottie, fades out on complete.
3. The site, with `heroStart` releasing Hero's animation timeline.

## Known gaps

- The enquiry form in `OrderPage` opens a prefilled `mailto:` draft. There is no
  backend. Pointing it at a real endpoint means replacing the body of
  `handleSubmit` and widening `connect-src` in `index.html`'s CSP.
- Views are local state, so only `/` has a URL. Anything beyond the home page is
  invisible to search engines.
- `.cpanel.yml` is disabled — it pointed at an unrelated project's account. Fill
  in the real cPanel path before using it, and have it copy `dist/`, not `./`.

## Deploy

`npm run build`, then upload the contents of `dist/` to the web root.
