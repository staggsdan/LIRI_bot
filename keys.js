// don't screw with this code

console.log('keys load');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bands = {
    id: process.env.BANDS_API_KEY, 
}

exports.omdb = {
  id: process.env.OMDB_API_KEY
}