import { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getUserTop } from '../../lib/SpotifyAPI/getUserTop';
import { sendLoadingEmbed } from '@/utils/sendLoadingEmbed';
import { errorEmbedBuilder } from '@/utils/errorEmbedBuilder';
import { icons } from '@/lib/Icons';
import numbro from 'numbro';

async function handleTimeRange(interaction: ButtonInteraction, timeRange: 'short_term' | 'medium_term' | 'long_term') {
  const [, , userId, , state] = interaction.customId.split('-');
  const user = interaction.user;
  if (userId !== user.id)
    return await interaction.reply({ content: 'You cannot interact with other users data!', ephemeral: true });
  const { shortTermBtn, mediumTermBtn, longTermBtn } = createButtons(userId, state as 'tracks' | 'artists');

  try {
    await interaction.deferUpdate();

    switch (timeRange) {
      case 'short_term':
        shortTermBtn.setDisabled(true);
        mediumTermBtn.setDisabled(false);
        longTermBtn.setDisabled(false);
        break;
      case 'medium_term':
        shortTermBtn.setDisabled(false);
        mediumTermBtn.setDisabled(true);
        longTermBtn.setDisabled(false);
        break;
      case 'long_term':
        shortTermBtn.setDisabled(false);
        mediumTermBtn.setDisabled(false);
        longTermBtn.setDisabled(true);
        break;
      default:
        break;
    }

    await sendLoadingEmbed(interaction);

    const data = await getUserTop(user.id, { type: state as 'tracks' | 'artists', time_range: timeRange, limit: 10 });

    const fieldValue = data.items
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

    const embedDescription = `## Top 10 ${state} of ${user.username} \n${fieldValue}`;

    await interaction.editReply({
      embeds: [{ description: embedDescription }],
      components: [createRow(shortTermBtn, mediumTermBtn, longTermBtn)],
    });
  } catch (error) {
    console.error('Error handling time range:', error);
    const errorEmbed = errorEmbedBuilder(error as Error);
    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
  }
}

export async function short(interaction: ButtonInteraction) {
  await handleTimeRange(interaction, 'short_term');
}

export async function medium(interaction: ButtonInteraction) {
  await handleTimeRange(interaction, 'medium_term');
}

export async function long(interaction: ButtonInteraction) {
  await handleTimeRange(interaction, 'long_term');
}

function createRow(shortTermBtn: ButtonBuilder, mediumTermBtn: ButtonBuilder, longTermBtn: ButtonBuilder) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(shortTermBtn, mediumTermBtn, longTermBtn);
}

function createButtons(userId: string, state: 'tracks' | 'artists') {
  const shortTermBtn = new ButtonBuilder()
    .setLabel('Last 4 Weeks')
    .setDisabled(true)
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(`button-top-${userId}-short-${state}`);

  const mediumTermBtn = new ButtonBuilder()
    .setLabel('Last 6 Months')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(`button-top-${userId}-medium-${state}`);

  const longTermBtn = new ButtonBuilder()
    .setLabel('Last 1 Year')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(`button-top-${userId}-long-${state}`);

  return { shortTermBtn, mediumTermBtn, longTermBtn };
}
