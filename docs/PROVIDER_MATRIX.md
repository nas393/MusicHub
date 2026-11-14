# Provider integration matrix

This is an initial due-diligence matrix, not a statement that every provider has approved this application. Provider terms must be rechecked before integration and at release.

| Provider | Discovery / metadata | Playback approach | Current gate |
|---|---|---|---|
| MusicBrainz | Official API searches artists, recordings and releases; useful for Arabic/Latin aliases, dates and identifiers | Metadata only; not an audio host | Free API use is for non-commercial applications. Requires a meaningful User-Agent and a maximum average of one request per second. Commercial use requires a commercial plan/contact. |
| Spotify | Official Web API can search and return artist, album and track metadata | Spotify-controlled Web Playback SDK or official embed/link, subject to account and developer restrictions | Premium is required for full streaming through the platform. No non-interactive broadcasting. Do not combine Spotify content with streams/content from another service. No commercial streaming use without written permission. |
| Apple Music | MusicKit / Apple Music API, subject to developer program terms | MusicKit JS for the user's Apple Music subscription, rendered only through Apple's permitted APIs | No downloading, uploading or modifying MusicKit content. Playback must remain within Apple's API experience. |
| SoundCloud | Official API / oEmbed where access is granted | Official widget/embed; custom stream only when explicitly permitted and attribution rules are met | Track can be blocked, preview-only, paywalled or geo-restricted. Do not treat every public page as streamable. |
| Jamendo | Official API offers catalog search and track-level license metadata | Provider-authorized audio/API mechanisms only | API terms include restrictions on commercial use, offline access and replicating Jamendo's overall service experience. Obtain legal review and written permission before using it as a core catalog/playback provider. |
| Internet Archive | Advanced Search and item metadata APIs | Do not infer file URLs. Inspect actual item files and rights statements; only enable authorized playback after review | Rights are item-specific and may differ between composition and sound recording. Unknown means no free-use or broadcast claim. |
| YouTube | Official Data API / search where approved | Official YouTube embedded player or outbound official link | Not a source for extracted audio or a custom music stream. Follow YouTube player and API terms. |

## Architecture consequence

The product can provide one search and catalog experience, but it must not promise one universal audio engine that merges streams from every provider. Playback is provider-specific: a track may open an official embed, launch the provider, or use an authorized direct stream. The UI must preserve provider attribution and restrictions.

## Primary official references

- MusicBrainz API: https://musicbrainz.org/doc/MusicBrainz_API
- MusicBrainz search API: https://musicbrainz.org/doc/MusicBrainz_API/Search
- MusicBrainz rate limiting: https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting
- Spotify Web API: https://developer.spotify.com/documentation/web-api/reference
- Spotify Web Playback SDK: https://developer.spotify.com/documentation/web-playback-sdk
- Spotify Developer Policy: https://developer.spotify.com/policy
- Apple Developer Program License Agreement (MusicKit): https://developer.apple.com/support/terms/apple-developer-program-license-agreement/
- SoundCloud API guide: https://developers.soundcloud.com/docs/api/guide
- Jamendo API documentation: https://developer.jamendo.com/v3.0/docs
- Jamendo track API: https://developer.jamendo.com/v3.0/tracks
- Jamendo API Terms: https://devportal.jamendo.com/api_terms_of_use
