# Implementation status

Updated: 2026-11-14

## Completed in foundation branch

- Confirmed and reused the existing nas393/MusicHub repository.
- Created isolated branch foundation/arabic-music-archive; main was not modified.
- Added product README, architecture, source/rights policy and provider integration matrix.
- Added initial PostgreSQL schema for artists, aliases, albums, genres, songs, contributors, source provenance, rights status, playlists and favorites.
- Added Next.js + TypeScript app scaffold and an Arabic RTL responsive dashboard shell.
- Added initial web app manifest.

## In progress

- Phase 1 source/provider due diligence.
- Catalog model and Arabic normalization implementation.
- Replacing the legacy Internet Archive endpoint with a fail-closed provider adapter.

## Critical findings

- The legacy backend route currently fabricates direct MP3 paths from Internet Archive identifiers and returns generic sample audio when provider calls fail. This must be removed before any production release.
- Spotify's developer policy limits full-track streaming to Premium users, prohibits non-interactive broadcasting, restricts commercial use and prohibits integration with streams/content from other services. The product must keep playback provider-specific.
- Jamendo's API terms include limits on commercial use, offline access and replicating its overall service experience. Do not make Jamendo a core source without written approval/legal review.
- Internet Archive search metadata alone does not prove a recording is public domain or cleared for broadcasting.

## Not yet done

- No database has been provisioned and no schema has been applied.
- No API keys or provider accounts have been connected.
- No production Vercel project or deployment has been created.
- No music catalog has been imported; no tracks are represented as playable.
- No radio broadcast capability is enabled.
- Build and device QA have not yet run; this branch has not been merged to main.

## Next engineering sequence

1. Implement Arabic normalization and provider-neutral catalog types.
2. Replace the legacy songs route with source-specific adapters that never guess media URLs or fabricate results.
3. Implement source provenance and rights-gated playback resolution.
4. Add catalog search/browse APIs and connect the UI.
5. Validate the build and provider error handling.
6. Review hosting/database configuration and costs before provisioning.
7. Deploy a preview after the build is valid; keep production and radio transmission disabled until their respective gates pass.
