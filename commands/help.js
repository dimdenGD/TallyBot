const Discord = require("discord.js");

module.exports.run = (msg, args, bot, db, isAdmin) => {
	let help = "`[arg]` - required, `<arg>` - optional.\n" +
		"\n" +
		"`th!album [album]` - get info about album.\n" +
		"`th!vote [song]` - add +1 to all votes (every 20 hours).\n" +
		"`th!rate [1-10] [song]` - rate song from 1 to 10.\n" +
		"`th!votes <page>` - top of songs by vote count (every page has 10 songs)\n" +
		"`th!rating <page>` - top of songs by rating (every page has 10 songs)\n" +
		"`th!hiddeninthesand [page]` or `th!hits [page]` - search page in hiddeninthesand.com/wiki\n" +
		"`th!song [name]` - get info about song: name, rating, votes, link, album, other stuff\n" +
		"`th!lyrics [song]` - get lyrics of song\n";
	if(isAdmin) help += "`th!addsong [author] [album] [song name]` - add song\n" +
		"`th!editsong [song id] [property] [value]` - edit song\n" +
		"`th!removesong [song id]` - remove song\n";
	msg.channel.send(help)
};
module.exports.aliases = ["?"];