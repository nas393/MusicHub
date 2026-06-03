import { Router, Response } from 'express';
import axios from 'axios';
import Song from '../models/Song';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Search songs from Internet Archive
router.get('/search', async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    try {
      // Search Internet Archive for music
      const archiveResponse = await axios.get('https://archive.org/advancedsearch.php', {
        params: {
          q: `${q} AND mediatype:audio`,
          fl: 'identifier,title,creator,duration',
          output: 'json',
          rows: 20
        },
        timeout: 10000
      });

      const docs = archiveResponse.data.response?.docs || [];
      
      const results = docs.map((doc: any, index: number) => ({
        id: doc.identifier || `item-${index}`,
        title: doc.title || 'Unknown Title',
        artist: doc.creator || 'Unknown Artist',
        duration: doc.duration ? parseInt(doc.duration) : 240,
        thumbnail: `https://archive.org/services/img/${doc.identifier}`,
        youtubeId: doc.identifier || `archive-${index}`,
        url: `https://archive.org/download/${doc.identifier}/${doc.identifier}_128kb.mp3`,
        archiveId: doc.identifier
      }));

      res.json({
        results: results,
        total: results.length
      });
    } catch (archiveError) {
      console.error('Archive search error:', archiveError);
      // Fallback to mock data if Internet Archive is down
      const mockResults = [
        {
          id: '1',
          title: `${q} - Free Track 1`,
          artist: 'Open Source Artist',
          duration: 240,
          thumbnail: 'https://via.placeholder.com/200?text=Music',
          youtubeId: 'free-1',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          archiveId: 'free-track-1'
        },
        {
          id: '2',
          title: `${q} - Free Track 2`,
          artist: 'Creative Commons',
          duration: 180,
          thumbnail: 'https://via.placeholder.com/200?text=Music',
          youtubeId: 'free-2',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          archiveId: 'free-track-2'
        }
      ];

      return res.json({
        results: mockResults,
        total: mockResults.length
      });
    }
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get all songs from Internet Archive (Popular uploads)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const archiveResponse = await axios.get('https://archive.org/advancedsearch.php', {
      params: {
        q: 'mediatype:audio AND (music OR song)',
        fl: 'identifier,title,creator,duration',
        output: 'json',
        rows: 50,
        sort: 'downloads desc'
      },
      timeout: 10000
    });

    const docs = archiveResponse.data.response?.docs || [];
    
    const songs = docs.map((doc: any, index: number) => ({
      _id: doc.identifier || `item-${index}`,
      title: doc.title || 'Unknown Title',
      artist: doc.creator || 'Unknown Artist',
      duration: doc.duration ? parseInt(doc.duration) : 240,
      thumbnail: `https://archive.org/services/img/${doc.identifier}`,
      youtubeId: doc.identifier || `archive-${index}`,
      url: `https://archive.org/download/${doc.identifier}/${doc.identifier}_128kb.mp3`,
      archiveId: doc.identifier
    }));

    res.json(songs);
  } catch (error) {
    console.error('Fetch songs error:', error);
    // Return mock data if Internet Archive is unavailable
    const mockSongs = [
      {
        _id: 'mock-1',
        title: 'Sample Music Track 1',
        artist: 'Open Source Artist',
        duration: 240,
        thumbnail: 'https://via.placeholder.com/200?text=Music',
        youtubeId: 'sample-1',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      },
      {
        _id: 'mock-2',
        title: 'Sample Music Track 2',
        artist: 'Creative Commons',
        duration: 200,
        thumbnail: 'https://via.placeholder.com/200?text=Music',
        youtubeId: 'sample-2',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      },
      {
        _id: 'mock-3',
        title: 'Sample Music Track 3',
        artist: 'Free Music Foundation',
        duration: 180,
        thumbnail: 'https://via.placeholder.com/200?text=Music',
        youtubeId: 'sample-3',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      }
    ];
    res.json(mockSongs);
  }
});

// Get song details
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Try to fetch from Internet Archive
    try {
      const archiveResponse = await axios.get('https://archive.org/metadata/' + id, {
        timeout: 5000
      });

      const doc = archiveResponse.data.metadata;
      
      if (!doc) {
        return res.status(404).json({ error: 'Song not found' });
      }

      const song = {
        _id: id,
        title: doc.title || 'Unknown Title',
        artist: doc.creator || 'Unknown Artist',
        duration: doc.duration ? parseInt(doc.duration) : 240,
        thumbnail: `https://archive.org/services/img/${id}`,
        youtubeId: id,
        url: `https://archive.org/download/${id}/${id}_128kb.mp3`,
        archiveId: id
      };

      res.json(song);
    } catch (archiveError) {
      // Fallback to mock data
      const mockSong = {
        _id: id,
        title: 'Sample Music',
        artist: 'Artist Name',
        duration: 240,
        thumbnail: 'https://via.placeholder.com/200?text=Music',
        youtubeId: id,
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      };
      res.json(mockSong);
    }
  } catch (error) {
    console.error('Fetch song error:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

export default router;
