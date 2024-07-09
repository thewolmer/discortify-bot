import { ChatInputCommandInteraction, Client, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export async function execute(interaction: ChatInputCommandInteraction, client: Client) {
  await interaction.deferReply();
  const reply = await interaction.fetchReply();
  const ping = reply.createdTimestamp - interaction.createdTimestamp;
  const embed = new EmbedBuilder()
    .setTitle('Pong!')
    .setDescription(`Ping: \`${ping}ms\` \n API Latency: \`${client.ws.ping}ms\` \n Created by <@932865250930360331>`)
    .setTimestamp()
    .setColor('NotQuiteBlack');
  await interaction.followUp({ embeds: [embed] });
}
