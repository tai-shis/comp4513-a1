import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('eras').select('*');
        
        if (error) {
            throw error;
        }

        res.json(data); 
    } catch (error) {
        console.error('Error fetching eras:', error);
        res.status(500).json({ error: 'An error occurred while fetching eras.' });
    }
});

export default router;
