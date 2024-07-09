import 'module-alias/register';
import { Client } from 'discord.js';
import { env } from './config';
import * as eventModules from '@/handlers';
import { IEventHandler } from './types/event-handler';

const handlers = Object.values(eventModules) as { event: IEventHandler }[];

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

for (const { event } of handlers) {
  if (event.once) {
    client.once(event.name, async (...args: any[]) => event.execute(client, ...args));
  } else {
    client.on(event.name, async (...args: any[]) => event.execute(client, ...args));
  }
}

client.login(env.DISCORD_TOKEN);
