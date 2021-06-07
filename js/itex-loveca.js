/**
 * @file Item Exchange Event (Loveca Use) Event calculator. Basically just a wrapper around the Story Event one.
 */

/**
 * A string, representing the target type - either Event Points or Currency Amount
 * @typedef {('EP','CA')} ItexLovecaTargetType
 */

/**
 * An object used to store input values for the Item Exchange Event (Loveca Use) calculator.
 * @class ItexLovecaData
 * @property {StoryData} storyData - Wrapped StoryData object.
 * @property {ItexLovecaTargetType} itexLovecaTargetType - The requested target type, either Event Points or Currency Amount
 * @property {number} itexLovecaTargetCurrencyAmount - The desired final amount of currency.
 * @property {number} itexLovecaCurrentCurrencyAmount - The current amount of currency.
 * @constructor
 */
function ItexLovecaData() {
    this.storyData = new StoryData();
    this.itexLovecaTargetType = 'EP';
    this.itexLovecaTargetCurrencyAmount = 0;
    this.itexLovecaCurrentCurrencyAmount = 0;
}

/**
 * A class serving static calculation methods handling ItexLovecaData objects.
 * @class ItexLovecaEstimationInfo
 * @param {StoryEstimationInfo} sei - The calculated StoryEstimationInfo object with most of the values.
 * @property {StoryEstimationInfo} storyEstimationInfo - Use the StoryEstimationInfo object to store most values.
 * @property {number} itexLovecaCurrency - Amount of currency collected.
 * @constructor
 */
function ItexLovecaEstimationInfo(sei) {
    this.storyEstimationInfo = sei;
    this.itexLovecaCurrency = 0;
}

/**
 * Read input values from the UI.
 */
ItexLovecaData.prototype.readFromUi = function () {
    this.storyData.storyTimerMethodAuto = $("#itexLovecaTimerMethodAuto").prop("checked");
    this.storyData.storyRegion = $("input:radio[name=itexLovecaRegion]:checked").val();
    this.storyData.storyTimerMethodManual = $("#itexLovecaTimerMethodManual").prop("checked");
    this.storyData.storyManualRestTimeInHours = ReadHelpers.toNum($("#itexLovecaManualRestTime").val());
    this.storyData.storyMinimumSleepHours = ReadHelpers.toNum($("#itexLovecaMinimumSleepHours").val(), 8);
    this.storyData.storyLiveDifficulty = $("input:radio[name=itexLovecaLiveDifficulty]:checked").val();
    this.storyData.storyLiveScore = $("input:radio[name=itexLovecaLiveScore]:checked").val();
    this.storyData.storyCardBonusPct = ReadHelpers.toNum($("#itexLovecaCardBonusPct").val(), 0);
    this.storyData.storyPassRefill = $("#itexLovecaPassRefillOn").prop("checked");
    this.itexLovecaTargetType = $("input:radio[name=itexLovecaTargetType]:checked").val();
    this.storyData.storyTargetEventPoints = ReadHelpers.toNum($("#itexLovecaTargetEventPoints").val());
    this.storyData.storyCurrentEventPoints = ReadHelpers.toNum($("#itexLovecaCurrentEventPoints").val());
    this.itexLovecaTargetCurrencyAmount = ReadHelpers.toNum($("#itexLovecaTargetCurrencyAmount").val());
    this.itexLovecaCurrentCurrencyAmount = ReadHelpers.toNum($("#itexLovecaCurrentCurrencyAmount").val());
    this.storyData.storyCurrentRank = ReadHelpers.toNum($("#itexLovecaCurrentRank").val());
    this.storyData.storyCurrentLP = ReadHelpers.toNum($("#itexLovecaCurrentLP").val(), 0);
    this.storyData.storyCurrentEXP = ReadHelpers.toNum($("#itexLovecaCurrentEXP").val(), 0);
};

/**
 * Set saved values to UI.
 * @param {ItexLovecaData} savedData The saved data to recall values from.
 */
ItexLovecaData.setToUi = function (savedData) {
    SetHelpers.checkBoxHelper($("#itexLovecaTimerMethodAuto"), savedData.storyData.storyTimerMethodAuto);
    SetHelpers.radioButtonHelper($("input:radio[name=itexLovecaRegion]"), savedData.storyData.storyRegion);
    if (savedData.storyData.storyRegion !== undefined) {
        updateTimerSection("itexLoveca");
    }
    var manualButton = $("#itexLovecaTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.storyData.storyTimerMethodManual);
    if (savedData.storyData.storyTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#itexLovecaManualRestTime"), savedData.storyData.storyManualRestTimeInHours);
    SetHelpers.inputHelper($("#itexLovecaMinimumSleepHours"), savedData.storyData.storyMinimumSleepHours);
    SetHelpers.radioButtonHelper($("input:radio[name=itexLovecaLiveDifficulty]"), savedData.storyData.storyLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=itexLovecaLiveScore]"), savedData.storyData.storyLiveScore);
    SetHelpers.inputHelper($("#itexLovecaCardBonusPct"), savedData.storyData.storyCardBonusPct);
    SetHelpers.radioButtonHelper($("input:radio[name=itexLovecaPassRefill]"), savedData.storyData.storyPassRefill ? "Y" : "N");
    SetHelpers.radioButtonHelper($("input:radio[name=itexLovecaTargetType]"), savedData.itexLovecaTargetType);
    SetHelpers.inputHelper($("#itexLovecaTargetEventPoints"), savedData.storyData.storyTargetEventPoints);
    SetHelpers.inputHelper($("#itexLovecaCurrentEventPoints"), savedData.storyData.storyCurrentEventPoints);
    SetHelpers.inputHelper($("#itexLovecaTargetCurrencyAmount"), savedData.itexLovecaTargetCurrencyAmount);
    SetHelpers.inputHelper($("#itexLovecaCurrentCurrencyAmount"), savedData.itexLovecaCurrentCurrencyAmount);
    SetHelpers.inputHelper($("#itexLovecaCurrentRank"), savedData.storyData.storyCurrentRank);
    SetHelpers.inputHelper($("#itexLovecaCurrentLP"), savedData.storyData.storyCurrentLP);
    SetHelpers.inputHelper($("#itexLovecaCurrentEXP"), savedData.storyData.storyCurrentEXP);
    if (savedData.storyData.storyCurrentLP > 0 || savedData.storyData.storyCurrentEXP > 0) {
        $("#itexLovecaCurrentExtra").collapsible('open', 0);
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Debug method, used to show a dialog with all input values.
 */
ItexLovecaData.prototype.alert = function () {
    alert("storyTimerMethodAuto: " + this.storyData.storyTimerMethodAuto + "\n" +
        "storyRegion: " + this.storyData.storyRegion + "\n" +
        "storyTimerMethodManual: " + this.storyData.storyTimerMethodManual + "\n" +
        "storyManualRestTimeInHours: " + this.storyData.storyManualRestTimeInHours + "\n" +
        "storyMinimumSleepHours: " + this.storyData.storyMinimumSleepHours + "\n" +
        "storyLiveDifficulty: " + this.storyData.storyLiveDifficulty + "\n" +
        "storyLiveScore: " + this.storyData.storyLiveScore + "\n" +
        "storyCardBonusPct: " + this.storyData.storyCardBonusPct + "\n" +
        "storyPassRefill: " + this.storyData.storyPassRefill + "\n" +
        "itexLovecaTargetType: " + this.itexLovecaTargetType + "\n" +
        "storyTargetEventPoints: " + this.storyData.storyTargetEventPoints + "\n" +
        "storyCurrentEventPoints: " + this.storyData.storyCurrentEventPoints + "\n" +
        "itexLovecaTargetCurrencyAmount: " + this.itexLovecaTargetCurrencyAmount + "\n" +
        "itexLovecaCurrentCurrencyAmount: " + this.itexLovecaCurrentCurrencyAmount + "\n" +
        "storyCurrentRank: " + this.storyData.storyCurrentRank + "\n" +
        "storyCurrentLP: " + this.storyData.storyCurrentLP + "\n" +
        "storyCurrentEXP: " + this.storyData.storyCurrentEXP);
};

/**
 * Creates a {@link StoryLiveInfo} object using the live input values, representing one play.
 * @returns {?StoryLiveInfo} A new object with all properties set, or null if the any live inputs are invalid.
 */
ItexLovecaData.prototype.createLiveInfo = function () {
    var diffId = this.storyData.getLiveDifficulty(),
        rankId = this.storyData.getLiveScore(),
        bonusFactor = this.storyData.getLiveBonusFactor();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || rankId == STORY_RANK.ERROR) {
        return null;
    }

    var lpCost = COMMON_LP_COST[diffId],
        expReward = COMMON_EXP_REWARD[diffId],
        pointReward = this.itexLovecaTargetType == 'EP'
            ?  ITEX_EVENT_EP[diffId][rankId]
            : ITEX_EVENT_CURRENCY[diffId][rankId] * bonusFactor;
    if (undefined === pointReward) return null;
    return new StoryLiveInfo(lpCost, pointReward, pointReward, expReward);
};

/**
 * Returns the amount of event points or currency left to meet the target.
 * @returns {number} Difference between the current event points or currency and the given target.
 */
ItexLovecaData.prototype.getEventPointsLeft = function () {
    return this.itexLovecaTargetType == 'EP'
        ? this.storyData.storyTargetEventPoints - this.storyData.storyCurrentEventPoints
        : this.itexLovecaTargetCurrencyAmount - this.itexLovecaCurrentCurrencyAmount;
};

/**
 * @param {StoryLiveCount} liveCount The amount of lives played.
 * @returns {number} The amount of currency gained for the given live count.
 */
ItexLovecaData.prototype.getCurrencyCount = function (liveCount) {
    var diffId = this.storyData.getLiveDifficulty(),
        rankId = this.storyData.getLiveScore(),
        bonusFactor = this.storyData.getLiveBonusFactor();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || rankId == STORY_RANK.ERROR || bonusFactor === 0) {
        return 0;
    }
    return Math.ceil(ITEX_EVENT_CURRENCY[diffId][rankId] * bonusFactor) * liveCount.liveCount;
};

/**
 * Call {@link StoryEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link ItexLovecaData.validate}.
 * @returns {ItexLovecaEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
ItexLovecaData.prototype.estimate = function () {
    var eei = new ItexLovecaEstimationInfo(StoryEstimator.estimate(this.createLiveInfo(),
        this.getEventPointsLeft(), this.storyData.getRestTimeInMinutes(),
        this.storyData.storyMinimumSleepHours, this.storyData.storyCurrentRank, this.storyData.storyCurrentEXP,
        this.storyData.storyCurrentLP, 0, 0, this.storyData.storyRegion,
        this.storyData.getPassRefillCount()));
    eei.itexLovecaCurrency = this.getCurrencyCount(eei.storyEstimationInfo.liveCount);
    return eei;
};

/**
 * Check whether the estimation has succeeded or not, or was judged to be impossible within the time left.
 * @returns {boolean}
 */
ItexLovecaEstimationInfo.prototype.hasResult = function () {
    return this.storyEstimationInfo.hasResult();
}

/**
 * Displays the calculation results on the UI.
 */
ItexLovecaEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#itexLovecaResultLiveCount"), this.storyEstimationInfo.liveCount.liveCount);
    $("#itexLovecaResultRegenTimeLost").text(Math.floor(this.storyEstimationInfo.regenTimeLostToSleepInMinutes / COMMON_LP_RECOVERY_TIME_IN_MINUTES) +
        " LP" + (this.storyEstimationInfo.regenTimeLostToSleepInMinutes === 0 ? "" : " (" + Common.minutesToString(this.storyEstimationInfo.regenTimeLostToSleepInMinutes) + ")"));
    $("#itexLovecaResultPlayTime").text(Common.minutesToString(this.storyEstimationInfo.getPlayTime()));
    $("#itexLovecaResultPlayTimeRate").text((100 * this.storyEstimationInfo.getPlayTimeRate()).toFixed(2) + "%");
    var highlightSkippedLives = false;
    var showSleepWarning = false;

    if (this.storyEstimationInfo.lpRecoveryInfo !== null) {
        Results.setBigResult($("#itexLovecaResultRefills"), this.storyEstimationInfo.lpRecoveryInfo.refills);
        Results.setBigResult($("#itexLovecaResultCurrency"), this.itexLovecaCurrency);
        if (this.storyEstimationInfo.skippedLives === 0) {
            $("#itexLovecaResultSkippedLivesText").text("0");
        } else {
            $("#exchangeResultSkippedLivesText").text((this.storyEstimationInfo.skippedLives * this.storyEstimationInfo.skippedLiveTickets) + " (" +
                this.storyEstimationInfo.skippedLives + " x " + this.storyEstimationInfo.skippedLiveTickets + " tickets)");
            highlightSkippedLives = true;
        }
        showSleepWarning = this.storyEstimationInfo.lpRecoveryInfo.sleepWarning;
        $("#itexLovecaResultFinalRank").text(this.storyEstimationInfo.lpRecoveryInfo.finalRank + " (" +
            (this.storyEstimationInfo.lpRecoveryInfo.finalRank >= COMMON_RANK_UP_EXP.length
                ? "MAX"
                : this.storyEstimationInfo.lpRecoveryInfo.finalRankExp + "/" +
                Common.getNextRankUpExp(this.storyEstimationInfo.lpRecoveryInfo.finalRank)
                + " EXP") + ")");
        $("#itexLovecaResultLoveca").text(Math.ceil(this.storyEstimationInfo.lpRecoveryInfo.lpToRecover / 100) * 10);
        $("#itexLovecaResultLiveCandy50").text(Math.ceil(this.storyEstimationInfo.lpRecoveryInfo.lpToRecover / 50));
        $("#itexLovecaResultLiveCandy100").text(Math.ceil(this.storyEstimationInfo.lpRecoveryInfo.lpToRecover / 100));
    } else {
        Results.setBigResult($("#itexLovecaResultRefills"), "---");
        Results.setBigResult($("#itexLovecaResultCurrency"), "---");
        $("#itexLovecaResultSkippedLivesText").text("---");
        $("#itexLovecaSleepWarning").hide(0);
        $("#itexLovecaResultFinalRank").text("---");
        $("#itexLovecaResultLoveca").text("---");
        $("#itexLovecaResultLiveCandy50").text("---");
        $("#itexLovecaResultLiveCandy100").text("---");
    }

    Results.show($("#itexLovecaResult"), highlightSkippedLives, showSleepWarning, this.storyEstimationInfo.lpRecoveryInfo && this.storyEstimationInfo.lpRecoveryInfo.region === "en");
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
ItexLovecaData.prototype.validate = function () {
    var errors = [];

    if (this.storyData.storyRegion != "en" && this.storyData.storyRegion != "jp") {
        errors.push("Choose a region");
        return errors;
    }

    var liveInfo = this.createLiveInfo();
    if (null === liveInfo) {
        errors.push("Live parameters have not been set");
    } else if (liveInfo.lp > Common.getMaxLp(this.storyData.storyCurrentRank, this.storyData.storyRegion)) {
        errors.push("The chosen live parameters result in an LP cost (" + liveInfo.lp +
            ") that's higher than your max LP (" + Common.getMaxLp(this.storyData.storyCurrentRank, this.storyData.storyRegion) + ")");
    }

    if (this.itexLovecaTargetType == 'EP') {
        if (0 >= this.storyData.storyTargetEventPoints) {
            errors.push("Enter event point target");
        } else if (this.getEventPointsLeft() <= 0) {
            errors.push("The given event point target has been reached! " +
                "Please change the event point target in order to calculate again");
        }

        if (0 > this.storyData.storyCurrentEventPoints) {
            errors.push("Enter current amount of event points");
        }
    } else if (this.itexLovecaTargetType == 'CA') {
        if (0 >= this.itexLovecaTargetCurrencyAmount) {
            errors.push("Enter currency amount target");
        } else if (this.getEventPointsLeft() <= 0) {
            errors.push("The given currency amount target has been reached! " +
                "Please change the currency amount target in order to calculate again");
        }

        if (0 > this.itexLovecaCurrentCurrencyAmount) {
            errors.push("Enter current amount of currency");
        }
    } else {
        errors.push("Select a target type");
    }

    if (0 >= this.storyData.storyCurrentRank) {
        errors.push("Enter current rank");
    }

    if (0 > this.storyData.storyCurrentLP) {
        errors.push("Enter a valid amount for current LP in the Optional Fields dropdown (or leave it empty)");
    }

    if (0 > this.storyData.storyCurrentEXP) {
        errors.push("Enter a valid amount for current EXP in the Optional Fields dropdown (or leave it empty)");
    }

    if (this.storyData.storyTimerMethodAuto && this.storyData.storyTimerMethodManual) {
        errors.push("Both Automatic Timer and Manual Input method are selected. Please unselect one of them");
    } else if (this.storyData.storyTimerMethodAuto) {
        if (this.storyData.getRestTimeInMinutes() <= 0) {
            errors.push("Event is already finished. Select Manual Input in order to calculate");
        }
    } else if (this.storyData.storyTimerMethodManual) {
        if (isNaN(this.storyData.getRestTimeInMinutes())) {
            errors.push("Manual Input only accepts integers")
        } else if (this.storyData.getRestTimeInMinutes() <= 0) {
            errors.push("Enter a valid remaining time");
        }
    } else {
        errors.push("Select Automatic Timer or Manual Input");
    }

    if (0 > this.storyData.storyMinimumSleepHours) {
        errors.push("Enter a valid amount for minimum hours to sleep (cannot be negative)");
    } else if (this.storyData.storyMinimumSleepHours >= 24) {
        errors.push("Enter a valid amount for minimum hours to sleep (cannot sleep for 24 hours or more)");
    }

    return errors;
};

/**
 * Event point rewards tables for lives - first index is difficulty, second index is rank.
 * @constant
 * @type {number[][]}
 */
var ITEX_EVENT_EP = [
    [225, 237, 250, 262, 275],
    [345, 360, 375, 390, 405],
    [525, 543, 562, 581, 600],
    [815, 830, 845, 860, 875]
]

/**
 * Item Exchange currency rewards tables for lives - first index is difficulty, second index is rank.
 * @constant
 * @type {number[][]}
 */
var ITEX_EVENT_CURRENCY = [
    [75, 90, 105, 120, 135],
    [165, 180, 195, 210, 225],
    [285, 300, 315, 330, 345],
    [465, 480, 495, 510, 525]
]