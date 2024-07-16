import type { SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Help command!')
	.addStringOption((option) =>
		option.setName('command').setDescription('The command you need help with').setRequired(true),
	);

export async function run({ interaction }: SlashCommandProps) {
	await interaction.editReply(`Help called, option was **${interaction.options.get('command')?.value}**`);
}
