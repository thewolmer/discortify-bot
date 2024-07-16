import * as eventModules from '@/buttons';
import type { ButtonInteraction, Client } from 'discord.js';

const events = Object(eventModules);

export default async function (interaction: ButtonInteraction, client: Client) {
	if (!interaction.isButton()) return;
	const { customId } = interaction;
	if (!customId.startsWith('button-')) return;
	const [, command, , action] = customId.split('-');
	if (!command || !action) {
		console.warn('Invalid custom ID format for button interaction:', customId);
		return;
	}
	const start = performance.now();
	try {
		console.log(`🟢 [ ${new Date().toLocaleString()} ] Btn command received: ${command}`);
		const event = events[command];

		if (command) {
			try {
				await interaction.deferUpdate();
				await event[action]({ interaction, client });
				const duration = (performance.now() - start) / 1000;
				console.log(`🟢 [ ${new Date().toLocaleString()} ] Btn Command executed: ${command} in ${duration}s`);
			} catch (error) {
				console.error(`🔴 [ ${new Date().toLocaleString()} ] Error executing command: ${command}\n`, error);
				await interaction.followUp({ content: 'There was an error executing that command!', ephemeral: true });
			}
		} else {
			console.warn(`🟡 [ ${new Date().toLocaleString()} ] Btn Command not found: ${command}`);
		}
		return true;
	} catch (error) {
		console.error('Error handling interaction:', error);
	}
}
