const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const { EMOJI_ERROR } = require('../config.json');

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  description: "`Get lyrics for the currently playing song.`\n\n**Usage:** \n`+lyrics`",
  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);

    const noembed = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} There is nothing playing.`)
    .setColor("#13FFDE");
    if (!queue) return message.channel.send(noembed);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    }


    let lyricsEmbed = new MessageEmbed()
      .setTitle(`${queue.songs[0].title} — Lyrics`)
      .setDescription(lyrics)
      .setColor("#13FFDE")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};


console.log("Lyrics working")
