# Portfolio Builder TODO

Use this as the implementation tracker. Tick items only after the code is actually implemented and checked.

## Phase 1: Backend Foundation

- [x] Create `Portfolio` MongoDB model.
- [x] Create `PortfolioProject` MongoDB model.
- [x] Create portfolio controller.
- [x] Create portfolio routes.
- [x] Register `/api/portfolio` in the Express server.
- [x] Implement create portfolio from resume.
- [x] Implement portfolio list/detail/update/delete.
- [x] Implement portfolio project CRUD.
- [x] Implement publish/unpublish.
- [x] Implement public portfolio fetch by slug.
- [x] Implement simple public analytics counters.
- [x] Add basic backend syntax/import checks.

## Phase 2: Frontend Foundation

- [x] Create `client/src/api/portfolio.api.js`.
- [x] Add protected portfolio routes in `App.jsx`.
- [x] Add public route `/u/:slug`.
- [x] Create `PortfolioDashboard` page.
- [x] Create `PortfolioCreate` page.
- [x] Create `PortfolioEditor` page.
- [x] Create `PortfolioPreview` page.
- [x] Create `PublicPortfolio` page.
- [ ] Create portfolio layout/editor components.
- [ ] Create theme registry.
- [ ] Create portfolio data adapter.

## Phase 3: MVP Themes

- [ ] Build Minimal Developer theme.
- [ ] Build Modern Fresher theme.
- [ ] Build Professional Corporate theme.
- [x] Add theme picker UI.
- [ ] Add desktop/mobile preview mode.
- [x] Add empty-state handling for missing sections.
- [x] Add public not-found/unpublished states.
- [x] Add resume download CTA.
- [x] Add social/contact/project click tracking.

## Phase 4: AI Helpers

- [ ] Add AI endpoint for portfolio about section.
- [ ] Add AI endpoint for project description improvement.
- [ ] Add AI endpoint for SEO metadata.
- [ ] Add AI buttons in editor.
- [ ] Track AI usage and respect existing subscription limits.

## Phase 5: Monetization And Limits

- [ ] Add free plan portfolio limit.
- [ ] Add paid plan portfolio limits.
- [ ] Add theme access restrictions.
- [ ] Add SmartNShine branding toggle by plan.
- [ ] Add analytics access restrictions.
- [ ] Update pricing page copy.

## Phase 6: QA And Launch

- [ ] Test create-from-resume flow.
- [ ] Test editing and saving portfolio fields.
- [ ] Test project CRUD.
- [ ] Test publishing and unpublishing.
- [ ] Test public URL without login.
- [ ] Test that drafts are not publicly visible.
- [ ] Test owner-only access.
- [ ] Test mobile responsive public pages.
- [ ] Test free/pro restrictions.
- [x] Add dashboard navigation entry.
- [ ] Add release notes.
