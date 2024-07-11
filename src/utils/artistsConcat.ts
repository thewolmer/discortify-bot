type props = { max: number };
export const artistsConcat = (artists: SpotifyApi.ArtistObjectSimplified[], { max }: props): String => {
  const names = artists.map((artist) => artist.name);
  return names.length > max ? names.slice(0, max).join(', ') + `, +${names.length - max} more` : names.join(', ');
};
