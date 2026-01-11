# Movie Review MERN App - Setup Guide

## ✅ Good News: No API Key Required!

**The app works completely without any API key!** All 20 movies are included with complete data (images, descriptions, ratings, directors, etc.). The app is fully functional right out of the box.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create `.env` file in the `backend` directory (Optional)
Create a file named `.env` with the following content:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/movie-review

# Server Port
PORT=5000

# JWT Secret (change this to a random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Movie API Keys (OPTIONAL - App works without them!)
# TMDB_API_KEY=your-tmdb-api-key-here
# OMDB_API_KEY=your-omdb-api-key-here
```

**Note:** API keys are completely optional. The app uses static data by default, so it works perfectly without any API keys!

### 3. Start MongoDB
Make sure MongoDB is running on your system. If not installed:
- Download from [MongoDB Website](https://www.mongodb.com/try/download/community)
- Or use MongoDB Atlas (cloud version)

### 4. Start Backend Server
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Features

### ✅ Complete Static Data
- 20 movies with complete information
- All movie posters included
- Directors, ratings, descriptions, genres all included
- Works completely offline (except for images from CDN)

### ✅ JWT Authentication
- Secure login with JWT tokens
- User registration and login
- Token stored in localStorage

### ✅ All Images Fixed
- Joker, The Prestige, and Mad Max: Fury Road images included
- All movie posters load correctly
- Fallback placeholder images if needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Movies
- `GET /api/movies` - Get all movies (returns static data)
- `GET /api/movies/:id` - Get single movie by ID

## Optional: Alternative Movie APIs

If you want to use an external API in the future (optional), here are alternatives:

### OMDb API (Recommended Alternative)
- Website: http://www.omdbapi.com/
- Free tier available
- Simpler than TMDB
- Get API key from: http://www.omdbapi.com/apikey.aspx

### IMDB (No official API, but data available)
- Can use OMDb which pulls from IMDB
- No direct API access

## Notes

- ✅ **No API key needed** - App works perfectly with static data
- ✅ All 20 movies are pre-loaded with complete information
- ✅ Images load from public CDN (should work globally)
- ✅ Authentication works with MongoDB
- Make sure both backend and frontend are running for full functionality
