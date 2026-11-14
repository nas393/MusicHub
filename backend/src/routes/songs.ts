import { Router, Response } from 'express';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const ARCHIVE_SEARCH_URL = 'https://archive.org/advancedsearch.php';
const ARCHIVE_TIMEOUT_MS = 10000;

type ArchiveDoc = {
  identifier?: string;
  title?: string;
  creator?: string | string[];
  date?: string;
  year?: string;
  duration?: string | number;
  licenseurl?: string;
  license_url?: string;
};

function mapArchiveMetadata(doc: ArchiveDoc) {
  const identifier = doc.identifier;
  if (!identifier) return null;

  const creator = Array.isArray(doc.creator) ? doc.creator.join(', ') : doc.creator;
  const yearValue = doc.year || doc.date?.slice(0, 4);
  const releaseYear = yearValue && /^\d{4}$/.test(yearValue) ? Number(yearValue) : undefined;

  return {
    id: identifier,
    title: doc.title || 'عنوان غير معروف',
    artist: creator || 'فنان غير محدد',
    releaseYear,
    durationSeconds: doc.duration ? Number.parseInt(String(doc.duration), 10) || undefined : undefined,
    artworkUrl: `https://archive.org/services/img/${encodeURIComponent(identifier)}`,
    canonicalUrl: `https://archive.org/details/${encodeURIComponent(identifier)}`,
    provider: 'Internet Archive',
    playbackMode: 'official_link' as const,
    rightsStatus: 'unknown' as const,
    availabilityStatus: 'unknown' as const,
    licenseUrl: doc.licenseurl || doc.license_url || undefined,
  };
}

// This endpoint returns discovery metadata only. It deliberately does not construct
// download URLs or claim that Internet Archive search results are rights-cleared.
router.get('/search', async (req: AuthRequest, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (!q) return res.status(400).json({ error: 'Search query required' });
  if (q.length > 160) return res.status(400).json({ error: 'Search query too long' });

  try {
    const response = await axios.get(ARCHIVE_SEARCH_URL, {
      params: {
        q: `${q} AND mediatype:audio`,
        fl: 'identifier,title,creator,date,year,duration,licenseurl,license_url',
        output: 'json',
        rows: 25,
        page: 1,
      },
      timeout: ARCHIVE_TIMEOUT_MS,
      headers: { Accept: 'application/json' },
    });

    const docs: ArchiveDoc[] = response.data?.response?.docs || [];
    const results = docs.map(mapArchiveMetadata).filter(Boolean);

    return res.json({
      provider: 'Internet Archive',
      results,
      total: response.data?.response?.numFound ?? results.length,
      notice: 'Metadata discovery only. Rights and playback availability have not been verified.',
    });
  } catch (error) {
    console.error('Internet Archive search failed:', error);
    return res.status(502).json({ error: 'Music metadata provider is temporarily unavailable' });
  }
});

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const response = await axios.get(ARCHIVE_SEARCH_URL, {
      params: {
        q: 'mediatype:audio AND (music OR song)',
        fl: 'identifier,title,creator,date,year,duration,licenseurl,license_url',
        output: 'json',
        rows: 25,
        page: 1,
        sort: 'downloads desc',
      },
      timeout: ARCHIVE_TIMEOUT_MS,
      headers: { Accept: 'application/json' },
    });

    const docs: ArchiveDoc[] = response.data?.response?.docs || [];
    const results = docs.map(mapArchiveMetadata).filter(Boolean);

    return res.json({
      provider: 'Internet Archive',
      results,
      total: response.data?.response?.numFound ?? results.length,
      notice: 'Metadata discovery only. Rights and playback availability have not been verified.',
    });
  } catch (error) {
    console.error('Internet Archive catalog request failed:', error);
    return res.status(502).json({ error: 'Music metadata provider is temporarily unavailable' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  if (!/^[a-zA-Z0-9._-]{1,120}$/.test(id)) {
    return res.status(400).json({ error: 'Invalid archive identifier' });
  }

  try {
    const response = await axios.get(`https://archive.org/metadata/${encodeURIComponent(id)}`, {
      timeout: 7000,
      headers: { Accept: 'application/json' },
    });

    const metadata = response.data?.metadata as ArchiveDoc | undefined;
    if (!metadata) return res.status(404).json({ error: 'Archive item not found' });

    const result = mapArchiveMetadata({ ...metadata, identifier: id });
    return res.json({
      ...result,
      description: typeof (metadata as Record<string, unknown>).description === 'string'
        ? (metadata as Record<string, string>).description
        : undefined,
      notice: 'This is a source record, not proof of public-domain status or broadcast clearance.',
    });
  } catch (error) {
    console.error('Internet Archive item lookup failed:', error);
    return res.status(502).json({ error: 'Music metadata provider is temporarily unavailable' });
  }
});

export default router;
