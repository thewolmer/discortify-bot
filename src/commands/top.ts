import { CommandInteraction, SlashCommandBuilder, User, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, ButtonInteraction } from 'discord.js';
import { getUserTop } from '../lib/SpotifyAPI/getUserTop';
import { errorEmbedBuilder } from '@/utils/errorEmbedBuilder';

export const data = new SlashCommandBuilder()
  .setName('top')
  .setDescription(`Get User's Top 10 songs!`)
  .addMentionableOption((option) => option.setName('user').setDescription('User').setRequired(false));

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();

  const mentionable = interaction.options.get('user');

  let user: User;

  if (mentionable?.user instanceof User) {
    user = mentionable.user;
  } else {
    user = interaction.user;
  }

  try {
    const data = await getUserTop(user.id, { type: 'tracks', time_range: 'short_term', limit: 10 });

    const embed = new EmbedBuilder()
      .setDescription(`## Top 10 tracks of ${user.username} \n`)
      .addFields({
        name: 'Tracks',
        value: data.items.map((item, index) => `${index + 1}. **${item.name}** - ${item.artists.map((artist) => artist.name).join(', ')}`).join('\n'),
      });

    const shortTermBtn = new ButtonBuilder()
      .setLabel('Last Month')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('short_term');

    const mediumTermBtn = new ButtonBuilder()
      .setLabel('Last 6 Months')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('medium_term');

    const longTermBtn = new ButtonBuilder()
      .setLabel('Last Year')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('long_term');

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(shortTermBtn, mediumTermBtn, longTermBtn);

    const message = await interaction.followUp({ embeds: [embed], components: [row] });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000 
    });

    collector.on('collect', async (buttonInteraction: ButtonInteraction) => {
      if (buttonInteraction.user.id !== user.id) {
        await buttonInteraction.reply({ content: 'You cannot interact with this button.', ephemeral: true });
        return;
      }

      await buttonInteraction.deferUpdate();

      let timeRange: 'short_term' | 'medium_term' | 'long_term';

      switch (buttonInteraction.customId) {
        case 'short_term':
          timeRange = 'short_term';
          shortTermBtn.setDisabled(true);
          mediumTermBtn.setDisabled(false);
          longTermBtn.setDisabled(false);
          break;
        case 'medium_term':
          timeRange = 'medium_term';
          shortTermBtn.setDisabled(false);
          mediumTermBtn.setDisabled(true);
          longTermBtn.setDisabled(false);
          break;
        case 'long_term':
          timeRange = 'long_term';
          shortTermBtn.setDisabled(false);
          mediumTermBtn.setDisabled(false);
          longTermBtn.setDisabled(true);
          break;
        default:
          timeRange = 'short_term';
          break;
      }

      try {
        const newData = await getUserTop(user.id, { type: 'tracks', time_range: timeRange, limit: 10 });

        const newEmbed = new EmbedBuilder()
          .setDescription(`## Top 10 tracks of ${user.username} \n`)
          .addFields({
            name: 'Tracks',
            value: newData.items.map((item, index) => `${index + 1}. **${item.name}** - ${item.artists.map((artist) => artist.name).join(', ')}`).join('\n'),
          });

        const newRow = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(shortTermBtn, mediumTermBtn, longTermBtn);

        await buttonInteraction.editReply({ embeds: [newEmbed], components: [newRow] });
      } catch (error) {
        console.error('Error fetching top tracks:', error);
        const errorEmbed = errorEmbedBuilder(error as Error);
        await buttonInteraction.followUp({ embeds: [errorEmbed], ephemeral: true });
      }
    });

    collector.on('end', async () => {
      shortTermBtn.setDisabled(true);
      mediumTermBtn.setDisabled(true);
      longTermBtn.setDisabled(true);
      const endRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(shortTermBtn, mediumTermBtn, longTermBtn);
      await interaction.editReply({ components: [endRow] });
    });

  } catch (error) {
    console.error('Error fetching top tracks:', error);
    const errorEmbed = errorEmbedBuilder(error as Error);
    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
  }
}
