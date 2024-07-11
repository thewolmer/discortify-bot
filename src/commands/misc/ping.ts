import { CommandOptions, SlashCommandProps } from 'commandkit';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export const options: CommandOptions = {
  deleted: false,
};

export async function run({ interaction, client }: SlashCommandProps) {
  const reply = await interaction.fetchReply();
  const ping = reply.createdTimestamp - interaction.createdTimestamp;
  const embed = new EmbedBuilder()
    .setTitle('Pong!')
    .setDescription(`Ping: \`${ping}ms\` \n API Latency: \`${client.ws.ping}ms\` \n Created by <@932865250930360331>`)
    .setTimestamp()
    .setColor('NotQuiteBlack');
  await interaction.editReply({ embeds: [embed] });
}
