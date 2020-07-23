const Discord = require("discord.js");
const data = {
	artists: {
		"Tally Hall": "https://www.tallyhall.com/",
		"ミラクルミュージカル": "http://www.hawaiipartii.com/",
		"Joe Hawley": "https://whalejoey.com/",
		"Rob Cantor": "https://robcantormusic.bandcamp.com/"
	},
	albums: {
		"Marvin's Marvelous Mechanical Museum": "https://www.tallyall.club/Tally%20Hall/Marvin%27s%20Marvelous%20Mechanical%20Museum/2008%20Version/MP3%20320/",
		"Marvin's Marvelous Mechanical Museum 2005": "https://www.tallyall.club/Tally%20Hall/Marvin%27s%20Marvelous%20Mechanical%20Museum/2005%20Version/MP3%20320/",
		"Good & Evil": "https://www.tallyall.club/Tally%20Hall/Good%20%26%20Evil/MP3%20320/",
		"Hawaii: Part II": "https://www.tallyall.club/members/Miracle%20Musical/Hawaii%20Part%20II/MP3%20320/",
		"Joe Hawley": "https://www.tallyall.club/members/Joe%20Hawley/Joe%20Hawley%20Joe%20Hawley/MP3%20320/",
		"Not a Trampoline": "https://www.tallyall.club/members/Rob%20Cantor/Not%20a%20Trampoline/MP3%20320/",
		"Complete Demos": "https://www.tallyall.club/Tally%20Hall/Complete%20Demos/MP3%20320/",
		"Admittedly Incomplete Demos": "https://www.tallyall.club/Tally%20Hall/Admittedly%20Incomplete%20Demos/MP3%20320/"
	}
};

module.exports.run = (msg, args, bot, db, isAdmin) => {
	let isId = !Number.isNaN(+args[0]) && args.length === 1;
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
		.setDescription(`**[#${sd.id}] ${data.artists[sd.author] ? `[${sd.author}](${data.artists[sd.author]})` : sd.author} - ${sd.album ? (data.albums[sd.album] ? `[${sd.album}](${data.albums[sd.album]})` : sd.album) + " - ":""}[${sd.name}](${sd.link})**`)
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