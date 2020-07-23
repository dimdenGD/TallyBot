const Discord = require("discord.js");
const fetch = require("node-fetch");
const BASE = "https://www.hiddeninthesand.com";

module.exports.run = (msg, args, bot, db, isAdmin) => {
    fetch(BASE + "/wiki/api.php?action=opensearch&format=json&search=" + encodeURIComponent(args.join(" ")))
        .then(i => i.json())
        .then(res => {
            console.log(res);
            if(res[3]) msg.channel.send(res[3][0]);
        });
};
module.exports.aliases = ["hiddeninthesand"];