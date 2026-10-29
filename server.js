import express from 'express';

import erasRouter from './routes/eras.js';
import galleriesRouter from './routes/galleries.js';
import artistsRouter from './routes/artists.js';
import genresRouter from './routes/genres.js';
import paintingsRouter from './routes/paintings.js';
import countsRouter from './routes/counts.js';

const app = express();
const port = process.env.PORT || 8080;

app.use('/api/eras', erasRouter);
app.use('/api/galleries', galleriesRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/paintings', paintingsRouter);
app.use('/api/counts', countsRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});