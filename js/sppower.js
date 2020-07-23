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
    var gimmickval = Number($("#gimmickval").val());
    var gimmickdir = $("#gimmickdir").val();
    var gimmickfac = 1 + gimmickval / ((gimmickdir == "plus") ? 100 : -100);
    var gimmickcond = $("#gimmickcond").val();

    for (var i = 1; i <= 9; i++) {
        var appl = Number($("#unit" + i + "appl").val());
        var tech = Number($("#unit" + i + "tech").val());
        var attr = Number($("#unit" + i + "attr").val());
        var bbat = Number($("#unit" + i + "bbat").val()) / 100;
        var bbsp = Number($("#unit" + i + "bbsp").val()) / 100;
        if (appl === 0 && tech === 0) continue;

        var attrmatch = (attr !== 0 && sortattr === attr);
        var gimmicked = false;
        if (gimmickcond == "off-attribute") {
            gimmicked = !attrmatch;
        } else if (gimmickcond == "on-attribute") {
            gimmicked = attrmatch;
        } else {
            gimmicked = $("#unit" + i + "gim").is(':checked');
        }

        units.push({
            name: $("#unit" + i + "name").val(),
            match: attrmatch,
            power: appl * (gimmicked ? gimmickfac : 1) + Math.floor(tech * (attrmatch ? 1.2 + bbat : 1)) * 1.2,
            bbsp: bbsp,
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
        topsp = Math.floor(units[0].power + units[1].power + units[2].power)
            * (1 + units[0].bbsp + units[1].bbsp + units[2].bbsp);
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

                    var currentsp = Math.floor(Math.floor(
                        currentunits[0].power + currentunits[1].power + currentunits[2].power)
                        * (1 + currentunits[0].bbsp + currentunits[1].bbsp + currentunits[2].bbsp))
                        * getRateFromNumberOfBoosts(currentboosts);
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
    var totalbbsp = 1;
    topunits.forEach(function (unit) {
        if (rank <= 3) {
            displaysum += unit.disppower;
            totalbbsp += unit.bbsp;
        }
        result += "<tr>";
        result += "<td>" + (rank++) + "</td>";
        result += "<td>" + unit.name + "</td>";
        result += "<td>" + unit.power.toFixed(1) + "</td>";
        result += "</tr>";
    });

    $("#resulttable").show();
    $("#resultbody").html(result);
    $("#displaysp").text(Math.floor(Math.floor(displaysum) * totalbbsp));
    $("#realsp").text(Math.floor(topsp));
}

$(function () {
    M.AutoInit();

    $("#sort").click(function () {
        sortAllUnits();
    });

    var gc = $("#gimmickcond");
    $("#inputtable").toggleClass("gimmickselect", gc.find(':selected').val() == "selected");
    gc.on("change", function () {
        $("#inputtable").toggleClass("gimmickselect", $(this).find(':selected').val() == "selected");
    });

    for (var i = 1; i <= 9; i++) {
        var attr = $('#unit' + i + 'attr');
        attr.on("change", function () {
            var icon = $(this).find(':selected').data("icon");
            if (icon !== undefined) $(this).parent().css("background-image", "url(" + icon + ")");
        });
        var icon = attr.find(':selected').data("icon");
        if (icon !== undefined) attr.parent().css("background-image", "url(" + icon + ")");
    }
});