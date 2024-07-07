import { ButtonInteraction, CommandInteraction, EmbedBuilder } from 'discord.js';

export const sendLoadingEmbed = async(interaction: CommandInteraction | ButtonInteraction) => {
  const embed = new EmbedBuilder()
  embed.setDescription('Loading...');
  await interaction.editReply({ embeds: [embed] });
};
