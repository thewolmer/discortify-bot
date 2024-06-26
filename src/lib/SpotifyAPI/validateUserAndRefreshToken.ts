import { User } from '@prisma/client';
import db from '../db';
import { refreshToken } from './refreshToken';

export const validateUserAndRefreshToken = async (id: string) => {
  try {
    if (!id || (id.length !== 17 && id.length !== 18)) {
      throw new TypeError('invalid-user');
    }
    const data = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!data) {
      throw new TypeError('no-linked-account');
    }
    const { spotify_access_token, spotify_global_name, spotify_token_expires } = data;
    if (!spotify_access_token || !spotify_global_name || !spotify_token_expires) {
      throw new TypeError('no-credentials');
    }

    let userData: User | undefined = undefined;
    if (Date.now() > spotify_token_expires.getTime()) {
      const response = await refreshToken(data);
      userData = response;
    } else {
      userData = data; 
    }

    return userData!;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to validate user and refresh token');
  }
};
