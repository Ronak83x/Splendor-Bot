const { MessageEmbed } = require('discord.js');
const { EMOJI_ERROR } = require('../config.json');

module.exports = {
  name: "clip",
  aliases: ["clip"],
  description: "`Plays a clip sound`",
  async execute(message, args) {
    const { channel } = message.member.voice;
    const queue = message.client.queue.get(message.guild.id);

    const use = new MessageEmbed()
    .setDescription(`Usage: ${message.client.prefix}clip <name>`)
    .setColor("#00FFAA");

    const cant = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} Can't play clip because there is an active queue.`)
    .setColor("#00FFAA");

    const needvc = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} You need to join a voice channel first!`)
    .setColor("#00FFAA");

    if (!args.length) return message.reply(use).catch(console.error);
    if (queue) return message.reply(cant);
    if (!channel) return message.reply(needvc).catch(console.error);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      const dispatcher = queueConstruct.connection
        .play(`./sounds/${args[0]}.mp3`)
        .on("finish", () => {
          message.client.queue.delete(message.guild.id);
          // channel.leave();
        })
        .on("error", err => {
          message.client.queue.delete(message.guild.id);
          // channel.leave();
          console.error(err);
        });
    } catch (error) {
      console.error(error);
    }
  }
};


console.log("Clip working")
