/**
 * @file Exchange Event calculator.
 */

/**
 * A string, representing the target type - either Event Points or Item Amount
 * @typedef {('EP','IA')} ExchangeTargetType
 */

/**
 * An object used to store input values for the Exchange Event calculator.
 * @class ExchangeData
 * @property {StoryData} storyData - Use the StoryData object to store all values.
 * @property {ExchangeTargetType} exchangeTargetType - The requested target type, either Event Points or Item Amount
 * @property {number} exchangeTargetItemAmount - The desired final amount of items.
 * @property {number} exchangeCurrentItemAmount - The current amount of items.
 * @constructor
 */
function ExchangeData() {
    this.storyData = new StoryData();
    this.exchangeTargetType = 'EP';
    this.exchangeTargetItemAmount = 0;
    this.exchangeCurrentItemAmount = 0;
}

/**
 * A class serving static calculation methods handling ExchangeData objects.
 * @class ExchangeEstimationInfo
 * @param {StoryEstimationInfo} sei - The calculated StoryEstimationInfo object with most of the values.
 * @property {StoryEstimationInfo} storyEstimationInfo - Use the StoryEstimationInfo object to store most values.
 * @property {number} exchangeItems - Amount of items collected.
 * @constructor
 */
function ExchangeEstimationInfo(sei) {
    this.storyEstimationInfo = sei;
    this.exchangeItems = 0;
}

/**
 * Read input values from the UI.
 */
ExchangeData.prototype.readFromUi = function () {
    this.storyData.storyTimerMethodAuto = $("#exchangeTimerMethodAuto").prop("checked");
    this.storyData.storyRegion = $("input:radio[name=exchangeRegion]:checked").val();
    this.storyData.storyTimerMethodManual = $("#exchangeTimerMethodManual").prop("checked");
    this.storyData.storyManualRestTimeInHours = ReadHelpers.toNum($("#exchangeManualRestTime").val());
    this.storyData.storyMinimumSleepHours = ReadHelpers.toNum($("#exchangeMinimumSleepHours").val(), 8);
    this.storyData.storyLiveDifficulty = $("input:radio[name=exchangeLiveDifficulty]:checked").val();
    this.storyData.storyLiveScore = $("input:radio[name=exchangeLiveScore]:checked").val();
    this.storyData.storyUnitBonusPct = ReadHelpers.toNum($("#exchangeUnitBonusPct").val(), 0);
    this.storyData.storyPassRefill = $("#exchangePassRefillOn").prop("checked");
    this.exchangeTargetType = $("input:radio[name=exchangeTargetType]:checked").val();
    this.storyData.storyTargetEventPoints = ReadHelpers.toNum($("#exchangeTargetEventPoints").val());
    this.storyData.storyCurrentEventPoints = ReadHelpers.toNum($("#exchangeCurrentEventPoints").val());
    this.exchangeTargetItemAmount = ReadHelpers.toNum($("#exchangeTargetItemAmount").val());
    this.exchangeCurrentItemAmount = ReadHelpers.toNum($("#exchangeCurrentItemAmount").val());
    this.storyData.storyCurrentRank = ReadHelpers.toNum($("#exchangeCurrentRank").val());
    this.storyData.storyCurrentLP = ReadHelpers.toNum($("#exchangeCurrentLP").val(), 0);
    this.storyData.storyCurrentEXP = ReadHelpers.toNum($("#exchangeCurrentEXP").val(), 0);
};

/**
 * Set saved values to UI.
 * @param {ExchangeData} savedData The saved data to recall values from.
 */
ExchangeData.setToUi = function (savedData) {
    SetHelpers.checkBoxHelper($("#exchangeTimerMethodAuto"), savedData.storyData.storyTimerMethodAuto);
    SetHelpers.radioButtonHelper($("input:radio[name=exchangeRegion]"), savedData.storyData.storyRegion);
    if (savedData.storyData.storyRegion !== undefined) {
        updateTimerSection("exchange");
    }
    var manualButton = $("#exchangeTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.storyData.storyTimerMethodManual);
    if (savedData.storyData.storyTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#exchangeManualRestTime"), savedData.storyData.storyManualRestTimeInHours);
    SetHelpers.inputHelper($("#exchangeMinimumSleepHours"), savedData.storyData.storyMinimumSleepHours);
    SetHelpers.radioButtonHelper($("input:radio[name=exchangeLiveDifficulty]"), savedData.storyData.storyLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=exchangeLiveScore]"), savedData.storyData.storyLiveScore);
    SetHelpers.inputHelper($("#exchangeUnitBonusPct"), savedData.storyData.storyUnitBonusPct);
    SetHelpers.radioButtonHelper($("input:radio[name=exchangePassRefill]"), savedData.storyData.storyPassRefill ? "Y" : "N");
    SetHelpers.radioButtonHelper($("input:radio[name=exchangeTargetType]"), savedData.exchangeTargetType);
    SetHelpers.inputHelper($("#exchangeTargetEventPoints"), savedData.storyData.storyTargetEventPoints);
    SetHelpers.inputHelper($("#exchangeCurrentEventPoints"), savedData.storyData.storyCurrentEventPoints);
    SetHelpers.inputHelper($("#exchangeTargetItemAmount"), savedData.exchangeTargetItemAmount);
    SetHelpers.inputHelper($("#exchangeCurrentItemAmount"), savedData.exchangeCurrentItemAmount);
    SetHelpers.inputHelper($("#exchangeCurrentRank"), savedData.storyData.storyCurrentRank);
    SetHelpers.inputHelper($("#exchangeCurrentLP"), savedData.storyData.storyCurrentLP);
    SetHelpers.inputHelper($("#exchangeCurrentEXP"), savedData.storyData.storyCurrentEXP);
    if (savedData.storyData.storyCurrentLP > 0 || savedData.storyData.storyCurrentEXP > 0) {
        $("#exchangeCurrentExtra").collapsible('open', 0);
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Debug method, used to show a dialog with all input values.
 */
ExchangeData.prototype.alert = function () {
    alert("storyTimerMethodAuto: " + this.storyData.storyTimerMethodAuto + "\n" +
        "storyRegion: " + this.storyData.storyRegion + "\n" +
        "storyTimerMethodManual: " + this.storyData.storyTimerMethodManual + "\n" +
        "storyManualRestTimeInHours: " + this.storyData.storyManualRestTimeInHours + "\n" +
        "storyMinimumSleepHours: " + this.storyData.storyMinimumSleepHours + "\n" +
        "storyLiveDifficulty: " + this.storyData.storyLiveDifficulty + "\n" +
        "storyLiveScore: " + this.storyData.storyLiveScore + "\n" +
        "storyUnitBonusPct: " + this.storyData.storyUnitBonusPct + "\n" +
        "storyPassRefill: " + this.storyData.storyPassRefill + "\n" +
        "exchangeTargetType: " + this.exchangeTargetType + "\n" +
        "storyTargetEventPoints: " + this.storyData.storyTargetEventPoints + "\n" +
        "storyCurrentEventPoints: " + this.storyData.storyCurrentEventPoints + "\n" +
        "exchangeTargetItemAmount: " + this.exchangeTargetItemAmount + "\n" +
        "exchangeCurrentItemAmount: " + this.exchangeCurrentItemAmount + "\n" +
        "storyCurrentRank: " + this.storyData.storyCurrentRank + "\n" +
        "storyCurrentLP: " + this.storyData.storyCurrentLP + "\n" +
        "storyCurrentEXP: " + this.storyData.storyCurrentEXP);
};

/**
 * Creates a {@link StoryLiveInfo} object using the live input values, representing one play.
 * @returns {?StoryLiveInfo} A new object with all properties set, or null if the any live inputs are invalid.
 */
ExchangeData.prototype.createLiveInfo = function () {
    var diffId = this.storyData.getLiveDifficulty(),
        rankId = this.storyData.getLiveScore(),
        bonusFactor = this.storyData.getLiveBonusFactor();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || rankId == STORY_RANK.ERROR) {
        return null;
    }

    var lpCost = COMMON_LP_COST[diffId],
        expReward = COMMON_EXP_REWARD[diffId],
        pointReward = this.exchangeTargetType == 'EP'
            ?  (this.storyData.storyRegion === "en" ? STORY_EVENT_POINTS_WW[diffId][rankId] : STORY_EVENT_POINTS[diffId][rankId])
            : EXCHANGE_EVENT_ITEMS[diffId][rankId] * bonusFactor;
    if (undefined === pointReward) return null;
    return new StoryLiveInfo(lpCost, pointReward, pointReward, expReward);
};

/**
 * Returns the amount of event points or items left to meet the target.
 * @returns {number} Difference between the current event points or items and the given target.
 */
ExchangeData.prototype.getEventPointsLeft = function () {
    return this.exchangeTargetType == 'EP' ? this.storyData.storyTargetEventPoints - this.storyData.storyCurrentEventPoints : this.exchangeTargetItemAmount - this.exchangeCurrentItemAmount;
};

/**
 * @param {StoryLiveCount} liveCount The amount of lives played.
 * @returns {number} The amount of items gained for the given live count.
 */
ExchangeData.prototype.getItemCount = function (liveCount) {
    var diffId = this.storyData.getLiveDifficulty(),
        rankId = this.storyData.getLiveScore(),
        bonusFactor = this.storyData.getLiveBonusFactor();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || rankId == STORY_RANK.ERROR || bonusFactor === 0) {
        return 0;
    }
    return Math.ceil(EXCHANGE_EVENT_ITEMS[diffId][rankId] * bonusFactor) * liveCount.liveCount;
};

/**
 * Call {@link StoryEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link ExchangeData.validate}.
 * @returns {ExchangeEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
ExchangeData.prototype.estimate = function () {
    var eei = new ExchangeEstimationInfo(StoryEstimator.estimate(this.createLiveInfo(),
        this.getEventPointsLeft(), this.storyData.getRestTimeInMinutes(),
        this.storyData.storyMinimumSleepHours, this.storyData.storyCurrentRank, this.storyData.storyCurrentEXP,
        this.storyData.storyCurrentLP, 0, 0, this.storyData.storyRegion,
        this.storyData.getPassRefillCount()));
    eei.exchangeItems = this.getItemCount(eei.storyEstimationInfo.liveCount);
    return eei;
};

/**
 * Check whether the estimation has succeeded or not, or was judged to be impossible within the time left.
 * @returns {boolean}
 */
ExchangeEstimationInfo.prototype.hasResult = function () {
    return this.storyEstimationInfo.hasResult();
}

/**
 * Displays the calculation results on the UI.
 */
ExchangeEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#exchangeResultLiveCount"), this.storyEstimationInfo.liveCount.liveCount);
    $("#exchangeResultRegenTimeLost").text(Math.floor(this.storyEstimationInfo.regenTimeLostToSleepInMinutes / COMMON_LP_RECOVERY_TIME_IN_MINUTES) +
        " LP" + (this.storyEstimationInfo.regenTimeLostToSleepInMinutes === 0 ? "" : " (" + Common.minutesToString(this.storyEstimationInfo.regenTimeLostToSleepInMinutes) + ")"));
    $("#exchangeResultPlayTime").text(Common.minutesToString(this.storyEstimationInfo.getPlayTime()));
    $("#exchangeResultPlayTimeRate").text((100 * this.storyEstimationInfo.getPlayTimeRate()).toFixed(2) + "%");
    var highlightSkippedLives = false;
    var showSleepWarning = false;

    if (this.storyEstimationInfo.lpRecoveryInfo !== null) {
        Results.setBigResult($("#exchangeResultRefills"), this.storyEstimationInfo.lpRecoveryInfo.refills);
        Results.setBigResult($("#exchangeResultItems"), this.exchangeItems);
        if (this.storyEstimationInfo.skippedLives === 0) {
            $("#exchangeResultSkippedLivesText").text("0");
        } else {
            $("#storyResultSkippedLivesText").text((this.storyEstimationInfo.skippedLives * this.storyEstimationInfo.skippedLiveTickets) + " (" +
                this.storyEstimationInfo.skippedLives + " x " + this.storyEstimationInfo.skippedLiveTickets + " tickets)");
            highlightSkippedLives = true;
        }
        showSleepWarning = this.storyEstimationInfo.lpRecoveryInfo.sleepWarning;
        $("#exchangeResultFinalRank").text(this.storyEstimationInfo.lpRecoveryInfo.finalRank + " (" +
            (this.storyEstimationInfo.lpRecoveryInfo.finalRank >= COMMON_RANK_UP_EXP.length
                ? "MAX"
                : this.storyEstimationInfo.lpRecoveryInfo.finalRankExp + "/" +
                Common.getNextRankUpExp(this.storyEstimationInfo.lpRecoveryInfo.finalRank)
                + " EXP") + ")");
        $("#exchangeResultLoveca").text(Math.ceil(this.storyEstimationInfo.lpRecoveryInfo.lpToRecover / 100) * 10);
        $("#exchangeResultLiveCandy50").text(Math.ceil(this.storyEstimationInfo.lpRecoveryInfo.lpToRecover / 50));
        $("#exchangeResultLiveCandy100").text(Math.ceil(this.storyEstimationInfo.lpRecoveryInfo.lpToRecover / 100));
    } else {
        Results.setBigResult($("#exchangeResultRefills"), "---");
        Results.setBigResult($("#exchangeResultItems"), "---");
        $("#exchangeResultSkippedLivesText").text("---");
        $("#exchangeSleepWarning").hide(0);
        $("#exchangeResultFinalRank").text("---");
        $("#exchangeResultLoveca").text("---");
        $("#exchangeResultLiveCandy50").text("---");
        $("#exchangeResultLiveCandy100").text("---");
    }

    Results.show($("#exchangeResult"), highlightSkippedLives, showSleepWarning, this.storyEstimationInfo.lpRecoveryInfo && this.storyEstimationInfo.lpRecoveryInfo.region === "en");
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
ExchangeData.prototype.validate = function () {
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

    if (this.exchangeTargetType == 'EP') {
        if (0 >= this.storyData.storyTargetEventPoints) {
            errors.push("Enter event point target");
        } else if (this.getEventPointsLeft() <= 0) {
            errors.push("The given event point target has been reached! " +
                "Please change the event point target in order to calculate again");
        }

        if (0 > this.storyData.storyCurrentEventPoints) {
            errors.push("Enter current amount of event points");
        }
    } else if (this.exchangeTargetType == 'IA') {
        if (0 >= this.exchangeTargetItemAmount) {
            errors.push("Enter item amount target");
        } else if (this.getEventPointsLeft() <= 0) {
            errors.push("The given item amount target has been reached! " +
                "Please change the item amount target in order to calculate again");
        }

        if (0 > this.exchangeCurrentItemAmount) {
            errors.push("Enter current amount of items");
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
 * Exchange item rewards tables for lives - first index is difficulty, second index is rank.
 * @constant
 * @type {number[][]}
 */
var EXCHANGE_EVENT_ITEMS = [
    [135, 120, 105, 90, 75],
    [225, 210, 195, 180, 165],
    [345, 330, 315, 300, 285],
    [525, 510, 495, 480, 465]
]