import { EmbedBuilder } from 'discord.js';

export const errorEmbedBuilder = (error: Error) => {
  const embed = new EmbedBuilder()
  switch (error.message) {
    case 'invalid-user':
      embed.setDescription('The user ID provided is invalid.');
      break;
    case 'no-linked-account':
      embed.setDescription('No linked Spotify account found.');
      break;
    case 'no-credentials':
      embed.setDescription('Incomplete Spotify credentials.');
      break;
    case 'Failed to validate user and refresh token':
      embed.setDescription('Failed to validate user and refresh token.');
      break;
    case 'invalid_grant':
      embed.setDescription('Invalid Spotify refresh token.');
      break;
    default:
      embed.setDescription('An unknown error occurred.');
  }

  return embed;
};
