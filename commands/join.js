const distube = require('../index.js');
const { MessageEmbed } = require("discord.js");
const { EMOJI_DONE , EMOJI_ERROR } = require("../config.json")
module.exports = {
    name: "join",
    aliases: ["j","24/7","aaja","aja"],
    description: "`Enables 24/7 mode in your server by joining User's VC!`\n\n**Usage:** \n`+join`",
    async execute(message, args) {
        const { channel } = message.member.voice;

        const joinerrorembed = new MessageEmbed()
        .setDescription(`${EMOJI_ERROR} You must be in the same channel as ${message.client.user}`)
        .setColor("#00FFFF");

        const needvc = new MessageEmbed()
        .setDescription(`${EMOJI_ERROR} You need to join a voice channel first!`)
        .setColor("#00FFFF");

        const joinembed = new MessageEmbed()
        .setDescription(`${EMOJI_DONE} 24/7 mode is now **enabled** in this server.`)
        .setColor("#00FFFF");
    
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!channel) return message.reply(needvc);
        if (serverQueue && channel !== message.guild.me.voice.channel)
          return message.reply(joinerrorembed);


          message.channel.send(joinembed)


          

            await message.member.voice.channel.join()
            return message.react(EMOJI_DONE);
        }
    }


    console.log("Join working")
