import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
	DISCORD_TOKEN: z.string().min(1),
	DISCORD_APP_ID: z.string().min(1),
	SERVER_ID: z.string().min(1),
	DISCORD_CLIENT_SECRET: z.string().min(1),
	SPOTIFY_CLIENT: z.string().min(1),
	SPOTIFY_CLIENT_SECRET: z.string().min(1),
	SPOTIFY_REDIRECT_URI: z.string().min(1),
	DISCORTIFY_API_URL: z.string().min(1),
	DISCORTIFY_API_KEY: z.string().min(1),
});

const validConfig = envSchema.safeParse(process.env);

if (!validConfig.success) {
	let errorMessage = '';
	for (const error of validConfig.error.errors) {
		errorMessage = `${errorMessage}  ${error.path[0]}, `;
	}
	throw new Error(`Missing Environment Variables - ${errorMessage}`);
}

export const env = validConfig.data;
