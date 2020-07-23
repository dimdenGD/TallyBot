const Discord = require("discord.js");

module.exports.run = (msg, args, bot, db, isAdmin) => {
    let isId = !isNaN(+args[1]);
    let rating = parseInt(args[0]);
    if(isNaN(rating) || rating > 10 || rating < 1) throw "Error. Usage: `th!rate [1-10] [song]`.";
    let song = args.slice(1).join(" ");
    let sd;
    if(isId) {
        sd = db.getSong(+song);
    } else {
        sd = db.findSong(song);
    }
    if(!sd) throw "Song was not found!";

    let rate = db.rateSong(msg.author.id, sd.id, rating);

    let embed = new Discord.RichEmbed()
        .setTitle(`${sd.name} rating`)
        .setDescription(`Successfully ${rate === "INSERT" ? "rated song" : "updated rating of"} \`[#${sd.id}] ${sd.author} - ${sd.album} - ${sd.name}\` ${rate === "INSERT" ? "with" : "to"} \`${rating}\`!`)
        .setColor("#55ff55")
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL);

    msg.channel.send(embed);
};

module.exports.aliases = [];