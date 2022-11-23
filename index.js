
const { Client, GatewayIntentBits } = require('discord.js');
const {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
  } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageTyping
	],
});

client.on('ready', () => {
    console.log('I am ready!');
});

//When user joins a voice channel, the bot will join the same voice channel and play a song. 
client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.channelId !== newState.channelId) {
        if (newState.member.user.bot) return;
        if (newState.channelId) {
            const connection = joinVoiceChannel(
            {
                channelId: newState.channel.id,
                guildId: newState.guild.id,
                adapterCreator: newState.guild.voiceAdapterCreator,
            });
            const player = createAudioPlayer();
            const resource = createAudioResource('./sounds/connected.wav');
            player.play(resource);

            // Play "track.mp3" across two voice connections
            connection.subscribe(player);
        //When user leaves play a different sound
        } else if (oldState.channelId) {
            const connection = joinVoiceChannel(
            {
                channelId: oldState.channel.id,
                guildId: oldState.guild.id,
                adapterCreator: oldState.guild.voiceAdapterCreator,
            });
            const player = createAudioPlayer();
            const resource = createAudioResource('./sounds/disconnected.wav');
            player.play(resource);

            // Play "track.mp3" across two voice connections
            connection.subscribe(player);
        }
    }
});

//Login with token to .env
client.login(process.env.TOKEN);
