const Discord = require("discord.js");
const yts = require('yt-search');
const searchlyrics = require("@youka/lyrics");

module.exports.run = async (msg, args, bot, db, isAdmin) => {
	if(!isAdmin) throw "You're not allowed to use this command!";
	if(!args[2]) throw "Usage: `th!add-song [author] [album] [song name] <-n>`";
	let noinfo = false;
	if(args[args.length-1] === "-n") {
		noinfo = true;
		args.splice(args.length-1, 1);
	}
	let author = args[0].replace(/_/g, " ");
	let album = args[1].replace(/_/g," ");
	let name = args.slice(2).join(" ");
	if(album === "null" || album === "undefined" || album === "0" || album === "none") album = undefined;
	if(album.toLowerCase() === "mmmm") album = "Marvin's Marvelous Mechanical Museum";
	if(album.toLowerCase() === "mmmm05") album = "Marvin's Marvelous Mechanical Museum 2005";
	if(album.toLowerCase() === "g&e") album = "Good & Evil";
	if(album.toLowerCase() === "hp:ii") album = "Hawaii: Part II";
	if(album.toLowerCase() === "hpii") album = "Hawaii Partii";
	if(album.toLowerCase() === "jh") album = "Joe Hawley";
	if(album.toLowerCase() === "nat") album = "Not a Trampoline";

	let song = db.createDefaultSong(name);
	db.db.prepare("update songs set author = ?, album = ? where id = ?").run(author, album, song);

	switch(album) {
		case "Marvin's Marvelous Mechanical Museum":
			db.db.prepare("update songs set thumb = ? where id = ?")
			.run("https://www.hiddeninthesand.com/wiki/images/4/42/MMMM08.jpg", song);
			break;
		case "Marvin's Marvelous Mechanical Museum 2005":
			db.db.prepare("update songs set thumb = ? where id = ?")
			.run("https://img.discogs.com/TwCnJ2wR0J4WYiXKgNSJ5aAwvgA=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1219069-1201549477.jpeg.jpg", song);
			break;
		case "Good & Evil":
			db.db.prepare("update songs set thumb = ? where id = ?")
			.run("https://i.redd.it/y1x8ccuii7c41.png", song);
			break;
		case "Hawaii: Part II":
			db.db.prepare("update songs set thumb = ? where id = ?")
			.run("https://vignette.wikia.nocookie.net/tallyhall/images/a/a4/Hawaiiptii.jpg/revision/latest/scale-to-width-down/340?cb=20150728023256", song);
			break;
		case "Joe Hawley":
			// https://66.media.tumblr.com/2382a5d210cd56cec3005a2e1dbbb70d/fb1d99633266a685-a4/s400x600/7a3bc1a7c46ee65dbc7fab25be72305ca410ce27.jpg
			db.db.prepare("update songs set thumb = ? where id = ?")
			.run("https://img.discogs.com/OF7uvVe2JtPJTQxNM1QfBJY89OU=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9261863-1477572749-5742.jpeg.jpg", song);
			break;
		case "Not a Trampoline":
			db.db.prepare("update songs set thumb = ? where id = ?")
			.run("https://is2-ssl.mzstatic.com/image/thumb/Music123/v4/10/4c/19/104c195c-8643-25b3-3352-2cdbe4b5fea5/859712431530_cover.jpg/600x600bf.png", song);
			break;
		case "Hawaii Partii":
			db.db.prepare("update songs set thumb = ? where id = ?")
			.run("https://img.discogs.com/NUngERklqnPGm6ttR9Q0Jo1kcyc=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-7921293-1451707090-8720.jpeg.jpg", song);
	}
	let message, link, lyrics;
	let embed = new Discord.RichEmbed()
		.setTitle("Song added")
		.setDescription(`Song \`${author} - ${album} - ${name}\` was added to database! ID: **\`${song}\`**. Use \`th!edit-song\` to add info to it.`)
		.setColor("#55ff55")
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL);

	message = await msg.channel.send(embed);
	if(!noinfo) {
		let got = false;
		yts(`${author} ${name}`, (err, r) => {
			if(got) return;
			got = true;
			let url = r.videos[0].url;
			link = true;
			db.editSong(song, "link", url);
			if(message) message.edit(`[UPDATE]: Found link${lyrics ? " & lyrics":""}!`);
		});
		searchlyrics(`${author} ${name}`).then(i => {
			if(!i) return;
			lyrics = true;
			db.editSong(song, "lyrics", i);
			if(message) message.edit(`[UPDATE]: Found lyrics${link ? " & link":""}!`)
		});
	}
};
module.exports.aliases = ["add-song", "createsong", "create-song"];