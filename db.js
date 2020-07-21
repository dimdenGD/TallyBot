const Database = require('better-sqlite3');
const db = new Database('./database.db', { verbose: console.log });

function convertMS(ms) {
  let h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  h = h % 24;

  let pad = function (n) { return n < 10 ? '0' + n : n; };

  let result = pad(h) + ' hours, ' + pad(m) + ' minutes';
  return result;
};

db.prepare(`
	create table if not exists songs (
		id integer primary key autoincrement,
		name text not null,
		votes integer default 0,
		album text default null,
		link text default null,
		thumb text default null,
		author text default null,
		lyrics text default null
	)
`).run();
db.prepare(`
	create table if not exists rates (
		id text not null,
		songid integer not null,
		rating integer default 5,
		primary key (id, songid)
	)
`).run();
db.prepare(`
	create table if not exists votes (
		id text not null,
		songid integer not null,
		date integer not null
	)
`).run();

function getSong(id) {
	if(!id) return false;
	
	return db.prepare("select * from songs where id = ?").get(id);
}
function findSong(name) {
	if(!name) return false;
	
	return db.prepare("select * from songs where lower(name) LIKE ? || '%'").get(name.toLowerCase());
}
function createSong(id, name, album, link, thumb) {
	if(!name) return false;
	
	db.prepare("insert into songs (id, name, album, link, thumb, lyrics) values (?, ?, ?, ?, ?, ?)").run(id, name, album, link, thumb, lyrics);
	
	return true;
}
function createDefaultSong(name) {
	if(!name) return false;
	let song = db.prepare("select id from songs where name = ?").get(name);
	if(song) name += "*";
	db.prepare("insert into songs (name) values (?)").run(name);
	song = db.prepare("select id from songs where name = ?").get(name);

	return song.id;
}
function editSong(id, key, value) {
	if(!id) return false;
	if(["name", "votes", "album", "link", "thumb", "lyrics"].indexOf(key) === -1) return false;
	
	db.prepare(`update songs set ${key} = ? where id = ?`).run(value, id);

	return true;
}
function rateSong(id, songid, rating) {
	if(!id || !songid || !rating) return false;
	if(!db.prepare(`select * from songs where id = ?`).get(songid)) return "NOT_FOUND";
	if(db.prepare(`select * from rates where id = ? and songid = ?`).get(id, songid)) {
		db.prepare(`update rates set rating = ? where id = ? and songid = ?`).run(rating, id, songid);
		return "UPDATE";
	} else {
		db.prepare(`insert into rates (id, songid, rating) values (?, ?, ?)`).run(id, songid, rating);
		return "INSERT";
	}

	return true;
}
function voteSong(id, songid) {
	if(!id || !songid) throw "Error";
	let song = db.prepare(`select * from songs where id = ?`).get(songid);
	if(!song) throw "Song was not found.";
	let vote = db.prepare(`select * from votes where id = ? and songid = ?`).get(id, songid);
	if(vote && Date.now()-vote.date < 7.2e+7) throw `Wait **${convertMS(7.2e+7-(Date.now()-vote.date))}** before using this command again.`;
	db.prepare(`update songs set votes = ? where id = ?`).run(song.votes+1, songid);
	if(vote) {
		db.prepare(`update votes set date = ? where id = ? and songid = ?`).run(Date.now(), id, songid);
	} else {
		db.prepare(`insert into votes (id, songid, date) values (?, ?, ?)`).run(id, songid, Date.now());
	}

	return true;
}
const reducer = (accumulator, currentValue) => accumulator + currentValue;
function getRating(id) {
	let rates = db.prepare(`select * from rates where songid = ?`).all(id);
	if(rates.length === 0) return "-";
	let rate = rates.map(i => i.rating).reduce(reducer);

	return (rate/rates.length).toFixed(2);
}

module.exports = {
	convertMS,
	getSong,
	findSong,
	createSong,
	createDefaultSong,
	editSong,
	rateSong,
	voteSong,
	db,
	getRating
}