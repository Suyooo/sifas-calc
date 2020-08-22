const fs = require('fs');

function capFirstLetter(s) {
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}

function skill(skill) {
    return skill_target(skill.target) + skill_effect(skill.effect_type, skill.effect_amount) +
        skill_finish(skill.finish_type, skill.finish_amount);
}

function skill_target(target_id) {
    if (target_id === 1) return "all units ";
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
    if (type_id === 3) return "charge SP Gauge by " + amount + " points";
    if (type_id === 4) return "gain " + amount + " points of shield";
    if (type_id === 5) return "restore " + amount + " points of stamina";
    if (type_id === 17) return "gain " + (amount / 100) + "% Appeal";
    if (type_id === 18) return "increase Voltage Gain by " + (amount / 100) + "%";
    if (type_id === 19) return "gain " + (amount / 100) + "% SP Gauge Fill Rate";
    if (type_id === 20) return "gain " + (amount / 100) + "% Critical Chance";
    if (type_id === 21) return "gain " + (amount / 100) + "% Critical Power";
    if (type_id === 22) return "gain " + (amount / 100) + "% Skill Activation Chance";
    if (type_id === 23) return "increase SP Voltage Gain by " + (amount / 100) + "%";
    if (type_id === 45) return "gain " + (amount / 100) + "% Base SP Gauge Fill Rate";
    if (type_id === 46) return "gain " + (amount / 100) + "% Base Critical Chance";
    if (type_id === 47) return "gain " + (amount / 100) + "% Base Critical Power";
    if (type_id === 48) return "gain " + (amount / 100) + "% Base Skill Activation Chance";
    if (type_id === 49) return "gain " + (amount / 100) + "% Base Appeal";
    if (type_id === 50) return "increase Base SP Voltage Gain by " + (amount / 100) + "%";
    if (type_id === 51) return "increase Base Voltage Gain by " + (amount / 100) + "%";
    if (type_id === 68) return "deal " + amount + " points of stamina damage";
    if (type_id === 69) return "discharge SP Gauge by " + (amount / 100) + "%";
    if (type_id === 71) return "lose " + (amount / 100) + "% Appeal";
    if (type_id === 73) return "lose " + (amount / 100) + "% SP Gauge Fill Rate";
    if (type_id === 76) return "lose " + (amount / 100) + "% Skill Activation Chance";
    if (type_id === 78) return "lose " + (amount / 100) + "% Base Skill Activation Chance";
    if (type_id === 81) return "lose " + (amount / 100) + "% Base Appeal";
    if (type_id === 83) return "lose " + (amount / 100) + "% Base SP Gauge Fill Rate";
    if (type_id === 84) return "lose " + (amount / 100) + "% Base Appeal";
    if (type_id === 85) return "lose " + (amount / 100) + "% Base SP Gauge Fill Rate";
    if (type_id === 86) return "lose " + (amount / 100) + "% Base Skill Activation Chance";
    if (type_id === 91) return "charge SP Gauge by " + (amount / 100) + "%";
    if (type_id === 96) return "restore " + (amount / 100) + "% of max stamina";
    if (type_id === 132) return "restore " + amount + " points of stamina for each Sk unit in the formation";
    if (type_id === 134) return "restore " + amount + " points of stamina for each Gd unit in the formation";
    if (type_id === 141) return "gain " + (amount / 100) + "% Base Appeal for each Sk unit in the formation";
    if (type_id === 143) return "gain " + (amount / 100) + "% Base Appeal for each Gd unit in the formation";
    if (type_id === 179) return "gain " + (amount / 100) + "% Critical Chance for each Sk unit in the formation";
    if (type_id === 187) return "gain " + (amount / 100) + "% Base Critical Chance for each Sk unit in the formation";
    if (type_id === 193) return "gain " + (amount / 100) + "% Critical Power for each Vo unit in the formation";
    throw new Error('Unknown Skill Effect Type ' + type_id);
}

function skill_finish(condition_id, amount) {
    if (condition_id === 1) return " until the song ends"
    if (condition_id === 2) return " for " + amount + " notes"
    if (condition_id === 3) return "" // instant effect (affecting SP charge or stamina)
    if (condition_id === 4) return "" // until AC ends (this is handled in the trigger switch below)
    if (condition_id === 7) return " for one time only"
    if (condition_id === 8) return " until the next Strategy switch"
    throw new Error('Unknown Skill Finish Condition ' + condition_id);
}

function ac_mission(type_id, goal) {
    if (type_id === 1) return "Get " + goal + " Voltage";
    if (type_id === 2) return "Hit " + goal + " NICEs";
    if (type_id === 3) return "Hit " + goal + " GREATs";
    if (type_id === 4) return "Hit " + goal + " WONDERFULs";
    if (type_id === 5) return goal + " Voltage in one Appeal";
    if (type_id === 6) return goal + " Voltage from SP";
    if (type_id === 7) return "Appeal with " + goal + " Units";
    if (type_id === 8) return "Get " + goal + " Criticals";
    if (type_id === 9) return "Activate " + goal + " Tap Skills";
    throw new Error('Unknown AC Mission Type ' + type_id);
}

function make_notemap(live) {
    let s = "";

    let stacker_global = [];
    if (live.notes !== null) {
        let firstnote_time = live.notes[0].time;
        let lastnote_time = live.notes[live.notes.length - 1].time;

        let totalacnotes = 0;
        for (let ai = 0; ai < live.appeal_chances.length; ai++) {
            let ac = live.appeal_chances[ai];
            let start = live.notes[ac.range_note_ids[0]].time;
            let length = live.notes[ac.range_note_ids[1]].time - start;

            s += '<div class="appealchance" style="' +
                'left: ' + ((start - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '%;' +
                'width: ' + (length / (lastnote_time - firstnote_time) * 98) + '%;">' +
                '&nbsp;</div>';
            totalacnotes += ac.range_note_ids[1] - ac.range_note_ids[0] + 1;
        }

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

                s += '<div class="gimmick" style="--gimmicklayer: ' + stack_layer_global + ';' +
                    '--gimmicklayer-filtered: ' + stack_layer_seperate + ';"><div class="gimmickmarker" style="' +
                    'left: calc(' + marker_position + '% - 0.625em);">' + (note.gimmick + 1) + '</div>';
                if (live.note_gimmicks[note.gimmick].finish_type === 2) {
                    let ni2 = ni + live.note_gimmicks[note.gimmick].finish_amount;
                    if (ni2 >= live.notes.length) ni2 = live.notes.length - 1;
                    let marker_length = ((live.notes[ni2].time - note.time) / (lastnote_time - firstnote_time) * 98);

                    s += '<div class="gimmicklength" style="' +
                        'left: ' + marker_position + '%;' +
                        'width: ' + marker_length + '%;">' +
                        '&nbsp;</div>';

                    stacker_global[stack_layer_global] = stacker_seperate[note.gimmick][stack_layer_seperate] = marker_position + marker_length;
                } else {
                    // magic value (TM) to avoid too much overlap of start markers
                    stacker_global[stack_layer_global] = stacker_seperate[note.gimmick][stack_layer_seperate] = marker_position + 0.7;
                }
                s += '</div>';
            }
            if (ni > 0 && ni % 10 === 0) {
                s += '<div class="marker' + (ni % 50 === 0 ? ' fifty' : '') +
                    '" style="left: calc(' + ((note.time - firstnote_time) / (lastnote_time - firstnote_time) * 98 + 1) + '% - 1em);">' +
                    '|<br>' + ni + '</div>';
            }
        }

        s += '</div></div><div class="row"><div class="col l6"><b>Note Count: </b>' + live.notes.length + '</div>' +
            '<div class="col l6"><b>Notes in ACs: </b>' + totalacnotes + '</div></div>';
    } else {
        s += '<div class="row" style="text-align: center">(no note map available)</div>';
    }

    s += '<div class="row">'
    s += '<div class="col l6"><b style="font-size: 150%">Gimmicks</b><br>';
    s += '<b>Song Gimmick:</b><br>';
    if (live.gimmick === null) {
        s += "none<br>";
    } else {
        let skillstr = skill(live.gimmick);
        if (live.gimmick.finish_type === 1) {
            // remove " until the song ends" if that is the condition - pretty much implied through being the song gimmick
            skillstr = skillstr.substring(0, skillstr.length - 20);
        }
        s += capFirstLetter(skillstr) + "<br>";
    }
    for (let gi = 0; gi < live.note_gimmicks.length; gi++) {
        let noteg = live.note_gimmicks[gi];

        s += '<b>Note Gimmick ' + (gi + 1) + ':</b><br>';
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
        s += skillstr + '<br>';
    }

    s += '</div><div class="col l6"><b style="font-size: 150%">Appeal Chances</b><br>';
    for (let ai = 0; ai < live.appeal_chances.length; ai++) {
        let ac = live.appeal_chances[ai];

        s += '<b>AC ' + (ai + 1) + ': ' + ac_mission(ac.mission_type, ac.mission_value) + '</b><br>' +
            'Gimmick: ';
        if (ac.gimmick === null) {
            s += 'none<br>';
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
            s += 'Length: ' + aclength + ' notes';
            if (ac.mission_type === 1) {
                s += ' (avg. ' + Math.ceil(ac.mission_value / aclength) + ' Voltage per note required)';
            }
            s += '<br>Success: ' + ac.reward_voltage + ' Voltage<br>' +
                'Failure: ' + ac.penalty_damage + ' Damage<br>';
        }
    }

    return '<div class="notebarcontainer"><div class="notebar" style="--gimmicklayers: ' + stacker_global.length + '">' + s + "</div></div>";
}

module.exports = {
    "make": make_notemap,
    "skill_effect": skill_effect
};