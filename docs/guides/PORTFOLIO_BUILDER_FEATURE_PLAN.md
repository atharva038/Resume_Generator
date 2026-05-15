# Portfolio Builder Feature Plan

## 1. Feature Vision

SmartNShine should evolve from an ATS resume builder into a career branding platform.

The new feature lets users turn their existing resume data plus extra portfolio-specific information into a public, mobile-responsive personal portfolio website with multiple themes.

Core promise:

> Create your ATS resume and portfolio website from one career profile.

This should feel like a natural extension of the current product, not a separate app. The resume remains the source of truth for core professional data, while the portfolio adds richer storytelling, visuals, links, project details, and recruiter-facing presentation.

## 2. Main User Value

Users currently need to maintain many separate career assets:

- Resume PDF
- LinkedIn profile
- GitHub profile
- Personal portfolio
- Project descriptions
- Cover letters
- Job-specific introductions

This feature reduces that effort by letting them enter information once and reuse it across resume, portfolio, and future career tools.

The strongest value proposition:

- Upload or create a resume.
- Add project images, links, and personal branding details.
- Choose a portfolio theme.
- Publish a public portfolio link in minutes.
- Use analytics later to see if recruiters viewed it.

## 3. Target Users

Start with users who get the most immediate benefit:

- College students
- Freshers
- Internship applicants
- Junior developers
- Full-stack developers
- Data analysts
- Designers with small project portfolios
- Freelancers
- Career switchers

Initial positioning:

> Build an ATS resume and professional portfolio link before applying for jobs and internships.

## 4. MVP Scope

The MVP should be intentionally focused. Build only what is required for a user to create, preview, publish, and share a useful portfolio.

### MVP Features

- Create portfolio from existing resume.
- Add/edit portfolio-specific profile data.
- Add/edit project cards with richer fields than resume projects.
- Choose from 3 themes.
- Preview desktop and mobile layouts.
- Publish/unpublish portfolio.
- Public portfolio URL.
- Resume download button on public portfolio.
- Contact/social links.
- Basic SEO fields.
- Basic AI help for about section and project descriptions.

### MVP Themes

1. Minimal Developer
   - Best for frontend, backend, full-stack, and software roles.
   - Emphasis on skills, projects, GitHub, live demos, and work experience.

2. Modern Fresher
   - Best for students and early-career users.
   - Emphasis on education, skills, certifications, internships, and mini projects.

3. Professional Corporate
   - Best for business, analyst, operations, HR, marketing, and non-technical roles.
   - Emphasis on summary, experience, achievements, and credibility.

### Out Of MVP

Keep these for later:

- Custom domains
- Advanced analytics
- Blog system
- Theme marketplace
- Drag-and-drop section builder
- Multiple portfolios per resume
- Static site export
- Recruiter password-protected view
- Heavy animation or 3D themes
- Paid custom design service

## 5. Product Architecture

Keep content separate from presentation.

Resume data should not be tightly coupled to one portfolio theme. Instead, build a portfolio model that references resume data and stores extra portfolio-specific information.

Recommended structure:

- `Resume`: existing professional source data.
- `Portfolio`: publish settings, selected theme, hero/about/SEO/configuration.
- `PortfolioProject`: richer project content with images, links, highlights, and ordering.
- `PortfolioView`: analytics event, added later or as a light MVP counter.

This allows the same portfolio data to render through different themes.

## 6. Recommended Data Models

### Portfolio Model

Create:

`server/models/Portfolio.model.js`

Suggested schema:

```js
{
  userId: ObjectId,
  resumeId: ObjectId,

  slug: String,
  title: String,
  tagline: String,
  professionalTitle: String,
  about: String,
  location: String,

  profileImage: String,
  heroImage: String,

  themeId: String,
  colorPreset: String,
  fontPreset: String,

  status: "draft" | "published" | "unpublished",
  publishedAt: Date,

  contact: {
    email: String,
    phone: String,
    showEmail: Boolean,
    showPhone: Boolean
  },

  socialLinks: [
    {
      label: String,
      url: String,
      type: "linkedin" | "github" | "twitter" | "website" | "leetcode" | "behance" | "dribbble" | "other"
    }
  ],

  sections: {
    showAbout: Boolean,
    showSkills: Boolean,
    showProjects: Boolean,
    showExperience: Boolean,
    showEducation: Boolean,
    showCertifications: Boolean,
    showAchievements: Boolean,
    showContact: Boolean
  },

  sectionOrder: [String],

  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  },

  settings: {
    showResumeDownload: Boolean,
    showSmartNShineBranding: Boolean,
    allowIndexing: Boolean
  },

  analytics: {
    totalViews: Number,
    resumeDownloads: Number,
    contactClicks: Number,
    projectClicks: Number
  }
}
```

Important indexes:

- Unique `slug`
- Compound `{ userId, resumeId }`
- `{ status, publishedAt }`

### Portfolio Project Model

Create:

`server/models/PortfolioProject.model.js`

Suggested schema:

```js
{
  userId: ObjectId,
  portfolioId: ObjectId,
  resumeProjectId: String,

  title: String,
  shortDescription: String,
  longDescription: String,

  problem: String,
  solution: String,
  impact: String,

  technologies: [String],
  role: String,
  duration: String,

  links: {
    live: String,
    github: String,
    caseStudy: String,
    video: String
  },

  images: [
    {
      url: String,
      alt: String,
      isCover: Boolean
    }
  ],

  highlights: [String],
  featured: Boolean,
  order: Number,
  visible: Boolean
}
```

## 7. Backend API Plan

Create:

- `server/controllers/portfolio.controller.js`
- `server/routes/portfolio.routes.js`
- `server/models/Portfolio.model.js`
- `server/models/PortfolioProject.model.js`

Register route in:

- `server/server.js`

```js
app.use("/api/portfolio", portfolioRoutes);
```

### Authenticated Routes

All dashboard/editor routes require `authMiddleware`.

```txt
POST   /api/portfolio/from-resume/:resumeId
GET    /api/portfolio
GET    /api/portfolio/:id
PUT    /api/portfolio/:id
DELETE /api/portfolio/:id

POST   /api/portfolio/:id/projects
PUT    /api/portfolio/:id/projects/:projectId
DELETE /api/portfolio/:id/projects/:projectId
PATCH  /api/portfolio/:id/projects/reorder

POST   /api/portfolio/:id/publish
POST   /api/portfolio/:id/unpublish
GET    /api/portfolio/:id/preview

POST   /api/portfolio/:id/ai/about
POST   /api/portfolio/:id/ai/project-description
POST   /api/portfolio/:id/ai/seo
```

### Public Routes

These should not require authentication.

```txt
GET  /api/portfolio/public/:slug
POST /api/portfolio/public/:slug/view
POST /api/portfolio/public/:slug/resume-download
POST /api/portfolio/public/:slug/contact-click
POST /api/portfolio/public/:slug/project-click
```

For MVP, analytics event endpoints can simply increment counters on the portfolio document.

Later, add a separate `PortfolioView` collection for detailed analytics.

## 8. Frontend Route Plan

Update:

- `client/src/App.jsx`

Recommended routes:

```txt
/portfolio
/portfolio/new
/portfolio/:id/edit
/portfolio/:id/preview
/portfolio/:id/analytics
/u/:slug
```

Protected routes:

- `/portfolio`
- `/portfolio/new`
- `/portfolio/:id/edit`
- `/portfolio/:id/preview`
- `/portfolio/:id/analytics`

Public route:

- `/u/:slug`

## 9. Frontend File Plan

Create pages:

```txt
client/src/pages/PortfolioDashboard.jsx
client/src/pages/PortfolioCreate.jsx
client/src/pages/PortfolioEditor.jsx
client/src/pages/PortfolioPreview.jsx
client/src/pages/PublicPortfolio.jsx
client/src/pages/PortfolioAnalytics.jsx
```

Create API module:

```txt
client/src/api/portfolio.api.js
```

Create components:

```txt
client/src/components/portfolio/PortfolioShell.jsx
client/src/components/portfolio/PortfolioSidebar.jsx
client/src/components/portfolio/PortfolioTopBar.jsx
client/src/components/portfolio/PortfolioThemePicker.jsx
client/src/components/portfolio/PortfolioSectionToggle.jsx
client/src/components/portfolio/PortfolioProjectEditor.jsx
client/src/components/portfolio/PortfolioPublishPanel.jsx
client/src/components/portfolio/PortfolioPreviewFrame.jsx
client/src/components/portfolio/PortfolioSeoPanel.jsx
client/src/components/portfolio/PortfolioSocialLinksEditor.jsx
```

Create theme components:

```txt
client/src/components/portfolio/themes/MinimalDeveloperTheme.jsx
client/src/components/portfolio/themes/ModernFresherTheme.jsx
client/src/components/portfolio/themes/ProfessionalCorporateTheme.jsx
client/src/components/portfolio/themes/themeRegistry.js
```

The theme registry should map theme IDs to React components and metadata.

Example:

```js
export const portfolioThemes = {
  minimalDeveloper: {
    id: "minimalDeveloper",
    name: "Minimal Developer",
    component: MinimalDeveloperTheme,
    allowedTiers: ["free", "one-time", "pro"]
  },
  modernFresher: {
    id: "modernFresher",
    name: "Modern Fresher",
    component: ModernFresherTheme,
    allowedTiers: ["free", "one-time", "pro"]
  },
  professionalCorporate: {
    id: "professionalCorporate",
    name: "Professional Corporate",
    component: ProfessionalCorporateTheme,
    allowedTiers: ["one-time", "pro"]
  }
};
```

## 10. User Flow

### Flow A: Create Portfolio From Existing Resume

1. User opens dashboard.
2. User clicks `Create Portfolio`.
3. App shows available resumes.
4. User selects one resume.
5. Backend creates a draft portfolio:
   - Copies name, title, summary, contact, skills, education, experience, projects.
   - Generates a suggested slug.
   - Creates portfolio projects from resume projects.
6. User lands in portfolio editor.
7. User chooses theme.
8. User edits about, projects, links, and visibility.
9. User previews.
10. User publishes.
11. User receives public URL.

### Flow B: Create Portfolio Without Existing Resume

This can be phase 2.

1. User clicks `Create Portfolio`.
2. User chooses `Start from scratch`.
3. User fills profile, skills, projects, and links.
4. User publishes.

For MVP, prioritize Flow A because this app already has resume data.

## 11. Portfolio Editor Structure

The editor should be simple and productive.

Recommended left navigation:

- Profile
- About
- Projects
- Experience
- Education
- Skills
- Certifications
- Social Links
- Theme
- SEO
- Publish

Recommended top bar:

- Back to dashboard
- Theme selector
- Desktop/mobile preview toggle
- Save status
- Preview
- Publish/unpublish

Editor behavior:

- Autosave after changes, or explicit save button for MVP.
- Use toast notifications for save/publish success.
- Warn before leaving with unsaved changes if using manual save.
- Allow section hide/show.
- Allow basic section ordering.

## 12. Public Portfolio Page Requirements

The public portfolio must be:

- Fast
- Mobile responsive
- SEO friendly
- Shareable
- Professional
- Free of dashboard UI
- Accessible enough for recruiters to scan quickly

Required sections:

- Hero
- About
- Skills
- Projects
- Experience
- Education
- Certifications
- Achievements
- Contact/social links
- Resume download

Required states:

- Loading
- Portfolio not found
- Portfolio unpublished
- Theme render fallback
- Missing optional sections

## 13. AI Feature Plan

Use existing AI service patterns from the resume feature.

### MVP AI Features

1. Generate Portfolio About
   - Input: resume summary, experience, skills, projects, target role.
   - Output: 1 polished about section.

2. Improve Project Description
   - Input: project name, short description, tech stack, bullets.
   - Output: portfolio-friendly project description and 3 highlights.

3. Generate SEO Metadata
   - Input: name, title, skills, location, target role.
   - Output: SEO title, meta description, keywords.

### Later AI Features

- Generate full portfolio from resume.
- Recommend best theme based on resume.
- Generate recruiter-friendly project case studies.
- Generate role-specific portfolio versions.
- Score portfolio completeness.
- Compare portfolio against target job description.

## 14. Subscription And Monetization Plan

Use the current subscription architecture instead of creating a separate payment system.

### Suggested Limits

Free:

- 1 portfolio
- 2 free themes
- SmartNShine branding visible
- Basic public URL
- Limited AI generations

One-time:

- 2 portfolios
- More themes
- Branding optional
- More AI generations

Pro:

- Unlimited or higher portfolio limit
- Premium themes
- Remove branding
- Analytics
- Custom domain, later
- Role-specific portfolio versions, later

### Premium Features

- Premium themes
- Remove SmartNShine branding
- Analytics dashboard
- Custom domain
- Multiple portfolios
- Advanced AI generation
- Export static site

## 15. SEO Plan

Public portfolio pages should have:

- Dynamic title
- Meta description
- Open Graph tags
- Twitter card tags
- Canonical URL
- Clean slug
- Public index toggle

For Vite/React SPA, dynamic metadata can be handled client-side initially with `react-helmet-async`.

Later, if SEO becomes important, consider:

- Server-side rendered public portfolio pages
- Static pre-rendering for published portfolios
- Sitemap generation

## 16. Analytics Plan

### MVP Analytics

Store simple counters on the Portfolio model:

- Total views
- Resume downloads
- Contact clicks
- Project clicks

Show these in a simple dashboard card layout.

### Advanced Analytics

Later model:

`server/models/PortfolioView.model.js`

Suggested fields:

```js
{
  portfolioId: ObjectId,
  userId: ObjectId,
  eventType: "view" | "resume_download" | "contact_click" | "project_click",
  projectId: ObjectId,
  referrer: String,
  userAgent: String,
  ipHash: String,
  country: String,
  deviceType: String,
  createdAt: Date
}
```

Do not store raw IP addresses long-term unless the privacy policy is updated and there is a clear reason.

## 17. Security And Privacy Requirements

- Only portfolio owner can edit private portfolio data.
- Public route returns only published portfolio data.
- Never expose user auth data, billing data, admin data, or internal IDs unnecessarily.
- Validate and sanitize portfolio fields.
- Validate URLs for social/project links.
- Rate limit public analytics endpoints.
- Protect image upload endpoints.
- Allow users to unpublish instantly.
- Add `allowIndexing` option for users who do not want Google indexing.
- Update privacy policy before advanced analytics or visitor tracking.

## 18. Image Upload Plan

For MVP, there are two choices.

Option A: Use external URLs only.

- Fastest to build.
- User pastes image URLs.
- Less polished.

Option B: Upload images to server storage.

- Better product.
- Requires file validation and storage management.

Recommended MVP path:

- Start with external image URLs for project images.
- Add upload support in phase 2 using the existing multer pattern.

Future upload targets:

- Local uploads for development
- Cloudinary
- S3-compatible object storage
- Firebase Storage

## 19. Theme Design Requirements

Themes must be more than color changes. Each theme should have different layout emphasis.

### Minimal Developer Theme

Tone:

- Clean
- Technical
- Fast to scan

Layout:

- Hero with name, role, GitHub/LinkedIn/live links
- Skills grouped by category
- Featured projects first
- Experience timeline
- Education compact
- Resume button always visible

Best for:

- Developers
- Engineers
- Technical students

### Modern Fresher Theme

Tone:

- Energetic
- Clear
- Student-friendly

Layout:

- Hero with open-to-work style call-to-action
- Education and skills near top
- Projects with learning outcomes
- Certifications and achievements emphasized
- Experience optional

Best for:

- Students
- Freshers
- Internship applicants

### Professional Corporate Theme

Tone:

- Polished
- Conservative
- Trust-focused

Layout:

- Strong summary
- Experience first
- Achievements and measurable impact
- Projects/case work secondary
- Contact section formal

Best for:

- Analysts
- Managers
- HR
- Marketing
- Business roles

## 20. Implementation Timeline

This timeline assumes one developer working part-time to full-time. If working consistently, MVP can be completed in about 4 weeks.

## Week 1: Foundation And Backend

Goal:

Build the data layer and core API so portfolio drafts can be created from resumes.

Tasks:

- Create `Portfolio.model.js`.
- Create `PortfolioProject.model.js`.
- Create `portfolio.routes.js`.
- Create `portfolio.controller.js`.
- Add portfolio routes to `server/server.js`.
- Implement create-from-resume endpoint.
- Implement portfolio list/detail/update/delete.
- Implement slug generation and uniqueness check.
- Implement project CRUD.
- Implement publish/unpublish.
- Implement public portfolio fetch by slug.
- Add validation for slug, links, and required fields.
- Add basic tests or manual API testing checklist.

Deliverable:

- Authenticated user can create a draft portfolio from a resume.
- Public API can fetch a published portfolio by slug.

## Week 2: Dashboard, Editor, And Theme System

Goal:

Build the frontend management experience and render theme previews.

Tasks:

- Create `portfolio.api.js`.
- Add protected routes in `App.jsx`.
- Create `PortfolioDashboard`.
- Create `PortfolioCreate`.
- Create `PortfolioEditor`.
- Create `PortfolioPreview`.
- Create `PublicPortfolio`.
- Create theme registry.
- Create theme data adapter.
- Build basic editor sections:
  - Profile
  - About
  - Projects
  - Skills
  - Experience
  - Education
  - Social links
  - Publish
- Implement save/update behavior.
- Implement desktop/mobile preview toggle.
- Implement section visibility settings.

Deliverable:

- User can create, edit, preview, and publish a portfolio from the UI.

## Week 3: MVP Themes And Polish

Goal:

Make the public portfolio look good enough to launch.

Tasks:

- Build `MinimalDeveloperTheme`.
- Build `ModernFresherTheme`.
- Build `ProfessionalCorporateTheme`.
- Make all themes mobile responsive.
- Add missing/empty section handling.
- Add resume download CTA.
- Add contact/social CTA.
- Add public not-found/unpublished pages.
- Add theme picker with thumbnails or preview cards.
- Add SEO fields in editor.
- Add public page metadata handling.
- Add loading/error states.
- Add copy public link button.

Deliverable:

- 3 polished themes are ready for real users.

## Week 4: AI, Analytics Lite, QA, And Launch

Goal:

Add differentiation and prepare the feature for release.

Tasks:

- Add AI generate portfolio about endpoint.
- Add AI improve project description endpoint.
- Add AI generate SEO endpoint.
- Add usage tracking for AI calls.
- Add simple analytics counters:
  - Views
  - Resume downloads
  - Contact clicks
  - Project clicks
- Add `PortfolioAnalytics` page with basic cards.
- Add subscription limits.
- Add free/pro theme restrictions.
- QA public pages on mobile and desktop.
- QA permissions:
  - User cannot edit another user's portfolio.
  - Public cannot view draft portfolio.
- Update dashboard navigation.
- Update pricing page copy if needed.
- Add release notes/changelog.

Deliverable:

- MVP ready to release as beta.

## 21. Detailed Step-By-Step Build Guide

### Step 1: Define Portfolio Data Contract

Create a shared mental contract for the data themes consume.

Recommended normalized shape:

```js
{
  portfolio: {},
  resume: {},
  projects: [],
  owner: {
    name,
    email
  }
}
```

Create a frontend adapter:

```txt
client/src/components/portfolio/themes/adaptPortfolioData.js
```

This adapter should convert backend data into a stable shape for every theme.

### Step 2: Backend Models

Add portfolio and project models.

Key rules:

- `userId` is required.
- `resumeId` should be optional later, but required for MVP create-from-resume.
- `slug` must be unique.
- `status` defaults to `draft`.
- `themeId` defaults to `minimalDeveloper`.
- Analytics counters default to `0`.

### Step 3: Create From Resume Endpoint

Endpoint:

```txt
POST /api/portfolio/from-resume/:resumeId
```

Behavior:

- Verify resume belongs to user.
- Create portfolio from resume fields.
- Generate slug from name.
- Copy resume projects into `PortfolioProject`.
- Return created portfolio with projects.

Slug examples:

- `atharva-patil`
- `atharva-patil-2`
- `atharva-full-stack-developer`

### Step 4: Portfolio CRUD

Implement:

```txt
GET /api/portfolio
GET /api/portfolio/:id
PUT /api/portfolio/:id
DELETE /api/portfolio/:id
```

Rules:

- Only owner can access private endpoints.
- Delete should also delete related portfolio projects.
- Update should not allow changing `userId`.

### Step 5: Publish System

Implement:

```txt
POST /api/portfolio/:id/publish
POST /api/portfolio/:id/unpublish
```

Before publishing, validate:

- Slug exists and is unique.
- Portfolio has a title/name.
- At least one contact/social link exists.
- At least one visible section exists.

### Step 6: Public Fetch

Endpoint:

```txt
GET /api/portfolio/public/:slug
```

Rules:

- Return only if `status === "published"`.
- Include resume-derived data that is safe to show.
- Include visible projects only.
- Do not require auth.

### Step 7: Frontend API Module

Create:

```txt
client/src/api/portfolio.api.js
```

Functions:

```js
listPortfolios()
createPortfolioFromResume(resumeId)
getPortfolio(id)
updatePortfolio(id, payload)
deletePortfolio(id)
createProject(portfolioId, payload)
updateProject(portfolioId, projectId, payload)
deleteProject(portfolioId, projectId)
publishPortfolio(id)
unpublishPortfolio(id)
getPublicPortfolio(slug)
trackPortfolioView(slug)
```

### Step 8: Dashboard Page

Create:

```txt
client/src/pages/PortfolioDashboard.jsx
```

Show:

- List of portfolios
- Status badge
- Theme name
- Public link if published
- Last updated date
- Buttons:
  - Edit
  - Preview
  - Publish/unpublish
  - Copy link

### Step 9: Create Page

Create:

```txt
client/src/pages/PortfolioCreate.jsx
```

Flow:

- Fetch user's resumes.
- Show resume cards.
- User selects resume.
- Call create-from-resume API.
- Redirect to editor.

### Step 10: Editor Page

Create:

```txt
client/src/pages/PortfolioEditor.jsx
```

Editor should manage:

- Portfolio fields
- Project list
- Theme
- Section visibility
- Social links
- SEO
- Publish settings

For MVP, use explicit save buttons per panel or one global save button. Autosave can come later.

### Step 11: Theme Registry

Create:

```txt
client/src/components/portfolio/themes/themeRegistry.js
```

Each theme should receive:

```js
<ThemeComponent data={adaptedData} mode="public" />
```

Preview mode can use:

```js
<ThemeComponent data={adaptedData} mode="preview" />
```

### Step 12: Public Portfolio Page

Create:

```txt
client/src/pages/PublicPortfolio.jsx
```

Behavior:

- Read `slug` from URL.
- Fetch public portfolio.
- Resolve theme from registry.
- Render not found/unpublished states.
- Track view once per page load.
- Track clicks for resume/contact/project CTAs.

### Step 13: AI Endpoints

Use existing AI service style.

Prompts should be constrained and structured.

Example output format for project improvement:

```json
{
  "shortDescription": "",
  "longDescription": "",
  "highlights": ["", "", ""]
}
```

This avoids messy parsing.

### Step 14: Subscription Limits

Add helper logic in subscription middleware or controller:

```js
canCreatePortfolio(user)
canUseTheme(user, themeId)
canRemoveBranding(user)
canViewPortfolioAnalytics(user)
```

Start simple. Do not overbuild.

### Step 15: QA Checklist

Test these before release:

- User can create portfolio from resume.
- User can edit profile/about/projects.
- User can change theme.
- User can publish.
- Public URL works without login.
- Draft URL does not expose data.
- User cannot access another user's portfolio editor.
- Public page works on mobile.
- Empty optional sections do not break layout.
- Broken image URLs do not destroy layout.
- Resume download button works.
- Copy link works.
- AI buttons handle loading/error states.
- Free user limits work.
- Pro user limits work.

## 22. Launch Strategy

### Beta Launch

Launch to existing users first.

Dashboard banner:

> New: Turn your resume into a portfolio website.

CTA:

> Create Portfolio

### Suggested Home Page Copy

Add a section:

> Resume + Portfolio in One Place
>
> Build an ATS-friendly resume and instantly turn it into a professional portfolio link you can share with recruiters.

### Suggested Pricing Copy

Free:

- 1 portfolio
- Basic themes

Pro:

- Premium themes
- Analytics
- Remove branding
- More AI portfolio writing

## 23. Success Metrics

Track:

- Number of portfolios created
- Number of portfolios published
- Create-to-publish conversion rate
- Public portfolio views
- Resume downloads from portfolio
- AI generation usage
- Free-to-pro upgrades caused by portfolio limits
- Most used theme
- Most abandoned editor step

Good early target:

- 30 percent of users who have a resume create a portfolio.
- 50 percent of created portfolios get published.
- 10 percent of published portfolios receive at least one external view.

## 24. Risks And Mitigations

Risk: Feature becomes too big.

Mitigation:

- MVP only supports create-from-resume, 3 themes, and basic publishing.

Risk: Themes look generic.

Mitigation:

- Make themes structurally different, not just color variations.

Risk: Public portfolios expose private data.

Mitigation:

- Add explicit visibility toggles and public response filtering.

Risk: SEO is weak in SPA.

Mitigation:

- Start with metadata support, then consider SSR/pre-rendering later.

Risk: Users do not have good project data.

Mitigation:

- Use AI to improve descriptions and suggest missing fields.

Risk: Image upload delays launch.

Mitigation:

- MVP supports image URLs first, upload later.

## 25. Suggested Build Order

Use this exact order to avoid getting stuck:

1. Backend models
2. Backend create-from-resume
3. Backend public fetch
4. Frontend public theme renderer with mocked data
5. Frontend dashboard
6. Frontend create-from-resume flow
7. Frontend editor
8. Theme picker
9. Publish/unpublish
10. Public URL
11. AI helpers
12. Analytics counters
13. Subscription limits
14. QA and beta launch

## 26. First Work Session Checklist

Start here when development begins:

- Create a branch: `feature/portfolio-builder`
- Add backend models.
- Add backend routes/controller.
- Register `/api/portfolio`.
- Implement `POST /api/portfolio/from-resume/:resumeId`.
- Test with one existing resume.
- Confirm draft portfolio is created in MongoDB.
- Confirm projects are copied into portfolio projects.

When this works, the feature has a real foundation.

## 27. Recommended MVP Definition Of Done

The MVP is complete when:

- A logged-in user can create a portfolio from a resume.
- The user can edit portfolio profile/about/projects/social links.
- The user can choose one of 3 themes.
- The user can preview before publishing.
- The user can publish and unpublish.
- The public portfolio link works without login.
- The public portfolio is mobile responsive.
- Free/pro restrictions are respected.
- Basic AI about/project/SEO generation works.
- Basic analytics counters work.
- The feature is linked from the dashboard.

## 28. Future Roadmap

### Phase 2

- Image uploads
- Better analytics
- More themes
- Portfolio completeness score
- Drag-and-drop section ordering
- More AI suggestions
- Multiple portfolios per user

### Phase 3

- Custom domains
- Static site export
- Blog/case study pages
- Password-protected portfolio
- Job-specific portfolio versions
- GitHub project importer
- LinkedIn profile generator

### Phase 4

- Theme marketplace
- Recruiter lead capture
- Portfolio review service
- AI career brand coach
- Application tracking integration

## 29. Final Product Direction

The portfolio builder should not feel like an isolated template tool. It should become part of a bigger SmartNShine career profile system.

Long-term product direction:

> One career profile. Many professional outputs.

Those outputs can include:

- ATS resume
- Portfolio website
- Cover letter
- LinkedIn summary
- Job-specific profile
- Interview preparation
- Application tracker

This makes the SaaS more defensible because users are not just creating one document. They are building and maintaining their professional identity inside SmartNShine.
