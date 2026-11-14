-- Arabic Music Archive — initial PostgreSQL schema
-- Review and apply through a controlled migration; this file is not auto-applied.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  sort_name TEXT,
  country_code CHAR(2),
  biography TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS artist_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  normalized_alias TEXT NOT NULL,
  language_code TEXT,
  UNIQUE (artist_id, normalized_alias)
);

CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  release_year SMALLINT CHECK (release_year BETWEEN 1800 AND 2100),
  country_code CHAR(2),
  artwork_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES genres(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  normalized_title TEXT NOT NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  release_year SMALLINT CHECK (release_year BETWEEN 1800 AND 2100),
  duration_seconds INTEGER CHECK (duration_seconds > 0),
  language_code TEXT,
  country_code CHAR(2),
  isrc TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS song_artists (
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  credit_role TEXT NOT NULL DEFAULT 'performer',
  credit_order SMALLINT NOT NULL DEFAULT 1,
  PRIMARY KEY (song_id, artist_id, credit_role)
);

CREATE TABLE IF NOT EXISTS song_genres (
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, genre_id)
);

CREATE TABLE IF NOT EXISTS music_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_key TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  provider_item_id TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  playback_mode TEXT NOT NULL CHECK (playback_mode IN ('official_embed','official_link','authorized_stream')),
  playback_url TEXT,
  artwork_url TEXT,
  attribution_text TEXT,
  rights_statement TEXT,
  license_url TEXT,
  rights_status TEXT NOT NULL DEFAULT 'unknown' CHECK (rights_status IN ('unknown','personal_use_only','cc_verified','public_domain_verified','commercial_license_verified','broadcast_cleared','restricted')),
  commercial_use_allowed BOOLEAN,
  broadcast_allowed BOOLEAN,
  territory_codes TEXT[],
  last_rights_reviewed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider_key, provider_item_id)
);

CREATE TABLE IF NOT EXISTS song_sources (
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES music_sources(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  availability_status TEXT NOT NULL DEFAULT 'unknown' CHECK (availability_status IN ('available','preview_only','blocked','unavailable','unknown')),
  checked_at TIMESTAMPTZ,
  PRIMARY KEY (song_id, source_id)
);

CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS playlist_items (
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (playlist_id, song_id),
  UNIQUE (playlist_id, position)
);

CREATE TABLE IF NOT EXISTS favorites (
  owner_id UUID NOT NULL,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (owner_id, song_id)
);

CREATE INDEX IF NOT EXISTS idx_songs_normalized_title ON songs (normalized_title);
CREATE INDEX IF NOT EXISTS idx_songs_release_year ON songs (release_year);
CREATE INDEX IF NOT EXISTS idx_artists_display_name ON artists (display_name);
CREATE INDEX IF NOT EXISTS idx_artist_aliases_normalized ON artist_aliases (normalized_alias);
CREATE INDEX IF NOT EXISTS idx_sources_rights_status ON music_sources (rights_status);
CREATE INDEX IF NOT EXISTS idx_song_sources_availability ON song_sources (availability_status);
CREATE INDEX IF NOT EXISTS idx_playlists_owner ON playlists (owner_id);
