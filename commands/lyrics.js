const Discord = require("discord.js");

module.exports.run = (msg, args, bot, db, isAdmin) => {
	let isId = !isNaN(+args[0]) && args.length === 1;
	let song = args.join(" ");
	let sd;
	if(isId) {
		sd = db.getSong(+song);
	} else {
		sd = db.findSong(song);
	}
	if(!sd) throw "Song was not found!";
	if(!sd.lyrics) throw "No lyrics available in database for this song.";

	let embed = new Discord.RichEmbed()
		.setTitle(`${sd.name} lyrics`)
		.setDescription(sd.lyrics.slice(0, 2048))
		.setColor("#55ff55")
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL);

	if(sd.thumb) embed.setThumbnail(sd.thumb);
	msg.channel.send(embed);
};
module.exports.aliases = ["lyric"];