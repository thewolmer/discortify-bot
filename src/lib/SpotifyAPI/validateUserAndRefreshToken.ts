import db from '@/lib/db';
import type { User } from '@prisma/client';
import { refreshToken } from './refreshToken';

export const validateUserAndRefreshToken = async (id: string): Promise<User> => {
	try {
		if (!id || Number(id) < 15) {
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
			return updatedUser;
		}

		return data;
	} catch (err) {
		console.error(err);
		throw new Error('Failed to validate user and refresh token');
	}
};
