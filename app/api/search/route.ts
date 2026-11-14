import { NextRequest, NextResponse } from 'next/server';
import { musicBrainzFetch } from '@/lib/musicbrainz-client';

export const runtime = 'nodejs';
export const revalidate = 3600;

const MUSICBRAINZ_ENDPOINT = 'https://musicbrainz.org/ws/2/recording/';

type MBArtistCredit = {
  name?: string;
  artist?: { id?: string; name?: string; 'sort-name'?: string };
};

type MBRecording = {
  id: string;
  title: string;
  length?: number;
  'first-release-date'?: string;
  'artist-credit'?: MBArtistCredit[];
  releases?: Array<{ id?: string; title?: string; date?: string }>;
  tags?: Array<{ name?: string; count?: number }>;
};

function cleanText(value: string): string {
  return value.replace(/[<>]/g, '').trim();
}

export async function GET(request: NextRequest) {
  const query = cleanText(request.nextUrl.searchParams.get('q') || '');
  if (!query) return NextResponse.json({ error: 'أدخل اسم أغنية أو فنان للبحث.' }, { status: 400 });
  if (query.length > 120) return NextResponse.json({ error: 'عبارة البحث طويلة جداً.' }, { status: 400 });

  const params = new URLSearchParams({
    query,
    fmt: 'json',
    limit: '25',
  });

  try {
    const response = await musicBrainzFetch(`${MUSICBRAINZ_ENDPOINT}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TarabArabicArchive/0.1.0 (https://github.com/nas393/MusicHub)',
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(9000),
    });

    if (response.status === 503) {
      return NextResponse.json({ error: 'مصدر الفهرسة مشغول. حاول بعد لحظات.' }, { status: 503 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: 'تعذر الوصول إلى مصدر بيانات الموسيقى حالياً.' }, { status: 502 });
    }

    const payload = await response.json() as { recordings?: MBRecording[]; count?: number };
    const recordings = (payload.recordings || []).map((recording) => {
      const credits = recording['artist-credit'] || [];
      const artists = credits.map((credit) => credit.name || credit.artist?.name).filter(Boolean) as string[];
      const release = recording.releases?.[0];
      const date = recording['first-release-date'] || release?.date || '';
      const year = /^\d{4}/.test(date) ? Number(date.slice(0, 4)) : null;

      return {
        id: recording.id,
        title: recording.title,
        artists,
        releaseTitle: release?.title || null,
        releaseYear: year,
        durationSeconds: recording.length ? Math.round(recording.length / 1000) : null,
        tags: (recording.tags || []).slice(0, 5).map((tag) => tag.name).filter(Boolean),
        provider: 'MusicBrainz',
        providerUrl: `https://musicbrainz.org/recording/${recording.id}`,
        playback: null,
        rightsStatus: 'metadata_only',
      };
    });

    return NextResponse.json({
      query,
      count: payload.count ?? recordings.length,
      results: recordings,
      source: 'MusicBrainz',
      notice: 'هذه بيانات فهرسة فقط. لا تتضمن الملفات الصوتية أو إثبات حقوق الاستماع.',
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (error) {
    console.error('MusicBrainz search error:', error);
    return NextResponse.json({ error: 'انتهت مهلة البحث. حاول مرة أخرى.' }, { status: 504 });
  }
}
