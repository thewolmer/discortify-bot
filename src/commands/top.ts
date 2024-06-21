import { CommandInteraction, SlashCommandBuilder, User, EmbedBuilder, GuildMember } from 'discord.js';
import { getUserTop } from '../lib/SpotifyAPI/getUserTop';

export const data = new SlashCommandBuilder()
  .setName('top')
  .setDescription('Get Top 10 songs!')
  .addMentionableOption((option) => option.setName('user').setDescription('User').setRequired(false));

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();

  const mentionable = interaction.options.get('user');
  let user: User;

  if (mentionable && mentionable instanceof GuildMember) {
    user = mentionable.user;
  } else {
    user = interaction.user;
  }

  const data = await getUserTop(user.id, { type: 'tracks', time_range: 'short_term', limit: 10 });
  // console.log(data);

  const embed = new EmbedBuilder()
    .setTitle(`Top 10 songs for ${user.username}`)
    .setDescription(data.items.map((song, index) => `${index + 1}. ${song.name} - ${song.album.name}`).join('\n'));

  await interaction.editReply({ embeds: [embed] });
}
