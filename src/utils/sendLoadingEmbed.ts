import { ButtonInteraction, CommandInteraction, EmbedBuilder } from 'discord.js';

export const sendLoadingEmbed = async (interaction: CommandInteraction | ButtonInteraction) => {
  const embed = new EmbedBuilder();
  embed.setDescription('Loading...');
  const message = await interaction.fetchReply();
  await message.edit({ embeds: [embed] });
};
