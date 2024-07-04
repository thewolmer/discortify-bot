import { validateUserAndRefreshToken } from './validateUserAndRefreshToken';
import { spotifyGet } from './helper';

type props = {
  time_range?: 'long_term' | 'medium_term' | 'short_term';
  limit?: number;
  offset?: number;
  type: 'artists' | 'tracks';
};

export const getUserTop = async (id: string, { ...props }: props): Promise<SpotifyApi.UsersTopTracksResponse> => {
  if (!id || (id.length !== 17 && id.length !== 18)) {
    throw new Error('invalid-user');
  }

  const user = await validateUserAndRefreshToken(id);

  const response = await spotifyGet(`/me/top/${props.type}`, user, {
    searchParams: {
      ...props,
    },
  });

  const data = await response.json();
  console.log('User Top:', data);

  return data;
};
