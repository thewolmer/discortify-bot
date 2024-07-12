import { SlashCommandBuilder, User, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { getUserTop } from '@/lib/SpotifyAPI/getUserTop';
import { errorEmbedBuilder } from '@/utils/errorEmbedBuilder';
import { icons } from '@/lib/Icons';
import numbro from 'numbro';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { artistsConcat } from '@/utils/artistsConcat';

// ------------------------------------------------------------------------------------ //

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

export const options: CommandOptions = {
  deleted: false,
};

// ------------------------------------------------------------------------------------ //

export async function run({ interaction }: SlashCommandProps) {
  const mentionable = interaction.options.get('user');
  const subcommand = interaction.options.getSubcommand();
  const type = subcommand === 'tracks' ? 'tracks' : 'artists';

  let user: User;

  if (mentionable?.user instanceof User) {
    user = mentionable.user;
  } else {
    user = interaction.user;
  }

  console.log('User:', user);

  try {
    // Fetch Data
    const response = await getUserTop(user.id, { type, time_range: 'short_term', limit: 10 });

    // Prepare UI
    const fieldValue = response.data.items
      .map((item, index) => {
        if (type === 'tracks' && 'album' in item) {
          const track = item as SpotifyApi.TrackObjectFull;
          const artists = artistsConcat(item.artists, { max: 3 });
          return `**${index + 1}.** ${icons.music} **[${track.name}](${track.external_urls.spotify})**\n - Album: ${track.album.name}\n - Artist(s): ${artists}`;
        } else if (type === 'artists') {
          const artist = item as SpotifyApi.ArtistObjectFull;
          return `**${index + 1}.** ${icons.music} **[${artist.name}](${artist.external_urls.spotify})**\n - Genres: ${artist.genres.join(', ')}\n - Followers: ${numbro(
            artist.followers.total,
          ).format({
            average: true,
          })} - Popularity: ${artist.popularity}%`;
        }
      })
      .join('\n');

    //  Embed
    const embed = new EmbedBuilder()
      .setDescription(`## Top 10 ${type} of ${user.username} \n${fieldValue}`)
      .setColor('#2b2d31');

    //  Buttons
    const shortTermBtn = new ButtonBuilder()
      .setLabel('Last 4 Weeks')
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`button-top-${user.id}-short-${type}`);

    const mediumTermBtn = new ButtonBuilder()
      .setLabel('Last 6 Months')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`button-top-${user.id}-medium-${type}`);

    const longTermBtn = new ButtonBuilder()
      .setLabel('Last 1 Year')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`button-top-${user.id}-long-${type}`);

    // Action Row
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(shortTermBtn, mediumTermBtn, longTermBtn);

    // Response
    await interaction.editReply({ embeds: [embed], components: [row] });
  } catch (error) {
    console.error('Error fetching top items:', error);
    const errorEmbed = errorEmbedBuilder(error as Error);
    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
  }
}
