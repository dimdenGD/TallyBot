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

	db.voteSong(msg.author.id, sd.id);

	let embed = new Discord.RichEmbed()
		.setTitle(`${sd.name} vote`)
		.setDescription(`Successfully voted for \`${sd.name}\`!`)
		.setColor("#55ff55")
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL);

	msg.channel.send(embed);
};
module.exports.aliases = [];