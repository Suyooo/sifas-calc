/**
 * @file Functions related to the UI, such as DOM manipulation, notifications and cookies.
 */

$(function () {
    M.AutoInit();
    registerTabBarButtonsAndScroll();
    registerSideNavButtons();
    registerDarkMode();
    registerPopUpButtons();
    registerCalculatorButtons();

    loadCookieData();
    goToDirectLinkTab();
    notificationLoad();

    // open all collapsibles on desktop
    if ($(window).width() >= 1200) {
        $('.collapsible:not(.small-collapsible)').collapsible('open', 0);
    }
});

/**
 * Checks whether a new notification is available, and displays it if one exists.
 */
function notificationLoad() {
    var curId = Cookie.get("notificationRead");
    if (curId === undefined) {
        curId = -1;
    }

    if (curId < notificationInfo.id) {
        $("#notificationButton").toggle(notificationInfo.allowDismiss).click(notificationDismiss);
        $("#notificationMessage").html(notificationInfo.message);
        $("#notification").slideDown();
    }
}

/**
 * Dismisses the current notification, and makes sure it doesn't appear on the next visit.
 */
function notificationDismiss() {
    Cookie.set("notificationRead", notificationInfo.id, 365);
    $("#notification").slideUp();
}

/**
 * Handles buttons and events in the tab bar. This includes scrolling the tab button into view, setting the hash in the
 * URL, and the scroll buttons for narrow screens.
 */
function registerTabBarButtonsAndScroll() {
    var tabbar = $('ul.tabs');

    tabbar.tabs({
        "onShow": function (e) {
            var id = $(e).attr("id");
            var tab = $("li.tab a[href='#" + id + "']");

            // noinspection JSValidateTypes
            var pos = tab.position(),
                width = tab.outerWidth(),
                containerScrollLeft = tabbar.scrollLeft(),
                containerWidth = tabbar.width(),
                left = pos.left + containerScrollLeft;

            var paddingPx = (containerWidth - width) * 0.3;

            if (left < containerScrollLeft) {
                // noinspection JSValidateTypes
                tabbar.animate({scrollLeft: left - paddingPx}, 200);
            }
            else if (left + width > containerScrollLeft + containerWidth) {
                // noinspection JSValidateTypes
                tabbar.animate({scrollLeft: left + width - containerWidth + paddingPx}, 200);
            }

            window.location.hash = id + "Calc";
        }
    });

    // Scrolling only sets a variable instead of changing the CSS instantly, to improve performance
    var hasScrolled = true;
    tabbar.scroll(function () {
        hasScrolled = true;
    });
    setInterval(function () {
        if (hasScrolled) {
            hasScrolled = false;
            // noinspection JSValidateTypes
            $(".tab-button-left").css("display", (tabbar.scrollLeft() === 0) ? "none" : "");
            // noinspection JSValidateTypes
            $(".tab-button-right").css("display", (tabbar.scrollLeft() === tabbar[0].scrollWidth - tabbar[0].clientWidth) ? "none" : "");
        }
    }, 250);
    tabbar.scroll();

    $(".tab-button-left").click(function () {
        // noinspection JSValidateTypes
        tabbar.animate({scrollLeft: tabbar.scrollLeft() - 100}, 200);
    });

    $(".tab-button-right").click(function () {
        // noinspection JSValidateTypes
        tabbar.scrollLeft(tabbar.scrollLeft() + 100);
        tabbar.animate({scrollLeft: tabbar.scrollLeft() + 100}, 200);
    });
}

/**
 * Handles buttons and events in the menu. This includes the menu button itself and the contact and close buttons.
 */
function registerSideNavButtons() {
    $(".sidenav:not(.tab-sidebar-button)").sidenav({
        draggable: true
    });
    $(".tab-sidebar-button").sidenav({
        draggable: false
    });

    $("#sideNavDiscord").click(function () {
        $("#sideNavDiscordName").slideToggle();
    });

    $("#sideNavClose").click(function () {
        $('.sidenav').sidenav('close');
    });

    $("#toolNavClose").click(function () {
        $('.sidenav').sidenav('close');
    });
}

/**
 * Handles functions releated to dark mode. This includes the switch in the menu, setting the transition disabler class
 * on the body during toggling and saving the dark mode preference as a cookie.
 */
function registerDarkMode() {
    var dmli = $(".dark-mode-switch");
    var dms = $("#darkModeSwitch");
    var setting = Cookie.get("dark-mode");

    dmli.click(function () {
        dms.prop("checked", !dms.prop("checked")).change();
    });

    dms.change(function () {
        var body = $("body");
        body.addClass("dark-mode-transition-disabler");
        if (dms.prop("checked") === true) {
            body.addClass("dark-mode");
            Cookie.set("dark-mode", "yes", 30);
        } else {
            body.removeClass("dark-mode");
            Cookie.set("dark-mode", "no", 30);
        }
        setTimeout(function () {
            body.removeClass("dark-mode-transition-disabler")
        }, 500);
    });

    if (setting !== undefined) {
        dms.prop("checked", setting === "yes").change();
    }
}

/**
 * Listener for the pop up close button.
 * @param eventOrPopUp Either a click event if called via the close/no button, or the popup as a jQuery element.
 */
function closePopUp(eventOrPopUp) {
    // if this method is called with an event object instead of directly...
    if (eventOrPopUp["type"] == "click") eventOrPopUp = $('#popUp');
    if (eventOrPopUp.css("pointer-events") === "auto") {
        eventOrPopUp.fadeTo(400, 0);
        eventOrPopUp.css("pointer-events", "none");
    }
}

/**
 * Handles buttons and events related to popups, including the close buttons and the ability to close the popup using
 * the enter key
 */
function registerPopUpButtons() {
    $("#popUpButton").click(closePopUp);
    $("#dialogNoButton").click(closePopUp);

    $(document).keypress(function (keypressEvent) {
        if (keypressEvent.which == 13) {
            keypressEvent.preventDefault();
            var popUp = $('#popUp');
            closePopUp(popUp);
        }
    });
}

/**
 * Handles buttons and events for the calculators, including the submit, auto timer and save config
 * buttons, and the automatic calculation if a value is changed.
 */
function registerCalculatorButtons() {
    var newDataObjectFunctions = {
        "token": function () {
            return new TokenData();
        }
    };

    $.each(newDataObjectFunctions, function (page, newDataObject) {
        var doCalc = function (showErrors) {
            Results.hide($("#" + page + "Result"));
            var data = newDataObject();
            data.readFromUi();

            var errors = data.validate();
            if (errors.length > 0) {
                if (showErrors) {
                    var errorList = "";
                    for (var i = 0; i < errors.length; i++) {
                        errorList += "<li>" + errors[i] + "</li>";
                    }
                    showPopUp("There might be something wrong with your input - please check and fix:<br>" +
                        "<ul>" + errorList + "</ul>");
                }
                return;
            }

            var lpEstimationInfo = data.estimate();
            if (null === lpEstimationInfo.lpRecoveryInfo && showErrors) {
                showPopUp("Assuming three minutes per live, the event will end before the target can be reached. Sorry.");
            }
            lpEstimationInfo.showResult();
        };

        updateAutoTimerSection(page);
        $("#" + page + "TimerMethodAuto").click(function () {
            $("#" + page + "TimerMethodManualSection").slideUp(200);
            updateAutoTimerSection(page);
        }).click();
        $("#" + page + "TimerMethodManual").click(function () {
            $("#" + page + "TimerMethodAutoSection").slideUp(200);
            $("#" + page + "TimerMethodManualSection").slideDown(200);
        });
        $("#" + page + "Calculate").click(function () {
            doCalc(true);
        });
        $("#" + page + "SaveConfig").click(function () {
            if (!navigator.cookieEnabled) {
                showPopUp("Cookies are disabled in your browser. Please enable them to save your configuration data.");
            }

            var data = new newDataObject();
            data.readFromUi($);
            if (Cookie.set(page + "Data", btoa(JSON.stringify(data)), 30)) {
                M.toast({html: "Data saved!"});
            }
        });
        $("input[type=number]", "#" + page).keypress(function (keypressEvent) {
            if (keypressEvent.which == 13) {
                keypressEvent.preventDefault();
                doCalc(false);
            }
        });
        $("input[type=radio]", "#" + page).click(function () {
            doCalc(false);
        });
        $("input[type=checkbox]", "#" + page).click(function () {
            doCalc(false);
        });
        $("input", "#" + page + "Arrange").click(function () {
            updateArrangeCount(page);
        });
        $(".collapsible", "#" + page + "Result").collapsible({
            onOpenStart: function () {
                // The Alternative Recovery Items collapsible should scroll down if the user is already at the bottom
                if ($(window).scrollTop() + window.innerHeight - $(document).height() > -100) {
                    $('html, body').animate({
                        scrollTop: $(document).height()
                    }, 300);
                }
            }
        });
    });
}

/**
 * Loads saved configurations for each of the calculators if available.
 */
function loadCookieData() {
    var loadFunctions = {
        "token": TokenData.setToUi
    };
    $.each(loadFunctions, function (page, loadFunction) {
        var cookie = Cookie.get(page + "Data");
        if (cookie !== undefined) {
            try {
                var data = JSON.parse(atob(cookie));
                loadFunction(data);
            } catch (e) {
                console.error("Couldn't load saved data for " + page + ": " + e);
            }
        }
    });
}

/**
 * If a hash is specified in the URL, change to the tab with the calculator specified in that hash.
 */
function goToDirectLinkTab() {
    var tabbar = $('ul.tabs');
    if (window.location.hash) {
        var page = window.location.hash;
        tabbar.tabs('select', page.substring(1, page.length - 4));
    }
}

/**
 * Creates a popup that covers the screen until dismissed by the user.
 * @param content Message displayed in the popup.
 */
function showPopUp(content) {
    $('#popUpButton').show(0);
    $('#dialogYesButton').hide(0);
    $('#dialogNoButton').hide(0);
    $('#popUpContent').html(content);
    var popUp = $('#popUp');
    popUp.fadeTo(400, 1);
    popUp.css("pointer-events", "auto");
}

/**
 * Creates a dialog that covers the screen until a yes/no question is answered by the user. ("no" will just dismiss the
 * dialog.)
 * @param content Message displayed in the popup.
 * @param yesFunc Function to execute if "yes" is chosen by the user. Will not close pop up if it returns false.
 */
function showDialog(content, yesFunc) {
    var popUp = $('#popUp');
    $('#popUpButton').hide(0);
    $('#dialogYesButton').show(0).click(function () {
        if (popUp.css("pointer-events") === "auto") {
            if (yesFunc() !== false) closePopUp(popUp);
        }
    });
    $('#dialogNoButton').show(0);
    $('#popUpContent').html(content);
    popUp.fadeTo(400, 1);
    popUp.css("pointer-events", "auto");
}

/**
 * Tthis method is responsible for setting up the automatic timer, including the event progress bar, the event images
 * and the text display of the time left in/until the event.
 * @param page The short name of the calculator to update.
 */
function updateAutoTimerSection(page) {
    $("#" + page + "TimerMethodAutoSection").slideDown(200);
    var eventInfo = $("#" + page + "TimerEventInfo");
    eventInfo.slideDown(300);

    var eventDates = Common.getEventBeginEndTime();
    var start = eventDates[0];
    var now = new Date();
    var end = eventDates[1];

    var progressBar = $("#" + page + "TimerProgress");
    var leftLabel = $("#" + page + "TimerLeft");
    var eventBanner = $("#" + page + "EventBanner");
    var newBanner = "image/event_jp.png";
    eventBanner.attr("src", newBanner);

    // Reset progress bar animation by creating a new one and removing the old one (this skips the transition)
    progressBar.width(0);
    var progressNew = progressBar.clone().appendTo(progressBar.parent());
    progressBar.remove();
    progressBar = progressNew;

    if (now < start) {
        leftLabel.text(Common.hoursToString(Common.hoursBetween(start, now)) + " until event begins");
        progressBar.width("0%");
    } else if (end <= now) {
        leftLabel.text("Event has ended");
        progressBar.width("100%");
    } else {
        var totalTime = Common.minsBetween(end, start);
        var timeLeft = Common.minsBetween(end, now);
        leftLabel.text(Common.hoursToString(Common.hoursBetween(end, now)) + " left");
        progressBar.width(((1 - timeLeft / totalTime) * 100) + "%");
    }
}

/**
 * Listener for clicks on arrange options in MedFes/ChaFes. Updates the number in the header of the collapsible.
 * @param page The short name of the calculator to update.
 */
function updateArrangeCount(page) {
    var count = 0;
    $("input", "#" + page + "Arrange").each(function () {
        if ($(this).prop("checked") === true) {
            count++;
        }
    });
    $("#" + page + "ArrangeCount").html(count);
}

/**
 * A class serving static methods used to display the results after calculation.
 * @class Results
 * @constructor
 */
function Results() {
}

/**
 * Hides calculation results on error.
 * @param resultDiv jQuery element representing the div containing the results.
 */
Results.hide = function (resultDiv) {
    $(".result-large", resultDiv).stop(true, true).fadeTo(0, 0);
    $(".result-small", resultDiv).stop(true, true).fadeTo(0, 0);
    $(".collapsible ", resultDiv).stop(true, true).fadeTo(0, 0);
    $(resultDiv).addClass("no-link");
};

/**
 * Shows calculation results with an animation. The values have been filled by the calculator before this method is
 * called.
 * @param resultDiv jQuery element representing the div containing the results.
 */
Results.show = function (resultDiv) {
    $(".result-large", resultDiv).delay(100).fadeTo(400, 1);
    $(".collapsible", resultDiv).delay(200).fadeTo(400, 1);
    var delay = 300;
    $(".result-small", resultDiv).each(function () {
        $(this).delay(delay).fadeTo(400, 1);
        delay += 100;
    });
    $(resultDiv).removeClass("no-link");
};

/**
 * Small helper method to set the large numbers in the results. Will automatically shrink the number if too wide.
 * @param element jQuery element representing the large number.
 * @param text The value to set it to.
 */
Results.setBigResult = function (element, text) {
    element.removeClass("shrink");
    element.text(text);
    if (element[0].scrollWidth - 5 > element.width()) {
        element.addClass("shrink");
    }
};

/**
 * A class serving static methods used for cookie storing and reading.
 * @class Cookie
 * @constructor
 */
function Cookie() {
}

var COOKIE_POLICY = "<h5>Cookie Policy</h5>SIFAS Calc uses cookies to store your preferences and inputs for later " +
    "use. It will only do so if you agree to this message.<br>The page is still functional without if you do " +
    "not allow storage, however, you will be unable to:<ul><li>Save configurations for later</li>" +
    "<li>Dismiss notifications permanently</li><li>Save your setting for dark mode</li></ul>No other data is " +
    "stored, and this information is not saved on the server or used to identify you.<br>You can revoke your consent at " +
    "any time by removing all cookies saved on your device by this site.";

/**
 * Sets a cookie. If no cookies exists, first ask for consent using a dialog showing the cookie policy.
 * @param key Cookie name.
 * @param value Cookie value.
 * @param days After how many days the cookie will expire.
 * @returns {boolean} True if the cookie was stored, false if we need to ask for cookie consent.
 */
Cookie.set = function (key, value, days) {
    if (document.cookie === "") {
        showDialog(COOKIE_POLICY + "<br><br>Do you agree with the cookie policy and " +
            "allow this site to store cookies on your device?",
            function () {
                var expiryDate = new Date();
                expiryDate.setTime(expiryDate.getTime() + (5 * 60 * 1000));
                document.cookie = "cookieConsent=1; expires=" + expiryDate.toUTCString() + "; path=/sifas";
                if (Cookie.get("cookieConsent") === undefined) {
                    showPopUp("Unable to store cookies. Your browser might be blocking cookie " +
                            "storage. Please check your browser's privacy and storage settings, then try again.");
                    return false;
                }
                Cookie.set(key, value, days);
            });
        return false;
    } else {
        var expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = key + "=" + value + "; expires=" + expiryDate.toUTCString() + "; path=/sifas";
        return true;
    }
};

/**
 * Retrieves the value of a cookie.
 * @param key Cookie name.
 * @returns {*} The value of the cookie if it exists, undefined otherwise.
 */
Cookie.get = function (key) {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        if (eqPos != -1 && cookie.substr(0, eqPos).trim() == key) {
            return cookie.substr(eqPos + 1, cookie.length).trim();
        }
    }
    return undefined;
};

/**
 * Removes all cookies. (Used for debugging. Based on a snippet from https://stackoverflow.com/a/179514/1381397)
 */
Cookie.removeAll = function () {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/sifas";
    }
};

/**
 * A class serving static methods used to read values from the calculator forms.
 * @class ReadHelpers
 * @constructor
 */
function ReadHelpers() {
}

/**
 * Converts a string to a number, but includes empty string handling.
 * @param {string} str The string to convert.
 * @param {number} [emptyVal] The value to return if the string is empty. Is interpreted as -1 if undefined.
 * @returns {?number} str converted to a number, emptyVal if it's empty, or undefined if it's undefined.
 */
ReadHelpers.toNum = function (str, emptyVal) {
    if (str === undefined) {
        return undefined;
    } else if (str.length === 0) {
        return (emptyVal === undefined) ? -1 : emptyVal;
    } else {
        return Number(str);
    }
};


/**
 * A class serving static methods used to set values to the calculator forms.
 * @class SetHelpers
 * @constructor
 */
function SetHelpers() {
}

/**
 * Sets a checkbox to the given value.
 * @param jqElement jQuery element representing the checkbox to set the value to.
 * @param checked Boolean value to set the checkbox to.
 */
SetHelpers.checkBoxHelper = function (jqElement, checked) {
    jqElement.prop("checked", (checked) ? "checked" : "");
};

/**
 * Given a set of radio buttons, activate only the one with the given value.
 * @param jqElements A set of jQuery elements representing radio buttons with the same name.
 * @param activeValue Which radio button to activate.
 */
SetHelpers.radioButtonHelper = function (jqElements, activeValue) {
    jqElements.each(function () {
        var isCorrectRadio = $(this).prop("value") == activeValue;
        $(this).prop("checked", (isCorrectRadio) ? "checked" : "");
        return !isCorrectRadio;
    });
};

/**
 * Sets a value to an input field, unless it is -1 - which represents and empty field.
 * @param jqElement jQuery element representing the input to set the value to.
 * @param value The value to set the input to, or -1 to leave it empty.
 */
SetHelpers.inputHelper = function (jqElement, value) {
    if (value !== -1) jqElement.val(value).change();
};