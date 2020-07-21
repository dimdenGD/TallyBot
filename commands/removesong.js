const Discord = require("discord.js");

module.exports.run = (msg, args, bot, db, isAdmin) => {
	if(!isAdmin) throw "You're not allowed to use this command!";
	if(!args[0]) throw "Usage: \`th!delete-song [id]\`";
	let id = +args[0];
	if(isNaN(id)) throw "Usage: \`th!delete-song [id]\`";

	db.db.prepare("delete from songs where id = ?").run(id);

	msg.channel.send("DELETED");
};
module.exports.aliases = ["remove-song", "delete-song", "deletesong"];