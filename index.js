const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const config = require("./config.json");
const fetch = require("node-fetch");
const fs = require("fs");
const { types } = require("util");
const db = require("./db.js");

bot.commands = {};

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        if(!props.name) props.name = f.slice(0, -3);
		bot.commands[props.name] = props;
		if(props.aliases) props.aliases.forEach(a => bot.commands[a] = props);
		console.log(`${f} loaded!`);
	});
});

bot.on("ready", () => {
	console.log(`\n\x1b[46m`, `${bot.user.username} is online on ${bot.guilds.size} servers!\x1b[0m`);
    bot.user.setActivity("https://dimden.dev/");
});

bot.on("error", () => {});
bot.on("message", msg => {
	if(msg.author.id === bot.user.id) return;
    if(msg.guild.id !== "503244758966337546") {
        if(msg.content.includes("swim")) {
            if(Math.random() > 0.99) msg.channel.send("You my friend, are very much swim!");
            else if(Math.random() > 0.50) msg.channel.send("I'm swim");
        }
        if(msg.content.includes("dimden")) {
            msg.channel.send("dimden");
        }
        if(msg.content.includes("topic pls")) {
            let collector = new Discord.MessageCollector(msg.channel, m => m.author.id === "476797114589118464", {time: 5000});
            let topicpls = false;
            collector.on("collect", () => {
                topicpls = true;
                collector.stop();
            });
            collector.on("end", () => {
                if(!topicpls) {
                    fetch("https://www.conversationstarters.com/random.php").then(i => i.text()).then(i => {
                        i = i.slice(39);
                        msg.channel.send(`boris is dead so i'm here :pleading_face:\n${i}`);
                    })
                }
            })
        }
    }
    const args = msg.content.split(" ");
    const command = args.shift().slice(config.prefix.length);

    if(!bot.commands[command] || !msg.content.startsWith(config.prefix)) return;
    console.log(msg.author.tag, msg.content);
    try {
    	let isAdmin = false;
	    if(config.admins.indexOf(msg.author.id) !== -1) isAdmin = true;
	    let c = bot.commands[command].run(msg, args, bot, db, isAdmin);

	    if(types.isPromise(c)) c.catch(e => {
            const embed = new Discord.RichEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                .setColor("ff4444")
                .setTitle("❌ Error")
                .setTimestamp()
                .setDescription(typeof e === "string" ? e : e.stack);
            msg.channel.send(embed);
        });
    } catch(e) {
    	const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
            .setColor("ff4444")
            .setTitle("❌ Error")
            .setTimestamp()
            .setDescription(typeof e === "string" ? e : e.stack);
        msg.channel.send(embed);
    } 
});

bot.login(config.token);