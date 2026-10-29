# Art Gallery API

COMP 4513 (Fall 2026), Assignment 1: Node API

## Overview

This project is a read-only REST API for an art database. The database holds paintings, artists, galleries, genres, and eras. The API uses Node and Express to handle routes. It reads the data from a Supabase (PostgreSQL) database. All responses are JSON.

![Node.js](https://img.shields.io/badge/Node.js-24.21.0-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.3.0-000000?logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.118.0-3FCF8E?logo=supabase&logoColor=white)
![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)

## Built With

- **[Node.js](https://nodejs.org/)**: JavaScript runtime
- **[Express](https://expressjs.com/)**: routing
- **[Supabase](https://supabase.com/)**: cloud PostgreSQL database, queried with `@supabase/supabase-js`
- **[Render](https://render.com/)**: hosting

## API Endpoints

Routes are case-insensitive.

### Eras

| Endpoint | Description |
|---|---|
| `/api/eras` | Get all eras. |

### Galleries

| Endpoint | Description |
|---|---|
| `/api/galleries` | Get all galleries. |
| `/api/galleries/:galleryId` | Get one gallery by its ID. |
| `/api/galleries/country/:substring` | Get the galleries whose country starts with the substring. The match is case-insensitive. |

### Artists

| Endpoint | Description |
|---|---|
| `/api/artists` | Get all artists. |
| `/api/artists/:artistId` | Get one artist by its ID. |
| `/api/artists/search/:substring` | Get the artists whose last name starts with the substring. The match is case-insensitive. |
| `/api/artists/country/:substring` | Get the artists whose nationality starts with the substring. The match is case-insensitive. |

### Genres

Each genre includes all of the fields of its era.

| Endpoint | Description |
|---|---|
| `/api/genres` | Get all genres. |
| `/api/genres/:genreId` | Get one genre by its ID. |
| `/api/genres/painting/:paintingId` | Get the genres of one painting, sorted by genre name. |

### Paintings

The sort, search, years, galleries, and artist routes include all of the fields of the painting's artist and gallery.

| Endpoint | Description |
|---|---|
| `/api/paintings/single/:paintingId` | Get one painting by its ID. |
| `/api/paintings/sort/:title\|year/limit/:limit` | Get the first `limit` paintings, sorted by title or by year. A limit of `0` returns all paintings. |
| `/api/paintings/sort/:title\|year/limit/:limit/skip/:skip` | Skip the first `skip` paintings, then get the next `limit` paintings. |
| `/api/paintings/search/:substring` | Get the paintings whose title contains the substring, sorted by year. The match is case-insensitive. |
| `/api/paintings/years/:start/:end` | Get the paintings from `start` to `end`, sorted by year. Both years are included. |
| `/api/paintings/galleries/:galleryId` | Get the paintings in one gallery, sorted by year. |
| `/api/paintings/artist/:artistId` | Get the paintings by one artist, sorted by year. |
| `/api/paintings/genre/:genreId` | Get the ID, title, and year of the paintings in one genre, sorted by year. |
| `/api/paintings/era/:eraId` | Get the ID, title, and year of the paintings in one era, sorted by year. |

### Counts

| Endpoint | Description |
|---|---|
| `/api/counts/genres` | Get the number of paintings in each genre, from fewest to most. |
| `/api/counts/artists` | Get the number of paintings by each artist, from most to fewest. |
| `/api/counts/topgenres/:count` | Get the genres that have more than `count` paintings, from most to fewest. |

## Example

**Request:** `/api/counts/topgenres/20`

**Response:**

```json
[
  { "genreName": "Baroque", "paintingCount": 71 },
  { "genreName": "Post-Impressionism", "paintingCount": 47 },
  { "genreName": "Dutch Golden Age", "paintingCount": 40 },
  { "genreName": "Renaissance", "paintingCount": 36 },
  { "genreName": "Romanticism", "paintingCount": 33 },
  { "genreName": "Impressionism", "paintingCount": 29 },
  { "genreName": "Realism", "paintingCount": 26 }
]
```

## Error Handling

Every error response is a JSON object with one `error` field.

**Request:** `/api/paintings/years/1850/1800`

**Response (400):**

```json
{ "error": "Start year cannot be greater than end year." }
```

| Status | Cause |
|---|---|
| `400` | A parameter is not valid. Examples: an ID that is not a number, an unknown sort field, or an end year before the start year. |
| `404` | The request returned no data, or the route does not exist. |
| `500` | The database query failed. |

## Project Files

| File | Description |
|---|---|
| `server.js` | Creates the Express app, connects the routers, and starts the server. It also sends a JSON 404 for unknown routes. |
| `supabase.js` | Creates the Supabase client from the environment variables. |
| `routes/eras.js` | Routes for `/api/eras`. |
| `routes/galleries.js` | Routes for `/api/galleries`. |
| `routes/artists.js` | Routes for `/api/artists`. |
| `routes/genres.js` | Routes for `/api/genres`. |
| `routes/paintings.js` | Routes for `/api/paintings`. |
| `routes/counts.js` | Routes for `/api/counts`. |

## Run Locally

1. Clone the repository and install the dependencies:

   ```sh
   git clone https://github.com/tai-shis/comp4513-a1.git
   cd comp4513-a1
   pnpm install
   ```

2. Create a `.env` file in the project root:

   ```sh
   SUPABASE_API_URL=your-supabase-project-url
   SUPABASE_API_KEY=your-supabase-anon-key
   ```

3. Start the server:

   ```sh
   node server.js
   ```

The server runs on port `8080`. Set the `PORT` environment variable to use a different port.

## Test Links

### Eras

- [/api/eras](https://comp4513-a1-kmsi.onrender.com/api/eras)

### Galleries

- [/api/galleries](https://comp4513-a1-kmsi.onrender.com/api/galleries)
- [/api/galleries/30](https://comp4513-a1-kmsi.onrender.com/api/galleries/30)
- [/api/galleries/calgary](https://comp4513-a1-kmsi.onrender.com/api/galleries/calgary)
- [/api/galleries/country/fra](https://comp4513-a1-kmsi.onrender.com/api/galleries/country/fra)

### Artists

- [/api/artists](https://comp4513-a1-kmsi.onrender.com/api/artists)
- [/api/artists/12](https://comp4513-a1-kmsi.onrender.com/api/artists/12)
- [/api/artists/1223423](https://comp4513-a1-kmsi.onrender.com/api/artists/1223423)
- [/api/artists/search/ma](https://comp4513-a1-kmsi.onrender.com/api/artists/search/ma)
- [/api/artists/search/mA](https://comp4513-a1-kmsi.onrender.com/api/artists/search/mA)
- [/api/artists/country/fra](https://comp4513-a1-kmsi.onrender.com/api/artists/country/fra)

### Genres

- [/api/genres](https://comp4513-a1-kmsi.onrender.com/api/genres)
- [/api/genres/76](https://comp4513-a1-kmsi.onrender.com/api/genres/76)
- [/api/genres/painting/408](https://comp4513-a1-kmsi.onrender.com/api/genres/painting/408)
- [/api/genres/painting/jsdfhg](https://comp4513-a1-kmsi.onrender.com/api/genres/painting/jsdfhg)

### Paintings

- [/api/paintings/single/63](https://comp4513-a1-kmsi.onrender.com/api/paintings/single/63)
- [/api/paintings/sort/title/limit/10](https://comp4513-a1-kmsi.onrender.com/api/paintings/sort/title/limit/10)
- [/api/paintings/sort/year/limit/10](https://comp4513-a1-kmsi.onrender.com/api/paintings/sort/year/limit/10)
- [/api/paintings/sort/absd/limit/10](https://comp4513-a1-kmsi.onrender.com/api/paintings/sort/absd/limit/10)
- [/api/paintings/sort/year/limit/asd](https://comp4513-a1-kmsi.onrender.com/api/paintings/sort/year/limit/asd)
- [/api/paintings/sort/year/limit](https://comp4513-a1-kmsi.onrender.com/api/paintings/sort/year/limit)
- [/api/paintings/sort/year/limit/10/skip/30](https://comp4513-a1-kmsi.onrender.com/api/paintings/sort/year/limit/10/skip/30)
- [/api/paintings/sort/year/limit/10/skip/30000](https://comp4513-a1-kmsi.onrender.com/api/paintings/sort/year/limit/10/skip/30000)
- [/api/paintings/sort/year/limit/10/skip](https://comp4513-a1-kmsi.onrender.com/api/paintings/sort/year/limit/10/skip)
- [/api/paintings/search/port](https://comp4513-a1-kmsi.onrender.com/api/paintings/search/port)
- [/api/paintings/search/pORt](https://comp4513-a1-kmsi.onrender.com/api/paintings/search/pORt)
- [/api/paintings/search/connolly](https://comp4513-a1-kmsi.onrender.com/api/paintings/search/connolly)
- [/api/paintings/years/1800/1850](https://comp4513-a1-kmsi.onrender.com/api/paintings/years/1800/1850)
- [/api/paintings/years/1850/1800](https://comp4513-a1-kmsi.onrender.com/api/paintings/years/1850/1800)
- [/api/paintings/galleries/5](https://comp4513-a1-kmsi.onrender.com/api/paintings/galleries/5)
- [/api/paintings/artist/16](https://comp4513-a1-kmsi.onrender.com/api/paintings/artist/16)
- [/api/paintings/artist/666](https://comp4513-a1-kmsi.onrender.com/api/paintings/artist/666)
- [/api/paintings/genre/78](https://comp4513-a1-kmsi.onrender.com/api/paintings/genre/78)
- [/api/paintings/era/2](https://comp4513-a1-kmsi.onrender.com/api/paintings/era/2)

### Counts

- [/api/counts/genres](https://comp4513-a1-kmsi.onrender.com/api/counts/genres)
- [/api/counts/artists](https://comp4513-a1-kmsi.onrender.com/api/counts/artists)
- [/api/counts/topgenres/20](https://comp4513-a1-kmsi.onrender.com/api/counts/topgenres/20)
- [/api/counts/topgenres/2034958](https://comp4513-a1-kmsi.onrender.com/api/counts/topgenres/2034958)
