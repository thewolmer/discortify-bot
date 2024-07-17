import { icons } from '@/lib/Icons';
import { images } from '@/lib/Images';
import { getUserTop } from '@/lib/SpotifyAPI/getUserTop';
import { artistsConcat } from '@/utils/artistsConcat';
import { errorEmbedBuilder } from '@/utils/errorEmbedBuilder';
import { sendLoadingEmbed } from '@/utils/sendLoadingEmbed';
import { ActionRowBuilder, ButtonBuilder, type ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';
import numbro from 'numbro';

// ------------------------------------------------------------------------------------ //

async function handleTimeRange(interaction: ButtonInteraction, timeRange: 'short_term' | 'medium_term' | 'long_term') {
	console.log(interaction.customId);
	const [, , userId, , state, oguser] = interaction.customId.split('-');
	console.log('User:', userId, 'State:', state, 'OGUser:', oguser);
	if (oguser !== interaction.user.id) {
		return await interaction.followUp({ content: 'You cannot interact with other users data!', ephemeral: true });
	}

	const shortTermBtn = new ButtonBuilder()
		.setLabel('Last 4 Weeks')
		.setDisabled(timeRange === 'short_term')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId(`button-top-${userId}-short-${state}-${oguser}`);

	const mediumTermBtn = new ButtonBuilder()
		.setLabel('Last 6 Months')
		.setDisabled(timeRange === 'medium_term')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId(`button-top-${userId}-medium-${state}-${oguser}`);

	const longTermBtn = new ButtonBuilder()
		.setLabel('Last 1 Year')
		.setDisabled(timeRange === 'long_term')
		.setStyle(ButtonStyle.Secondary)
		.setCustomId(`button-top-${userId}-long-${state}-${oguser}`);

	// Action Row
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(shortTermBtn, mediumTermBtn, longTermBtn);

	try {
		// Loading Fallback
		await sendLoadingEmbed({ interaction });

		// Fetch Data
		const data = await getUserTop(userId, { type: state as 'tracks' | 'artists', time_range: timeRange, limit: 10 });

		// Prepare UI
		const fieldValue = data.data.items
			.map((item, index) => {
				if (state === 'tracks' && 'album' in item) {
					const track = item as SpotifyApi.TrackObjectFull;
					const displayedArtists = artistsConcat(track.artists, { max: 2 });
					return `${icons.music} **${index + 1}. [${track.name}](${track.external_urls.spotify})**
           From: ${track.album.name.length > 18 ? `${track.album.name.slice(0, 18)}...` : track.album.name}
           By: ${displayedArtists}`;
				}
				if (state === 'artists') {
					const artist = item as SpotifyApi.ArtistObjectFull;
					return `**${index + 1}.** ${icons.music} **[${artist.name}](${artist.external_urls.spotify})**
          ${icons.space} Genres: ${artist.genres.join(', ')}
          ${icons.space} Followers: ${numbro(artist.followers.total).format({
						average: true,
					})} - Popularity: ${artist.popularity}%`;
				}
			})
			.join('\n\n');

		const embed = new EmbedBuilder()
			.setTitle(`Top 10 ${state} of ${data.user.discord_username}`)
			.setDescription(`\n ${fieldValue}`)
			.setColor('#2b2d31')
			.setImage(images.bottombar);

		// Update Message
		await interaction.editReply({
			embeds: [embed],
			components: [row],
		});
	} catch (error) {
		console.error('Error handling time range:', error);
		const errorEmbed = errorEmbedBuilder(error as Error);
		await interaction.update({ embeds: [errorEmbed], components: [] });
	}
}

// ------------------------------------------------------------------------------------ //

export async function short({ interaction }: { interaction: ButtonInteraction }) {
	await handleTimeRange(interaction, 'short_term');
}

export async function medium({ interaction }: { interaction: ButtonInteraction }) {
	await handleTimeRange(interaction, 'medium_term');
}

export async function long({ interaction }: { interaction: ButtonInteraction }) {
	await handleTimeRange(interaction, 'long_term');
}
