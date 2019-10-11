function getRateFromNumberOfBoosts(boostnum) {
    if (boostnum === 3) {
        return 1.2;
    }
    if (boostnum === 2) {
        return 1.15;
    }
    if (boostnum === 1) {
        return 1.1;
    }
    return 1;
}

function sortAllUnits() {
    var units = [];
    var sortattr = Number($("#sortattr").val());

    for (var i = 1; i <= 9; i++) {
        var appl = Number($("#unit" + i + "appl").val());
        var tech = Number($("#unit" + i + "tech").val());
        var attr = Number($("#unit" + i + "attr").val());
        if (appl === 0 && tech === 0) continue;

        var attrmatch = (sortattr === 0 || (attr !== 0 && sortattr === attr));
        units.push({
            name: $("#unit" + i + "name").val(),
            match: attrmatch,
            power: appl + tech * (attrmatch ? 1.44 : 1.2),
            disppower: appl + tech * 1.2
        });
    }

    units.sort(function (a, b) {
        return b.power - a.power;
    });

    var topunits;
    var topsp = 0;

    if (units.length < 3) {
        topunits = units;
        var boosts = 0;
        var sum = 0;
        if (units.length >= 1) {
            sum += units[0].power;
            if (units[0].match) boosts++;
        }
        if (units.length >= 2) {
            sum += units[1].power;
            if (units[1].match) boosts++;
        }
        topsp = sum * getRateFromNumberOfBoosts(boosts);
    } else if (sortattr === 0) {
        topunits = [units[0], units[1], units[2]];
        topsp = (units[0].power + units[1].power + units[2].power) * getRateFromNumberOfBoosts(3);
    } else {
        // this could probably be optimized.
        // once it is, I can add more rows and auto-calculate on value changes
        // technically this is something I studied in university so I should know how to do this
        var currentunits = [undefined, undefined, undefined];
        var currentboosts = 0;
        for (var a = 0; a < units.length; a++) {
            currentunits[0] = units[a];
            if (currentunits[0].match) currentboosts++;
            for (var b = a + 1; b < units.length; b++) {
                currentunits[1] = units[b];
                if (currentunits[1].match) currentboosts++;
                for (var c = b + 1; c < units.length; c++) {
                    currentunits[2] = units[c];
                    if (currentunits[2].match) currentboosts++;

                    var currentsp = (currentunits[0].power + currentunits[1].power + currentunits[2].power) *
                                    getRateFromNumberOfBoosts(currentboosts);
                    if (currentsp > topsp) {
                        topunits = currentunits.slice(0); // array clone
                        topsp = currentsp;
                    }

                    if (currentunits[2].match) currentboosts--;
                }
                if (currentunits[1].match) currentboosts--;
            }
            if (currentunits[0].match) currentboosts--;
        }
    }

    if (topsp === 0) return;

    var result = "";
    var rank = 1;
    var displaysum = 0;
    topunits.forEach(function (unit) {
        if (rank <= 3) {
            displaysum += unit.disppower;
        }
        result += "<tr>";
        result += "<td>" + (rank++) + "</td>";
        result += "<td>" + unit.name + "</td>";
        result += "<td>" + unit.power.toFixed(1) + "</td>";
        result += "</tr>";
    });

    $("#resulttable").show();
    $("#resultbody").html(result);
    $("#displaysp").text(Math.floor(displaysum));
    $("#realsp").text(Math.floor(topsp));
}

$(function () {
    M.AutoInit();

    $("#sort").click(function () {
        sortAllUnits();
    });

    /*$("input").bind('keyup change', function () {
        sortAllUnits();
    });*/
});