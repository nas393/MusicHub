# Arabic Music Archive — Architecture

## Product principles

1. Metadata discovery is separate from audio playback rights.
2. Every playable item has a provider, provider item ID, playback mode, territory constraints, attribution requirements and a rights-review status.
3. Official commercial services retain control of their own streams; the app never extracts or re-hosts those streams.
4. Local mode is a PWA experience, not a mechanism for downloading copyrighted recordings.
5. Radio broadcasting is a separate rights workflow, not an extension of personal listening permission.

## Core modules

### Catalog
Artists, contributors, songs, albums, releases, genres, countries, languages, aliases and artwork references.

### Provider adapters
Each provider is isolated behind a common adapter contract: search(query, filters), getTrack(providerTrackId), getArtist(providerArtistId), getAlbum(providerAlbumId), resolvePlayback(providerTrackId, userContext), normalizeMetadata(providerPayload). An adapter must return provenance and licensing fields. If rights are unknown, the result may be discoverable but must not be labelled free or radio-cleared.

### Search
- Normalize Arabic presentation forms and diacritics.
- Support Arabic and Latin artist/title aliases.
- Preserve the original display spelling.
- Filter by genre, artist, country, language, decade and exact/estimated release year.
- Deduplicate by provider IDs and, where available, ISRC plus title/artist similarity.

### Playback
Supported modes: official_embed (provider-controlled embedded player), official_link (open the official track/album page), authorized_stream (direct stream explicitly permitted by provider terms and track license).

Never synthesize a media URL from an archive identifier. Never fall back to sample audio when a provider fails.

### Personal library
Favorites, playlists, listening history (opt-in), saved searches and local preferences. Users can export their metadata and playlist references.

### Radio Studio
Scheduling and automation may be developed as a private draft tool. Actual public transmission remains locked until applicable master recording, composition/publishing, performer/neighboring-rights, territory, platform and commercial-use permissions have been documented.

## Suggested stack

- Next.js + TypeScript for web/PWA.
- PostgreSQL for catalog, users, playlists, source provenance and rights records.
- Server-side provider adapters to protect API credentials.
- Vercel for hosting, subject to deployment configuration.
- Neon as a candidate PostgreSQL host; do not provision until cost/region/backup choices are approved.

## Environments and secrets

- No provider secrets in client bundles or Git.
- Use environment variables in deployment settings.
- Keep separate development and production credentials.
- Apply rate limits and cache provider metadata within provider terms.
- Record provider attribution and terms URLs with each adapter.

## Quality gates

- Search result provenance is visible.
- No false claim that a track is free.
- No playable control for unavailable or blocked items.
- Rights status is explicit: unknown, personal_use_only, cc_verified, public_domain_verified, commercial_license_verified, broadcast_cleared, restricted.
- Automated tests cover Arabic normalization, provider errors, deduplication and rights gating.
