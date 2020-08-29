const fs = require('fs');

function capFirstLetter(s) {
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}

function format(x) {
    // https://stackoverflow.com/a/2901298
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "&#8239;");
    return parts.join(".");
}

function attribute(attr_id) {
    if (attr_id === 1) return "smile";
    if (attr_id === 2) return "pure";
    if (attr_id === 3) return "cool";
    if (attr_id === 4) return "active";
    if (attr_id === 5) return "natural";
    if (attr_id === 6) return "elegant";
    if (attr_id === 9) return "none";
    throw new Error('Unknown Attribute ' + attr_id);
}

function difficulty(diff_id) {
    if (diff_id === 10) return "Beginner";
    if (diff_id === 20) return "Intermediate";
    if (diff_id === 30) return "Advanced";
    if (diff_id === 40) return "Advanced+";
    throw new Error('Unknown Difficulty ' + diff_id);
}

function skill(skill) {
    return skill_target(skill.target) + skill_effect(skill.effect_type, skill.effect_amount) +
        skill_finish(skill.finish_type, skill.finish_amount);
}

function skill_target(target_id) {
    if (target_id === 1) return "all units ";
    if (target_id === 29) return "µ's units ";
    if (target_id === 30) return "Aqours units ";
    if (target_id === 31) return "Nijigaku units ";
    if (target_id === 38) return "Vo units ";
    if (target_id === 39) return "Sp units ";
    if (target_id === 40) return "Gd units ";
    if (target_id === 41) return "Sk units ";
    if (target_id === 58) return ""; // no target (affecting SP charge or stamina)
    if (target_id === 61) return "Smile units ";
    if (target_id === 62) return "Pure units ";
    if (target_id === 63) return "Cool units ";
    if (target_id === 64) return "Active units ";
    if (target_id === 65) return "Natural units ";
    if (target_id === 66) return "Elegant units ";
    if (target_id === 67) return "non-Smile units ";
    if (target_id === 68) return "non-Vo units ";
    if (target_id === 72) return "non-Pure units ";
    if (target_id === 73) return "non-Cool units ";
    if (target_id === 74) return "non-Active units ";
    if (target_id === 75) return "non-Natural units ";
    if (target_id === 76) return "non-Elegant units ";
    if (target_id === 77) return "non-Sp units ";
    if (target_id === 78) return "non-Gd units ";
    if (target_id === 79) return "non-Sk units ";
    if (target_id === 87) return "non-Vo or Gd units ";
    if (target_id === 90) return "non-Gd or Sp units ";
    throw new Error('Unknown Skill Target ' + target_id);
}

function skill_effect(type_id, amount) {
    if (type_id === 3) return "charge SP Gauge by " + format(amount) + " points";
    if (type_id === 4) return "gain " + format(amount) + " points of shield";
    if (type_id === 5) return "restore " + format(amount) + " points of stamina";
    if (type_id === 17) return "gain " + format(amount / 100) + "% Appeal";
    if (type_id === 18) return "increase Voltage Gain by " + format(amount / 100) + "%";
    if (type_id === 19) return "gain " + format(amount / 100) + "% SP Gauge Fill Rate";
    if (type_id === 20) return "gain " + format(amount / 100) + "% Critical Chance";
    if (type_id === 21) return "gain " + format(amount / 100) + "% Critical Power";
    if (type_id === 22) return "gain " + format(amount / 100) + "% Skill Activation Chance";
    if (type_id === 23) return "increase SP Voltage Gain by " + format(amount / 100) + "%";
    if (type_id === 45) return "gain " + format(amount / 100) + "% Base SP Gauge Fill Rate";
    if (type_id === 46) return "gain " + format(amount / 100) + "% Base Critical Chance";
    if (type_id === 47) return "gain " + format(amount / 100) + "% Base Critical Power";
    if (type_id === 48) return "gain " + format(amount / 100) + "% Base Skill Activation Chance";
    if (type_id === 49) return "gain " + format(amount / 100) + "% Base Appeal";
    if (type_id === 50) return "increase Base SP Voltage Gain by " + format(amount / 100) + "%";
    if (type_id === 51) return "increase Base Voltage Gain by " + format(amount / 100) + "%";
    if (type_id === 52) return "remove all buffs (excluding those affecting Base values)";
    if (type_id === 68) return "deal " + format(amount) + " points of stamina damage";
    if (type_id === 69) return "discharge SP Gauge by " + format(amount / 100) + "%";
    if (type_id === 70) return "lose " + format(amount) + " points of shield";
    if (type_id === 71) return "lose " + format(amount / 100) + "% Appeal";
    if (type_id === 73) return "lose " + format(amount / 100) + "% SP Gauge Fill Rate";
    if (type_id === 75) return "lose " + format(amount / 100) + "% Critical Power";
    if (type_id === 76) return "lose " + format(amount / 100) + "% Skill Activation Chance";
    if (type_id === 78) return "lose " + format(amount / 100) + "% Base Skill Activation Chance";
    if (type_id === 81) return "lose " + format(amount / 100) + "% Base Appeal";
    if (type_id === 83) return "lose " + format(amount / 100) + "% Base SP Gauge Fill Rate";
    if (type_id === 84) return "lose " + format(amount / 100) + "% Base Appeal";
    if (type_id === 85) return "lose " + format(amount / 100) + "% Base SP Gauge Fill Rate";
    if (type_id === 86) return "lose " + format(amount / 100) + "% Base Skill Activation Chance";
    if (type_id === 91) return "charge SP Gauge by " + format(amount / 100) + "%";
    if (type_id === 93) return "gain " + format(amount / 100) + "% of max stamina as shield";
    if (type_id === 96) return "restore " + format(amount / 100) + "% of max stamina";
    if (type_id === 119) return "gain " + format(amount / 100) + "% Appeal for each Vo unit in the formation";
    if (type_id === 132) return "restore " + format(amount) + " points of stamina for each Sk unit in the formation";
    if (type_id === 134) return "restore " + format(amount) + " points of stamina for each Gd unit in the formation";
    if (type_id === 141) return "gain " + format(amount / 100) + "% Base Appeal for each Sk unit in the formation";
    if (type_id === 143) return "gain " + format(amount / 100) + "% Base Appeal for each Gd unit in the formation";
    if (type_id === 164) return "gain " + format(amount / 100) + "% Skill Activation Chance for each Gd unit in the formation";
    if (type_id === 179) return "gain " + format(amount / 100) + "% Critical Chance for each Sk unit in the formation";
    if (type_id === 187) return "gain " + format(amount / 100) + "% Base Critical Chance for each Sk unit in the formation";
    if (type_id === 193) return "gain " + format(amount / 100) + "% Critical Power for each Vo unit in the formation";
    if (type_id === 210) return "increase SP Voltage Gain by " + format(amount / 100) + "% for each Sp unit in the formation";
    if (type_id === 230) return "increase the power of their Strategy Switch bonus by " + format(amount) + " points";
    throw new Error('Unknown Skill Effect Type ' + type_id);
}

function skill_finish(condition_id, amount) {
    if (condition_id === 1) return " until the song ends"
    if (condition_id === 2) return " for " + format(amount) + " notes"
    if (condition_id === 3) return "" // instant effect (affecting SP charge or stamina)
    if (condition_id === 4) return "" // until AC ends (this is handled in the trigger switch below)
    if (condition_id === 7) return " for one time only"
    if (condition_id === 8) return " until the next Strategy switch"
    throw new Error('Unknown Skill Finish Condition ' + condition_id);
}

function ac_mission(type_id, goal) {
    if (type_id === 1) return "Get " + format(goal) + " Voltage";
    if (type_id === 2) return "Hit " + format(goal) + " NICEs";
    if (type_id === 3) return "Hit " + format(goal) + " GREATs";
    if (type_id === 4) return "Hit " + format(goal) + " WONDERFULs";
    if (type_id === 5) return "Get " + format(goal) + " Voltage in one Appeal";
    if (type_id === 6) return "Get " + format(goal) + " Voltage from SP";
    if (type_id === 7) return "Appeal with " + format(goal) + " unique Units";
    if (type_id === 8) return "Get " + format(goal) + " Criticals";
    if (type_id === 9) return "Activate " + format(goal) + " Tap Skills";
    throw new Error('Unknown AC Mission Type ' + type_id);
}

function make_notemap(live) {
    let s = "";

    if (live.notes !== null) {
        let firstnote_time = live.notes[0].time;
        let lastnote_time = live.notes[live.notes.length - 1].time;
        // notes are placed in the center 98% of the timeline, but we need the total time covered for timing
        let total_time = (lastnote_time - firstnote_time) / 98 * 100;

        let totalacnotes = 0;
        for (let ai = 0; ai < live.appeal_chances.length; ai++) {
            let ac = live.appeal_chances[ai];
            let start = live.notes[ac.range_note_ids[0]].time;
            let length = live.notes[ac.range_note_ids[1]].time - start;

            s += '<div data-ac="' + ai + '" class="appealchance" style="' +
                'left: ' + ((start - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '%;' +
                'width: ' + (length / (lastnote_time - firstnote_time) * 98) + '%;">' +
                '&nbsp;</div>';
            totalacnotes += ac.range_note_ids[1] - ac.range_note_ids[0] + 1;
        }

        let stacker_global = [];
        let stacker_seperate = [];
        for (let gi = 0; gi < live.note_gimmicks.length; gi++) stacker_seperate.push([]);
        for (let ni = 0; ni < live.notes.length; ni++) {
            let note = live.notes[ni];

            s += '<div class="note ' + (note.rail == 1 ? 'top' : 'bottom') + (note.gimmick !== null ? ' gimmicked' : '') +
                '" style="left: calc(' + ((note.time - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '% - 1px);">' +
                '&nbsp;</div>';
            if (note.type === 2) {
                let ni2 = ni + 1;
                while (live.notes[ni2].rail !== note.rail) ni2++;
                s += '<div class="hold ' + (note.rail == 1 ? 'top' : 'bottom')
                    + '" style="left: calc(' + ((note.time - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '% - 1px);' +
                    'width: ' + ((live.notes[ni2].time - note.time) / (lastnote_time - firstnote_time) * 98) + '%;">' +
                    '&nbsp;</div>';
            }
            if (note.gimmick !== null) {
                if (live.note_gimmicks[note.gimmick].counter === undefined) live.note_gimmicks[note.gimmick].counter = 1;
                else live.note_gimmicks[note.gimmick].counter += 1;
                let marker_position = ((note.time - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1);

                let stack_layer_global = 0;
                while (stack_layer_global < stacker_global.length && stacker_global[stack_layer_global] > marker_position) {
                    stack_layer_global++;
                }
                if (stack_layer_global == stacker_global.length) stacker_global.push(0);

                let stack_layer_seperate = 0;
                while (stack_layer_seperate < stacker_seperate[note.gimmick].length &&
                stacker_seperate[note.gimmick][stack_layer_seperate] > marker_position) {
                    stack_layer_seperate++;
                }
                if (stack_layer_seperate == stacker_seperate[note.gimmick].length)
                    stacker_seperate[note.gimmick].push(0);

                let marker_length = 0;
                if (live.note_gimmicks[note.gimmick].finish_type === 2) {
                    let ni2 = ni + live.note_gimmicks[note.gimmick].finish_amount;
                    if (ni2 >= live.notes.length) ni2 = live.notes.length - 1;
                    marker_length = ((live.notes[ni2].time - note.time) / (lastnote_time - firstnote_time) * 98);
                }

                s += '<div class="gimmick" data-gimmick="' + note.gimmick + '" style="--gimmicklayer: ' + stack_layer_global +
                    ';' + '--gimmicklayer-filtered: ' + stack_layer_seperate + '; left: ' + marker_position + '%; ' +
                    'width:' + marker_length + '%"><div class="gimmickmarker">' + (note.gimmick + 1) + '</div>';
                if (live.note_gimmicks[note.gimmick].finish_type === 2) {
                    s += '<div class="gimmicklength">&nbsp;</div>';

                    stacker_global[stack_layer_global] = stacker_seperate[note.gimmick][stack_layer_seperate] = marker_position + marker_length;
                } else {
                    // magic value (TM) to avoid too much overlap of start markers
                    stacker_global[stack_layer_global] = stacker_seperate[note.gimmick][stack_layer_seperate] = marker_position + 0.75;
                }
                s += '</div>';
            }
            if (ni > 0 && ni % 10 === 0) {
                s += '<div class="marker' + (ni % 50 === 0 ? ' fifty' : '') +
                    '" style="left: calc(' + ((note.time - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '% - 1em);">' +
                    '|<br>' + format(ni) + '</div>';
            }
        }

        s += '</div></div><div class="row"><div class="col l6"><b>Note Count: </b>' + format(live.notes.length) + '</div>' +
            '<div class="col l6"><b>Notes in ACs: </b>' + format(totalacnotes) + '</div></div>';
        s = '<div class="notebarcontainer"><div class="notebar" style="--gimmicklayers: ' + stacker_global.length + '"' +
            'data-totaltime="' + total_time + '">' + s;
    } else {
        s += '<div class="row" style="margin-top: 1em; text-align: center">(no note map available)</div>';
    }

    s += '<div class="row nomargin">'
    s += '<div class="col l6 detailinfo"><h5>Gimmicks</h5>';
    s += '<div><div>Song Gimmick</div><div>';
    if (live.gimmick === null) {
        s += "none";
    } else {
        let skillstr = skill(live.gimmick);
        if (live.gimmick.finish_type === 1) {
            // remove " until the song ends" if that is the condition - pretty much implied through being the song gimmick
            skillstr = skillstr.substring(0, skillstr.length - 20);
        }
        s += capFirstLetter(skillstr) + '<br><b>Cleansable:</b> ' + (skillstr.indexOf("Base") !== -1 ? "No" : "Yes");
    }
    s += '</div></div>';

    for (let gi = 0; gi < live.note_gimmicks.length; gi++) {
        let noteg = live.note_gimmicks[gi];

        s += '<div data-gimmick="' + gi + '" class="gimmick"><div>Note Gimmick ' + format(gi + 1) + '</div><div>';
        switch (noteg.trigger) {
            case 1:
                s += "If hit, ";
                break;
            case 2:
                s += "If missed, ";
                break;
            case 3:
                s += "";
                break; // always
            default:
                throw new Error('Unknown Note Gimmick Trigger ' + noteg.trigger);
        }

        let skillstr = skill(noteg);
        if (noteg.trigger === 3) {
            skillstr = capFirstLetter(skillstr);
        }
        s += skillstr;
        if (noteg.counter !== undefined) {
            s += '<br><b>Amount:</b> ' + format(noteg.counter) + ' note' + (noteg.counter === 1 ? '' : 's');
        }
        s += '</div></div>';
    }

    s += '</div><div class="col l6 detailinfo"><h5>Appeal Chances</h5>';
    for (let ai = 0; ai < live.appeal_chances.length; ai++) {
        let ac = live.appeal_chances[ai];

        s += '<div data-ac="' + ai + '" class="appealchance"><div>AC ' + format(ai + 1) + ': ' +
            ac_mission(ac.mission_type, ac.mission_value) + '</div><div>';
        if (ac.gimmick === null) {
            s += 'No Gimmick<br>';
        } else {
            switch (ac.gimmick.trigger) {
                case 1:
                    s += (ac.gimmick.finish_type === 4) ? "During this AC, " : "When the AC starts, ";
                    break;
                case 2:
                    s += "On AC Success, ";
                    break;
                case 3:
                    s += "On AC Failure, ";
                    break;
                case 4:
                    s += "At the end of the AC, ";
                    break;
                default:
                    throw new Error('Unknown AC Gimmick Trigger ' + ac.gimmick.trigger);
            }
            s += skill(ac.gimmick) + '<br>';
        }

        if (ac.range_note_ids !== null) {
            let aclength = (ac.range_note_ids[1] - ac.range_note_ids[0] + 1);
            s += '<b>Length:</b> ' + format(aclength) + ' notes';
            if (ac.mission_type === 1) {
                s += ' (avg. ' + format(Math.ceil(ac.mission_value / aclength)) + ' Voltage per note)';
            } else if (ac.mission_type === 8) {
                s += ' (' + format(Math.ceil(ac.mission_value / aclength * 100)) + '% of notes must crit)';
            } else if (ac.mission_type === 9) {
                s += ' (' + format(Math.ceil(ac.mission_value / aclength * 100)) + '% of taps must proc)';
            }
            s += '<div class="row nomargin"><div class="col m6 no-padding"><b>Success:</b> ' + format(ac.reward_voltage) +
                ' Voltage</div>' + '<div class="col m6 no-padding"><b>Failure:</b> ' + format(ac.penalty_damage) + ' Damage</div></div>';
        }

        s += '</div></div>';
    }

    return s + "</div></div>";
}

module.exports = {
    "make": make_notemap,
    "attribute": attribute,
    "difficulty": difficulty,
    "skill_effect": skill_effect,
    "format": format
};