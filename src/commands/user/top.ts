import {
  SlashCommandBuilder,
  User,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { getUserTop } from '../../lib/SpotifyAPI/getUserTop';
import { errorEmbedBuilder } from '@/utils/errorEmbedBuilder';
import { icons } from '@/lib/Icons';
import numbro from 'numbro';

export const data = new SlashCommandBuilder()
  .setName('top')
  .setDescription("Get User's Top 10 items!")
  .addSubcommand((subcommand) =>
    subcommand
      .setName('tracks')
      .setDescription('Get Top 10 tracks!')
      .addMentionableOption((option) => option.setName('user').setDescription('User').setRequired(false)),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('artists')
      .setDescription('Get Top 10 artists!')
      .addMentionableOption((option) => option.setName('user').setDescription('User').setRequired(false)),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const mentionable = interaction.options.get('user');
  const subcommand = interaction.options.getSubcommand();
  const type = subcommand === 'tracks' ? 'tracks' : 'artists';

  let user: User;

  if (mentionable?.user instanceof User) {
    user = mentionable.user;
  } else {
    user = interaction.user;
  }

  try {
    const data = await getUserTop(user.id, { type, time_range: 'short_term', limit: 10 });

    const fieldValue = data.items
      .map((item, index) => {
        if (type === 'tracks' && 'album' in item) {
          const track = item as SpotifyApi.TrackObjectFull;
          const artists = track.artists.map((artist) => artist.name);
          const displayedArtists =
            artists.length > 3 ? artists.slice(0, 3).join(', ') + `, +${artists.length - 3} more` : artists.join(', ');
          return `**${index + 1}.** ${icons.music} **[${track.name}](${track.external_urls.spotify})**\n - Album: ${track.album.name}\n - Artist(s): ${displayedArtists}`;
        } else if (type === 'artists') {
          const artist = item as SpotifyApi.ArtistObjectFull;
          return `**${index + 1}.** ${icons.music} **[${artist.name}](${artist.external_urls.spotify})**\n - Genres: ${artist.genres.join(', ')}\n - Followers: ${numbro(
            artist.followers.total,
          ).format({
            average: true,
          })} - Popularity: ${artist.popularity}%
          `;
        }
      })
      .join('\n');

    const embed = new EmbedBuilder()
      .setDescription(`## Top 10 ${type} of ${user.username} \n${fieldValue}`)
      .setColor('#2b2d31');

    const shortTermBtn = new ButtonBuilder()
      .setLabel('Last 4 Weeks')
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`button-top-${interaction.user.id}-short-${type}`);

    const mediumTermBtn = new ButtonBuilder()
      .setLabel('Last 6 Months')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`button-top-${interaction.user.id}-medium-${type}`);

    const longTermBtn = new ButtonBuilder()
      .setLabel('Last 1 Year')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`button-top-${interaction.user.id}-long-${type}`);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(shortTermBtn, mediumTermBtn, longTermBtn);

    await interaction.followUp({ embeds: [embed], components: [row] });
  } catch (error) {
    console.error('Error fetching top items:', error);
    const errorEmbed = errorEmbedBuilder(error as Error);
    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
  }
}
