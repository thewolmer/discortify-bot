import type { User } from '@/types/Discortify';

interface Props {
	searchParams?: Record<string, string | number | undefined>;
}
export const spotifyGet = async (uri: string, user: User, { searchParams }: Props) => {
	const headers = {
		Authorization: `Bearer ${user.spotify_access_token}` as string,
		'Content-Type': 'application/json',
	};
	const url = new URL(`https://api.spotify.com/v1${uri}`);
	if (searchParams) {
		for (const param of Object.keys(searchParams)) {
			const value = searchParams[param];
			if (value) {
				url.searchParams.append(param, value.toString());
			}
		}
	}
	return await fetch(url.toString(), {
		headers,
	});
};

export const spotifyPost = async (url: string, body: unknown, user: User) => {
	const headers = {
		Authorization: `Bearer ${user.spotify_access_token}` as string,
		'Content-Type': 'application/json',
	};
	await fetch(`${process.env.ARMOBOT_API_URL}${url}`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers,
	});
};
