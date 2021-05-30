/**
 * Module Imports
 */
require('events').EventEmitter.defaultMaxListeners = 3000;
const { Client, Collection } = require("discord.js");
const { EMOJI_CRY, EMOJI_UPDOWN } = require('./config.json');
const { readdirSync } = require("fs");
const { MessageEmbed } = require('discord.js');
const { join } = require("path");
const { TOKEN, PREFIX } = require("./util/SplendorbotUtil");
const client = new Client({ disableMentions: "everyone" });
const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient('818782183937802270', 'eI4D7QiomSOj-vZKY6a-DT9UaSprc8I0PyJ-vUchhiXgxlRoVWDNNiUDvDK47cYmYMko');

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const {BOT_PREFIX, BOT_STATUS2, BOT_STATUS3 , BOT_PRESENCE } = require('./config.json');

/**
 * Client Events
 */
client.on("ready", () => {
   function randomStatus() {
 let status = [`${BOT_PREFIX}help | ${client.channels.cache.size} Channels`,`${BOT_PREFIX}help | ${client.guilds.cache.size} Servers`] //  let status = [`${BOT_PREFIX}help | ${client.channels.cache.size} Channels`,`${BOT_PREFIX}help | ${client.users.cache.size} Members`, `${BOT_PREFIX}help | ${client.guilds.cache.size} Servers`]
let rstatus = Math.floor(Math.random() * status.length);

client.user.setActivity(status[rstatus], {type: `${BOT_PRESENCE}` });
}; setInterval(randomStatus, 200000)

console.log('Bot is ready to play songs !')
})
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }
});

client.on("message", async (message) => {
    if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
            const HELLO_SERVER = new MessageEmbed()
            .addField("Invite Me", "You Can Invite Me By Clicking [Splendor+](https://discord.com/oauth2/authorize?client_id=789386169463996426&permissions=8&scope=bot)")
            .addField("Invite Splendor 1", "You Can Invite Splendor 1 By Clicking [Splendor](https://discord.com/oauth2/authorize?client_id=765843852661227520&permissions=8&scope=bot)")
            .addField("Support", "If you have questions, suggestions, or found a bug, please join the [Splendor Support Server](https://discord.gg/XKmhHKCnQP)")
            .setTitle("Hi, I'm Splendor+ ! Need Help ?")
            .setFooter("MADE BY 𝐒𝐆 • ROИΔK#0083")
            .setColor("#00FF70")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(`You can check every command by \`+help\` command!`)
            return message.channel.send(HELLO_SERVER);
        }
})

process.on("unhandledRejection", (err) => {
	webhookClient.send(`\> --> ${err}`);
});

