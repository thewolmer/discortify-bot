import { icons } from '@/lib/Icons';
import { ButtonInteraction, CommandInteraction, EmbedBuilder } from 'discord.js';

type props = {
  interaction: CommandInteraction | ButtonInteraction;
  text?: string;
};

export const sendLoadingEmbed = async ({ interaction, text = 'Loading...' }: props) => {
  const embed = new EmbedBuilder();
  embed.setDescription(` ${icons.loading} ${icons.space} ${text}`);
  const message = await interaction.fetchReply();
  await message.edit({ embeds: [embed] });
};
