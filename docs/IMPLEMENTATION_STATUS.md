# Implementation status

Updated: 2026-11-14

## Completed in foundation branch

- Reused existing nas393/MusicHub repository and isolated changes on foundation/arabic-music-archive; main remains untouched.
- Added product architecture, source/rights policy and provider integration matrix.
- Added initial PostgreSQL catalog and rights schema (not yet provisioned/applied).
- Added Next.js + TypeScript Arabic RTL responsive app shell and PWA manifest/icon.
- Added provider-neutral catalog types, Arabic text normalization and fail-closed playback/broadcast policy helpers.
- Hardened the legacy Internet Archive route: metadata and canonical item links only; no guessed MP3 paths or mock audio fallback.
- Added live MusicBrainz recording metadata search API with server-side request, descriptive User-Agent, timeout and caching.
- Connected the web search field to the catalog API with debouncing, loading/error/empty states and source-record links.
- Added responsive search-result presentation and metadata-only / rights-not-verified messaging.
- Added recording lookup API that resolves known streaming relationships to official provider pages (Spotify, Apple Music, YouTube, SoundCloud, Anghami, Deezer and TIDAL) only when those links are present in the MusicBrainz record.
- Added UI to request and open those official provider links. No audio extraction or re-hosting.
- Added GitHub Actions workflow for TypeScript checks and Next.js production build.

## Current capability

The app can search MusicBrainz recording metadata and, on demand, look up known streaming-page relationships recorded for that recording. Official links open the provider's own website/app; they do not bypass subscription requirements, regional restrictions or provider terms. The app still does not stream or host copyrighted audio.

## Validation

- GitHub Actions TypeScript check and production build passed for commit a7c7664bf35d6c56a866a1a6c86f08e47d6d2d58.
- Validation is running again after adding the official-provider-link lookup and UI. Do not treat the latest changes as validated until that run completes.

## Provider and rights constraints

- MusicBrainz supplies metadata and relationship links, not audio. Respect API rate limits and use a descriptive User-Agent.
- Spotify playback remains provider-controlled; subscription and developer policy restrictions apply. Do not merge Spotify streams into a multi-service radio broadcast.
- Jamendo's API terms need legal/permission review before it becomes a core catalog/playback provider.
- Internet Archive item metadata is not proof of public-domain status or broadcast clearance.
- Commercial track playback must remain on official provider links/players unless a separate track-specific license explicitly authorizes direct streaming.
- Public radio transmission stays disabled until master recording, composition/publishing, performer/neighboring-rights and territory-specific broadcast permissions are documented.

## Not yet done

- No database has been provisioned and no schema has been applied.
- No provider API credentials/accounts are connected.
- No full commercial provider player SDK is integrated yet; current commercial path is official outbound links.
- No music catalog has been imported into a persistent database.
- No authentication, favorites or playlists are connected to persistent storage.
- No radio broadcast capability is enabled.
- No production deployment has been created.
- Mobile/desktop QA has not been completed.

## Next engineering sequence

1. Complete CI validation for official-provider links.
2. Add provider-specific official embeds/players where the terms and user account support them.
3. Provision the database after reviewing cost, region and backups.
4. Add authentication and personal library.
5. Test mobile/desktop and deploy a preview.
