import type { User } from '@/types/Discortify';
import { spotifyGet } from './helper';
import { validateUserAndRefreshToken } from './validateUserAndRefreshToken';

type props = {
	time_range?: 'long_term' | 'medium_term' | 'short_term';
	limit?: number;
	offset?: number;
	type: 'artists' | 'tracks';
};

interface Response {
	data: SpotifyApi.UsersTopTracksResponse | SpotifyApi.UsersTopArtistsResponse;
	user: User;
}

export const getUserTop = async (id: string, { ...props }: props): Promise<Response> => {
	const user = await validateUserAndRefreshToken(id);

	const response = await spotifyGet(`/me/top/${props.type}`, user, {
		searchParams: {
			...props,
		},
	});

	const data = await response.json();
	console.log('User Top:', data);

	return { data, user };
};
