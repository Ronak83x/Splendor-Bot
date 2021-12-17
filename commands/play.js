const { play } = require("../include/play");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default;
const https = require("https");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, LOCALE, DEFAULT_VOLUME, SPOTIFY_CLIENT_ID, SPOTIFY_SECRET_ID } = require("../util/SplendorbotUtil");
const spotifyURI = require('spotify-uri');
const Spotify = require('node-spotify-api');
const youtubesr = require("youtube-sr");
const { EMOJI_DONE , EMOJI_ERROR, EMOJI_BLUEDISC } = require('../config.json');
const { MessageEmbed } = require("discord.js");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const spotify = new Spotify({
  id: SPOTIFY_CLIENT_ID,
  secret: SPOTIFY_SECRET_ID
});


module.exports = {
  name: "play",
  aliases: ["baja","bja","p"],
  cooldown: 3,
  description: "`Plays audio from YouTube,Soundcloud and Spotify.`\n\n**Usage:** \n`+p <YouTube URL | Song Name | Soundcloud URL | Spotify URL>`",
  async execute(message, args) {
    const { channel } = message.member.voice;
    
    const needvc = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} You need to join a voice channel first!`)
    .setColor("#00FFA6");

    const youmust = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} You must be in the same channel as ${message.client.user}`)
    .setColor("#00FF78");

    const missperm = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} Cannot connect to voice channel, missing permissions.`)
    .setColor("#FF2A00");

    const speakperm = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} I cannot speak in this voice channel, make sure I have the proper permissions!`)
    .setColor("#3EFF00");    

    const ncf = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} No content could be found at that url.`)
    .setColor("#00FFBD");  

    const urlrd = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} Following url redirection..`)
    .setColor("#00FFBD"); 

    const notjoin = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} Could not join the channel.`)
    .setColor("#FF573C"); 
   
    const playyy = new MessageEmbed()
    .setDescription(`Usage: **${message.client.prefix}play <YouTube URL | Song Name | Soundcloud URL | Spotify URL>**`)
    .setColor("#00FF70"); 



    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply(needvc);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(youmust);

    if (!args.length)
      return message
        .reply(playyy);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply(missperm);
    if (!permissions.has("SPEAK"))
      return message.reply(speakperm)
    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
    const spotifyPattern = /^.*(https:\/\/open\.spotify\.com\/track)([^#\&\?]*).*/gi;
    const spotifyValid = spotifyPattern.test(args[0]);
    const spotifyPlaylistPattern = /^.*(https:\/\/open\.spotify\.com\/playlist)([^#\&\?]*).*/gi;
    const spotifyPlaylistValid = spotifyPlaylistPattern.test(args[0])
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (spotifyPlaylistValid) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    if (mobileScRegex.test(url)) {
      try {
        https.get(url, function (res) {
          if (res.statusCode == "302") {
            return message.client.commands.get("play").execute(message, [res.headers.location]);
          } else {
            return message.reply(ncf);
          }
        });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
      return message.reply(urlrd);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME || 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (spotifyValid) {
      let spotifyTitle, spotifyArtist;
      const spotifyTrackID = spotifyURI.parse(url).id
      const spotifyInfo = await spotify.request(`https://api.spotify.com/v1/tracks/${spotifyTrackID}`).catch(err => {
        return message.channel.send(`Oops... \n` + err)
      })
      spotifyTitle = spotifyInfo.name
      spotifyArtist = spotifyInfo.artists[0].name

      try {
        const final = await youtube.searchVideos(`${spotifyTitle} - ${spotifyArtist}`, 1, { part: 'snippet' });
        songInfo = await ytdl.getInfo(final[0].url)
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        }
      } catch (err) {
        console.log(err)
        return message.channel.send(`Oops.. There was an error! \n ` + err)
      }

    } else if (urlValid) {
      try {
        songInfo = await youtubesr.searchOne(search) ;
        song = {
          title: songInfo.title,
          url: songInfo.url,
          thumbnail: songInfo.thumbnail,
          duration: songInfo.durationFormatted,
       };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: Math.ceil(trackInfo.duration / 1000)
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else {
      try {
         songInfo = await youtubesr.searchOne(search) ;
         song = {
           title: songInfo.title,
           url: songInfo.url,
           thumbnail: songInfo.thumbnail,
           duration: songInfo.durationFormatted,
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }
    let sembed = new MessageEmbed()
    .setDescription(`${EMOJI_BLUEDISC} Queued: [${song.title}](${song.url})\nRequested By: <@${message.author.id}>`)
    .setFooter('Queue stuck? Try +skip')
    .setColor("#00FFF0");

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(sembed);
    }


    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(notjoin);
      
    }
  }
};



console.log("Play cmd working")
