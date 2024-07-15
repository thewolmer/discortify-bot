import { SlashCommandBuilder, User, EmbedBuilder } from 'discord.js';
import { errorEmbedBuilder } from '@/utils/errorEmbedBuilder';
import { icons } from '@/lib/Icons';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { getUserRecent } from '@/lib/SpotifyAPI/getUserRecent';
import { artistsConcat } from '@/utils/artistsConcat';
import { formatDistance } from 'date-fns';
import { images } from '@/lib/Images';

// ------------------------------------------------------------------------------------ //

export const data = new SlashCommandBuilder()
  .setName('recent')
  .setDescription("Get user's recently played songs!")
  .addMentionableOption((option) => option.setName('user').setDescription('User').setRequired(false));

export const options: CommandOptions = {
  deleted: false,
};

// ------------------------------------------------------------------------------------ //

export async function run({ interaction }: SlashCommandProps) {
  const mentionable = interaction.options.get('user');

  let user: User;

  if (mentionable?.user instanceof User) {
    user = mentionable.user;
  } else {
    user = interaction.user;
  }

  try {
    // Fetch Data
    const response = await getUserRecent(user.id, { limit: 10 });

    // Prepare UI
    const fieldValue = response.data.items
      .map((item, index) => {
        const artists = artistsConcat(item.track.artists, { max: 3 });
        return `**${index + 1}.** ${icons.music} **[${item.track.name}](${item.track.external_urls.spotify})**\n - **Played - ${formatDistance(item.played_at, new Date(), { addSuffix: true })}**\n - Album: ${item.track.album.name}\n - Artist(s): ${artists}`;
      })
      .join('\n');

    //  Embed
    const embed = new EmbedBuilder()
      .setDescription(`## Recently Played Songs of ${user.username} \n${fieldValue}`)
      .setThumbnail(response.data.items[0].track.album.images[0].url)
      .setColor('#2b2d31')
      .setImage(images.bottombar);

    // Response
    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching top items:', error);
    const errorEmbed = errorEmbedBuilder(error as Error);
    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
  }
}
