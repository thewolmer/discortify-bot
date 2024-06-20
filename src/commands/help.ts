import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Help command!')
  .addStringOption((option) =>
    option.setName('command').setDescription('The command you need help with').setRequired(true),
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.reply(`helpp called, option was **${interaction.options.get('command')?.value}**`);
}
