type props = { max: number };
export const artistsConcat = (artists: SpotifyApi.ArtistObjectSimplified[], { max }: props): string => {
	const names = artists.map((artist) => artist.name);
	// biome-ignore lint/style/useTemplate: <just ignore for now>
	return names.length > max ? names.slice(0, max).join(', ') + `, +${names.length - max} more` : names.join(', ');
};
