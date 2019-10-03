function sortAllUnits() {
    var units = [];

    for (var i = 1; i <= 9; i++) {
        var appl = Number($("#unit" + i + "appl").val());
        var tech = Number($("#unit" + i + "tech").val());
        if (appl === 0 && tech === 0) continue;
        units.push({
            name: $("#unit" + i + "name").val(),
            power: appl + tech * 1.2
        });
    }

    units.sort(function (a, b) {
        return b.power - a.power;
    });

    var result = "";
    var rank = 1;
    var sum = 0;
    units.forEach(function (unit) {
        if (rank <= 3) {
            sum += unit.power;
        }
        result += "<tr>";
        result += "<td>" + (rank++) + "</td>";
        result += "<td>" + unit.name + "</td>";
        result += "<td>" + unit.power.toFixed(1) + "</td>";
        result += "</tr>";
    });

    $("#resulttable").show();
    $("#resultbody").html(result);
    $("#strongestsp").text(sum.toFixed(1));
}

$(function () {
    M.AutoInit();

    $("#sort").click(function () {
        sortAllUnits();
    });

    $("input").bind('keyup change', function () {
        sortAllUnits();
    });
});