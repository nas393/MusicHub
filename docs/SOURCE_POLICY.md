# Source and Music Rights Policy

## Default rule

A recording is not free merely because it can be found, streamed, embedded, or downloaded online. Metadata availability, personal listening, redistribution, commercial use and public broadcasting are separate permissions.

## Source classes

### A. Free/open-license catalogs
Examples to evaluate: Jamendo, Free Music Archive, ccMixter and individually licensed Internet Archive items.

Requirements:
- Store the exact track-level license URL or rights statement.
- Store attribution text and creator identity.
- Record whether commercial use, adaptation, redistribution and public performance are permitted.
- For Creative Commons, distinguish licenses that prohibit commercial use or derivatives.
- Treat missing or ambiguous license evidence as unknown.

### B. Historical and public-domain recordings
Internet Archive and similar collections may contain public-domain or openly licensed recordings, but status can vary by item, recording, country and underlying composition.

Requirements:
- Inspect item metadata and the actual files.
- Preserve the source item URL and rights statement.
- Do not assume the composition and sound recording share the same rights status.
- Do not infer a valid MP3 filename from an item identifier; inspect provider file metadata.

### C. Commercial streaming services
Examples to evaluate: Spotify, Apple Music, YouTube Music and Anghami.

Requirements:
- Use official APIs, widgets, SDKs or outbound links only as permitted by each provider.
- Playback remains under the provider's player and subscription rules.
- Display required attribution, artwork and metadata.
- Respect market availability, account tier and device restrictions.
- Do not use a provider integration as a source for a separate radio/webcast stream.
- Do not combine content from one service with another where prohibited.

### D. Creator-hosted music
SoundCloud and similar creator platforms may permit playback for some public tracks. Availability can be blocked, preview-only, paywalled or territory-restricted.

Requirements:
- Use official embed/API mechanisms.
- Credit the uploader and source as required.
- Link back to the original work.
- Do not download or re-host unless separately authorized.

## Rights fields required before enabling playback

- Provider and provider item ID.
- Canonical source URL.
- Playback mode.
- Track-level rights statement/license URL.
- Rights status and reviewer timestamp.
- Allowed territories, if known.
- Attribution requirements.
- Commercial-use permission.
- Public-broadcast permission.
- Expiry/review date, if applicable.

## Radio lock

Personal streaming permission does not authorize public broadcasting. The Radio Studio must not transmit a track unless broadcast clearance is documented for the relevant territory and use. A missing or ambiguous field means the track is blocked from broadcast.

## Prohibited implementation patterns

- YouTube/Spotify ripping, scraping or DRM circumvention.
- Guessing direct audio URLs.
- Treating a generic audio file as a real song when provider lookup fails.
- Marking an item free based only on its presence in a search result.
- Caching or storing provider audio against provider terms.
