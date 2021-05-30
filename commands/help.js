const { MessageEmbed } = require("discord.js");
const { EMOJI_PLAYING ,EMOJI_INFO ,EMOJI_DONE ,EMOJI_ERROR ,BOT_ID } = require('../config.json');

// message.react(EMOJI_DONE);

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "`Show commands list or specific command help.`\n\n**Usage:** \n`+help \n+help (command name)`",
  execute(message, args) {
    let commands = message.client.commands.array();
    //const music = commands.map((x) => '`' + x.name + '`').join(', ');

    if(!args[0]) {
    let helpEmbed = new MessageEmbed()
    .setAuthor("Splendor + Help!", message.client.user.displayAvatarURL())
    //.setTitle(`${message.client.user.username} Help`)
    .setColor("#00FF70")
    //.setDescription('To get help on a specific command type !!help <command>')
    .setDescription("My Current Prefix in this Server is `+`")
    //.setDescription("My Current Prefix in this Server is `+`\n \n`help(h)`, `play(p)`, `24/7(j)`, `nowplaying(np)`, `queue(q)`, `pause`, `resume(r)`, `skip(s)`, `stop`, `loop(l)`, `lyrics(ly)`, `search`, `shuffle`, `move(mv)`, `remove(rm)`, `skipto(st)`, `volume(v)`, `disconnect(dc)`, `pruning`, `invite(inv)`, `bug`, `feedback(fb)`, `support`, `stats(about)`, `uptime(u)`, `ping`, `vote`")
    .addField(`${EMOJI_PLAYING} Music`, "\n \n`play(p)`, `playlist(pl)`, `24/7(j)`, `nowplaying(np)`, `queue(q)`, `pause`, `resume(r)`, `skip(s)`, `stop(end)`, `loop(l)`, `lyrics(ly)`, `search`, `shuffle`, `move(mv)`, `remove(rm)`, `skipto(st)`, `volume(v)`, `disconnect(dc)`, `pruning`")
    .addField(`${EMOJI_INFO} General`, "`help(h)`, `invite(inv)`, `bug`, `feedback(fb)`, `support(ss)`, `stats(about)`, `uptime(u)`, `ping`")
    //.addField(`Splendor Commands`, music)
    .addField("\u200B", `[SUPPORT SERVER](https://discord.gg/XKmhHKCnQP) • [INVITE](https://discord.com/api/oauth2/authorize?client_id=${BOT_ID}&permissions=8&scope=bot) `)
    .setFooter('Type +help <command name> for command info.\nMADE BY 𝐒𝐆 • ROИΔK#0083')
    //.setFooter(' To get help on a specific command type +help <command name>\nMADE BY 𝐒𝐆 • ROИΔK#0083')
    .setImage('https://media.discordapp.net/attachments/810780302540013578/824246998243999764/Splendor_Line.gif')
    .setThumbnail("https://media.discordapp.net/attachments/810780302540013578/823558351371239434/spl_glitch.gif?width=443&height=427");
   // helpEmbed.setTimestamp();

    message.channel.send(helpEmbed)
  } else {
    const command = message.client.commands.get(args.join(" ").toLowerCase()) || message.client.commands.find(x => x.aliases && x.aliases.includes(args.join(" ").toLowerCase()));

    const nfcmd = new MessageEmbed()
    .setDescription(`${EMOJI_ERROR} - I did not find this command !`)
    .setColor("#00FF78");

    if (!command) return message.channel.send(nfcmd);

    const helpembed = new MessageEmbed()
    .setAuthor('Help Panel', message.client.user.displayAvatarURL())
    .addField('Description', command.description)
    .addField('Name', `\`${command.name}\``)
    .addField('Aliase(s)', `\`${command.aliases.length < 1 ? 'None' : command.aliases.join(', ')}\``)
    .setColor("#8108FF")
    .setTimestamp()
    .setImage('https://media.discordapp.net/attachments/810780302540013578/824246998243999764/Splendor_Line.gif')
    .setThumbnail("https://media.discordapp.net/attachments/810780302540013578/823558351371239434/spl_glitch.gif?width=443&height=427")
    .setFooter('Thanks For Choosing Splendor +')
    message.channel.send(helpembed);
   };
  }
};


console.log("help working")
