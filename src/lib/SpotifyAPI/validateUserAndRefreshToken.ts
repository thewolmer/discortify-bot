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
      throw new Error('no-linked-account');
    }
    const { spotify_access_token, spotify_global_name, spotify_token_expires } = data;
    if (!spotify_access_token || !spotify_global_name || !spotify_token_expires) {
      throw new Error('no-credentials');
    }

    if (Date.now() > spotify_token_expires.getTime()) {
      const updatedUser = await refreshToken(data);
      await db.user.update({
        where: { id },
        data: {
          spotify_access_token: updatedUser.spotify_access_token,
          spotify_token_expires: updatedUser.spotify_token_expires,
        },
      });
      return updatedUser as User;
    }
    
    return data as User;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to validate user and refresh token');
  }
};
