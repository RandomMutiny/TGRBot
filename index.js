const Discord = require("discord.js");
const botconfig = require("./botconfig.json");
const colours = require("./colours.json");
const fs = require("fs");

const bot = new Discord.Client({
  disableEveryone: true
});

bot.on("ready", async () => {
   console.log(`${bot.user.username} is online!`)
   bot.user.setActivity("Hello", {type: "WATCHING"});
});

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  
  if(err) console.log(err)

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    return console.log("[LOGS] Couldn't Find Commands!");
  }

  jsfile.forEach((f, i) => {
    let pull = require(`./commands/${f}`);
    bot.commands.set(pull.config.name, pull);
    pull.config.aliases.forEach(alias => {
      bot.aliases.set(alias, pull.config.name)
    })
  })

});


bot.on("message", async message => {
  if(message.author.bot || message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ")
  let cmd = messageArray[0];
  let args = messageArray.slice(1);


  let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(cmd.aliases.get(cmd.slice(prefix.length)))
  if(commandfile) commandfile.run(bot,message,args)
})

bot.login(process.env.token);
