import * as commandModules from '@/commands';
import { Client, Interaction } from 'discord.js';

const commands = Object(commandModules);

export default async function (interaction: Interaction, client: Client) {
  console.log('interaction.isCommand()', interaction.isCommand());
  if (!interaction.isCommand()) return;
  const start = performance.now();
  try {
    await interaction.deferReply();
    const { commandName } = interaction;
    console.log(`🟢 [ ${new Date().toLocaleString()} ] Slash command received: ${commandName}`);
    const command = commands[commandName];
    if (command) {
      try {
        await command.run({ interaction, client });
        const duration = (performance.now() - start) / 1000;
        console.log(`🟢 [ ${new Date().toLocaleString()} ] Command executed: ${commandName} in ${duration}s`);
      } catch (error) {
        console.error(`🔴 [ ${new Date().toLocaleString()} ] Error executing command: ${commandName}\n`, error);
        if (!interaction.replied) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    } else {
      console.warn(`🟡 [ ${new Date().toLocaleString()} ] Command not found: ${commandName}`);
      if (!interaction.replied) {
        await interaction.followUp({ content: 'Command not found!', ephemeral: true });
      }
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    if (!interaction.replied) {
      try {
        await interaction.followUp({ content: 'There was an error while handling the interaction!', ephemeral: true });
      } catch (followUpError) {
        console.error('Error sending follow-up:', followUpError);
      }
    }
  }
}
