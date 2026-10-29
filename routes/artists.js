import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('artists').select('*');

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({ error: 'An error occurred while fetching artists.' });
    }
});

router.get('/:artistId', async (req, res) => {
    const { artistId } = req.params;

    if (!artistId) {
        return res.status(400).json({ error: 'Artist ID is required.' });
    }

    if (isNaN(artistId)) {
        return res.status(400).json({ error: 'Artist ID must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .eq('artistId', artistId)
            .maybeSingle();
            
        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'Artist not found.' });
        }
    
        res.json(data);
    } catch (error) {
        console.error(`Error fetching artist with ID ${artistId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the artist.' });
    }
});

router.get('/search/:query', async (req, res) => {
    const { query } = req.params;

    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .ilike('lastName', `${query}%`);

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No artists found matching the query.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error searching artists by last name "${query}":`, error);
        res.status(500).json({ error: 'An error occurred while searching for artists.' });
    }
});

router.get('/country/:query', async (req, res) => {
    const { query } = req.params;

    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('artists')
            .select('*')
            .ilike('nationality', `${query}%`);
            
        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No artists found matching the query.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error searching artists by country "${query}":`, error);
        res.status(500).json({ error: 'An error occurred while searching for artists.' });
    }
});

export default router;