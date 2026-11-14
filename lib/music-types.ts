export type PlaybackMode = 'official_embed' | 'official_link' | 'authorized_stream';

export type RightsStatus =
  | 'unknown'
  | 'personal_use_only'
  | 'cc_verified'
  | 'public_domain_verified'
  | 'commercial_license_verified'
  | 'broadcast_cleared'
  | 'restricted';

export type AvailabilityStatus = 'available' | 'preview_only' | 'blocked' | 'unavailable' | 'unknown';

export interface MusicSource {
  providerKey: string;
  providerName: string;
  providerItemId: string;
  canonicalUrl: string;
  playbackMode: PlaybackMode;
  playbackUrl?: string;
  attributionText?: string;
  licenseUrl?: string;
  rightsStatus: RightsStatus;
  availabilityStatus: AvailabilityStatus;
  personalUseAllowed?: boolean;
  commercialUseAllowed?: boolean;
  broadcastAllowed?: boolean;
  territoryCodes?: string[];
}

export interface CatalogArtist {
  id: string;
  name: string;
  aliases: string[];
  countryCode?: string;
}

export interface CatalogSong {
  id: string;
  title: string;
  normalizedTitle: string;
  artists: CatalogArtist[];
  albumTitle?: string;
  releaseYear?: number;
  durationSeconds?: number;
  genreNames: string[];
  countryCode?: string;
  languageCode?: string;
  sources: MusicSource[];
}

export interface ProviderSearchResult {
  providerKey: string;
  providerItemId: string;
  canonicalUrl: string;
  title: string;
  artistName?: string;
  albumTitle?: string;
  releaseYear?: number;
  durationSeconds?: number;
  artworkUrl?: string;
  source: MusicSource;
}
