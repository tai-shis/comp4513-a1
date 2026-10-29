import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.get('/genres', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('genre_counts')
            .select('*')
            .order('paintingCount', { ascending: true });


        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching genre counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/artists', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('artist_counts')
            .select('*')
            .order('paintingCount', { ascending: false });

        if (error) {
            throw error;
        }

        res.json(data.map(({ concat, paintingCount }) => ({
            artistName: concat.trim(),
            paintingCount,
        })));
    } catch (error) {
        console.error('Error fetching artist counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/topgenres/:threshold', async (req, res) => {
    const { threshold } = req.params;

    if (!threshold) {
        return res.status(400).json({ error: 'Threshold is required.' });
    }

    if (isNaN(threshold) || threshold < 0) {
        return res.status(400).json({ error: 'Threshold must be a number greater than 0.' });
    }

    try {
        const { data, error } = await supabase
            .from('genre_counts')
            .select('*')
            .gt('paintingCount', threshold)
            .order('paintingCount', { ascending: false });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No genres found with painting count greater than the specified threshold.' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching genre counts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;