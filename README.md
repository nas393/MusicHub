# Arabic Music Archive

A legal-first Arabic music discovery, cataloguing and listening platform for personal use, with a separately gated path toward licensed radio broadcasting.

## Product scope

- Search Arabic music across artists, songs, albums, genres, countries and release years.
- Normalize Arabic and Latin spellings to improve discovery.
- Aggregate metadata and playback destinations from authorized providers.
- Prefer free-to-listen tracks whose individual license can be verified.
- Link to or embed official commercial streaming destinations where provider terms permit.
- Keep rights evidence and playback restrictions attached to each source/track.
- Provide a responsive web app and installable PWA. Local mode stores catalog preferences and playlists; it does not imply offline copies of copyrighted recordings.
- Prepare a Radio Studio module, disabled for public broadcast until required recording, composition, performance and territory-specific rights are verified.

## Non-goals

- No scraping or ripping from YouTube, Spotify, Anghami, Deezer or other services.
- No bypassing subscriptions, geo-restrictions, DRM or platform playback controls.
- No fabricated MP3 URLs or mock tracks presented as real catalog results.
- No redistribution or hosting of copyrighted audio without explicit authorization.

## Initial repository status

This repository previously contained a small Internet Archive search route. That route must be treated as untrusted legacy code: metadata search results are not proof of audio rights or a valid playable file. The new foundation documents the intended data model and source policy before replacing the legacy integration.

## Planned architecture

- Web: Next.js + TypeScript, responsive PWA.
- API: server-side provider adapters; provider credentials stay server-side.
- Database: PostgreSQL (Neon candidate; provision only after configuration and cost review).
- Search: PostgreSQL full-text search plus Arabic normalization and transliteration aliases.
- Playback: official embeds, authorized provider players, or direct streams only where the source explicitly permits them.
- Hosting: Vercel candidate.
- Local experience: installable PWA with local preferences and cached metadata only where permitted.

## Delivery gates

1. Source audit and provider terms.
2. Catalog schema and ingestion validation.
3. Search and browse experience.
4. Legal playback integrations.
5. PWA and synchronization.
6. Radio Studio rights gate and broadcast review.
7. Security, QA and production release.

See docs/ARCHITECTURE.md, docs/SOURCE_POLICY.md, and database/schema.sql.
