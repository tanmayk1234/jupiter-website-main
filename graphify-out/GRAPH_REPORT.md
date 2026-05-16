# Graph Report - C:/Users/DELL/Desktop/jupiter website  (2026-05-10)

## Corpus Check
- Corpus is ~15,585 words - fits in a single context window. You may not need a graph.

## Summary
- 124 nodes · 104 edges · 17 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_WGB Brand & External Libs|WGB Brand & External Libs]]
- [[_COMMUNITY_Main App & Section Components|Main App & Section Components]]
- [[_COMMUNITY_Animations & AI Integration|Animations & AI Integration]]
- [[_COMMUNITY_Lottie Processing Utilities|Lottie Processing Utilities]]
- [[_COMMUNITY_HTML Entry & Styles|HTML Entry & Styles]]
- [[_COMMUNITY_Navbar Component|Navbar Component]]
- [[_COMMUNITY_CTA Section|CTA Section]]
- [[_COMMUNITY_Orbital Graphic UI|Orbital Graphic UI]]
- [[_COMMUNITY_Dimension Check Scripts|Dimension Check Scripts]]
- [[_COMMUNITY_Footer Component|Footer Component]]
- [[_COMMUNITY_Lenis Smooth Scroll Provider|Lenis Smooth Scroll Provider]]
- [[_COMMUNITY_PainPoints Section|PainPoints Section]]
- [[_COMMUNITY_Custom Cursor UI|Custom Cursor UI]]
- [[_COMMUNITY_Page Transition UI|Page Transition UI]]
- [[_COMMUNITY_SplitText UI|SplitText UI]]
- [[_COMMUNITY_Utility Functions|Utility Functions]]
- [[_COMMUNITY_OrbitalGraphic (standalone)|OrbitalGraphic (standalone)]]

## God Nodes (most connected - your core abstractions)
1. `wgb.html (WGB Agency Reference Clone)` - 19 edges
2. `package.json (Project Dependencies)` - 12 edges
3. `GSAP 3.15 (Animation Library)` - 5 edges
4. `IntroLoader (Section Component)` - 4 edges
5. `processLottie()` - 3 edges
6. `main()` - 3 edges
7. `README.md (Project Docs)` - 3 edges
8. `Hero (Section Component)` - 3 edges
9. `Lenis 1.3 (Smooth Scroll Library)` - 3 edges
10. `@dotlottie/react-player (Lottie Animations)` - 3 edges

## Surprising Connections (you probably didn't know these)
- `SplitText (UI Component)` --references--> `GSAP 3.15 (Animation Library)`  [INFERRED]
  src/components/ui/SplitText.tsx → package.json
- `IntroLoader (Section Component)` --references--> `@dotlottie/react-player (Lottie Animations)`  [INFERRED]
  src/components/sections/IntroLoader.tsx → package.json
- `Hero (Section Component)` --references--> `GSAP 3.15 (Animation Library)`  [INFERRED]
  src/components/sections/Hero.tsx → package.json
- `wgb.html (WGB Agency Reference Clone)` --conceptually_related_to--> `index.html (App Entry Point)`  [INFERRED]
  wgb.html → index.html
- `LenisProvider (Smooth Scroll Context)` --references--> `Lenis 1.3 (Smooth Scroll Library)`  [INFERRED]
  src/components/providers/LenisProvider.tsx → package.json

## Hyperedges (group relationships)
- **React Component Tree (App -> Sections/Layout/UI)** — src_app_tsx, comp_lenis_provider, comp_navbar, comp_footer, comp_intro_loader, comp_hero, comp_pain_points, comp_cases, comp_services, comp_comparison, comp_testimonials, comp_cta_section, comp_custom_cursor, comp_page_transition [EXTRACTED 1.00]
- **GSAP Plugin Suite Used in Project** — lib_gsap, lib_gsap_scroll_trigger, lib_gsap_split_text, lib_gsap_flip, lib_gsap_custom_ease, lib_gsap_react [EXTRACTED 1.00]
- **WGB Reference Site Animation Stack** — lib_gsap, lib_gsap_scroll_trigger, lib_lenis, lib_swiper, lib_barba [EXTRACTED 1.00]
- **Lottie Animation Assets** — public_loader_lottie, public_loop_lottie, public_preloader_lottie, lottie_animation_json, lib_dotlottie_react [INFERRED 0.80]

## Communities

### Community 0 - "WGB Brand & External Libs"
Cohesion: 0.11
Nodes (19): LenisProvider (Smooth Scroll Context), Adaptive CSS Scaling System (by Osmo), WGB Trust Engine (B2B Growth System), WGB B2B Growth Agency, Barba.js 2.10 (Page Transition Library), Calendly Widget, CookieFlow by Reform Digital (Consent Manager), GSAP CustomEase Plugin (+11 more)

### Community 1 - "Main App & Section Components"
Cohesion: 0.11
Nodes (16): App(), Cases (Section Component), Comparison (Section Component), CTASection (Section Component), CustomCursor (UI Component), Footer (Layout Component), Hero (Section Component), IntroLoader (Section Component) (+8 more)

### Community 2 - "Animations & AI Integration"
Cohesion: 0.14
Nodes (18): SplitText (UI Component), AI Studio App (Google AI Studio), GEMINI_API_KEY (Env Variable), clsx + tailwind-merge (Class Utilities), @dotlottie/react-player (Lottie Animations), @google/genai (Gemini AI SDK), GSAP 3.15 (Animation Library), @gsap/react (GSAP React Bindings) (+10 more)

### Community 3 - "Lottie Processing Utilities"
Cohesion: 0.7
Nodes (3): main(), processLottie(), removeUnwantedLayers()

### Community 4 - "HTML Entry & Styles"
Cohesion: 0.5
Nodes (3): index.html (App Entry Point), React 19, src/index.css (Global Styles)

### Community 5 - "Navbar Component"
Cohesion: 0.67
Nodes (2): handleNav(), handleScroll()

### Community 6 - "CTA Section"
Cohesion: 0.67
Nodes (2): handleMouseEnter(), handleMouseLeave()

### Community 7 - "Orbital Graphic UI"
Cohesion: 0.67
Nodes (2): OrbitalGraphic(), WGBStar()

### Community 8 - "Dimension Check Scripts"
Cohesion: 0.67
Nodes (1): check()

### Community 9 - "Footer Component"
Cohesion: 0.67
Nodes (1): Footer()

### Community 10 - "Lenis Smooth Scroll Provider"
Cohesion: 0.67
Nodes (1): LenisProvider()

### Community 11 - "PainPoints Section"
Cohesion: 0.67
Nodes (1): PainPoints()

### Community 12 - "Custom Cursor UI"
Cohesion: 0.67
Nodes (1): CustomCursor()

### Community 13 - "Page Transition UI"
Cohesion: 0.67
Nodes (1): PageTransition()

### Community 14 - "SplitText UI"
Cohesion: 0.67
Nodes (1): SplitText()

### Community 15 - "Utility Functions"
Cohesion: 0.67
Nodes (1): cn()

### Community 38 - "OrbitalGraphic (standalone)"
Cohesion: 1.0
Nodes (1): OrbitalGraphic (UI Component)

## Knowledge Gaps
- **34 isolated node(s):** `src/index.css (Global Styles)`, `CustomCursor (UI Component)`, `PageTransition (UI Component)`, `OrbitalGraphic (UI Component)`, `Navbar (Layout Component)` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Navbar Component`** (4 nodes): `Navbar.tsx`, `handleNav()`, `handleScroll()`, `Navbar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CTA Section`** (4 nodes): `CTASection.tsx`, `handleMouseEnter()`, `handleMouseLeave()`, `CTASection.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Orbital Graphic UI`** (4 nodes): `OrbitalGraphic.tsx`, `OrbitalGraphic()`, `WGBStar()`, `OrbitalGraphic.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dimension Check Scripts`** (3 nodes): `sizes.js`, `check()`, `sizes.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Footer Component`** (3 nodes): `Footer.tsx`, `Footer()`, `Footer.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Lenis Smooth Scroll Provider`** (3 nodes): `LenisProvider.tsx`, `LenisProvider()`, `LenisProvider.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PainPoints Section`** (3 nodes): `PainPoints.tsx`, `PainPoints()`, `PainPoints.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Custom Cursor UI`** (3 nodes): `CustomCursor.tsx`, `CustomCursor()`, `CustomCursor.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Page Transition UI`** (3 nodes): `PageTransition.tsx`, `PageTransition()`, `PageTransition.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SplitText UI`** (3 nodes): `SplitText.tsx`, `SplitText()`, `SplitText.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Utility Functions`** (3 nodes): `utils.ts`, `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `OrbitalGraphic (standalone)`** (1 nodes): `OrbitalGraphic (UI Component)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `wgb.html (WGB Agency Reference Clone)` connect `WGB Brand & External Libs` to `Animations & AI Integration`, `HTML Entry & Styles`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `package.json (Project Dependencies)` connect `Animations & AI Integration` to `WGB Brand & External Libs`, `HTML Entry & Styles`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `GSAP 3.15 (Animation Library)` connect `Animations & AI Integration` to `WGB Brand & External Libs`, `Main App & Section Components`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `GSAP 3.15 (Animation Library)` (e.g. with `SplitText (UI Component)` and `Hero (Section Component)`) actually correct?**
  _`GSAP 3.15 (Animation Library)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `IntroLoader (Section Component)` (e.g. with `@dotlottie/react-player (Lottie Animations)` and `public/loader.lottie`) actually correct?**
  _`IntroLoader (Section Component)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `src/index.css (Global Styles)`, `CustomCursor (UI Component)`, `PageTransition (UI Component)` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WGB Brand & External Libs` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._