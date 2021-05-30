const { MessageEmbed } = require("discord.js");
const YouTubeAPI = require("simple-youtube-api");
const { YOUTUBE_API_KEY } = require("../util/SplendorbotUtil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const { EMOJI_ERROR } = require('../config.json');

module.exports = {
  name: "search",
  aliases: ["find"],
  description: "`Search and select videos to play.`\n\n**Usage:** \n`+search <Music Name>`",
  async execute(message, args) {
    
    const use = new MessageEmbed()
    .setDescription(`Usage: ${message.client.prefix}${module.exports.name} <Video Name>`)
    .setColor("#00FF78");

    const collect = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} A message collector is already active in this channel.`)
    .setColor("#00FF78");

    const needvc = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} You need to join a voice channel first!`)
    .setColor("#00FF78");
    
    if (!args.length)
      return message
        .reply(use)
        .catch(console.error);
    if (message.channel.activeCollector)
      return message.reply(collect);
    if (!message.member.voice.channel)
      return message.reply(needvc).catch(console.error);

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setTitle(`**Reply with the song number you want to play**`)
      .setDescription(`Results for: ${search}`)
      .setColor("#00FF6F");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

      let resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
        return pattern.test(msg.content);
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      const reply = response.first().content;

      if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());

        for (let song of songs) {
          await message.client.commands
            .get("play")
            .execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
        }
      } else {
        const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
        message.client.commands.get("play").execute(message, [choice]);
      }

      message.channel.activeCollector = false;
      resultsMessage.delete().catch(console.error);
      response.first().delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
      message.reply(error.message).catch(console.error);
    }
  }
};


console.log("Search working")
