/**
 * @file Exchange Event calculator.
 */

/**
 * An object used to store input values for the Exchange Event calculator.
 * @class ExchangeData
 * @property {StoryData} storyData - Use the StoryData object to store all values.
 * @constructor
 */
function ExchangeData() {
    this.storyData = new StoryData();
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
    this.storyData.storyTimerMethodManual = $("#exchangeTimerMethodManual").prop("checked");
    this.storyData.storyManualRestTimeInHours = ReadHelpers.toNum($("#exchangeManualRestTime").val());
    this.storyData.storyMinimumSleepHours = ReadHelpers.toNum($("#exchangeMinimumSleepHours").val(), 8);
    this.storyData.storyLiveDifficulty = $("input:radio[name=exchangeLiveDifficulty]:checked").val();
    this.storyData.storyLiveScore = $("input:radio[name=exchangeLiveScore]:checked").val();
    this.storyData.storyUnitBonusPct = ReadHelpers.toNum($("#exchangeUnitBonusPct").val(), 0);
    this.storyData.storyTargetEventPoints = ReadHelpers.toNum($("#exchangeTargetEventPoints").val());
    this.storyData.storyCurrentEventPoints = ReadHelpers.toNum($("#exchangeCurrentEventPoints").val());
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
    SetHelpers.inputHelper($("#exchangeTargetEventPoints"), savedData.storyData.storyTargetEventPoints);
    SetHelpers.inputHelper($("#exchangeCurrentEventPoints"), savedData.storyData.storyCurrentEventPoints);
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
    alert("exchangeTimerMethodAuto: " + this.storyData.storyTimerMethodAuto + "\n" +
        "exchangeTimerMethodManual: " + this.storyData.storyTimerMethodManual + "\n" +
        "exchangeManualRestTimeInHours: " + this.storyData.storyManualRestTimeInHours + "\n" +
        "exchangeMinimumSleepHours: " + this.storyData.storyMinimumSleepHours + "\n" +
        "exchangeLiveDifficulty: " + this.storyData.storyLiveDifficulty + "\n" +
        "exchangeLiveScore: " + this.storyData.storyLiveScore + "\n" +
        "exchangeUnitBonusPct: " + this.storyData.storyUnitBonusPct + "\n" +
        "exchangeTargetEventPoints: " + this.storyData.storyTargetEventPoints + "\n" +
        "exchangeCurrentRank: " + this.storyData.storyCurrentRank + "\n" +
        "exchangeCurrentEventPoints: " + this.storyData.storyCurrentEventPoints + "\n" +
        "exchangeCurrentLP: " + this.storyData.storyCurrentLP + "\n" +
        "exchangeCurrentEXP: " + this.storyData.storyCurrentEXP);
};

/**
 * Creates a {@link StoryLiveInfo} object using the live input values, representing one play.
 * @returns {?StoryLiveInfo} A new object with all properties set, or null if the any live inputs are invalid.
 */
ExchangeData.prototype.createLiveInfo = function () {
    var diffId = this.storyData.getLiveDifficulty(),
        rankId = this.storyData.getLiveScore();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || rankId == STORY_RANK.ERROR) {
        return null;
    }

    var lpCost = COMMON_LP_COST[diffId],
        expReward = COMMON_EXP_REWARD[diffId],
        pointReward = STORY_EVENT_POINTS[diffId][rankId];
    if (undefined === pointReward) return null;
    return new StoryLiveInfo(lpCost, pointReward, expReward);
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
        this.storyData.getEventPointsLeft(), this.storyData.getRestTimeInMinutes(),
        this.storyData.storyMinimumSleepHours, this.storyData.storyCurrentRank, this.storyData.storyCurrentEXP,
        this.storyData.storyCurrentLP, 0, 0));
    eei.exchangeItems = this.getItemCount(eei.storyEstimationInfo.liveCount);
    return eei;
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
ExchangeData.prototype.validate = function () {
    return this.storyData.validate();
};

/**
 * Displays the calculation results on the UI.
 */
ExchangeEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#exchangeResultLiveCount"), this.storyEstimationInfo.liveCount.liveCount);
    $("#exchangeResultRegenTimeLost").text((this.storyEstimationInfo.regenTimeLostToSleepInMinutes / COMMON_LP_RECOVERY_TIME_IN_MINUTES) +
        " LP (" + Common.minutesToString(this.storyEstimationInfo.regenTimeLostToSleepInMinutes) + ")");
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
            $("#exchangeResultSkippedLivesText").text(this.storyEstimationInfo.skippedLives + " (" + this.storyEstimationInfo.skippedLiveTickets +
                " tickets per live)");
            highlightSkippedLives = true;
        }
        showSleepWarning = this.storyEstimationInfo.lpRecoveryInfo.sleepWarning;
        $("#exchangeResultFinalRank").text(this.storyEstimationInfo.lpRecoveryInfo.finalRank + " (" +
            (this.storyEstimationInfo.lpRecoveryInfo.finalRank >= COMMON_RANK_UP_EXP.length
                ? "MAX"
                : this.storyEstimationInfo.lpRecoveryInfo.finalRankExp + "/" +
                Common.getNextRankUpExp(this.storyEstimationInfo.lpRecoveryInfo.finalRank)
                + " EXP") + ")");
        $("#exchangeResultLoveca").text(this.storyEstimationInfo.lpRecoveryInfo.refills * COMMON_LOVECA_PER_REFILL);
        $("#exchangeResultLiveCandy50").text(this.storyEstimationInfo.lpRecoveryInfo.refills * 2);
        $("#exchangeResultLiveCandy100").text(this.storyEstimationInfo.lpRecoveryInfo.refills);
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

    Results.show($("#exchangeResult"), highlightSkippedLives, showSleepWarning);
};

/**
 * Exchange item rewards tables for lives on Easy difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var EXCHANGE_EVENT_ITEM_TABLE_EASY = [100, 120, 140, 160, 180];

/**
 * Exchange item rewards tables for lives on Normal difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var EXCHANGE_EVENT_ITEM_TABLE_NORMAL = [220, 240, 260, 280, 300];

/**
 * Exchange item rewards tables for lives on Hard difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var EXCHANGE_EVENT_ITEM_TABLE_HARD = [380, 400, 420, 440, 460];

/**
 * Exchange item rewards tables for lives on Hard+ difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var EXCHANGE_EVENT_ITEM_TABLE_HARD_PLUS = [620, 640, 660, 680, 700];

/**
 * Array saving references to all point tables, for access using the difficulty ID from COMMON_DIFFICULTY_IDS.
 * @constant
 * @type {number[][]}
 */
var EXCHANGE_EVENT_ITEMS = [];
EXCHANGE_EVENT_ITEMS[COMMON_DIFFICULTY_IDS.EASY] = EXCHANGE_EVENT_ITEM_TABLE_EASY;
EXCHANGE_EVENT_ITEMS[COMMON_DIFFICULTY_IDS.NORMAL] = EXCHANGE_EVENT_ITEM_TABLE_NORMAL;
EXCHANGE_EVENT_ITEMS[COMMON_DIFFICULTY_IDS.HARD] = EXCHANGE_EVENT_ITEM_TABLE_HARD;
EXCHANGE_EVENT_ITEMS[COMMON_DIFFICULTY_IDS.HARD_PLUS] = EXCHANGE_EVENT_ITEM_TABLE_HARD_PLUS;