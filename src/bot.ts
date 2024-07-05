import { Client } from 'discord.js';
import { env } from './config';
// import { Player } from 'discord-player';
import * as commandModules from './commands';

const commands = Object(commandModules);

export const client = new Client({
  intents: [
    'Guilds',
    'GuildMembers',
    'GuildMessages',
    'GuildMessageReactions',
    'DirectMessages',
    'DirectMessageReactions',
    'DirectMessageTyping',
    'MessageContent',
    'GuildVoiceStates',
  ],
});


client.once('ready', (client) => {
  console.log('🤖 Ready!', client.user?.tag);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  const command = commands[commandName];

  if (command) {
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Error executing command: ${commandName}`, error);
      await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
  } else {
    console.warn(`Command not found: ${commandName}`);
  }
});


client.login(env.DISCORD_TOKEN);
