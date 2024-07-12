import { validateUserAndRefreshToken } from './validateUserAndRefreshToken';
import { spotifyGet } from './helper';
import { User } from '@/types/Discortify';

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
  if (!id || Number(id) < 15) {
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

  return { data, user };
};
