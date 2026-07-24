# TGN Africa Editorial Platform — Next.js

A component-based React conversion of the supplied Stitch editorial homepage for The Gospel Network Africa.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Framer Motion
- Three.js

## Run locally

```bash
npm install
npm run dev
```

## Supabase setup

The application now reads and writes publications, authors, topics, settings,
comments, reactions, bookmarks, reminders, and analytics through Supabase.

1. Authenticate and link the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref eiltvtbrbtfhegrvlgdb
```

2. Apply the schema and import the starter records:

```bash
npx supabase db push
npm run supabase:seed
```

3. Create a user in Supabase Authentication, then promote it once:

```bash
npm run supabase:promote-admin -- you@example.com
```

4. Restart the Next.js development server and sign in at `/admin/login`.

Keep `SUPABASE_SECRET_KEY` server-only. Never add a `NEXT_PUBLIC_` prefix to it.
Rotate any secret that has been pasted into chat, logs, or source control.

Production build:

```bash
npm run build
npm run start
```

## Project structure

```text
app/                  Next.js routes and metadata
src/
  components/      Reusable homepage sections and interactions
  data/content.js  Temporary frontend content source
  views/           Interactive page-level views used by App Router routes
  index.css         Tailwind layers and global editorial styles
```

## Important implementation notes

1. The Stitch export used remote Google-hosted image URLs. They are retained temporarily in `src/data/content.js`. For production, download approved images into `src/assets` or move them to a media service such as Cloudinary or Supabase Storage.
2. All article, category, pathway, and navigation content is data-driven so it can later come from a CMS or API.
3. The Three.js book presentation is implemented as a React component with proper resize handling and cleanup.
4. Current links are placeholders. Add React Router when the article listing, article detail, series, category, contributor, search, and static-information pages are implemented.

## Recommended next application modules

- Authentication and editorial roles
- Admin dashboard
- Articles, series, categories, tags, and contributors
- Rich-text editor with drafts and publishing workflow
- Search
- Newsletter subscriptions
- Media library
- SEO metadata and social cards
- Analytics

## Suggested content model

### Article

- `id`
- `slug`
- `title`
- `excerpt`
- `body`
- `featuredImage`
- `categoryId`
- `authorId`
- `seriesId`
- `status`
- `publishedAt`
- `readingTime`
- `seoTitle`
- `seoDescription`

### Category

- `id`
- `name`
- `slug`
- `description`
- `icon`

### Series

- `id`
- `title`
- `slug`
- `description`
- `coverImage`
- `status`

### Contributor

- `id`
- `name`
- `slug`
- `bio`
- `photo`
- `socialLinks`
