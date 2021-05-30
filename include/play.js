//const ytdl = require("erit-ytdl");
const ytdl = require("discord-ytdl-core");
const { MessageEmbed } = require("discord.js");
const scdl = require("soundcloud-downloader").default;
const { canModifyQueue, STAY_TIME } = require("../util/SplendorbotUtil");
const {EMOJI_ARROW , EMOJI_STARTED_PLAYING , EMOJI_DONE, EMOJI_DISC }= require('../config.json');

module.exports = {
  async play(song, message) {
    const { SOUNDCLOUD_CLIENT_ID } = require("../util/SplendorbotUtil");

    let config;

    try {
      config = require("../config.json");
    } catch (error) {
      config = null;
    }

    let completeembed = new MessageEmbed()
    .setDescription(`${EMOJI_DONE} I'have played all the songs, Now my queue list is empty! ,i'm in vc just  **${message.client.prefix}p <song name>** ,to play song`)
    .setColor("#00FF70");

    const PRUNING = config ? config.PRUNING : process.env.PRUNING;

    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
    queue.textChannel.send(completeembed);
    return message.client.queue.delete(message.guild.id);
  }

    //-------------------------------------------------------------------------------------
    //do some variables defining
    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus"; //if its youtube change streamtype
    let isnotayoutube = false; //is not a youtube
    let seekTime = 0; //seektime to 0
    let oldSeekTime = queue.realseek; //the seek time if you skipped the song it would reset it himself, this provents it
    //let encoderArgstoset; //encoderargs for the filters only for youtube tho

    try {
      if (song.url.includes("youtube.com")) {
        stream = ytdl(song.url, {
         filter: "audioonly",
         opusEncoded: true,
         //encoderArgs: encoderArgstoset,
         bitrate: 320,
         seek: seekTime,
         quality: "highestaudio",
         liveBuffer: 40000,
         highWaterMark: 1 << 50, 

     });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID);
        } catch (error) {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {


      
      const playingembed =  new MessageEmbed()
      .setTitle(`${EMOJI_DISC} Now Playing`)
      .setDescription(`[${song.title}](${song.url})`)
      .setColor("#00FF70")
      //.setThumbnail(song.thumbnail)

  
      
var playingMessage = await queue.textChannel.send(playingembed);

      await playingMessage.react("⏭");
      //await playingMessage.react("⏯");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);
      const skipembed = new MessageEmbed()
      .setDescription(`⏭ Skipped the song!\nSkipped By: <@${user.id}>`)
      .setColor("#00E0FF");
      
      const pembed = new MessageEmbed()
      .setDescription(`⏸ Paused the music!\nPaused By: <@${user.id}>`)
      .setColor("#FF3232");

      const rembed = new MessageEmbed()
      .setDescription(`▶ Resumed the music!\nResumed By: <@${user.id}>`)
      .setColor("#00FF50")

      const unmuteembed = new MessageEmbed()
      .setDescription(`🔊 unmuted the music!\nUnmuted By: <@${user.id}>`)
      .setColor("#FFCE97")

      const muteembed = new MessageEmbed()
      .setDescription(`🔇 muted the music!\nMuted By: <@${user.id}>`)
      .setColor("#FFCE97")

      const decembed = new MessageEmbed()
      .setDescription(`🔉 decreased the volume, the volume is now **${queue.volume}%**\nDecreased By: <@${user.id}>`)
      .setColor("#00FF4D")

      const invembed = new MessageEmbed()
      .setDescription(`🔊 increased the volume, the volume is now **${queue.volume}%**\nIncreased By: <@${user.id}>`)
      .setColor("#00FF4D")

      const loopembed = new MessageEmbed()
      .setDescription(`${EMOJI_DONE} Loop is now ${queue.loop ? "**off**" : "**on**"}\nBy: <@${user.id}>`)
      .setColor("#00FF3E")

      const stopembed = new MessageEmbed()
      .setDescription(`⏹ Player has been stopped!\nStopped By: <@${user.id}>`)
      .setColor("#0032FF")
      

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel.send(skipembed);
          collector.stop();
          break;

        /*case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(pembed);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(rembed);
          }
          break;*/

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            queue.textChannel.send(unmuteembed);
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            queue.textChannel.send(muteembed);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 0) return;
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(decembed)
            .catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member) || queue.volume == 100) return;
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(invembed)
            .catch(console.error);
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel.send(loopembed);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel.send(stopembed);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
