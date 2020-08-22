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

let songdata = JSON.parse(fs.readFileSync('notemap/mapdb.json'));
let layout = fs.readFileSync('notemap/notemap.html').toString();
let s = "<h5>µ's</h5>"

let live_ids = Object.keys(songdata)
    .map(function (x) {
        return Number(x)
    })
    .filter(function (x) {
        return x < 20000000
    })
    .sort(function (a, b) {
        let do_comp = songdata[a].display_order - songdata[b].display_order;

        // same live id => sort by difficulty id, which results in a sort by difficulty
        if (do_comp !== 0) return do_comp;
        else return a - b;
    });

let last_live_id = 0;
let current_tabs = "";
for (let li = 0; li < live_ids.length; li++) {
    let live_difficulty_id = live_ids[li];
    let live = songdata[live_difficulty_id];
    let diff_id = Math.floor(live_difficulty_id % 1000 / 10);

    if (Math.floor(live_difficulty_id / 1000) != Math.floor(last_live_id / 1000)) {
        if (li > 0) {
            s += '</ul>' + current_tabs + '</div></li></ul>';
        }
        current_tabs = "";

        if (live_difficulty_id >= 11000000 && last_live_id < 11000000) s += "<h5>Aqours</h5>";
        if (live_difficulty_id >= 12000000 && last_live_id < 12000000) s += "<h5>Nijigaku</h5>";

        s += '<ul class="collapsible" data-collapsible="expandable"><li>' +
            '<div class="collapsible-header' + (live.floor_type === 5 ? ' light-blue lighten-5' : '') + '">' +
            '<img src="image/icon_' + attribute(live.song_attribute) + '.png" alt="' + attribute(live.song_attribute) + '">' +
            '<b>' + live.song_name + '</b></div>' +
            '<div class="collapsible-body"><ul class="tabs tabs-transparent tabs-fixed-width">';
    }
    last_live_id = live_difficulty_id;

    s += '<li class="tab"><a href="#' + live_difficulty_id + '"' + (diff_id === 30 ? ' class="active"' : '') + '>' +
        difficulty(diff_id) + '</a></li>';
    current_tabs += '<div id="' + live_difficulty_id + '">' +
        '<div class="row nomargin"><div class="col l6"><b>S Rank: </b>' + live.ranks.S + '</div>' +
        '<div class="col l6"><b>A Rank: </b>' + live.ranks.A + '</div></div>' +
        '<div class="row nomargin"><div class="col l6"><b>B Rank: </b>' + live.ranks.B + '</div>' +
        '<div class="col l6"><b>C Rank: </b>' + live.ranks.C + '</div></div>' +
        '<div class="row nomargin"><div class="col l6"><b>Recommended Stamina: </b>' + live.recommended_stamina + '</div>' +
        '<div class="col l6"><b>Note Damage: </b>' + live.note_damage + '</div></div>';

    current_tabs += notemap.make(live) + '</div>';
}
s += '</ul>' + current_tabs + '</div></li></ul>';

fs.writeFile('build/notemap.html', minify(layout.replace("$SONGDB", s), {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);