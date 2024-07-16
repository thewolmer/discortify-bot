import type { User } from '@/types/Discortify';
import { spotifyGet } from './helper';
import { validateUserAndRefreshToken } from './validateUserAndRefreshToken';

interface BaseProps {
	limit?: number;
}

interface AfterProps extends BaseProps {
	after?: number;
	before?: never;
}

interface BeforeProps extends BaseProps {
	before?: number;
	after?: never;
}

type props = AfterProps | BeforeProps;

interface Response {
	data: SpotifyApi.UsersRecentlyPlayedTracksResponse;
	user: User;
}

export const getUserRecent = async (id: string, { ...props }: props): Promise<Response> => {
	const user = await validateUserAndRefreshToken(id);

	const response = await spotifyGet('/me/player/recently-played', user, {
		searchParams: {
			...props,
		},
	});

	const data = await response.json();

	console.log('User Recent:', data);
	return { data, user };
};
