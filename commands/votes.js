const Discord = require("discord.js");

module.exports.run = (msg, args, bot, db, isAdmin) => {
    let page = parseInt(args[0]);
    if(isNaN(page)) page = 1;

    let songs = db.db.prepare(`select * from songs order by votes desc limit ${(page-1)*10}, 10`).all();

    let i = ((page-1)*10)+1;

    let embed = new Discord.RichEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
        .setTitle(`Song leaderboard by votes`)
        .setDescription(songs.map(s => `${i++}. [${s.name}](${s.link}) • ${s.votes} votes`).join("\n"))
        .setColor("RANDOM")
        .setFooter(`${page} page`)
        .setTimestamp();

    msg.channel.send(embed);
};
module.exports.aliases = [];