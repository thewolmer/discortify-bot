import { Client } from 'discord.js';
import { IEventHandler } from '@/types/event-handler';

export const event: IEventHandler = {
  name: 'ready',
  once: true,
  async execute(client: Client) {
    console.log(`🤖 ${client.user?.tag} is ready!`);
  },
};
