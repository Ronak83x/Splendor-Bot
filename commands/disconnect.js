const { MessageEmbed } = require('discord.js');
const { EMOJI_DONE , EMOJI_ERROR } = require('../config.json');

module.exports = {
    name: "disconnect",
    aliases: ["dc", "leave", "nikal"],
    description: "`Leaves Voice Channel.`\n\n**Usage:**\n`+dc`\n\n**Permission:**\n`To Disconnect Bot You Require MOVE MEMBERS Perm To Execute This Command!`",
    async execute(message, args) {
        const { channel } = message.member.voice;
    
        if(!message.member.hasPermission('MOVE_MEMBERS')){
          const noperms = new MessageEmbed()
          .setDescription('<a:spl_music_error:808395975726727189> You Do Not Have Perms To Execute This Command! You Require __`MOVE MEMBERS`__ Perm To Execute This Command!')
          .setColor("#00FFFF");
          return message.channel.send(noperms)
        }

        const serverQueue = message.client.queue.get(message.guild.id);
        const dcerrorembed = new MessageEmbed()
        .setDescription(`${EMOJI_ERROR} You need to join a voice channel which i'm in - to disconnect me!`)
        .setColor("#00FFFF")

        const scembed = new MessageEmbed()
        .setDescription(`${EMOJI_ERROR} You must be in the same channel as ${message.client.user}`)
        .setColor("#00FFFF")

        const dcembed = new MessageEmbed()
        .setDescription(`${EMOJI_DONE} 24/7 mode is now **disabled** in this server.`)
        .setColor("#00FFFF")

        if (!channel) return message.reply(dcerrorembed);
        if (serverQueue && channel !== message.guild.me.voice.channel)
          return message.reply(scembed);

          message.channel.send(dcembed)
            message.member.voice.channel.leave();
            return message.react(EMOJI_DONE);
            
           
        }
    }



    console.log("DC / Disconnect working")
