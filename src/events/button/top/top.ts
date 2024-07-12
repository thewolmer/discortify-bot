import { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getUserTop } from '@/lib/SpotifyAPI/getUserTop';
import { sendLoadingEmbed } from '@/utils/sendLoadingEmbed';
import { errorEmbedBuilder } from '@/utils/errorEmbedBuilder';
import { icons } from '@/lib/Icons';
import numbro from 'numbro';

// ------------------------------------------------------------------------------------ //

async function handleTimeRange(interaction: ButtonInteraction, timeRange: 'short_term' | 'medium_term' | 'long_term') {
  const [, , userId, , state] = interaction.customId.split('-');
  const user = interaction.user;
  // if (userId !== user.id)
  //   return await interaction.followUp({ content: 'You cannot interact with other users data!', ephemeral: true });

  // Buttons

  const shortTermBtn = new ButtonBuilder()
    .setLabel('Last 4 Weeks')
    .setDisabled(timeRange === 'short_term')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(`button-top-${userId}-short-${state}`);

  const mediumTermBtn = new ButtonBuilder()
    .setLabel('Last 6 Months')
    .setDisabled(timeRange === 'medium_term')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(`button-top-${userId}-medium-${state}`);

  const longTermBtn = new ButtonBuilder()
    .setLabel('Last 1 Year')
    .setDisabled(timeRange === 'long_term')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(`button-top-${userId}-long-${state}`);

  // Action Row
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(shortTermBtn, mediumTermBtn, longTermBtn);

  try {
    // Loading Fallback
    await sendLoadingEmbed(interaction);

    // Fetch Data
    const data = await getUserTop(userId, { type: state as 'tracks' | 'artists', time_range: timeRange, limit: 10 });

    // Prepare UI
    const fieldValue = data.data.items
      .map((item, index) => {
        if (state === 'tracks' && 'album' in item) {
          const track = item as SpotifyApi.TrackObjectFull;
          const artists = track.artists.map((artist) => artist.name);
          const displayedArtists =
            artists.length > 3 ? artists.slice(0, 3).join(', ') + `, +${artists.length - 3} more` : artists.join(', ');
          return `**${index + 1}.** ${icons.music} **[${track.name}](${track.external_urls.spotify})**\n - Album: ${track.album.name}\n - Artist(s): ${displayedArtists}`;
        } else if (state === 'artists') {
          const artist = item as SpotifyApi.ArtistObjectFull;
          return `**${index + 1}.** ${icons.music} **[${artist.name}](${artist.external_urls.spotify})**\n - Genres: ${artist.genres.join(', ')}\n - Followers: ${numbro(
            artist.followers.total,
          ).format({
            average: true,
          })} - Popularity: ${artist.popularity}%`;
        }
      })
      .join('\n');

    // Update Message
    await interaction.editReply({
      embeds: [{ description: `## Top 10 ${state} of ${data.user.discord_username} \n${fieldValue}` }],
      components: [row],
    });
  } catch (error) {
    console.error('Error handling time range:', error);
    const errorEmbed = errorEmbedBuilder(error as Error);
    await interaction.update({ embeds: [errorEmbed], components: [] });
  }
}

// ------------------------------------------------------------------------------------ //

export async function short({ interaction }: { interaction: ButtonInteraction }) {
  await handleTimeRange(interaction, 'short_term');
}

export async function medium({ interaction }: { interaction: ButtonInteraction }) {
  await handleTimeRange(interaction, 'medium_term');
}

export async function long({ interaction }: { interaction: ButtonInteraction }) {
  await handleTimeRange(interaction, 'long_term');
}
