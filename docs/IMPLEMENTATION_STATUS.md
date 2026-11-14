# Implementation status

Updated: 2026-11-14

## Completed in foundation branch

- Confirmed and reused the existing nas393/MusicHub repository.
- Created isolated branch foundation/arabic-music-archive; main was not modified.
- Added product README, architecture, source/rights policy and provider integration matrix.
- Added initial PostgreSQL schema for artists, aliases, albums, genres, songs, contributors, source provenance, rights status, playlists and favorites.
- Added Next.js + TypeScript app scaffold and an Arabic RTL responsive dashboard shell.
- Added initial web app manifest and SVG app icon.
- Added provider-neutral catalog types, Arabic normalization utilities and fail-closed personal playback/broadcast policy helpers.
- Replaced the legacy Internet Archive route on the feature branch: it now returns metadata and canonical item links only, with rights/availability unknown; it no longer guesses MP3 URLs or returns mock sample audio.

## In progress

- Phase 1 source/provider due diligence.
- Catalog search API and provider adapter implementation.
- Connecting the UI to live metadata sources.

## Critical findings

- Spotify's developer policy limits full-track streaming to Premium users, prohibits non-interactive broadcasting, restricts commercial use and prohibits integration with streams/content from other services. The product must keep playback provider-specific.
- Jamendo's API terms include limits on commercial use, offline access and replicating its overall service experience. Do not make Jamendo a core source without written approval/legal review.
- MusicBrainz can supply metadata, not recordings. Its public API requires a meaningful User-Agent and no more than one request per second; commercial use requires a commercial plan.
- Internet Archive search metadata alone does not prove a recording is public domain or cleared for broadcasting.

## Not yet done

- No database has been provisioned and no schema has been applied.
- No API keys or provider accounts have been connected.
- No production Vercel project or deployment has been created.
- No music catalog has been imported; no tracks are represented as playable.
- No radio broadcast capability is enabled.
- Build and device QA have not yet run; this branch has not been merged to main.

## Next engineering sequence

1. Implement provider adapters with rate limits, caching and metadata provenance.
2. Add source-specific playback resolution and rights review workflows.
3. Connect catalog search/browse APIs to the web UI.
4. Add private authentication, favorites and playlists.
5. Validate the build, provider errors, accessibility and mobile behavior.
6. Review hosting/database configuration and costs before provisioning.
7. Deploy a preview after the build is valid; keep production and radio transmission disabled until their respective gates pass.
