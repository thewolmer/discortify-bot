import 'module-alias/register';
import path from 'node:path';
import { env } from '@/config/env';
import { Client } from 'discord.js';
const { CommandKit } = require('commandkit');

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

new CommandKit({
	client,
	commandsPath: path.join(__dirname, 'commands'),
	eventsPath: path.join(__dirname, 'events'),
	// validationsPath: path.join(__dirname, 'validations'),
	devGuildIds: ['1066230569740017664'],
	devUserIds: ['932865250930360331'],
	// skipBuiltInValidations: true,
	bulkRegister: false,
});

client.login(env.DISCORD_TOKEN);
