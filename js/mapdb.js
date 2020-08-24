$(function () {
    M.AutoInit();
    let tooltip = $(".tooltip");
    let tooltipInner = $(".tooltip-inner");
    let body = $("body");

    $(".collapsible").each(function () {
        let collapsible = M.Collapsible.getInstance(this);
        if (IS_MAP_DB) {
            // notemap database
            let tabs = $(".tabs", this);
            if (tabs.length === 0) return true; // page help collapsible
            tabs = M.Tabs.getInstance(tabs[0]);

            if (window.location.hash.startsWith("#live")) {
                let tabId = window.location.hash.substring(5);
                let wantedTab = $("#" + tabId, this);
                if (wantedTab.length > 0) {
                    // add padding at bottom to successfully scroll to divs at the end of the page
                    body.css({"padding-bottom": "100%"});
                    setTimeout(function () {
                        body.css({"padding-bottom": 0, "transition": "padding-bottom .5s"})
                    }, 300);
                    collapsible.open();
                    tabs.select(tabId);
                    window.scrollTo(0, $(this).offset().top);
                }
            }

            // materialize doesn't set indicator positions inside hidden elements, so we'll do it ourselves on open
            // we can also use it to set the location anchor to link to that live difficulty
            collapsible.options.onOpenStart = function () {
                let tabs = $(".tabs", this.el);
                let activetablink = $(".active", tabs);
                let activetab = activetablink.parent();
                let alltabs = activetab.parent().children();
                let tabindex = alltabs.index(activetab);
                let tabwidth = 100 / (alltabs.length - 1);
                $(".indicator", tabs).css("left", (tabwidth * tabindex) + "%")
                    .css("right", (tabwidth * (-tabindex + alltabs.length - 2)) + "%");
                window.location.hash = "live" + activetablink.attr("href").substring(1);
            };

            tabs.options.onShow = function (e) {
                window.location.hash = "live" + $(e).attr("id");
            };
        } else {
            // DLP Stage List

            if (window.location.hash.startsWith("#floor")) {
                if ($(this).data("floor") == window.location.hash.substring(6)) {
                    // add padding at bottom to successfully scroll to divs at the end of the page
                    body.css({"padding-bottom": "100%"});
                    setTimeout(function () {
                        body.css({"padding-bottom": 0, "transition": "padding-bottom .5s"})
                    }, 300);
                    collapsible.open();
                    window.scrollTo(0, $(this).offset().top);
                }
            }

            let thisFloor = $(this).data("floor");
            collapsible.options.onOpenStart = function () {
                window.location.hash = "floor" + thisFloor;
            };
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