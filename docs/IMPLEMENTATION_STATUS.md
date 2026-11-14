# Implementation status

Updated: 2026-11-14

## Completed in foundation branch

- Reused existing nas393/MusicHub repository and isolated changes on foundation/arabic-music-archive; main remains untouched.
- Added product architecture, source/rights policy and provider integration matrix.
- Added initial PostgreSQL catalog and rights schema (not yet provisioned/applied).
- Added Next.js + TypeScript Arabic RTL responsive app shell and PWA manifest/icon.
- Added provider-neutral catalog types, Arabic text normalization and fail-closed playback/broadcast policy helpers.
- Hardened the legacy Internet Archive route: metadata and canonical item links only; no guessed MP3 paths or mock audio fallback.
- Added live MusicBrainz recording metadata search API with server-side request, User-Agent, timeout and cache policy.
- Connected the web search field to the catalog API with debouncing, loading/error/empty states and source-record links.
- Added responsive search-result presentation and clear metadata-only / rights-not-verified messaging.
- Added GitHub Actions workflow for TypeScript checks and Next.js production build.

## Current capability

The search experience can query MusicBrainz recording metadata through the app API. It does not stream audio. Each result links to its MusicBrainz source record and is explicitly labelled metadata-only. Arabic text normalization is used for local category filtering; provider search itself uses the original query.

## In progress

- CI validation of the web app.
- Provider adapter and official playback integrations.
- Database-backed catalog, user accounts and personal library.

## Provider and rights constraints

- MusicBrainz supplies metadata, not audio. Respect API rate limits and use a descriptive User-Agent.
- Spotify playback is provider-controlled; full playback requires the appropriate user subscription and the product cannot merge Spotify streams into a multi-service radio broadcast.
- Jamendo's API terms need legal/permission review before it becomes a core catalog/playback provider.
- Internet Archive item metadata is not proof of public-domain status or broadcast clearance.
- Commercial track playback must remain on official provider links/players unless a separate license explicitly authorizes direct streaming.
- Public radio transmission stays disabled until master recording, composition/publishing, performer/neighboring-rights and territory-specific broadcast permissions are documented.

## Not yet done

- No database has been provisioned and no schema has been applied.
- No provider API credentials/accounts are connected.
- No commercial provider player is integrated yet.
- No music catalog has been imported into a persistent database.
- No authentication, favorites or playlists are connected to persistent storage.
- No radio broadcast capability is enabled.
- No production deployment has been created.
- No build result is claimed until CI completes.

## Next engineering sequence

1. Complete and fix CI typecheck/build.
2. Add official provider adapters and track-level source/playback metadata.
3. Add official provider playback/link UI, without extracting audio.
4. Provision database only after reviewing cost, region and backups.
5. Add authentication and personal library.
6. Test mobile/desktop and deploy a preview.
