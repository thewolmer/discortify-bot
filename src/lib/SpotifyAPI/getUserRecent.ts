import { validateUserAndRefreshToken } from './validateUserAndRefreshToken';
import { spotifyGet } from './helper';

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

export const getUserRecent = async (
  id: string,
  { ...props }: props,
): Promise<SpotifyApi.UsersRecentlyPlayedTracksResponse> => {
  if (!id || (id.length !== 17 && id.length !== 18)) {
    throw new Error('invalid-user');
  }

  const user = await validateUserAndRefreshToken(id);

  const response = await spotifyGet(`/me/player/recently-played`, user, {
    searchParams: {
      ...props,
    },
  });

  const data = await response.json();
  console.log('User Recents:', data);

  return data;
};
