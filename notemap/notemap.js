const fs = require('fs');
const notemap = require('./notemap-reader.js');
const minify = require('html-minifier').minify;

function difficulty(diff_id) {
    if (diff_id === 10) return "Beginner";
    if (diff_id === 20) return "Intermediate";
    if (diff_id === 30) return "Advanced";
    if (diff_id === 40) return "Advanced+";
    throw new Error('Unknown Difficulty ' + diff_id);
}

function attribute(attr_id) {
    if (attr_id === 1) return "smile";
    if (attr_id === 2) return "pure";
    if (attr_id === 3) return "cool";
    if (attr_id === 4) return "active";
    if (attr_id === 5) return "natural";
    if (attr_id === 6) return "elegant";
    throw new Error('Unknown Attribute ' + attr_id);
}

let songdata = JSON.parse(fs.readFileSync('notemap/song_db.json'));
let layout = fs.readFileSync('notemap/notemap.html').toString();
let s = "<h5>µ's</h5>";

let last_live_id = 0;
for (let li = 0; li < songdata.length; li++) {
    let live = songdata[li];
    if (live.live_difficulty_id >= 20000000) break;

    if (live.live_difficulty_id >= 11000000 && last_live_id < 11000000) s += "<h5>Aqours</h5>";
    if (live.live_difficulty_id >= 12000000 && last_live_id < 12000000) s += "<h5>Nijigaku</h5>";
    last_live_id = live.live_difficulty_id;

    s += '<ul class="collapsible" data-collapsible="expandable"><li>' +
        '<div class="collapsible-header' + (live.floor_type === 5 ? ' light-blue lighten-5' : '') + '">' +
        '<img src="image/icon_' + attribute(live.song_attribute) + '.png" alt="' + attribute(live.song_attribute) + '">' +
        '<b>' + live.song_name + '</b>&nbsp;(' + difficulty(Math.floor(live.live_difficulty_id % 1000 / 10)) + ')</div>';
    s += '<div class="collapsible-body">' +
        '<div class="row nomargin"><div class="col l6"><b>S Rank: </b>' + live.ranks.S + '</div>' +
        '<div class="col l6"><b>A Rank: </b>' + live.ranks.A + '</div></div>' +
        '<div class="row nomargin"><div class="col l6"><b>B Rank: </b>' + live.ranks.B + '</div>' +
        '<div class="col l6"><b>C Rank: </b>' + live.ranks.C + '</div></div>' +
        '<div class="row"><div class="col l6"><b>Recommended Stamina: </b>' + live.recommended_stamina + '</div>' +
        '<div class="col l6"><b>Note Damage: </b>' + live.note_damage + '</div></div>';

    s += notemap.make(live);

    s += '</div></li></ul>';
}

fs.writeFile('build/notemap.html', minify(layout.replace("$SONGDB", s), {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);