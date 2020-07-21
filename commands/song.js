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
	let myrating = db.db.prepare("select * from rates where id = ? and songid = ?").get(msg.author.id, sd.id);

	let embed = new Discord.RichEmbed()
		.setTitle(sd.name)
		.setDescription(`**[#${sd.id}] ${sd.author} - ${sd.album ? sd.album+" - ":""}${sd.name}**`)
		.setColor("RANDOM")
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
		.addField("Votes", sd.votes, true)
		.addField("Rating", `${db.getRating(sd.id)} ${myrating?"(You: "+myrating.rating+")":""}`, true)
		.addField("_ _", "_ _", true)
	if(sd.lyrics) embed.description += `\nLyrics are available. (\`th!lyrics ${sd.id}\`)`;
	if(sd.link) embed.addField("Link", sd.link, true);
	if(sd.thumb) embed.setThumbnail(sd.thumb);

	msg.channel.send(embed);
};
module.exports.aliases = [];