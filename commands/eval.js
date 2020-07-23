const Discord = require("discord.js");

module.exports.run = (msg, args, bot, db, isAdmin) => {
    if(!isAdmin) throw "You're not allowed to use this command!";

    let embed = new Discord.RichEmbed()
        .setDescription(eval(args.join(" ")));

    msg.channel.send(embed);
};
module.exports.aliases = [];