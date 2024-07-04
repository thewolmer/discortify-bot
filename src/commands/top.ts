import { CommandInteraction, SlashCommandBuilder, User, EmbedBuilder, GuildMember } from 'discord.js';
import { getUserTop } from '../lib/SpotifyAPI/getUserTop';
import { errorEmbedBuilder } from '@/utils/errorEmbedBuilder';

export const data = new SlashCommandBuilder()
  .setName('top')
  .setDescription('Get Top 10 songs!')
  .addMentionableOption((option) => option.setName('user').setDescription('User').setRequired(false));

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();

  const mentionable = interaction.options.get('user');

  let user: User;

  if (mentionable?.user instanceof User) {
    user = mentionable.user;
  } else {
    user = interaction.user;
  }

  try {
    const data = await getUserTop(user.id, { type: 'tracks', time_range: 'short_term', limit: 10 });

    const embed = new EmbedBuilder()
      .setDescription(`## Top 10 tracks of ${user.username} \n`)
      .addFields({
        name: 'Tracks',
        value: data.items.map((item, index) => `${index + 1}. **${item.name}** - ${item.artists.map((artist) => artist.name).join(', ')}`).join('\n'),
      })

    await interaction.followUp({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    const errorEmbed = errorEmbedBuilder(error as Error); 
    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
  }
}
