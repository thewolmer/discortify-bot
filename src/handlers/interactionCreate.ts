import { Client, Interaction, ButtonInteraction } from 'discord.js';
import { IEventHandler } from '@/types/event-handler';
import * as commandModules from '@/commands';

const commands = Object(commandModules);

export const event: IEventHandler = {
  name: 'interactionCreate',
  async execute(client: Client, interaction: Interaction) {
    try {
      if (interaction.isCommand()) {
        await handleCommandInteraction(interaction as any, client);
      } else if (interaction.isButton()) {
        await handleButtonInteraction(interaction as ButtonInteraction, client);
      } else {
        console.warn('Unsupported interaction type:', interaction.type);
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
    }
  },
};

async function handleCommandInteraction(interaction: any, client: Client) {
  const { commandName } = interaction;
  console.log(`🟢 [ ${new Date().toLocaleString()} ] Slash command received: ${commandName}`);

  const command = commands[commandName];

  if (command) {
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`🔴 [ ${new Date().toLocaleString()} ] Error executing command: ${commandName}\n`, error);
      await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
  } else {
    console.warn(`🟡 [ ${new Date().toLocaleString()} ] Command not found: ${commandName}`);
  }
}

async function handleButtonInteraction(interaction: ButtonInteraction, client: Client) {
  const { customId } = interaction;

  if (!customId.startsWith('button-')) return;

  const [, command, , action, state] = customId.split('-');

  if (!command || !action) {
    console.warn('Invalid custom ID format for button interaction:', customId);
    return;
  }

  try {
    const modulePath = `@/events/button/${command}`;
    const module = await import(modulePath);
    const actionFunctionName = action;

    if (!(actionFunctionName in module)) {
      console.warn(`Action handler not found for ${customId}`);
      return;
    }

    await module[actionFunctionName](interaction, client);
    console.log(`🟢 [ ${new Date().toLocaleString()} ] Button interaction handled: ${customId} state: ${state}`);
  } catch (error) {
    console.error('Error handling button interaction:', error);
  }
}
