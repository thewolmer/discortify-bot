import { CommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { QueryType, useMainPlayer } from 'discord-player';
import { playerOptions } from '../config/playerOptions';

export const data = new SlashCommandBuilder()
  .setName('playquery')
  .setDescription('Search and play music')
  .addStringOption((option) => option.setName('query').setDescription('The input to search for').setRequired(true));

export const execute = async (interaction: CommandInteraction) => {
  const player = useMainPlayer();

  const member = interaction.member as GuildMember;

  if (!member.voice.channel) {
    return interaction.reply('You are not connected to a voice channel!');
  }

  const query = interaction.options.get('query')?.value as string;

  await interaction.deferReply();

  try {
    const result = await player.search(query, {
      searchEngine: QueryType.SPOTIFY_SONG,
      requestedBy: interaction.user,
    });

    if (!result.hasTracks()) {
      return await interaction.followUp('No results found!');
    }

    try {
      const { track } = await player.play(member.voice.channel, result, {
        nodeOptions: {
          metadata: interaction,
          ...playerOptions,
        },
        requestedBy: interaction.user,
        connectionOptions: { deaf: true },
      });
      return await interaction.followUp(`Playing **${track.title}** by **${track.url}**!`);
    } catch (e) {
      console.error(e);
      return await interaction.followUp({ content: 'An error occurred while playing the track!' });
    }
  } catch (e) {
    console.error(e);
    return await interaction.followUp({ content: 'An error occurred while searching for the track!' });
  }
};
