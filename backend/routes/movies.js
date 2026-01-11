const express = require("express");
const axios = require("axios");
const router = express.Router();

// OMDb API Configuration (Alternative to TMDB - Optional)
const OMDB_API_KEY = process.env.OMDB_API_KEY || "";
const OMDB_BASE_URL = "http://www.omdbapi.com/";

// TMDB API Configuration (Optional - fallback)
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Popular movies list with their IDs
const POPULAR_MOVIES = [
  { title: "Interstellar", tmdbId: 157336, imdbId: "tt0816692" },
  { title: "Inception", tmdbId: 27205, imdbId: "tt1375666" },
  { title: "The Dark Knight", tmdbId: 155, imdbId: "tt0468569" },
  { title: "Joker", tmdbId: 475557, imdbId: "tt7286456" },
  { title: "Avengers: Endgame", tmdbId: 299534, imdbId: "tt4154796" },
  { title: "Titanic", tmdbId: 597, imdbId: "tt0120338" },
  { title: "Avatar", tmdbId: 19995, imdbId: "tt0499549" },
  { title: "Gladiator", tmdbId: 98, imdbId: "tt0172495" },
  { title: "Forrest Gump", tmdbId: 13, imdbId: "tt0109830" },
  { title: "The Prestige", tmdbId: 11216, imdbId: "tt0482571" },
  { title: "The Matrix", tmdbId: 603, imdbId: "tt0133093" },
  { title: "Pulp Fiction", tmdbId: 680, imdbId: "tt0110912" },
  { title: "The Godfather", tmdbId: 238, imdbId: "tt0068646" },
  { title: "Fight Club", tmdbId: 550, imdbId: "tt0137523" },
  { title: "The Shawshank Redemption", tmdbId: 278, imdbId: "tt0111161" },
  { title: "Parasite", tmdbId: 496243, imdbId: "tt6751668" },
  { title: "Dune", tmdbId: 438631, imdbId: "tt1160419" },
  { title: "The Lord of the Rings: The Return of the King", tmdbId: 122, imdbId: "tt0167260" },
  { title: "Whiplash", tmdbId: 244786, imdbId: "tt2582802" },
  { title: "Mad Max: Fury Road", tmdbId: 76341, imdbId: "tt1392190" }
];

// GET all movies - Uses static data by default (works without API key)
router.get("/", async (req, res) => {
  try {
    // Return static data directly (works without any API)
    // This ensures the app works even if APIs are blocked or unavailable
    const movies = getStaticMovies();
    return res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    // Return static data as fallback
    res.json(getStaticMovies());
  }
});

// GET single movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    const staticMovies = getStaticMovies();
    const movie = staticMovies.find(m => m.id === movieId || m.tmdbId === movieId);
    
    if (movie) {
      return res.json(movie);
    }

    res.status(404).json({ message: "Movie not found" });
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Static movies data - Complete dataset (works without API)
function getStaticMovies() {
  return [
    {
      id: 157336,
      tmdbId: 157336,
      title: "Interstellar",
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
      year: 2014,
      genre: "Sci-Fi, Drama, Adventure",
      director: "Christopher Nolan",
      rating: 5,
      runtime: "169 min"
    },
    {
      id: 27205,
      tmdbId: 27205,
      title: "Inception",
      image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      description: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance at redemption if he can successfully perform an inception - planting an idea rather than stealing one.",
      year: 2010,
      genre: "Action, Sci-Fi, Thriller",
      director: "Christopher Nolan",
      rating: 5,
      runtime: "148 min"
    },
    {
      id: 155,
      tmdbId: 155,
      title: "The Dark Knight",
      image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      description: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
      year: 2008,
      genre: "Action, Crime, Drama",
      director: "Christopher Nolan",
      rating: 5,
      runtime: "152 min"
    },
    {
      id: 475557,
      tmdbId: 475557,
      title: "Joker",
      image: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
      description: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.",
      year: 2019,
      genre: "Crime, Drama, Thriller",
      director: "Todd Phillips",
      rating: 4,
      runtime: "122 min"
    },
    {
      id: 299534,
      tmdbId: 299534,
      title: "Avengers: Endgame",
      image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
      year: 2019,
      genre: "Action, Adventure, Drama",
      director: "Anthony Russo, Joe Russo",
      rating: 5,
      runtime: "181 min"
    },
    {
      id: 597,
      tmdbId: 597,
      title: "Titanic",
      image: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      description: "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later. A young Rose boards the ship with her mother and fiancé. Meanwhile, Jack Dawson and Fabrizio De Rossi win third-class tickets aboard the ship.",
      year: 1997,
      genre: "Drama, Romance",
      director: "James Cameron",
      rating: 5,
      runtime: "194 min"
    },
    {
      id: 19995,
      tmdbId: 19995,
      title: "Avatar",
      image: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
      description: "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
      year: 2009,
      genre: "Action, Adventure, Fantasy",
      director: "James Cameron",
      rating: 4,
      runtime: "162 min"
    },
    {
      id: 98,
      tmdbId: 98,
      title: "Gladiator",
      image: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
      description: "When a Roman General is betrayed, and his family murdered by an emperor's corrupt son, he comes to Rome as a gladiator to seek revenge.",
      year: 2000,
      genre: "Action, Adventure, Drama",
      director: "Ridley Scott",
      rating: 5,
      runtime: "155 min"
    },
    {
      id: 13,
      tmdbId: 13,
      title: "Forrest Gump",
      image: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      description: "A man with a low IQ has accomplished great things in his life and been present during significant historic events - in each case, far exceeding what anyone imagined he could do. Yet, despite all the things he has attained, his true love eludes him.",
      year: 1994,
      genre: "Drama, Romance",
      director: "Robert Zemeckis",
      rating: 5,
      runtime: "142 min"
    },
    {
      id: 11216,
      tmdbId: 11216,
      title: "The Prestige",
      image: "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_SX300.jpg",
      description: "Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.",
      year: 2006,
      genre: "Drama, Mystery, Thriller",
      director: "Christopher Nolan",
      rating: 5,
      runtime: "130 min"
    },
    {
      id: 603,
      tmdbId: 603,
      title: "The Matrix",
      image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      description: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
      year: 1999,
      genre: "Action, Sci-Fi",
      director: "Lana Wachowski, Lilly Wachowski",
      rating: 5,
      runtime: "136 min"
    },
    {
      id: 680,
      tmdbId: 680,
      title: "Pulp Fiction",
      image: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      description: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll, and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
      year: 1994,
      genre: "Crime, Drama",
      director: "Quentin Tarantino",
      rating: 5,
      runtime: "154 min"
    },
    {
      id: 238,
      tmdbId: 238,
      title: "The Godfather",
      image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      description: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
      year: 1972,
      genre: "Crime, Drama",
      director: "Francis Ford Coppola",
      rating: 5,
      runtime: "175 min"
    },
    {
      id: 550,
      tmdbId: 550,
      title: "Fight Club",
      image: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      description: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground 'fight clubs' forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
      year: 1999,
      genre: "Drama",
      director: "David Fincher",
      rating: 5,
      runtime: "139 min"
    },
    {
      id: 278,
      tmdbId: 278,
      title: "The Shawshank Redemption",
      image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      description: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.",
      year: 1994,
      genre: "Drama",
      director: "Frank Darabont",
      rating: 5,
      runtime: "142 min"
    },
    {
      id: 496243,
      tmdbId: 496243,
      title: "Parasite",
      image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      description: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
      year: 2019,
      genre: "Comedy, Drama, Thriller",
      director: "Bong Joon-ho",
      rating: 5,
      runtime: "132 min"
    },
    {
      id: 438631,
      tmdbId: 438631,
      title: "Dune",
      image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      description: "Paul Atreides leads a rebellion to restore his family's honor after House Atreides is overthrown. He travels to the most dangerous planet in the universe to ensure the future of his family and his people as malevolent forces explode into conflict over the planet's exclusive supply of the most precious resource in existence.",
      year: 2021,
      genre: "Sci-Fi, Adventure",
      director: "Denis Villeneuve",
      rating: 4,
      runtime: "155 min"
    },
    {
      id: 122,
      tmdbId: 122,
      title: "The Lord of the Rings: The Return of the King",
      image: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
      description: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron's forces. Meanwhile, Frodo and Sam take the ring closer to the heart of Mordor, the dark lord's realm.",
      year: 2003,
      genre: "Adventure, Drama, Fantasy",
      director: "Peter Jackson",
      rating: 5,
      runtime: "201 min"
    },
    {
      id: 244786,
      tmdbId: 244786,
      title: "Whiplash",
      image: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
      description: "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, even his humanity.",
      year: 2014,
      genre: "Drama, Music",
      director: "Damien Chazelle",
      rating: 5,
      runtime: "107 min"
    },
    {
      id: 76341,
      tmdbId: 76341,
      title: "Mad Max: Fury Road",
      image: "https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
      description: "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life. Within this world exist two rebels on the run who just might be able to restore order.",
      year: 2015,
      genre: "Action, Adventure, Sci-Fi",
      director: "George Miller",
      rating: 5,
      runtime: "120 min"
    }
  ];
}

module.exports = router;
