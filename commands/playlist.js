const { MessageEmbed } = require("discord.js");
const { play } = require("../include/play");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default;
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, MAX_PLAYLIST_SIZE } = require("../util/SplendorbotUtil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const ytsr = require('ytsr');
const { getTracks } = require('spotify-url-info');
const { EMOJI_ERROR , EMOJI_LOAD ,EMOJI_BLUELOAD } = require('../config.json');

module.exports = {
  name: "playlist",
  cooldown: 5,
  aliases: ["pl"],
  description: "`Play a playlist from Youtube,Soundcloud and Spotify.`\n\n**Usage:** \n`+pl <Playlist Name | Youtube Playlist URL | Soundcloud Playlist URL | Spotify Playlist URL>`",
  async execute(message, args) {
    const { channel } = message.member.voice;
    const serverQueue = message.client.queue.get(message.guild.id);
    
    const aaembed = new MessageEmbed()
    .setDescription(`Usage: ${message.client.prefix}playlist <Playlist Name | Youtube Playlist URL | Soundcloud Playlist URL | Spotify Playlist URL>`)
    .setColor("#00FFBD");

    const bbembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} You need to join a voice channel first!`)
    .setColor("#00FFA6");

    const ccembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} Cannot connect to voice channel, missing permissions.`)
    .setColor("#FF2A00");

    const ddembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} I cannot speak in this voice channel, make sure I have the proper permissions!`)
    .setColor("#3EFF00");

    const eeembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} You must be in the same channel as ${message.client.user}`)
    .setColor("#00FF78");

    const ffembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} Playlist not found.`)
    .setColor("#FF0000");

    const ggembed = new MessageEmbed()
    .setDescription(`${EMOJI_LOAD} Fetching the playlist...\n ${EMOJI_BLUELOAD}Please wait it will take few seconds.`)
    .setColor("#00FF00");

    const hhembed = new MessageEmbed()
    .setDescription(`${message.author} Started a playlist.`)
    .setColor("#00FFAE");

    const zzembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} Could not join the channel.`)
    .setColor("#FF0000");

    if (!args.length)
      return message
        .reply(aaembed)
        .catch(console.error);
    if (!channel) return message.reply(bbembed).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply(ccembed);
    if (!permissions.has("SPEAK"))
      return message.reply(ddembed);

    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(eeembed).catch(console.error);

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const spotifyPlaylistPattern = /^.*(https:\/\/open\.spotify\.com\/playlist)([^#\&\?]*).*/gi;
    const spotifyPlaylistValid = spotifyPlaylistPattern.test(args[0]);
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let newSongs = null;
    let playlist = null;
    let videos = [];
    let waitMessage = null;

    if (spotifyPlaylistValid) {
      try {
        waitMessage = await message.channel.send(ggembed)
        let playlistTrack = await getTracks(url);
        if (playlistTrack > MAX_PLAYLIST_SIZE) {
          playlistTrack.length = MAX_PLAYLIST_SIZE
        }
        const spotfiyPl = await Promise.all(playlistTrack.map(async (track) => {
          let result;
          const ytsrResult = await ytsr((`${track.name} - ${track.artists ? track.artists[0].name : ''}`), { limit: 1 });
          result = ytsrResult.items[0];
          return (song = {
            title: result.title,
            url: result.url,
            duration: result.duration ? this.convert(result.duration) : undefined,
            thumbnail: result.thumbnails ? result.thumbnails[0].url : undefined
          });
        }));
        const result = await Promise.all(spotfiyPl.filter((song) => song.title != undefined || song.duration != undefined));
        videos = result;
      } catch (err) {
        console.log(err);
        return message.channel.send(err ? err.message : 'There was an error!');
      }
    } else if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(ffembed).catch(console.error);
      }
    } else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes("/sets/")) {
        message.channel.send(ggembed);
        playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
        videos = playlist.tracks.map((track) => ({
          title: track.title,
          url: track.permalink_url,
          duration: track.duration / 1000
        }));
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    newSongs = videos
      .filter((video) => video.title != "Private video" && video.title != "Deleted video")
      .map((video) => {
        return (song = {
          title: video.title,
          url: video.url,
          duration: video.durationSeconds
        });
      });

    serverQueue ? serverQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);
    const songs = serverQueue ? serverQueue.songs : queueConstruct.songs;

    let playlistEmbed = new MessageEmbed()
    .setTitle(`${playlist ? playlist.title : 'Spotify Playlist'}`)
      .setDescription(songs.map((song, index) => `${index + 1}. ${song.title}`))
      //.setURL(playlist.url)
      .setURL(playlist ? playlist.url : 'https://www.spotify.com/')
      .setColor("#00E0FF")
      .setFooter(`\nAll songs are added type +queue/+q to check queue list`)
      //.setTimestamp();

    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description =
        playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";

    //waitMessage ? waitMessage.delete() : null
    message.channel.send(`${message.author} Started a playlist`, playlistEmbed);

    if (!serverQueue) {
      message.client.queue.set(message.guild.id, queueConstruct);

      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(zzembed).catch(console.error);
      }
    }
  },
  convert(second) {
    const a = second.split(':');
    let rre
    if (a.length == 2) {
      rre = (a[0] * 60) + a[1]
    } else {
      rre = ((a[0] * 60) * 60) + (a[1] * 60) + a[2]
    }

    return rre;
  }
};


console.log("Playlist cmd working")
