# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Snapshot

Firefly Pico is a mobile-first Firefly III companion app for fast transaction entry, dashboards, icons, tags, templates, profiles, piggy banks, recurring transactions, and assistant-assisted expense logging.

The repo is split into:

- `front/`: Nuxt/Vue single-page PWA. Uses Vue 3 script setup, Pinia, Vant, Tabler icons, VueUse, i18n, SVGO, and local UI-kit components.
- `back/`: Laravel API. Mostly proxies Firefly III endpoints, while storing Pico-only extra fields and resources in its own database.
- `docker/` and `docker-compose*.yml`: production/container runtime setup for Pico alone or Pico plus Firefly III.
- `docs/`: images and public-facing documentation assets.

## Working Style

- Read the nearby code before editing. This project has strong local patterns; follow them instead of introducing new architecture.
- Keep changes small and directly connected to the request. Avoid drive-by refactors, formatting churn, or dependency updates unless they are part of the task.
- Protect user work. Check `git status --short` before larger edits and never overwrite unrelated modified files.
- Prefer existing helpers, constants, repositories, stores, transformers, and UI-kit components over one-off logic.
- When behavior touches both `front/` and `back/`, trace the full flow: route constant, page/component, repository, backend route/controller/model/migration if applicable.
- Validate the narrowest thing that proves the change, then broaden only when risk warrants it.

## Common Commands

Front end:

```powershell
cd front
npm install
npm run dev
npm run build
npm run lint
npm run lint:fix
```

Back end:

```powershell
cd back
composer install
php artisan serve
php artisan test
vendor\bin\pint
```

Docker examples from the repo root:

```powershell
docker compose -f docker-compose.pico.yml up
docker compose -f docker-compose.pico+firefly.yml up
```

Use the command that matches the scope of the change. Do not run expensive Docker builds unless the task needs container validation.

## Front-End Notes

- Nuxt is configured as `ssr: false`; treat the app as a client-side PWA.
- Components are auto-imported from `front/components` with `pathPrefix: false`; global components live under `front/components/global`.
- Pages live in `front/pages`; routes should be mirrored through `front/constants/RouteConstants.js` where app navigation depends on constants.
- Data access goes through classes in `front/repository`, usually extending `BaseRepository`.
- Domain shape lives in `front/models`, transformation in `front/transformers`, app-wide state in `front/stores`, and reusable behavior in `front/composables`.
- Use existing UI primitives in `front/components/ui-kit` and themed controls in `front/components/ui-kit/theme`.
- Keep the app mobile-first while preserving desktop layout paths such as `appStore.isDesktopLayout`.
- Use CSS variables and existing theme files in `front/assets/styles` for colors and spacing. Check both light and dark theme impact.
- Never hard code labels in HTML. Use i18n which is found in `front/i18n/locales`. When adding a key always provide translations for all languages there.
- Icons generally come from Tabler constants/components or the existing SVG icon assets. Avoid adding a new icon system.

## Back-End Notes

- Backend routes are registered in `back/routes/api.php`.
- `RouteUtils::makeCRUD(...)` is the normal CRUD route pattern.
- Firefly-backed controllers usually extend `App\Http\Controllers\Base\BaseControllerFirefly`.
- Pico-owned resources or local extensions use Laravel models, migrations, and controllers in the existing style.
- `BaseControllerFirefly` forwards auth/content headers to Firefly III and merges Pico-only model fields after Firefly responses when a model is supplied.
- Keep Firefly proxy behavior transparent unless a task explicitly requires Pico-specific enrichment.
- Prefer request/response shapes that match Firefly III and the current repositories, so the front end stays thin.

## Testing And Verification

- For front-end changes, run `npm run lint` and `npm run build` from `front/` when feasible.
- For backend PHP changes, run `php artisan test` or the relevant PHPUnit target from `back/`.
- Run `vendor\bin\pint` only when PHP formatting is part of the task or the touched files clearly need it.
- For localized JSON changes, parse the changed JSON files before finishing.
- For UI work, manually inspect the affected mobile and desktop states when possible.

## Data And Configuration

- Do not commit secrets, real Firefly tokens, personal database credentials, or local `.env` values.
- Docker compose examples contain placeholder credentials and paths. Preserve that style unless the user asks for a real deployment file.
- Be careful around local storage settings in the front end, especially auth token, backend URL, profiles, sync settings, and dashboard preferences.

## Collaboration Defaults

- If the request is implementation-oriented, make the change and verify it instead of stopping at a proposal.
- If requirements are ambiguous but the safe path is obvious, choose the conservative repo-native option and mention the assumption.
- If a change could affect user data, auth, migrations, proxy behavior, or Docker deployment, slow down and call out the risk.
- Leave the workspace cleaner than you found it, but do not "clean up" unrelated files.
