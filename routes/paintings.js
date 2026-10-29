import express from 'express';
import supabase from '../supabase.js';

const router = express.Router();

router.get('/single/:paintingId', async (req, res) => {
    const { paintingId } = req.params;

    if (!paintingId) {
        return res.status(400).json({ error: 'Painting ID is required.' });
    }

    if (isNaN(paintingId)) {
        return res.status(400).json({ error: 'Painting ID must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('paintings')
            .select('*')
            .eq('paintingID', paintingId)
            .maybeSingle();
            
        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'Painting not found.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error fetching painting with ID ${paintingId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the painting.' });
    }
});

const ALLOWED_CATEGORIES = ['title', 'year'];

function getOrderCategory(category) {
    return category === 'year' ? 'yearOfWork' : category;
}

router.get('/sort/:category/limit/:limit', async (req, res) => {
    const { category, limit } = req.params;

    if (!category || !limit) {
        return res.status(400).json({ error: 'Category and limit are required.' });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: 'Invalid category.' });
    }

    if (isNaN(limit) || limit < 0) {
        return res.status(400).json({ error: 'Limit must be a non-negative number.' });
    }

    try {
        let query = supabase
            .from('paintings')
            .select('*, artists(*), galleries(*)')
            .order(getOrderCategory(category), { ascending: true })

        if (limit != 0) {
            query = query.limit(parseInt(limit));
        }

        const { data, error } = await query;
                
        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No paintings found for the given parameters.' });
        }
        
        res.json(data);
    } catch (error) {
        console.error(`Error fetching paintings sorted by ${category} with limit ${limit}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the paintings.' });
    }
});

router.get('/sort/:category/limit/:limit/skip/:skip', async (req, res) => {
    const { category, limit, skip } = req.params;

    if (!category || !limit || !skip) {
        return res.status(400).json({ error: 'Category, limit, and skip are required.' });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: 'Invalid category.' });
    }

    if (isNaN(limit) || limit < 0) {
        return res.status(400).json({ error: 'Limit must be a positive number.' });
    }

    if (isNaN(skip) || skip < 0) {
        return res.status(400).json({ error: 'Skip must be a non-negative number.' });
    }


    try {
        let query = supabase
            .from('paintings')
            .select('*, artists(*), galleries(*)')
            .order(getOrderCategory(category), { ascending: true });


        if (skip != 0) {
            let upperLimit = limit != 0 ? parseInt(skip) + parseInt(limit) - 1 : -1;

            query = query.range(parseInt(skip), upperLimit);
        } else if (limit != 0) {
            query = query.limit(parseInt(limit));
        }

        const { data, error } = await query;
                
        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No paintings found for the given parameters.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error fetching paintings sorted by ${category} with limit ${limit} and skip ${skip}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the paintings.' });
    }
});

router.get('/search/:query', async (req, res) => {
    const { query } = req.params;

    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists(*), galleries(*)')
            .ilike('title', `%${query}%`)
            .order('yearOfWork', { ascending: true });

        if (error) {
            throw error;
        }
        
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No paintings found matching the query.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error searching paintings with query "${query}":`, error);
        res.status(500).json({ error: 'An error occurred while searching for paintings.' });
    }
});

router.get('/years/:startYear/:endYear', async (req, res) => {
    const { startYear, endYear } = req.params;

    if (!startYear || !endYear) {
        return res.status(400).json({ error: 'Start year and end year are required.' });
    }

    if (isNaN(startYear) || isNaN(endYear)) {
        return res.status(400).json({ error: 'Start year and end year must be valid numbers.' });
    }

    if (parseInt(startYear) > parseInt(endYear)) {
        return res.status(400).json({ error: 'Start year cannot be greater than end year.' });
    }

    try {
        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists(*), galleries(*)')
            .gte('yearOfWork', parseInt(startYear))
            .lte('yearOfWork', parseInt(endYear))
            .order('yearOfWork', { ascending: true });

        if (error) {
            throw error;
        }
        
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No paintings found between the specified years.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error fetching paintings between years ${startYear} and ${endYear}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the paintings.' });
    }
});

router.get('/galleries/:galleryId', async (req, res) => {
    const { galleryId } = req.params;

    if (!galleryId) {
        return res.status(400).json({ error: 'Gallery ID is required.' });
    }

    if (isNaN(galleryId)) {
        return res.status(400).json({ error: 'Gallery ID must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists(*), galleries(*)')
            .eq('galleryID', galleryId)
            .order('yearOfWork', { ascending: true });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No paintings found for the specified gallery.' });
        }
        
        res.json(data);
    } catch (error) {
        console.error(`Error fetching paintings for gallery with ID ${galleryId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the paintings.' });
    }
});

router.get('/artist/:artistId', async (req, res) => {
    const { artistId } = req.params;

    if (!artistId) {
        return res.status(400).json({ error: 'Artist ID is required.' });
    }

    if (isNaN(artistId)) {
        return res.status(400).json({ error: 'Artist ID must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('paintings')
            .select('*, artists!inner(*), galleries!inner(*)')
            .eq('artists.artistId', artistId)
            .order('yearOfWork', { ascending: true });
            
        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No paintings found for the specified artist.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error fetching paintings for artist with ID ${artistId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the paintings.' });
    }
});

router.get('/genre/:genreId', async (req, res) => {
    const { genreId } = req.params;

    if (!genreId) {
        return res.status(400).json({ error: 'Genre ID is required.' });
    }

    if (isNaN(genreId)) {
        return res.status(400).json({ error: 'Genre ID must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('paintings')
            .select(`
                paintingID,
                title,
                yearOfWork,
                paintinggenres!inner(genres!inner(genreID, genreName))
            `)
            .eq('paintinggenres.genres.genreID', genreId)
            .order('yearOfWork', { ascending: true });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No paintings found for the specified genre.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error fetching paintings for genre with ID ${genreId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the paintings.' });
    }
});

router.get('/era/:eraId', async (req, res) => {
    const { eraId } = req.params;
    
    if (!eraId) {
        return res.status(400).json({ error: 'Era ID is required.' });
    }

    if (isNaN(eraId)) {
        return res.status(400).json({ error: 'Era ID must be a number.' });
    }

    try {
        const { data, error } = await supabase
            .from('paintings')
            .select(`
                paintingID,
                title,
                yearOfWork,
                paintinggenres!inner(genres!inner(genreID, genreName, eraID, eras(*)))
            `)
            .eq('paintinggenres.genres.eraID', eraId)
            .order('yearOfWork', { ascending: true });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No paintings found for the specified era.' });
        }

        res.json(data);
    } catch (error) {
        console.error(`Error fetching paintings for era with ID ${eraId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the paintings.' });
    }
});

export default router;