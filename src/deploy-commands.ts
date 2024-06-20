import { REST, Routes } from 'discord.js';
import { env } from './config';

import * as commandModules from './commands';

const commands = [];

for (const module of Object.values(commandModules)) {
  commands.push(module.data);
}

const rest = new REST().setToken(env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const startTime = Date.now();
    const data: any = await rest.put(Routes.applicationCommands(env.DISCORD_APP_ID), { body: commands });
    const endTime = Date.now();
    console.log(`✨Reloaded ${data.length} application (/) commands in ${(endTime - startTime) / 1000}s.`);
  } catch (error) {
    console.error(error);
  }
})();
