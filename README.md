# Denizard Consulting portfolio

A dependency-free, eight-page portfolio using the existing navy, teal and red palette, Greg's existing published portrait and locally served fonts.

## Run

```sh
node build.mjs
node verify.mjs
node serve.mjs
```

Local preview: http://127.0.0.1:8765

## GitHub Pages

The GitHub Actions workflow builds and publishes `dist/` on every push to `main`.
Repository Settings → Pages → Source must be **GitHub Actions**.
`SITE_ORIGIN` is supplied from the Pages configuration so canonical URLs, sharing images and the sitemap use the live address. Page and asset links are relative, so the same files work under `/greg-website/` and at a domain root.

Preview URL: https://faizan-ali-dev.github.io/greg-website/

Edit content/layout in `build.mjs`, styles in `src/style.css`, interactions in `src/site.js`. `dist/` is deployable static output.

## Working interactions

Responsive verification details and tested screen sizes are in [RESPONSIVE-QA.md](RESPONSIVE-QA.md).

- Responsive navigation, accessible native service menu and FAQs.
- Service finder with three contextual destinations.
- Contact query preselection and CRM organization field.
- Required inputs, email validation and message preview dialog.
- Copy-message and user-controlled email draft; no automatic sending or website lead database.
- Direct phone/email, official WFG and Academy links.
- Reduced-motion support, keyboard focus, skip link, per-page metadata and sitemap.

## Content and launch notes

- Portrait source: https://denizard-consulting.vercel.app/assets/founder-CfbbtqT2.png. Original retained in `dist/assets/gregory-denizard.png`; optimized WebP is used by the site. Replace with the new approved portrait when supplied.
- Published education and role descriptions originate from the existing site/profile; owner sign-off remains appropriate before a public client launch.
- No invented testimonials, customer logos or unsubstantiated performance metrics are included. Add approved testimonials and conference photographs when supplied.
- Financial appointments route to the existing WFG profile. Confirm current company requirements before public financial marketing publication.
- Academy joining routes to its public Skool page; Greg's additional personal-club URL remains pending.
- Contact entries remain in the page and are placed into an email draft only when the visitor chooses it. No email is sent by the website. GHL integration is explicitly deferred.
- Fonts: Manrope and Instrument Serif, downloaded from Google Fonts and served locally. The download utility is for maintenance, not a runtime dependency.

## Local development preference

The local development server runs at http://localhost:8765. The brand is Denizard Consulting; Gregory remains the featured professional. Header and hero refinements live in src/refinements.css.

## Client-story carousel and motion

The home-page carousel contains four clearly labeled design-preview cards in `testimonialPreviews` in `build.mjs`. Replace them with approved quotes and attribution when supplied. It supports automatic advance, pause/play, touch scrolling, keyboard arrows and direct slide selection. Hover, keyboard focus, reduced-motion preferences and off-screen visibility pause automatic movement. FAQs animate in both directions while retaining native details/summary semantics.
