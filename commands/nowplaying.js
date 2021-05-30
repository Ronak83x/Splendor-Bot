const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const {EMOJI_ERROR , EMOJI_LINE , EMOJI_LINES, EMOJI_MUSICLOVER, EMOJI_CP } = require('../config.json')
module.exports = {
  name: "nowplaying",
  aliases: ['np',"now-playing","current","current-song"],
  description: "`Shows information about the current song!`\n\n**Usage:** \n`+np`",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    const noplayembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is nothing playing.`)
    .setColor("#5BFF1E");
    if (!queue) return message.reply(noplayembed);

    const song = queue.songs[0];
    //get current song duration in s
    let minutes = song.duration.split(":")[0];
    let seconds = song.duration.split(":")[1];
    let ms = (Number(minutes)*60+Number(seconds));

    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    //define left duration
    const left = ms - seek;
    
    /*const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;*/

    let nowPlaying = new MessageEmbed()
      .setTitle(`${EMOJI_MUSICLOVER} Now playing`)
      .setDescription(`**[${song.title}](${song.url})**`)
      .setColor("#5BFF1E")
      .setAuthor(message.client.user.username)
      .setThumbnail("https://media.discordapp.net/attachments/810780302540013578/823558351371239434/spl_glitch.gif?width=443&height=427")
      .setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));

      //if its a stream
      if(ms >= 10000) {
        nowPlaying.addField("\u200b", "🔴 LIVE", false);
        //send approve msg
        return message.channel.send(nowPlaying);
      }
      //If its not a stream
      if (ms > 0 && ms<10000) {
        nowPlaying.addField("\u200b", `**${EMOJI_LINE}` + createBar((ms == 0 ? seek : ms), seek, 25, "▬", `${EMOJI_CP}`)[0] + `${EMOJI_LINES}**\n**` + new Date(seek * 1000).toISOString().substr(11, 8) + " / " + (ms == 0 ? " ◉ LIVE" : new Date(ms * 1000).toISOString().substr(11, 8))+ "**" , false );
        //send approve msg
        return message.channel.send(nowPlaying);
      }

    /*if (song.duration > 0) {
      nowPlaying.addField(
        "\u200b",
        new Date(seek * 1000).toISOString().substr(11, 8) +
          `${EMOJI_LINE}` +
          createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
          `${EMOJI_LINES}` +
          (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
        false
      );
      nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
    }*/

    //return message.channel.send(nowPlaying);
  }
};
console.log("NowPlaying working")
