const Discord = require("discord.js");

module.exports.run = (msg, args, bot, db, isAdmin) => {
	if(!isAdmin) throw "You're not allowed to use this command!";
	if(!args[1]) throw "Usage: \`th!edit-song [id] [property] [value]\`. Properties: name, votes, album, link, thumb, lyrics";
	let id = +args[0], property = args[1], value = args[2] ? args.slice(2).join(" ") : null;
	if(isNaN(id)) throw "Usage: \`th!edit-song [id] [property] [value]\`. Properties: name, votes, album, link, thumb, lyrics";

	let edit = db.editSong(id, property, value);
	if(!edit) throw "Error during editing song. Usage: \`th!edit-song [id] [property] [value]\`. Properties: name, votes, lyrics, album, link, thumb";
	let song = db.getSong(id);

	let embed = new Discord.RichEmbed()
		.setTitle("Song edited")
		.setDescription(`Song \`${song.name}\` was edited.`)
		.setColor("#55ff55")
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL);

	msg.channel.send(embed);
};
module.exports.aliases = ["edit-song"];