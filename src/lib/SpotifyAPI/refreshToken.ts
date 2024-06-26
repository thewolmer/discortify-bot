import { env } from '@/config';
import { User } from '@prisma/client';

export const refreshToken = async (user: User) => {
  const { spotify_refresh_token, id } = user;

  try {
    const response = await fetch(`${env.DISCORTIFY_API_URL}/spotify/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': env.DISCORTIFY_API_KEY,
      },
      body: JSON.stringify({ id, refresh_token: spotify_refresh_token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to refresh Spotify access token: ' + errorData);
    }

    return await response.json();
  } catch (err) {
    console.error('Error refreshing Spotify access token:', err);
    throw new Error('Failed to refresh Spotify access token: ');
  }
};
