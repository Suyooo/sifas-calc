$(function () {
    M.AutoInit();
    let tooltip = $(".tooltip");
    let tooltipInner = $(".tooltip-inner");
    let body = $("body");

    // materialize doesn't set indicator positions inside hidden elements, so we'll do it ourselves on open
    $(".collapsible").each(function () {
        M.Collapsible.getInstance(this).options.onOpenStart = function () {
            let tabs = $(".tabs", this.el);
            let activetab = $(".active", tabs).parent();
            let alltabs = activetab.parent().children();
            let tabindex = alltabs.index(activetab);
            let tabwidth = 100 / (alltabs.length - 1);
            $(".indicator", tabs).css("left", (tabwidth * tabindex) + "%")
                .css("right", (tabwidth * (-tabindex + alltabs.length - 2)) + "%");
        }

        $(".live-difficulty", this).each(function () {
            let selecting = false;
            // note measure
            // TODO: add support for touch events on mobile... how?
            let notebar = $(".notebar", this);
            notebar.mousedown(function (e) {
                selecting = true;
                let selector = $("<div></div>").addClass("selection");
                notebar.append(selector);
                let fixedStartpos = e.pageX;
                let notebarPos = notebar.offset();
                let notebarWidth = notebar.width();
                body.mousemove(function (e) {
                    let startpos = fixedStartpos;
                    let endpos = e.pageX;
                    if (endpos < startpos) {
                        let temp = startpos;
                        startpos = endpos;
                        endpos = temp;
                    }
                    if (startpos < notebarPos.left) {
                        startpos = notebarPos.left;
                    }
                    if (endpos > notebarPos.left + notebarWidth) {
                        endpos = notebarPos.left + notebarWidth;
                    }

                    let count = 0;
                    $(".note", notebar).each(function () {
                        let notepos = $(this).offset().left;
                        if (notepos >= startpos && notepos <= endpos) count++;
                    });

                    tooltipInner.text(count + " note" + (count !== 1 ? "s" : ""));
                    tooltip.css({"left": (startpos + endpos) / 2, "top": notebarPos.top});
                    selector.css({"left": startpos - notebarPos.left, "width": endpos - startpos});
                });
                body.mouseup(function () {
                    $(this).off("mousemove").off("mouseup");
                    selecting = false;
                    selector.remove();
                    tooltip.css({"left": 0, "top": 0});
                });
            });

            // gimmick mouseover
            let gimmickmarkers = $(".notebar .gimmick", this);
            let gimmickinfos = $(".detailinfo .gimmick", this);
            gimmickmarkers.mouseover(function () {
                if (selecting || $(this).hasClass("hidden")) return;
                let gi = $(this).data("gimmick");
                gimmickinfos.each(function () {
                    if ($(this).data("gimmick") === gi) {
                        let details = $("div", this);
                        tooltipInner.html(details[1].innerHTML);
                        return false;
                    }
                });
                let thismarker = $(".gimmickmarker", this);
                let position = thismarker.offset();
                position.left += thismarker.width() / 2;
                tooltip.css(position);
            });
            gimmickmarkers.mouseout(function () {
                tooltip.css({"left": 0, "top": 0});
            });

            // appeal chance mouseover
            let acmarkers = $(".notebar .appealchance", this);
            let acinfos = $(".detailinfo .appealchance", this);
            acmarkers.mouseover(function () {
                if (selecting) return;
                let ai = $(this).data("ac");
                acinfos.each(function () {
                    if ($(this).data("ac") === ai) {
                        let details = $("div", this);
                        tooltipInner.html("<b>" + details[0].innerHTML.split(":")[1] + "</b><br>" + details[1].innerHTML);
                        return false;
                    }
                });
                let position = $(this).offset();
                position.left += $(this).width() / 2;
                tooltip.css(position);
            });
            acmarkers.mouseout(function () {
                tooltip.css({"left": 0, "top": 0});
            });

            // gimmick filtering
            gimmickinfos.click(function () {
                if ($(this).hasClass("filtered")) {
                    $(this).removeClass("filtered");
                    gimmickmarkers.removeClass("hidden filtered");
                } else {
                    gimmickinfos.removeClass("filtered");
                    $(this).addClass("filtered");
                    let gi = $(this).data("gimmick");
                    gimmickmarkers.each(function () {
                        if ($(this).data("gimmick") === gi) {
                            $(this).removeClass("hidden");
                            $(this).addClass("filtered");
                        } else {
                            $(this).removeClass("filtered");
                            $(this).addClass("hidden");
                        }
                    });
                }
            });
        });
    });
});