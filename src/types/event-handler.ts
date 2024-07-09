import { Client } from 'discord.js';

export interface IEventHandler {
  name: string;
  once?: boolean;
  execute(client: Client, ...args: any[]): Promise<void>;
}
