import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('galleries').select('*');
        
        if (error) {
            throw error;
        }

        res.json(data); 
    } catch (error) {
        console.error('Error fetching galleries:', error);
        res.status(500).json({ error: 'An error occurred while fetching galleries.' });
    }
});

router.get('/:galleryId', async (req, res) => {
    const { galleryId } = req.params;

    if (!galleryId) {
        return res.status(400).json({ error: 'Gallery ID is required.' });
    }

    if (isNaN(galleryId)) {
        return res.status(400).json({ error: 'Gallery ID must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('galleries')
            .select('*')
            .eq('galleryId', galleryId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'Gallery not found.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error fetching gallery with ID ${galleryId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the gallery.' });
    }
});

router.get('/country/:query', async (req, res) => {
    const { query } = req.params;
    
    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('galleries')
            .select('*')
            .ilike('galleryCountry', `${query}%`);

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No galleries found for the specified country.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error searching galleries by country "${query}":`, error);
        res.status(500).json({ error: 'An error occurred while fetching the galleries.' });
    }
}); 

export default router;
