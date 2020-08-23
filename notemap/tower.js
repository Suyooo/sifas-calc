const fs = require('fs');
const notemap = require('./notemap-reader.js');
const minify = require('html-minifier').minify;

function attribute(attr_id) {
    if (attr_id === 0) return "none";
    if (attr_id === 1) return "smile";
    if (attr_id === 2) return "pure";
    if (attr_id === 3) return "cool";
    if (attr_id === 4) return "active";
    if (attr_id === 5) return "natural";
    if (attr_id === 6) return "elegant";
    throw new Error('Unknown Attribute ' + attr_id);
}

let towerdata = JSON.parse(fs.readFileSync('notemap/tower.json'));
let songdata = JSON.parse(fs.readFileSync('notemap/mapdb.json'));
let layout = fs.readFileSync('notemap/tower.html').toString();
let s = "";

for (let tower_id in towerdata) {
    if (!towerdata.hasOwnProperty(tower_id)) continue;
    let tower = towerdata[tower_id];

    s += '<h5>' + tower.name + '</h5>';
    s += '<b>Performance Points:</b> ' + tower.pp_at_start + ' (+ ' + tower.pp_recovery_limit + ' recoverable)<br>'
    s += '<b>PP Recovery Cost:</b> ' + tower.pp_recovery_cost + ' loveca stars<br><br>';

    for (let fi = 0; fi < tower["floors"].length; fi++) {
        let floor = tower["floors"][fi];
        if (floor["notemap_live_difficulty_id"] !== null) {
            let freelive = songdata[floor["notemap_live_difficulty_id"]];
            floor["notes"] = freelive["notes"];
            floor["gimmick"] = freelive["gimmick"];
            floor["note_gimmicks"] = freelive["note_gimmicks"];
            floor["appeal_chances"] = freelive["appeal_chances"];
        }

        s += '<ul class="collapsible" data-collapsible="expandable"><li>' +
            '<div class="collapsible-header' + (floor.floor_type === 5 ? ' light-blue lighten-5' : '') + '">' +
            '<img src="image/icon_' + attribute(floor.song_attribute) + '.png" alt="' + attribute(floor.song_attribute) + '">' +
            '<b class="floorno">' + floor.floor_number + (floor.notes === null ? " *" : "") + ')</b>' +
            '<div class="row">' +
            '<div class="col l3"><b>' + floor.song_name + '</b></div>' +
            '<div class="col l3"><b>Target:</b> ' + notemap.format(floor.voltage_target) + '</div>' +
            '<div class="col l3"><b>Cleansable:</b> ' +
            (floor.gimmick === null ? "-" :
                notemap.skill_effect(floor.gimmick.effect_type, 0).indexOf("Base") === -1 ? "Yes" : "No") + '</div>' +
            '<div class="col l3"><b>Note Damage:</b> ' + notemap.format(floor.note_damage) + '</div>' +
            '</div></div>';
        s += '<div class="collapsible-body">' +
            '<div class="row nomargin"><div class="col l6"><b>Voltage Target: </b>' + notemap.format(floor.voltage_target) + '</div>' +
            '<div class="col l6"><b>Recommended Stamina: </b>' + notemap.format(floor.recommended_stamina) + '</div></div>' +
            '<div class="row nomargin"><div class="col l6"><b>Note Damage: </b>' + notemap.format(floor.note_damage) +
            ' (' + notemap.format(Math.round(floor.note_damage_rate * 100)) + '% of Free Live)</div>' +
            '<div class="col l6"><b>Clear Reward: </b>' +
            notemap.format(floor.reward_clear["19001"]) + ' medals, ' + notemap.format(floor.reward_clear["0"]) + ' stars</div>' + "</div>";

        s += notemap.make(floor);

        s += '</div></li></ul>';

        if (floor.reward_progress !== null) {
            s += '<div class="progress reward"><b>Progress Reward:</b> ' + notemap.format(floor.reward_progress["19001"]) +
                ' medals, ' + notemap.format(floor.reward_progress["0"]) + ' stars</div>';
        } else {
            s += '<div class="progress">&nbsp;</div>';
        }
    }
}

fs.writeFile('build/tower.html', minify(layout.replace("$TOWER", s), {
        collapseWhitespace: true
    }),
    function (err) {
        if (err) {
            return console.log(err);
        }
    }
);