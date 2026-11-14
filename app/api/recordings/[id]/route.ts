import { NextRequest, NextResponse } from 'next/server';
import { musicBrainzFetch } from '@/lib/musicbrainz-client';

export const runtime = 'nodejs';
export const revalidate = 3600;

type MusicBrainzRelation = {
  type?: string;
  url?: { resource?: string };
};

const PROVIDERS: Array<{ host: RegExp; name: string }> = [
  { host: /(^|\.)open\.spotify\.com$/i, name: 'Spotify' },
  { host: /(^|\.)music\.apple\.com$/i, name: 'Apple Music' },
  { host: /(^|\.)youtube\.com$/i, name: 'YouTube' },
  { host: /(^|\.)youtu\.be$/i, name: 'YouTube' },
  { host: /(^|\.)soundcloud\.com$/i, name: 'SoundCloud' },
  { host: /(^|\.)anghami\.com$/i, name: 'Anghami' },
  { host: /(^|\.)deezer\.com$/i, name: 'Deezer' },
  { host: /(^|\.)tidal\.com$/i, name: 'TIDAL' },
];

function providerFor(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:') return null;
    return PROVIDERS.find((provider) => provider.host.test(url.hostname))?.name || null;
  } catch {
    return null;
  }
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'معرّف التسجيل غير صالح.' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ fmt: 'json', inc: 'url-rels+releases' });
    const response = await musicBrainzFetch(`https://musicbrainz.org/ws/2/recording/${id}?${params}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TarabArabicArchive/0.1.0 (https://github.com/nas393/MusicHub)',
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(9000),
    });

    if (response.status === 404) return NextResponse.json({ error: 'التسجيل غير موجود في الفهرس.' }, { status: 404 });
    if (!response.ok) return NextResponse.json({ error: 'تعذر تحميل روابط المصدر حالياً.' }, { status: 502 });

    const recording = await response.json() as { id: string; title?: string; relations?: MusicBrainzRelation[] };
    const links = (recording.relations || [])
      .filter((relation) => (relation.type || '').toLowerCase().includes('stream'))
      .map((relation) => {
        const url = relation.url?.resource;
        if (!url) return null;
        const provider = providerFor(url);
        return provider ? { provider, url } : null;
      })
      .filter((item): item is { provider: string; url: string } => Boolean(item))
      .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index);

    return NextResponse.json({
      recordingId: recording.id,
      title: recording.title || null,
      links,
      notice: 'هذه روابط موثقة في سجل MusicBrainz إلى صفحات مزودي الخدمة. شروط الاشتراك والتوفر الجغرافي تطبق لدى كل مزود.',
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (error) {
    console.error('MusicBrainz recording lookup failed:', error);
    return NextResponse.json({ error: 'انتهت مهلة تحميل روابط الاستماع.' }, { status: 504 });
  }
}
