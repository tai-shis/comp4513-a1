import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('genres')
            .select('*, eras(*)')

        if (error) {
            throw error;
        }

        res.json(data); 
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ error: 'An error occurred while fetching genres.' });
    }
});

router.get('/:genreId', async (req, res) => {
    const { genreId } = req.params;

    if (!genreId) {
        return res.status(400).json({ error: 'Genre ID is required.' });
    }

    if (isNaN(genreId)) {
        return res.status(400).json({ error: 'Genre ID must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('genres')
            .select('*, eras(*)')
            .eq('genreID', genreId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'Genre not found.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error fetching genre with ID ${genreId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the genre.' });
    }
});

router.get('/painting/:paintingId', async (req, res) => {
    const { paintingId } = req.params;

    if (isNaN(paintingId)) {
        return res.status(400).json({ error: 'Painting ID must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('genres')
            .select('*, eras(*), paintinggenres!inner(paintingId)')
            .eq('paintinggenres.paintingId', paintingId)
            .order('genreName', { ascending: true });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Genre for the specified painting not found.' });
        }

        res.json(data.map(({ paintinggenres, ...genre }) => genre));
    } catch (error) {
        console.error(`Error fetching genre for painting with ID ${paintingId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the genre for the painting.' });
    }
});

export default router;