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
    if (process.argv[2] === 'local') {
      const startTime = Date.now();
      console.log(`Started refreshing Local ${commands.length} application (/) commands in ${env.SERVER_ID}`);
      const data: any = await rest.put(Routes.applicationGuildCommands(env.DISCORD_APP_ID, env.SERVER_ID), {
        body: commands,
      });
      const endTime = Date.now();
      console.log(`✨ Reloaded ${data?.length} Local application (/) commands in ${(endTime - startTime) / 1000}s.`);
    } else {
      const startTime = Date.now();
      const data: any = await rest.put(Routes.applicationCommands(env.DISCORD_APP_ID), { body: commands });
      const endTime = Date.now();
      console.log(`✨ Reloaded ${data?.length} Global application (/) commands in ${(endTime - startTime) / 1000}s.`);
    }
  } catch (error) {
    console.error(error);
  }
})();
