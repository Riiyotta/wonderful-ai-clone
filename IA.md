# https://www.wonderful.ai (live sitemap) and the local clone at http://localhost:5288

Source: https://www.wonderful.ai (live sitemap) and the local clone at http://localhost:5288
Status: **measured-from-clone**
104 routes · 27 templates · 83 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Blog article, Country launch page, Legal document) account for 70 of 104 routes (67%). The remaining 34 routes span 24 templates.

| template | routes | share |
|---|---:|---:|
| Blog article | 51 | 49% |
| Country launch page | 10 | 10% |
| Legal document | 9 | 9% |
| Industry page | 6 | 6% |
| Case study | 3 | 3% |
| Job post | 2 | 2% |
| Job application | 2 | 2% |
| Event registration (FC Bayern matchday) | 2 | 2% |
| Homepage | 1 | 1% |
| Product: AI OS | 1 | 1% |
| Product: Agents | 1 | 1% |
| Product: Systems | 1 | 1% |
| Product: AI Gateway | 1 | 1% |
| Approach: Deployment | 1 | 1% |
| Approach: AI transformation strategy | 1 | 1% |
| Industry page with customer video | 1 | 1% |
| About us | 1 | 1% |
| Careers | 1 | 1% |
| Press | 1 | 1% |
| Contact | 1 | 1% |
| Form confirmation | 1 | 1% |
| Blog index | 1 | 1% |
| Legal index | 1 | 1% |
| Candidate privacy notice | 1 | 1% |
| Not found (404) | 1 | 1% |
| Event registration confirmation | 1 | 1% |
| Careers embed shell (archive) | 1 | 1% |

## Page chrome

**85 routes carry chrome = `full`** — Homepage, Product: AI OS, Product: Agents, Product: Systems, Product: AI Gateway, Approach: Deployment, Approach: AI transformation strategy, Industry page, Industry page with customer video, Case study, About us, Careers, Press, Form confirmation, Blog index, Blog article, Country launch page, Not found (404), Careers embed shell (archive).

**1 routes carry chrome = `nav-only`** — Contact.

**1 routes carry chrome = `nav-light-footer`** — Legal index.

**14 routes carry chrome = `none`** — Legal document, Candidate privacy notice, Job post, Job application.

**3 routes carry chrome = `event`** — Event registration (FC Bayern matchday), Event registration confirmation.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.site-nav` | SHELL | 21 | 87 | `src/components/Navbar.jsx (+ nav/Announcement.jsx, nav/MegaMenu.jsx, nav/MobileMenu.jsx)` | Every route with the full site chrome, plus /contact and /legal which mount the same nav themselves (87 routes). |
| `shell.site-footer` | SHELL | 19 | 85 | `src/components/Footer.jsx` | Every route with the full site chrome (85 routes). |
| `content.article-header` | CONTENT | 1 | 51 | `src/pages/content/Article.jsx > Meta` | Every blog article (51 routes). |
| `content.article-banner` | CONTENT | 1 | 51 | `src/pages/content/Article.jsx > Banner/HeroVideo` | Every blog article (51 routes). |
| `content.article-body` | CONTENT | 1 | 51 | `src/pages/content/Article.jsx (+ Sidebar)` | Every blog article (51 routes). |
| `content.article-related` | CONTENT | 1 | 51 | `src/pages/content/Article.jsx > RelatedGrid` | Every blog article (51 routes). |
| `conversion.operating-model-cta` | CONVERSION | 7 | 12 | `src/pages/company/sections/CtaBand.jsx; re-implemented as src/pages/product/aios/Cta.jsx, src/pages/platform/Closer.jsx, src/pages/industries/sections/ClosingCta.jsx` | /ai-os, both approach pages, all 7 industry pages, /about-us and /careers (12 routes); /agents, /systems and /ai-gateway end on the product cards instead, and the legal index carries the same message inside its light footer. |
| `hero.country` | HERO | 1 | 10 | `src/pages/regional/CountryPage.jsx` | Every country landing page (10 routes). |
| `narrative.country-body` | NARRATIVE | 1 | 10 | `src/pages/regional/CountryPage.jsx > TextBlock/Quote/Links` | Every country landing page (10 routes). |
| `content.legal-doc-header` | CONTENT | 1 | 9 | `src/pages/content/LegalDoc.jsx` | Every legal document (9 routes). |
| `content.legal-doc-body` | CONTENT | 1 | 9 | `src/pages/content/LegalDoc.jsx` | Every legal document (9 routes). |
| `hero.industry` | HERO | 2 | 7 | `src/pages/industries/sections/IndustryHero.jsx` | Every industry page (7 routes). |
| `proof.industry-logo-strip` | PROOF | 2 | 7 | `src/pages/industries/sections/LogoStrip.jsx` | Every industry page (7 routes). |
| `features.industry-transform` | FEATURES | 2 | 7 | `src/pages/industries/sections/Transform.jsx` | Every industry page (7 routes). |
| `features.industry-workflows` | FEATURES | 2 | 7 | `src/pages/industries/sections/Workflows.jsx` | Every industry page (7 routes). |
| `features.industry-why-choose` | FEATURES | 2 | 7 | `src/pages/industries/sections/WhyChoose.jsx` | Every industry page (7 routes). |
| `features.platform-cards` | FEATURES | 4 | 4 | `src/pages/product/shared/ProductCards.jsx; re-implemented in src/pages/platform/Gateway.jsx > Products` | Every product page plus /ai-gateway (4 routes). |
| `hero.product` | HERO | 3 | 3 | `src/pages/product/shared/ProductHero.jsx (+ aios/Lattice.jsx on /ai-os)` | The three core product pages /ai-os, /agents, /systems (3 routes). |
| `shell.event-footer` | SHELL | 2 | 3 | `src/pages/regional/FcbFooter.jsx` | The event registration and event confirmation pages (3 routes). |
| `hero.case-study` | HERO | 1 | 3 | `src/pages/industries/CaseStudyPage.jsx` | Every case study (3 routes). |
| `proof.customer-quote` | PROOF | 1 | 3 | `src/pages/industries/CaseStudyPage.jsx > QuoteCard` | Every case study (3 routes). |
| `narrative.case-study-challenge` | NARRATIVE | 1 | 3 | `src/pages/industries/CaseStudyPage.jsx` | Every case study (3 routes). |
| `narrative.case-study-results` | NARRATIVE | 1 | 3 | `src/pages/industries/CaseStudyPage.jsx` | Every case study (3 routes). |
| `hero.approach` | HERO | 2 | 2 | `src/pages/platform/Deployment.jsx > Hero, src/pages/platform/Transformation.jsx > Hero` | The two approach pages /deployment and /ai-transformation (2 routes). |
| `features.icon-feature-grid` | FEATURES | 2 | 2 | `src/pages/platform/FeatureGrid.jsx` | The /ai-gateway and /deployment pages (2 routes). |
| `hero.event` | HERO | 1 | 2 | `src/pages/regional/FcbMatchday.jsx` | The two event registration pages (2 routes). |
| `conversion.event-registration-form` | CONVERSION | 1 | 2 | `src/pages/regional/FcbMatchday.jsx` | The two event registration pages (2 routes). |
| `conversion.job-application-form` | CONVERSION | 1 | 2 | `src/pages/regional/AshbySubmit.jsx (+ AshbyApplicationForm.jsx)` | The two job application pages (2 routes). |
| `conversion.job-apply-bar` | CONVERSION | 1 | 2 | `src/pages/regional/AshbyJob.jsx > ApplyButton` | The two job detail pages (2 routes). |
| `content.event-info` | CONTENT | 1 | 2 | `src/pages/regional/FcbMatchday.jsx` | The two event registration pages (2 routes). |
| `content.job-header` | CONTENT | 1 | 2 | `src/pages/regional/AshbyJob.jsx` | The two job detail pages (2 routes). |
| `content.job-description` | CONTENT | 1 | 2 | `src/pages/regional/AshbyJob.jsx` | The two job detail pages (2 routes). |
| `shell.light-footer` | SHELL | 1 | 1 | `src/pages/content/footer/LightFooter.jsx` | Only /legal (1 route). |
| `hero.home` | HERO | 1 | 1 | `src/components/Hero.jsx` | Homepage only (1 route). |
| `hero.gateway-dashboard` | HERO | 1 | 1 | `src/pages/platform/Gateway.jsx > Hero (+ gateway/GatewayOverview.jsx)` | Only /ai-gateway (1 route). |
| `hero.about` | HERO | 1 | 1 | `src/pages/company/AboutUs.jsx` | Only /about-us (1 route). |
| `hero.careers` | HERO | 1 | 1 | `src/pages/company/Careers.jsx` | Only /careers (1 route). |
| `proof.client-logos` | PROOF | 1 | 1 | `src/components/Clients.jsx` | Homepage only (1 route). |
| `proof.case-study-carousel` | PROOF | 1 | 1 | `src/components/CaseStudies.jsx` | Homepage only (1 route). |
| `proof.case-study-carousel-dark` | PROOF | 1 | 1 | `src/pages/product/agents/AgentCases.jsx` | Only /agents (1 route). |
| `proof.investors` | PROOF | 1 | 1 | `src/pages/company/AboutUs.jsx` | Only /about-us (1 route). |
| `narrative.scroll-reveal-statement` | NARRATIVE | 1 | 1 | `src/components/RevealStatement.jsx` | Homepage only (1 route). |
| `narrative.careers-statement` | NARRATIVE | 1 | 1 | `src/pages/company/sections/StickyReveal.jsx` | Only /careers (1 route). |
| `narrative.transformation-body` | NARRATIVE | 1 | 1 | `src/pages/platform/Transformation.jsx > Body` | Only /ai-transformation (1 route). |
| `narrative.about-story` | NARRATIVE | 1 | 1 | `src/pages/company/AboutUs.jsx > Story` | Only /about-us (1 route). |
| `features.ai-os-lattice-band` | FEATURES | 1 | 1 | `src/components/DarkBand.jsx (+ darkband/Lattice.jsx)` | Homepage only (1 route). |
| `features.deployment-strategy-cards` | FEATURES | 1 | 1 | `src/components/darkband/DeployCards.jsx` | Homepage only (1 route). |
| `features.industry-tabs` | FEATURES | 1 | 1 | `src/components/Industries.jsx` | Homepage only (1 route). |
| `features.aios-infrastructure` | FEATURES | 1 | 1 | `src/pages/product/aios/Infra.jsx` | Only /ai-os (1 route). |
| `features.aios-advantage` | FEATURES | 1 | 1 | `src/pages/product/aios/Advantage.jsx` | Only /ai-os (1 route). |
| `features.enterprise-rows` | FEATURES | 1 | 1 | `src/pages/product/aios/Enterprise.jsx` | Only /ai-os (1 route). |
| `features.agents-use-cards` | FEATURES | 1 | 1 | `src/pages/product/agents/UseCards.jsx` | Only /agents (1 route). |
| `features.agents-real-work` | FEATURES | 1 | 1 | `src/pages/product/agents/RealWork.jsx` | Only /agents (1 route). |
| `features.agents-teams` | FEATURES | 1 | 1 | `src/pages/product/agents/Teams.jsx` | Only /agents (1 route). |
| `features.systems-adapts` | FEATURES | 1 | 1 | `src/pages/product/systems/Adapts.jsx` | Only /systems (1 route). |
| `features.systems-helps` | FEATURES | 1 | 1 | `src/pages/product/systems/Helps.jsx` | Only /systems (1 route). |
| `features.systems-replace` | FEATURES | 1 | 1 | `src/pages/product/systems/Replace.jsx` | Only /systems (1 route). |
| `features.systems-deployed` | FEATURES | 1 | 1 | `src/pages/product/systems/Deployed.jsx` | Only /systems (1 route). |
| `features.gateway-video` | FEATURES | 1 | 1 | `src/pages/platform/gateway/VideoSection.jsx (+ gateway/lightbox.js)` | Only /ai-gateway (1 route). |
| `features.gateway-capabilities` | FEATURES | 1 | 1 | `src/pages/platform/Gateway.jsx > Capabilities` | Only /ai-gateway (1 route). |
| `features.deployment-teams` | FEATURES | 1 | 1 | `src/pages/platform/Deployment.jsx > Teams` | Only /deployment (1 route). |
| `features.deployment-phases` | FEATURES | 1 | 1 | `src/pages/platform/Deployment.jsx > Phases` | Only /deployment (1 route). |
| `features.transformation-principles` | FEATURES | 1 | 1 | `src/pages/platform/Transformation.jsx > Principle` | Only /ai-transformation (1 route). |
| `features.approach-cards` | FEATURES | 1 | 1 | `src/pages/platform/PlatformCards.jsx` | Only /ai-transformation (1 route). |
| `features.industry-video` | FEATURES | 1 | 1 | `src/pages/industries/sections/VideoSection.jsx (+ VideoLightbox.jsx, Counter.jsx)` | Only /industries/utilities (1 route). |
| `features.careers-global` | FEATURES | 1 | 1 | `src/pages/company/sections/Globe.jsx` | Only /careers (1 route). |
| `conversion.company-closer-cards` | CONVERSION | 1 | 1 | `src/components/Closer.jsx` | Homepage only (1 route). |
| `conversion.careers-roles` | CONVERSION | 1 | 1 | `src/pages/company/Careers.jsx > RoleRow` | Only /careers (1 route). |
| `conversion.contact-intro` | CONVERSION | 1 | 1 | `src/pages/company/Contact.jsx` | Only /contact (1 route). |
| `conversion.contact-form` | CONVERSION | 1 | 1 | `src/pages/company/Contact.jsx` | Only /contact (1 route). |
| `content.press-header` | CONTENT | 1 | 1 | `src/pages/company/Press.jsx` | Only /press (1 route). |
| `content.press-grid` | CONTENT | 1 | 1 | `src/pages/company/Press.jsx > Layout/PressCard` | Only /press (1 route). |
| `content.blog-featured` | CONTENT | 1 | 1 | `src/pages/content/Blog.jsx > Featured` | Only /blog (1 route). |
| `content.blog-filter` | CONTENT | 1 | 1 | `src/pages/content/Blog.jsx > Tabs` | Only /blog (1 route). |
| `content.blog-grid` | CONTENT | 1 | 1 | `src/pages/content/Blog.jsx > PostCard` | Only /blog (1 route). |
| `content.legal-index-list` | CONTENT | 1 | 1 | `src/pages/content/LegalIndex.jsx` | Only /legal (1 route). |
| `content.notice-header` | CONTENT | 1 | 1 | `src/pages/company/CandidateNotice.jsx` | Only /careers/candidate_notice (1 route). |
| `content.notice-body` | CONTENT | 1 | 1 | `src/pages/company/CandidateNotice.jsx` | Only /careers/candidate_notice (1 route). |
| `content.blog-teaser` | CONTENT | 1 | 1 | `src/pages/company/ThankYou.jsx > PostCard` | Only /thank-you (1 route). |
| `utility.form-confirmation` | UTILITY | 1 | 1 | `src/pages/company/ThankYou.jsx` | Only /thank-you (1 route). |
| `utility.event-confirmation` | UTILITY | 1 | 1 | `src/pages/regional/FcbThankYou.jsx` | Only /fcb/x/thank-you (1 route). |
| `utility.not-found` | UTILITY | 1 | 1 | `src/pages/regional/Ashby404.jsx` | Only /ashby (1 route), which renders the not-found page on live. |
| `utility.careers-embed-shell` | UTILITY | 1 | 1 | `src/pages/regional/ComeetStyle.jsx` | Only /archive/comeet-style (1 route). |

**13 shared sections** appear in more than one template and belong in a component library.

**70 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.home` | page-local |
| 3 | PROOF | `proof.client-logos` | page-local |
| 4 | PROOF | `proof.case-study-carousel` | page-local |
| 5 | NARRATIVE | `narrative.scroll-reveal-statement` | page-local |
| 6 | FEATURES | `features.ai-os-lattice-band` | page-local |
| 7 | FEATURES | `features.deployment-strategy-cards` | page-local |
| 8 | FEATURES | `features.industry-tabs` | page-local |
| 9 | CONVERSION | `conversion.company-closer-cards` | page-local |
| 10 | SHELL | `shell.site-footer` | shared ×19 |

### Product: AI OS — `template.product-ai-os`

1 route · `/ai-os` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.product` | shared ×3 |
| 3 | FEATURES | `features.aios-infrastructure` | page-local |
| 4 | FEATURES | `features.platform-cards` | shared ×4 |
| 5 | FEATURES | `features.aios-advantage` | page-local |
| 6 | FEATURES | `features.enterprise-rows` | page-local |
| 7 | CONVERSION | `conversion.operating-model-cta` | shared ×7 |
| 8 | SHELL | `shell.site-footer` | shared ×19 |

### Product: Agents — `template.product-agents`

1 route · `/agents` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.product` | shared ×3 |
| 3 | FEATURES | `features.agents-use-cards` | page-local |
| 4 | FEATURES | `features.agents-real-work` | page-local |
| 5 | PROOF | `proof.case-study-carousel-dark` | page-local |
| 6 | FEATURES | `features.agents-teams` | page-local |
| 7 | FEATURES | `features.platform-cards` | shared ×4 |
| 8 | SHELL | `shell.site-footer` | shared ×19 |

### Product: Systems — `template.product-systems`

1 route · `/systems` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.product` | shared ×3 |
| 3 | FEATURES | `features.systems-adapts` | page-local |
| 4 | FEATURES | `features.systems-helps` | page-local |
| 5 | FEATURES | `features.systems-replace` | page-local |
| 6 | FEATURES | `features.systems-deployed` | page-local |
| 7 | FEATURES | `features.platform-cards` | shared ×4 |
| 8 | SHELL | `shell.site-footer` | shared ×19 |

### Product: AI Gateway — `template.product-ai-gateway`

1 route · `/ai-gateway` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.gateway-dashboard` | page-local |
| 3 | FEATURES | `features.gateway-video` | page-local |
| 4 | FEATURES | `features.gateway-capabilities` | page-local |
| 5 | FEATURES | `features.icon-feature-grid` | shared ×2 |
| 6 | FEATURES | `features.platform-cards` | shared ×4 |
| 7 | SHELL | `shell.site-footer` | shared ×19 |

### Approach: Deployment — `template.approach-deployment`

1 route · `/deployment` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.approach` | shared ×2 |
| 3 | FEATURES | `features.deployment-teams` | page-local |
| 4 | FEATURES | `features.deployment-phases` | page-local |
| 5 | FEATURES | `features.icon-feature-grid` | shared ×2 |
| 6 | CONVERSION | `conversion.operating-model-cta` | shared ×7 |
| 7 | SHELL | `shell.site-footer` | shared ×19 |

### Approach: AI transformation strategy — `template.approach-transformation`

1 route · `/ai-transformation` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.approach` | shared ×2 |
| 3 | NARRATIVE | `narrative.transformation-body` | page-local |
| 4 | FEATURES | `features.transformation-principles` | page-local |
| 5 | FEATURES | `features.approach-cards` | page-local |
| 6 | CONVERSION | `conversion.operating-model-cta` | shared ×7 |
| 7 | SHELL | `shell.site-footer` | shared ×19 |

### Industry page — `template.industry`

6 routes · `/industries/{slug}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.industry` | shared ×2 |
| 3 | PROOF | `proof.industry-logo-strip` | shared ×2 |
| 4 | FEATURES | `features.industry-transform` | shared ×2 |
| 5 | FEATURES | `features.industry-workflows` | shared ×2 |
| 6 | FEATURES | `features.industry-why-choose` | shared ×2 |
| 7 | CONVERSION | `conversion.operating-model-cta` | shared ×7 |
| 8 | SHELL | `shell.site-footer` | shared ×19 |

### Industry page with customer video — `template.industry-with-video`

1 route · `/industries/utilities` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.industry` | shared ×2 |
| 3 | PROOF | `proof.industry-logo-strip` | shared ×2 |
| 4 | FEATURES | `features.industry-transform` | shared ×2 |
| 5 | FEATURES | `features.industry-video` | page-local |
| 6 | FEATURES | `features.industry-workflows` | shared ×2 |
| 7 | FEATURES | `features.industry-why-choose` | shared ×2 |
| 8 | CONVERSION | `conversion.operating-model-cta` | shared ×7 |
| 9 | SHELL | `shell.site-footer` | shared ×19 |

### Case study — `template.case-study`

3 routes · `/case-studies/{slug}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.case-study` | page-local |
| 3 | NARRATIVE | `narrative.case-study-challenge` | page-local |
| 4 | PROOF | `proof.customer-quote` | page-local |
| 5 | NARRATIVE | `narrative.case-study-results` | page-local |
| 6 | SHELL | `shell.site-footer` | shared ×19 |

### About us — `template.about`

1 route · `/about-us` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.about` | page-local |
| 3 | NARRATIVE | `narrative.about-story` | page-local |
| 4 | PROOF | `proof.investors` | page-local |
| 5 | CONVERSION | `conversion.operating-model-cta` | shared ×7 |
| 6 | SHELL | `shell.site-footer` | shared ×19 |

### Careers — `template.careers`

1 route · `/careers` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.careers` | page-local |
| 3 | NARRATIVE | `narrative.careers-statement` | page-local |
| 4 | FEATURES | `features.careers-global` | page-local |
| 5 | CONVERSION | `conversion.careers-roles` | page-local |
| 6 | CONVERSION | `conversion.operating-model-cta` | shared ×7 |
| 7 | SHELL | `shell.site-footer` | shared ×19 |

### Press — `template.press`

1 route · `/press` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | CONTENT | `content.press-header` | page-local |
| 3 | CONTENT | `content.press-grid` | page-local |
| 4 | SHELL | `shell.site-footer` | shared ×19 |

### Contact — `template.contact`

1 route · `/contact` · chrome: **nav-only**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | CONVERSION | `conversion.contact-intro` | page-local |
| 3 | CONVERSION | `conversion.contact-form` | page-local |

### Form confirmation — `template.thank-you`

1 route · `/thank-you` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | UTILITY | `utility.form-confirmation` | page-local |
| 3 | CONTENT | `content.blog-teaser` | page-local |
| 4 | SHELL | `shell.site-footer` | shared ×19 |

### Blog index — `template.blog-index`

1 route · `/blog` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | CONTENT | `content.blog-featured` | page-local |
| 3 | CONTENT | `content.blog-filter` | page-local |
| 4 | CONTENT | `content.blog-grid` | page-local |
| 5 | SHELL | `shell.site-footer` | shared ×19 |

### Blog article — `template.blog-article`

51 routes · `/blog-articles/{slug}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | CONTENT | `content.article-header` | page-local |
| 3 | CONTENT | `content.article-banner` | page-local |
| 4 | CONTENT | `content.article-body` | page-local |
| 5 | CONTENT | `content.article-related` | page-local |
| 6 | SHELL | `shell.site-footer` | shared ×19 |

### Legal index — `template.legal-index`

1 route · `/legal` · chrome: **nav-light-footer**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | CONTENT | `content.legal-index-list` | page-local |
| 3 | SHELL | `shell.light-footer` | page-local |

### Legal document — `template.legal-document`

9 routes · `/legal/{slug}` · chrome: **none**

| # | category | section | |
|---:|---|---|---|
| 1 | CONTENT | `content.legal-doc-header` | page-local |
| 2 | CONTENT | `content.legal-doc-body` | page-local |

### Candidate privacy notice — `template.candidate-notice`

1 route · `/careers/candidate_notice` · chrome: **none**

| # | category | section | |
|---:|---|---|---|
| 1 | CONTENT | `content.notice-header` | page-local |
| 2 | CONTENT | `content.notice-body` | page-local |

### Country launch page — `template.country`

10 routes · `/{country}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | HERO | `hero.country` | page-local |
| 3 | NARRATIVE | `narrative.country-body` | page-local |
| 4 | SHELL | `shell.site-footer` | shared ×19 |

### Not found (404) — `template.not-found`

1 route · `/ashby` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | UTILITY | `utility.not-found` | page-local |
| 3 | SHELL | `shell.site-footer` | shared ×19 |

### Job post — `template.job-detail`

2 routes · `/ashby/{jobId}` · chrome: **none**

| # | category | section | |
|---:|---|---|---|
| 1 | CONTENT | `content.job-header` | page-local |
| 2 | CONTENT | `content.job-description` | page-local |
| 3 | CONVERSION | `conversion.job-apply-bar` | page-local |

### Job application — `template.job-application`

2 routes · `/ashby/{jobId}/submit` · chrome: **none**

| # | category | section | |
|---:|---|---|---|
| 1 | CONVERSION | `conversion.job-application-form` | page-local |

### Event registration (FC Bayern matchday) — `template.event-registration`

2 routes · `/fcb/x/{match}` · chrome: **event**

| # | category | section | |
|---:|---|---|---|
| 1 | HERO | `hero.event` | page-local |
| 2 | CONVERSION | `conversion.event-registration-form` | page-local |
| 3 | CONTENT | `content.event-info` | page-local |
| 4 | SHELL | `shell.event-footer` | shared ×2 |

### Event registration confirmation — `template.event-confirmation`

1 route · `/fcb/x/thank-you` · chrome: **event**

| # | category | section | |
|---:|---|---|---|
| 1 | UTILITY | `utility.event-confirmation` | page-local |
| 2 | SHELL | `shell.event-footer` | shared ×2 |

### Careers embed shell (archive) — `template.careers-embed`

1 route · `/archive/comeet-style` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.site-nav` | shared ×21 |
| 2 | UTILITY | `utility.careers-embed-shell` | page-local |
| 3 | SHELL | `shell.site-footer` | shared ×19 |

## Section reference

### SHELL

_Site chrome repeated across routes: navigation, footers and their variants._

**`shell.site-nav`** — Fixed top navigation: 48px rotating announcement ticker that collapses on first scroll, 60px bar with wordmark, Platform/Industries/Company mega-menus, Blog link, EN language chip and "Get in touch" pill; switches between a white-on-dark and a frosted light variant depending on the section underneath; hamburger + accordion drawer below 880px.

· Every route with the full site chrome, plus /contact and /legal which mount the same nav themselves (87 routes). · appears on 87 routes · implemented by `src/components/Navbar.jsx (+ nav/Announcement.jsx, nav/MegaMenu.jsx, nav/MobileMenu.jsx)`

**`shell.site-footer`** — Dark (#080808) site footer: wordmark, tagline, "Get in touch" pill, five link columns (Platform, Industries, Company, Social, Legal) with the current page highlighted, and a giant faded wordmark; its desktop/tablet/mobile switch points are set per page family.

· Every route with the full site chrome (85 routes). · appears on 85 routes · implemented by `src/components/Footer.jsx`

**`shell.light-footer`** — Light "White L" footer variant used on the legal index: closing CTA, link columns on white, and two animated canvas patterns (ascii pattern, warp gradient).

· Only /legal (1 route). · appears on 1 routes · implemented by `src/pages/content/footer/LightFooter.jsx`

**`shell.event-footer`** — Compact co-branded footer for the FC Bayern matchday microsite: partner lockup, copyright and legal links; replaces the site footer.

· The event registration and event confirmation pages (3 routes). · appears on 3 routes · implemented by `src/pages/regional/FcbFooter.jsx`

### HERO

_The page-opening composition only._

**`hero.home`** — Full-viewport homepage opener: autoplaying background video (16:9 desktop, 9:16 mobile) under a gradient overlay, word-by-word revealed H1 "Accelerate AI transformation across the enterprise", subtitle and two pill buttons.

· Homepage only (1 route). · appears on 1 routes · implemented by `src/components/Hero.jsx`

**`hero.product`** — Product-page opener: centred word-revealed headline and subtitle over a full-width visual, with the AI OS variant layering the animated dot-and-tag lattice.

· The three core product pages /ai-os, /agents, /systems (3 routes). · appears on 3 routes · implemented by `src/pages/product/shared/ProductHero.jsx (+ aios/Lattice.jsx on /ai-os)`

**`hero.gateway-dashboard`** — AI Gateway opener: headline plus an interactive spend/usage dashboard (7d/30d/QTD data morph, chart draw-in, tooltips); static image below 880px.

· Only /ai-gateway (1 route). · appears on 1 routes · implemented by `src/pages/platform/Gateway.jsx > Hero (+ gateway/GatewayOverview.jsx)`

**`hero.approach`** — 85vh dark opener for the approach pages: large statement headline with word reveal and a short supporting line.

· The two approach pages /deployment and /ai-transformation (2 routes). · appears on 2 routes · implemented by `src/pages/platform/Deployment.jsx > Hero, src/pages/platform/Transformation.jsx > Hero`

**`hero.industry`** — Industry opener: full-viewport photo with the industry name as a giant title, subtitle and CTA.

· Every industry page (7 routes). · appears on 7 routes · implemented by `src/pages/industries/sections/IndustryHero.jsx`

**`hero.case-study`** — Case-study header: customer title with character reveal, key outcome statistics and subtitle.

· Every case study (3 routes). · appears on 3 routes · implemented by `src/pages/industries/CaseStudyPage.jsx`

**`hero.about`** — About-us opener: "The Engine behind enterprise AI Transformation." headline over imagery.

· Only /about-us (1 route). · appears on 1 routes · implemented by `src/pages/company/AboutUs.jsx`

**`hero.careers`** — Careers opener: "Careers at Wonderful" headline, intro copy and team imagery.

· Only /careers (1 route). · appears on 1 routes · implemented by `src/pages/company/Careers.jsx`

**`hero.country`** — Country-launch opener: "Wonderful <Country>" title over a still image with the launch headline.

· Every country landing page (10 routes). · appears on 10 routes · implemented by `src/pages/regional/CountryPage.jsx`

**`hero.event`** — Matchday microsite opener: "One match. One seat. A room with your peers." with fixture, date and venue details.

· The two event registration pages (2 routes). · appears on 2 routes · implemented by `src/pages/regional/FcbMatchday.jsx`

### PROOF

_Social proof: customer logos, case-study carousels, quotes, investors._

**`proof.client-logos`** — Homepage "Trusted by leading enterprises across industries" grid of inline-SVG customer logos at reduced opacity (2x6 desktop, 3x4 mobile).

· Homepage only (1 route). · appears on 1 routes · implemented by `src/components/Clients.jsx`

**`proof.industry-logo-strip`** — Per-industry "Trusted by leading enterprises" logo row showing the customers of that vertical.

· Every industry page (7 routes). · appears on 7 routes · implemented by `src/pages/industries/sections/LogoStrip.jsx`

**`proof.case-study-carousel`** — Light horizontal carousel of linked 583px customer case-study cards (photo, title, customer logo) with 400px arrow scrolling.

· Homepage only (1 route). · appears on 1 routes · implemented by `src/components/CaseStudies.jsx`

**`proof.case-study-carousel-dark`** — Dark-band variant of the customer case-study carousel on the agents page, same 400px arrow step.

· Only /agents (1 route). · appears on 1 routes · implemented by `src/pages/product/agents/AgentCases.jsx`

**`proof.customer-quote`** — Pull-quote card with attributed customer testimonial inside a case study.

· Every case study (3 routes). · appears on 3 routes · implemented by `src/pages/industries/CaseStudyPage.jsx > QuoteCard`

**`proof.investors`** — About-us "Backed by the best" investor logos and backing statement.

· Only /about-us (1 route). · appears on 1 routes · implemented by `src/pages/company/AboutUs.jsx`

### NARRATIVE

_Long-form statement or story prose that argues a point rather than listing capabilities._

**`narrative.scroll-reveal-statement`** — Large statement paragraph ("We bring together the AI platform, deployment teams, and strategic partnership...") whose words recolour from faint grey to ink, driven by scroll and reversible.

· Homepage only (1 route). · appears on 1 routes · implemented by `src/components/RevealStatement.jsx`

**`narrative.careers-statement`** — Careers mission statement with the same scroll-driven word recolouring inside a sticky block.

· Only /careers (1 route). · appears on 1 routes · implemented by `src/pages/company/sections/StickyReveal.jsx`

**`narrative.transformation-body`** — "The enterprise of the future" multi-paragraph argument whose paragraphs reveal together when half the block is in view.

· Only /ai-transformation (1 route). · appears on 1 routes · implemented by `src/pages/platform/Transformation.jsx > Body`

**`narrative.about-story`** — "Turning AI potential into operational reality" company story blocks with imagery.

· Only /about-us (1 route). · appears on 1 routes · implemented by `src/pages/company/AboutUs.jsx > Story`

**`narrative.country-body`** — Country launch body: alternating paragraphs, attributed quotes from local leaders and named team links; spacing and block order vary per country and width.

· Every country landing page (10 routes). · appears on 10 routes · implemented by `src/pages/regional/CountryPage.jsx > TextBlock/Quote/Links`

**`narrative.case-study-challenge`** — Case-study prose: the challenge and the solution, with a full-width banner image above.

· Every case study (3 routes). · appears on 3 routes · implemented by `src/pages/industries/CaseStudyPage.jsx`

**`narrative.case-study-results`** — "Results & Impact" closing prose and figures of a case study.

· Every case study (3 routes). · appears on 3 routes · implemented by `src/pages/industries/CaseStudyPage.jsx`

### FEATURES

_Product, platform and industry capabilities, workflows and benefits._

**`features.ai-os-lattice-band`** — Dark #080808 band opening with the "wonderful AI OS" mark, headline "The unified operating layer for the AI-native enterprise" and "Explore the OS" button over an animated 11-column dot lattice whose 10 tags (Data, Alerts, Skills...) pop in and type their labels on a 17.05s cycle (separate tablet and mobile configurations).

· Homepage only (1 route). · appears on 1 routes · implemented by `src/components/DarkBand.jsx (+ darkband/Lattice.jsx)`

**`features.deployment-strategy-cards`** — Pair of tall image cards, "Deployment teams in every market." and "Strategy that drives AI transformation.", each with gradient overlay, body text and white pill link.

· Homepage only (1 route). · appears on 1 routes · implemented by `src/components/darkband/DeployCards.jsx`

**`features.industry-tabs`** — "Deep in regulated, mission-critical industries" seven-tab switcher swapping a 1200x600 industry image card; selection is mirrored to ?selected-industry.

· Homepage only (1 route). · appears on 1 routes · implemented by `src/components/Industries.jsx`

**`features.platform-cards`** — "Transform the way you work on a unified platform" row of product cards (AI OS, Agents, Systems, AI Gateway) that hides the current page's own card.

· Every product page plus /ai-gateway (4 routes). · appears on 4 routes · implemented by `src/pages/product/shared/ProductCards.jsx; re-implemented in src/pages/platform/Gateway.jsx > Products`

**`features.aios-infrastructure`** — "Complete infrastructure to run enterprise AI" clickable seven-state block diagram; the active block gets an image background and a travelling border glow.

· Only /ai-os (1 route). · appears on 1 routes · implemented by `src/pages/product/aios/Infra.jsx`

**`features.aios-advantage`** — "The advantage of a unified, open layer" benefit grid.

· Only /ai-os (1 route). · appears on 1 routes · implemented by `src/pages/product/aios/Advantage.jsx`

**`features.enterprise-rows`** — "Built for the enterprise. From deployment to data protection" hover rows (dash, title slide, image fade on desktop).

· Only /ai-os (1 route). · appears on 1 routes · implemented by `src/pages/product/aios/Enterprise.jsx`

**`features.agents-use-cards`** — "Transform the way you work" agent use-case cards.

· Only /agents (1 route). · appears on 1 routes · implemented by `src/pages/product/agents/UseCards.jsx`

**`features.agents-real-work`** — "Built for real enterprise work" click accordion of agent capabilities with a state image.

· Only /agents (1 route). · appears on 1 routes · implemented by `src/pages/product/agents/RealWork.jsx`

**`features.agents-teams`** — "Built for teams building at scale" team-oriented capability grid.

· Only /agents (1 route). · appears on 1 routes · implemented by `src/pages/product/agents/Teams.jsx`

**`features.systems-adapts`** — "Software finally adapts to you." explanation block.

· Only /systems (1 route). · appears on 1 routes · implemented by `src/pages/product/systems/Adapts.jsx`

**`features.systems-helps`** — "What Wonderful helps you do" capability list.

· Only /systems (1 route). · appears on 1 routes · implemented by `src/pages/product/systems/Helps.jsx`

**`features.systems-replace`** — "Build or replace your core business systems" system-type showcase.

· Only /systems (1 route). · appears on 1 routes · implemented by `src/pages/product/systems/Replace.jsx`

**`features.systems-deployed`** — "Deployed where you run, by local teams" two cards that swap widths on hover with a spring.

· Only /systems (1 route). · appears on 1 routes · implemented by `src/pages/product/systems/Deployed.jsx`

**`features.gateway-video`** — Scroll-driven video section for the AI Gateway with a play button that opens a lightbox player (minimise, close, Esc).

· Only /ai-gateway (1 route). · appears on 1 routes · implemented by `src/pages/platform/gateway/VideoSection.jsx (+ gateway/lightbox.js)`

**`features.gateway-capabilities`** — "AI usage is outpacing AI control" capability walkthrough of the gateway.

· Only /ai-gateway (1 route). · appears on 1 routes · implemented by `src/pages/platform/Gateway.jsx > Capabilities`

**`features.icon-feature-grid`** — Grid of icon + title + text feature cells ("What it means for your business", "Deploy anywhere").

· The /ai-gateway and /deployment pages (2 routes). · appears on 2 routes · implemented by `src/pages/platform/FeatureGrid.jsx`

**`features.deployment-teams`** — "Locally embedded deployment teams" FDE/DS cards that expand on hover, with a counting "40+" figure.

· Only /deployment (1 route). · appears on 1 routes · implemented by `src/pages/platform/Deployment.jsx > Teams`

**`features.deployment-phases`** — "From Wonderful-led to full client ownership, by design." phase tabs with an animated progress bar and percentage.

· Only /deployment (1 route). · appears on 1 routes · implemented by `src/pages/platform/Deployment.jsx > Phases`

**`features.transformation-principles`** — "AI transformation principles" independently opening accordion with spring height and caret rotation.

· Only /ai-transformation (1 route). · appears on 1 routes · implemented by `src/pages/platform/Transformation.jsx > Principle`

**`features.approach-cards`** — "Helping critical organizations accelerate AI adoption" AI OS / Deployment image cards with per-breakpoint images.

· Only /ai-transformation (1 route). · appears on 1 routes · implemented by `src/pages/platform/PlatformCards.jsx`

**`features.industry-transform`** — "Transform your <industry> operations with AI" intro with stats.

· Every industry page (7 routes). · appears on 7 routes · implemented by `src/pages/industries/sections/Transform.jsx`

**`features.industry-video`** — "Explore inspiring stories..." customer video block with counters and a lightbox player.

· Only /industries/utilities (1 route). · appears on 1 routes · implemented by `src/pages/industries/sections/VideoSection.jsx (+ VideoLightbox.jsx, Counter.jsx)`

**`features.industry-workflows`** — "Streamline your most critical workflows" workflow lists for the vertical.

· Every industry page (7 routes). · appears on 7 routes · implemented by `src/pages/industries/sections/Workflows.jsx`

**`features.industry-why-choose`** — "Why <industry> choose Wonderful" hover rows (background, divider, image fade, title slide on one 420ms curve).

· Every industry page (7 routes). · appears on 7 routes · implemented by `src/pages/industries/sections/WhyChoose.jsx`

**`features.careers-global`** — "Global by Design. Local by Execution." with a draggable dotted globe rotating through office cities.

· Only /careers (1 route). · appears on 1 routes · implemented by `src/pages/company/sections/Globe.jsx`

### CONVERSION

_Blocks whose job is to get a visitor to act: CTA bands, forms, apply links, closers._

**`conversion.operating-model-cta`** — Closing call-to-action band "Transform your operating model with Wonderful." with a "Get in touch" button that fades in on scroll.

· /ai-os, both approach pages, all 7 industry pages, /about-us and /careers (12 routes); /agents, /systems and /ai-gateway end on the product cards instead, and the legal index carries the same message inside its light footer. · appears on 12 routes · implemented by `src/pages/company/sections/CtaBand.jsx; re-implemented as src/pages/product/aios/Cta.jsx, src/pages/platform/Closer.jsx, src/pages/industries/sections/ClosingCta.jsx`

**`conversion.company-closer-cards`** — Homepage closer: "The team building the future of applied AI." over a dark image with About us / Careers glass cards that widen on hover.

· Homepage only (1 route). · appears on 1 routes · implemented by `src/components/Closer.jsx`

**`conversion.careers-roles`** — "Main Roles" list of open roles with hover rows and mailto apply links.

· Only /careers (1 route). · appears on 1 routes · implemented by `src/pages/company/Careers.jsx > RoleRow`

**`conversion.contact-intro`** — Contact page left column: "Applied AI for the enterprise" pitch and inquiry types.

· Only /contact (1 route). · appears on 1 routes · implemented by `src/pages/company/Contact.jsx`

**`conversion.contact-form`** — "Set a meeting with our team" form with custom dropdowns and browser validation; never submits, navigates to /thank-you.

· Only /contact (1 route). · appears on 1 routes · implemented by `src/pages/company/Contact.jsx`

**`conversion.event-registration-form`** — "Request my seat" registration form for the matchday; never submits, navigates to /fcb/x/thank-you.

· The two event registration pages (2 routes). · appears on 2 routes · implemented by `src/pages/regional/FcbMatchday.jsx`

**`conversion.job-application-form`** — Job application frame with back link; stand-in for the jobs.ashbyhq.com embed (real field list unverified), validates then navigates to /thank-you.

· The two job application pages (2 routes). · appears on 2 routes · implemented by `src/pages/regional/AshbySubmit.jsx (+ AshbyApplicationForm.jsx)`

**`conversion.job-apply-bar`** — "Apply now" call to action repeated at the bottom of a job post.

· The two job detail pages (2 routes). · appears on 2 routes · implemented by `src/pages/regional/AshbyJob.jsx > ApplyButton`

### CONTENT

_Editorial and reference content: blog, press, legal, job descriptions, event info._

**`content.event-info`** — Matchday arrival and logistics information (time, venue, what to expect).

· The two event registration pages (2 routes). · appears on 2 routes · implemented by `src/pages/regional/FcbMatchday.jsx`

**`content.press-header`** — "Wonderful in the news" press page heading.

· Only /press (1 route). · appears on 1 routes · implemented by `src/pages/company/Press.jsx`

**`content.press-grid`** — Grid of press coverage cards whose article mix and card styles differ per breakpoint; cards replay their appear on every re-entry.

· Only /press (1 route). · appears on 1 routes · implemented by `src/pages/company/Press.jsx > Layout/PressCard`

**`content.blog-featured`** — Blog index featured-post block (latest announcement with image).

· Only /blog (1 route). · appears on 1 routes · implemented by `src/pages/content/Blog.jsx > Featured`

**`content.blog-filter`** — "All Posts" heading with category tabs mirrored to ?blog-category.

· Only /blog (1 route). · appears on 1 routes · implemented by `src/pages/content/Blog.jsx > Tabs`

**`content.blog-grid`** — Grid of post cards (image, category, title, date) with hover dim, filtered by the active category.

· Only /blog (1 route). · appears on 1 routes · implemented by `src/pages/content/Blog.jsx > PostCard`

**`content.article-header`** — Article title, category, author and date.

· Every blog article (51 routes). · appears on 51 routes · implemented by `src/pages/content/Article.jsx > Meta`

**`content.article-banner`** — Article hero media: full-width image or autoplaying video.

· Every blog article (51 routes). · appears on 51 routes · implemented by `src/pages/content/Article.jsx > Banner/HeroVideo`

**`content.article-body`** — Article rich-text body (headings, lists, quotes, images, embedded video) rendered from extracted Framer markup, with an optional sticky sidebar (key facts / customer card) on case-style posts.

· Every blog article (51 routes). · appears on 51 routes · implemented by `src/pages/content/Article.jsx (+ Sidebar)`

**`content.article-related`** — "More Posts" row of related article cards.

· Every blog article (51 routes). · appears on 51 routes · implemented by `src/pages/content/Article.jsx > RelatedGrid`

**`content.legal-index-list`** — "Wonderful legal" list of legal documents linking to each policy.

· Only /legal (1 route). · appears on 1 routes · implemented by `src/pages/content/LegalIndex.jsx`

**`content.legal-doc-header`** — Legal document title and effective date.

· Every legal document (9 routes). · appears on 9 routes · implemented by `src/pages/content/LegalDoc.jsx`

**`content.legal-doc-body`** — Numbered, heading-bounded legal clauses rendered from extracted rich text.

· Every legal document (9 routes). · appears on 9 routes · implemented by `src/pages/content/LegalDoc.jsx`

**`content.notice-header`** — Candidate Privacy Notice title block (no site chrome).

· Only /careers/candidate_notice (1 route). · appears on 1 routes · implemented by `src/pages/company/CandidateNotice.jsx`

**`content.notice-body`** — Numbered privacy-notice clauses for job candidates, verbatim legal text.

· Only /careers/candidate_notice (1 route). · appears on 1 routes · implemented by `src/pages/company/CandidateNotice.jsx`

**`content.job-header`** — Job post header: role title, location, employment type tags and an "Apply now" link.

· The two job detail pages (2 routes). · appears on 2 routes · implemented by `src/pages/regional/AshbyJob.jsx`

**`content.job-description`** — Job description rich text; cut off at the fixed 1080px page height exactly like live.

· The two job detail pages (2 routes). · appears on 2 routes · implemented by `src/pages/regional/AshbyJob.jsx`

**`content.blog-teaser`** — "From our blog" row of recent post cards shown after a confirmation.

· Only /thank-you (1 route). · appears on 1 routes · implemented by `src/pages/company/ThankYou.jsx > PostCard`

### UTILITY

_Confirmation, error and placeholder pages that exist for flow rather than content._

**`utility.form-confirmation`** — "Thank you! We'll be in touch soon." confirmation heading with two (non-autoplaying) circular videos.

· Only /thank-you (1 route). · appears on 1 routes · implemented by `src/pages/company/ThankYou.jsx`

**`utility.event-confirmation`** — "Thank you for registering." matchday confirmation with video and imagery.

· Only /fcb/x/thank-you (1 route). · appears on 1 routes · implemented by `src/pages/regional/FcbThankYou.jsx`

**`utility.not-found`** — "404 - Oops Page Not Found in Data." page with spinning gradient blob and timed text reveals.

· Only /ashby (1 route), which renders the not-found page on live. · appears on 1 routes · implemented by `src/pages/regional/Ashby404.jsx`

**`utility.careers-embed-shell`** — Empty 600x400 careers-widget frame between nav and footer (the live embed renders nothing).

· Only /archive/comeet-style (1 route). · appears on 1 routes · implemented by `src/pages/regional/ComeetStyle.jsx`
