import type { MusicSource } from './music-types';

export type PlaybackDecision =
  | { allowed: true; mode: MusicSource['playbackMode']; url: string; provider: string }
  | { allowed: false; reason: 'unavailable' | 'blocked' | 'missing_url' | 'rights_not_verified' | 'territory_restricted' };

export function resolvePersonalPlayback(
  source: MusicSource,
  territoryCode?: string,
): PlaybackDecision {
  if (source.availabilityStatus !== 'available') {
    return { allowed: false, reason: source.availabilityStatus === 'blocked' ? 'blocked' : 'unavailable' };
  }

  if (territoryCode && source.territoryCodes?.length && !source.territoryCodes.includes(territoryCode)) {
    return { allowed: false, reason: 'territory_restricted' };
  }

  if (source.rightsStatus === 'restricted') {
    return { allowed: false, reason: 'rights_not_verified' };
  }

  // Official provider players/links keep playback within the provider's own licensed experience.
  if (source.playbackMode === 'official_embed' || source.playbackMode === 'official_link') {
    const url = source.playbackUrl || source.canonicalUrl;
    if (!url) return { allowed: false, reason: 'missing_url' };
    return { allowed: true, mode: source.playbackMode, url, provider: source.providerName };
  }

  // A direct stream is allowed only with affirmative, track-level personal-use permission.
  const directStreamRights = ['cc_verified', 'public_domain_verified', 'commercial_license_verified', 'broadcast_cleared'];
  if (!source.personalUseAllowed || !directStreamRights.includes(source.rightsStatus)) {
    return { allowed: false, reason: 'rights_not_verified' };
  }

  if (!source.playbackUrl) return { allowed: false, reason: 'missing_url' };
  return { allowed: true, mode: 'authorized_stream', url: source.playbackUrl, provider: source.providerName };
}

export function canBroadcast(source: MusicSource, territoryCode?: string): boolean {
  if (source.availabilityStatus !== 'available') return false;
  if (source.rightsStatus !== 'broadcast_cleared' || source.broadcastAllowed !== true) return false;
  if (territoryCode && source.territoryCodes?.length && !source.territoryCodes.includes(territoryCode)) return false;
  return true;
}
