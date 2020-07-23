const Discord = require("discord.js");

module.exports.run = (msg, args, bot, db, isAdmin) => {
    let page = parseInt(args[0]);
    if(isNaN(page)) page = 1;

    let songs = db.db.prepare(`select id, name, link from songs`).all();

    for(let i in songs) {
        let song = songs[i];
        let rating = db.getRating(song.id);
        if(!isNaN(parseFloat(rating))) song.rating = parseFloat(rating);
        else song.rating = 0;
    }
    songs = songs.sort((a, b) => b.rating-a.rating);
    songs = songs.slice((page-1)*10, ((page-1)*10)+10);

    let i = ((page-1)*10)+1;

    let embed = new Discord.RichEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
        .setTitle(`Song leaderboard by rating`)
        .setDescription(songs.map(s => `${i++}. [${s.name}](${s.link}) • ${s.rating} ⭐`).join("\n"))
        .setColor("RANDOM")
        .setFooter(`${page} page`)
        .setTimestamp();

    msg.channel.send(embed);
};
module.exports.aliases = [];