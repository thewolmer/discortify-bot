import { env } from '@/config';
import { User } from '@prisma/client';

export const refreshToken = async (user: User) => {
  const { spotify_access_token, id } = user;

  try {
    const response = await fetch(`${env.DISCORTIFY_API_URL}/spotify/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': env.DISCORTIFY_API_KEY,
      },
      body: JSON.stringify({
        id,
        refresh_token: spotify_access_token,
      }),
    });
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error('Failed to refresh spotify access token');
  }
};
