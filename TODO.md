# TODO - Index/Page/Login + 404 + Login Fixes

- [x] Update `server.js` routes so:
  - `/` serves `public/index.html` (dashboard)
  - `/index.html` explicitly serves `public/index.html`
  - `/login` serves `public/login.html`
- [x] Add a safe 404 handler for non-API routes (and JSON for `/api/*`) to avoid confusing 404s.
- [ ] Restart dev server and verify:
  - `GET /` loads dashboard
  - `GET /login` loads login
  - Successful login redirects to `/index.html` without 404


