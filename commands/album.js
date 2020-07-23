const reducer = (accumulator, currentValue) => accumulator + currentValue;
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
const Discord = require("discord.js");

module.exports.run = (msg, args, bot, db, isAdmin) => {
    let album = args.join(" ");

    if(album.toLowerCase() === "mmmm") album = "Marvin's Marvelous Mechanical Museum";
    if(album.toLowerCase() === "mmmm05") album = "Marvin's Marvelous Mechanical Museum 2005";
    if(album.toLowerCase() === "g&e") album = "Good & Evil";
    if(album.toLowerCase().includes("good a")) album = "Good & Evil";
    if(album.toLowerCase() === "hp:ii") album = "Hawaii: Part II";
    if(album.toLowerCase() === "hpii") album = "Hawaii Partii";
    if(album.toLowerCase() === "jh") album = "Joe Hawley";
    if(album.toLowerCase() === "nat") album = "Not a Trampoline";
    if(album.toLowerCase() === "cd") album = "Complete Demos";
    if(album.toLowerCase() === "aid") album = "Admittedly Incomplete Demos";

    let songs = db.db.prepare("select * from songs where lower(album) LIKE ? || '%'").all(album);
    if(!songs.length || !args[0]) throw "Album was not found... :pleading_face:";
    album = songs[0].album;
    if(album === "Single") throw "Album was not found... :pleading_face:"
    let votes = songs.map(i => i.votes).reduce(reducer);
    let rates = [];

    for(let i in songs) {
        let rating = db.getRating(songs[i].id);
        if(rating === "-") continue;
        rates.push(parseFloat(rating));
    }
    let rating = rates.length ? (rates.reduce(reducer)/rates.length).toFixed(2) : "-";

    let i = 1;
    let embed = new Discord.RichEmbed()
        .setTitle(album)
        .setThumbnail(songs[0].thumb)
        .setDescription(`by ${data.artists[songs[0].author] ? `[${songs[0].author}](${data.artists[songs[0].author]})` : songs[0].author}.\n
        ${songs.map(s => `${i++}. [#${s.id}] [${s.name}](${s.link})`).join("\n")}`)
        .setColor("RANDOM")
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
        .addField("Votes", `${votes} votes`, true)
        .addField("Rating", `${rating} ⭐`, true);

    if(data.albums[album]) embed.setURL(data.albums[album]);
    msg.channel.send(embed);
};
module.exports.aliases = [];