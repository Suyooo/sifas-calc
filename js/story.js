/**
 * @file Story Event calculator.
 */

/**
 * An object used to store input values for the Story Event calculator.
 * @class StoryData
 * @property {boolean} storyTimerMethodAuto - Whether Automatic Timer is selected on the UI.
 * @property {boolean} storyTimerMethodManual - Whether Manual Input is selected on the UI.
 * @property {number} storyManualRestTimeInHours - The time left in hours, entered for Manual Input.
 * @property {difficulty} storyLiveDifficulty - The difficulty lives are played on.
 * @property {rank} storyLiveScore - Which score rank the player clears lives with.
 * @property {number} storyUnitBonusPct - Event point bonus gained through bonus units, in percent
 * @property {number} storyTargetEventPoints - The desired final amount of event points.
 * @property {number} storyCurrentEventPoints - The current amount of event points.
 * @property {number} storyCurrentRank - The player's current rank.
 * @property {number} storyCurrentLP - The player's current LP.
 * @property {number} storyCurrentEXP - The player's current EXP in the current rank.
 * @constructor
 */
function StoryData() {
    this.storyTimerMethodAuto = false;
    this.storyTimerMethodManual = false;
    this.storyManualRestTimeInHours = 0;
    this.storyLiveDifficulty = "EASY";
    this.storyLiveScore = "D";
    this.storyUnitBonusPct = 0;
    this.storyTargetEventPoints = 0;
    this.storyCurrentEventPoints = 0;
    this.storyCurrentRank = 0;
    this.storyCurrentLP = 0;
    this.storyCurrentEXP = 0;
}

/**
 * An object used to store information about the cost and rewards of a single live.
 * @class StoryLiveInfo
 * @property {number} lp - LP cost for one live.
 * @property {number} point - Event point reward for one live.
 * @property {number} exp - EXP reward for one live.
 * @constructor
 */
function StoryLiveInfo(lp, point, exp) {
    this.lp = lp;
    this.point = point;
    this.exp = exp;
}

/**
 * A class serving static calculation methods handling StoryData objects.
 * @class StoryEstimator
 * @constructor
 */
function StoryEstimator() {
}

/**
 * An object storing the total amount of live plays, rewards and cost.
 * @class StoryLiveCount
 * @property {number} liveCount - How many lives are played.
 * @property {number} exp - Total EXP reward of lives.
 * @property {number} lp - Total LP cost of normal lives.
 * @constructor
 */
function StoryLiveCount(liveCount, exp, lp) {
    this.liveCount = liveCount;
    this.exp = exp;
    this.lp = lp;
}

/**
 * An object storing the result of the calculation for StoryData objects.
 * @class StoryEstimationInfo
 * @property {StoryLiveCount} liveCount - Amount of lives to play and total rewards.
 * @property {LpRecoveryInfo} lpRecoveryInfo - Loveca use and rank ups.
 * @property {number} restTime - Event time left, in minutes.
 * @property {number} skipTickets - The amount of skip tickets to use.
 * @constructor
 */
function StoryEstimationInfo(liveCount, restTime, skippedLives, skippedLiveTickets) {
    this.liveCount = liveCount;
    this.lpRecoveryInfo = null;
    this.restTime = restTime;
    this.skippedLives = skippedLives;
    this.skippedLiveTickets = skippedLiveTickets;
}

/**
 * Read input values from the UI.
 */
StoryData.prototype.readFromUi = function () {
    this.storyTimerMethodAuto = $("#storyTimerMethodAuto").prop("checked");
    this.storyTimerMethodManual = $("#storyTimerMethodManual").prop("checked");
    this.storyManualRestTimeInHours = ReadHelpers.toNum($("#storyManualRestTime").val());
    this.storyLiveDifficulty = $("input:radio[name=storyLiveDifficulty]:checked").val();
    this.storyLiveScore = $("input:radio[name=storyLiveScore]:checked").val();
    this.storyUnitBonusPct = ReadHelpers.toNum($("#storyUnitBonusPct").val(), 0);
    this.storyTargetEventPoints = ReadHelpers.toNum($("#storyTargetEventPoints").val());
    this.storyCurrentEventPoints = ReadHelpers.toNum($("#storyCurrentEventPoints").val());
    this.storyCurrentRank = ReadHelpers.toNum($("#storyCurrentRank").val());
    this.storyCurrentLP = ReadHelpers.toNum($("#storyCurrentLP").val(), 0);
    this.storyCurrentEXP = ReadHelpers.toNum($("#storyCurrentEXP").val(), 0);
};

/**
 * Set saved values to UI.
 * @param {StoryData} savedData The saved data to recall values from.
 */
StoryData.setToUi = function (savedData) {
    SetHelpers.checkBoxHelper($("#storyTimerMethodAuto"), savedData.storyTimerMethodAuto);
    var manualButton = $("#storyTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.storyTimerMethodManual);
    if (savedData.storyTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#storyManualRestTime"), savedData.storyManualRestTimeInHours);
    SetHelpers.radioButtonHelper($("input:radio[name=storyLiveDifficulty]"), savedData.storyLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=storyLiveScore]"), savedData.storyLiveScore);
    SetHelpers.inputHelper($("#storyUnitBonusPct"), savedData.storyUnitBonusPct);
    SetHelpers.inputHelper($("#storyTargetEventPoints"), savedData.storyTargetEventPoints);
    SetHelpers.inputHelper($("#storyCurrentEventPoints"), savedData.storyCurrentEventPoints);
    SetHelpers.inputHelper($("#storyCurrentRank"), savedData.storyCurrentRank);
    SetHelpers.inputHelper($("#storyCurrentLP"), savedData.storyCurrentLP);
    SetHelpers.inputHelper($("#storyCurrentEXP"), savedData.storyCurrentEXP);
    if (savedData.storyCurrentLP > 0 || savedData.storyCurrentEXP > 0) {
        $("#storyCurrentExtra").collapsible('open', 0);
    }
};

// noinspection JSUnusedGlobalSymbols
/**
 * Debug method, used to show a dialog with all input values.
 */
StoryData.prototype.alert = function () {
    alert("storyTimerMethodAuto: " + this.storyTimerMethodAuto + "\n" +
          "storyTimerMethodManual: " + this.storyTimerMethodManual + "\n" +
          "storyManualRestTimeInHours: " + this.storyManualRestTimeInHours + "\n" +
          "storyLiveDifficulty: " + this.storyLiveDifficulty + "\n" +
          "storyLiveScore: " + this.storyLiveScore + "\n" +
          "storyTargetEventPoints: " + this.storyTargetEventPoints + "\n" +
          "storyCurrentRank: " + this.storyCurrentRank + "\n" +
          "storyCurrentEventPoints: " + this.storyCurrentEventPoints + "\n" +
          "storyCurrentLP: " + this.storyCurrentLP + "\n" +
          "storyCurrentEXP: " + this.storyCurrentEXP);
};

/**
 * Gets event time left, depending on the chosen timer.
 * @returns {number} Event time left in minutes.
 */
StoryData.prototype.getRestTimeInMinutes = function () {
    if (this.storyTimerMethodAuto) {
        return Common.getAutoRestTimeInMinutes();
    }
    if (this.storyTimerMethodManual) {
        return 60 * this.storyManualRestTimeInHours;
    }
    return 0;
};

/**
 * Returns the amount of event points left to meet the target.
 * @returns {number} Difference between the current event points and the given target.
 */
StoryData.prototype.getEventPointsLeft = function () {
    return this.storyTargetEventPoints - this.storyCurrentEventPoints;
};

/**
 * Get an index associated with the inputted live difficulty for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link COMMON_DIFFICULTY_IDS}.ERROR if the input is invalid.
 */
StoryData.prototype.getLiveDifficulty = function () {
    var diffId = COMMON_DIFFICULTY_IDS[this.storyLiveDifficulty];
    if (undefined !== diffId) return diffId;
    return COMMON_DIFFICULTY_IDS.ERROR;
};

/**
 * Get an index associated with the inputted live score rank for lookup in the cost/reward arrays.
 * @returns {number} An index for array lookup, or {@link STORY_RANK}.ERROR if the input is invalid.
 */
StoryData.prototype.getLiveScore = function () {
    var rankId = STORY_RANK[this.storyLiveScore];
    if (undefined !== rankId) return rankId;
    return STORY_RANK.ERROR;
};

/**
 * Returns the factor representing the gain from bonus units in a live team.
 * @returns {number} A factor to multiply event point rewards with.
 */
StoryData.prototype.getLiveBonusFactor = function () {
    return 1 + (this.storyUnitBonusPct / 100.0);
};

/**
 * Creates a {@link StoryLiveInfo} object using the live input values, representing one play.
 * @returns {?StoryLiveInfo} A new object with all properties set, or null if the any live inputs are invalid.
 */
StoryData.prototype.createLiveInfo = function () {
    var diffId = this.getLiveDifficulty(),
        rankId = this.getLiveScore(),
        bonusFactor = this.getLiveBonusFactor();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || rankId == STORY_RANK.ERROR) {
        return null;
    }

    var lpCost = COMMON_LP_COST[diffId],
        expReward = COMMON_EXP_REWARD[diffId],
        pointReward = STORY_EVENT_POINTS[diffId][rankId] * bonusFactor;
    if (undefined === pointReward) return null;
    return new StoryLiveInfo(lpCost, pointReward, expReward);
};

/**
 * Calculates the amount of lives required to meet the point target.
 * @param {StoryLiveInfo} liveInfo Cost and reward info about one live play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @returns {StoryLiveCount} A new object with properties set.
 */
StoryEstimator.calculateLiveCount = function (liveInfo, eventPointsLeft) {
    var liveCount = Math.ceil(eventPointsLeft / (liveInfo.point));
    return new StoryLiveCount(liveCount, liveCount * liveInfo.exp, liveCount * liveInfo.lp);
};

/**
 * Call {@link StoryEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link StoryData.validate}.
 * @returns {StoryEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
StoryData.prototype.estimate = function () {
    return StoryEstimator.estimate(this.createLiveInfo(), this.getEventPointsLeft(), this.getRestTimeInMinutes(),
        this.storyCurrentRank, this.storyCurrentEXP, this.storyCurrentLP);
};

/**
 * Start calculation for a Story Event. A rough summary of the estimation method follows:
 * <ul><li>1) Calculate amount of lives to play to reach the point goal.
 *      See {@link StoryEstimator.calculateLiveCount}</li>
 * <li>2) Subtract LP regeneration from the total LP cost, then divide the leftover by max LP to get the amount of
 *      required loveca. See {@link Common.calculateLpRecoveryInfo}</li></ul>
 * @param {StoryLiveInfo} liveInfo Cost and reward info about one live play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} timeLeft The amount of event time left, in minutes.
 * @param {number} playerRank The player's initial rank.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} playerLp The player's initial LP.
 * @returns {StoryEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
StoryEstimator.estimate = function (liveInfo, eventPointsLeft, timeLeft, playerRank, playerExp, playerLp) {
    var liveCount = this.calculateLiveCount(liveInfo, eventPointsLeft);
    var avgMaxLp = Common.calculateAverageLovecaLpRecovery(playerRank, liveCount.exp);
    var estimation = new StoryEstimationInfo(liveCount, timeLeft, 0,
        Math.floor(avgMaxLp / liveInfo.lp));
    if (estimation.getPlayTime() > timeLeft) {
        // check whether we can use skip tickets to meet the target

        var maxSkippedLivesNeeded = Math.ceil(liveCount.liveCount / estimation.skippedLiveTickets);
        if (maxSkippedLivesNeeded * COMMON_SKIP_LIVE_TIME_IN_MINUTES > timeLeft) {
            // even with skipped lives, the goal is not possible
            return estimation;
        }

        var playTimeOverflow = estimation.getPlayTime() - timeLeft;
        var timeSavedPerSkippedLive = COMMON_LIVE_TIME_IN_MINUTES * estimation.skippedLiveTickets -
                                      COMMON_SKIP_LIVE_TIME_IN_MINUTES;
        estimation.skippedLives = Math.ceil(playTimeOverflow / timeSavedPerSkippedLive);
    }
    estimation.lpRecoveryInfo =
        Common.calculateLpRecoveryInfo(playerRank, liveCount.exp, playerExp, liveCount.lp, playerLp, timeLeft);
    return estimation;
};

/**
 * Returns the total time spent playing lives required to meet the target.
 * @returns {number} The amount of play time, in minutes.
 */
StoryEstimationInfo.prototype.getPlayTime = function () {
    return this.liveCount.liveCount * COMMON_LIVE_TIME_IN_MINUTES - this.skippedLives * (this.skippedLiveTickets *
           COMMON_LIVE_TIME_IN_MINUTES - COMMON_SKIP_LIVE_TIME_IN_MINUTES);
};

/**
 * Returns what percentage of event time left needs to be spent playing lives.
 * @returns {number} The required play time divided by the event time left.
 */
StoryEstimationInfo.prototype.getPlayTimeRate = function () {
    return this.getPlayTime() / this.restTime;
};

/**
 * Displays the calculation results on the UI.
 */
StoryEstimationInfo.prototype.showResult = function () {
    Results.setBigResult($("#storyResultLiveCount"), this.liveCount.liveCount);
    $("#storyResultPlayTime").text(Common.minutesToString(this.getPlayTime()));
    $("#storyResultPlayTimeRate").text((100 * this.getPlayTimeRate()).toFixed(2) + "%");
    var highlightSkippedLives = false;
    var showSleepWarning = false;

    if (this.lpRecoveryInfo !== null) {
        Results.setBigResult($("#storyResultLoveca"), this.lpRecoveryInfo.lovecaUses);
        if (this.skippedLives === 0) {
            $("#storyResultSkippedLivesText").text("0");
        } else {
            $("#storyResultSkippedLivesText").text(this.skippedLives + " (" + this.skippedLiveTickets +
                                                   " tickets per live)");
            highlightSkippedLives = true;
        }
        showSleepWarning = this.lpRecoveryInfo.sleepWarning;
        $("#storyResultFinalRank").text(this.lpRecoveryInfo.finalRank + " (" +
                                        (this.lpRecoveryInfo.finalRank === COMMON_RANK_UP_EXP.length
                                            ? "MAX"
                                            : this.lpRecoveryInfo.finalRankExp + "/" +
                                        Common.getNextRankUpExp(this.lpRecoveryInfo.finalRank)
                                        + " EXP") + ")");
        $("#storyResultLiveCandy50").text(this.lpRecoveryInfo.lovecaUses / 5);
        $("#storyResultLiveCandy100").text(this.lpRecoveryInfo.lovecaUses / 10);
    } else {
        Results.setBigResult($("#storyResultLoveca"), "---");
        $("#storyResultSkippedLivesText").text("---");
        $("#storySleepWarning").hide(0);
        $("#storyResultFinalRank").text("---");
        $("#storyResultLiveCandy50").text("---");
        $("#storyResultLiveCandy100").text("---");
    }

    Results.show($("#storyResult"), highlightSkippedLives, showSleepWarning);
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
StoryData.prototype.validate = function () {
    var errors = [];

    if (null === this.createLiveInfo()) {
        errors.push("Live parameters have not been set");
    }

    if (0 >= this.storyTargetEventPoints) {
        errors.push("Enter event point target");
    } else if (this.getEventPointsLeft() <= 0) {
        errors.push("The given event point target has been reached! " +
                    "Please change the event point target in order to calculate again");
    }

    if (0 > this.storyCurrentEventPoints) {
        errors.push("Enter current amount of event points");
    }

    if (0 >= this.storyCurrentRank) {
        errors.push("Enter current rank");
    }

    if (0 > this.storyCurrentLP) {
        errors.push("Enter a valid amount for current LP in the Optional Fields dropdown (or leave it empty)");
    }

    if (0 > this.storyCurrentEXP) {
        errors.push("Enter a valid amount for current EXP in the Optional Fields dropdown (or leave it empty)");
    }

    if (this.storyTimerMethodAuto && this.storyTimerMethodManual) {
        errors.push("Both Automatic Timer and Manual Input method are selected. Please unselect one of them");
    } else if (this.storyTimerMethodAuto) {
        if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Event is already finished. Select Manual Input in order to calculate");
        }
    } else if (this.storyTimerMethodManual) {
        if (isNaN(this.getRestTimeInMinutes())) {
            errors.push("Manual Input only accepts integers")
        } else if (this.getRestTimeInMinutes() <= 0) {
            errors.push("Enter a valid remaining time");
        }
    } else {
        errors.push("Select Automatic Timer or Manual Input");
    }

    return errors;
};

/**
 * IDs for the score rank inputs on the UI.
 * @constant
 * @type {Object.<string, number>}
 */
var STORY_RANK = {
    "D": 0,
    "C": 1,
    "B": 2,
    "A": 3,
    "S": 4,
    "ERROR": 5
};

/**
 * Event point rewards tables for lives on Easy difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var STORY_EVENT_POINT_TABLE_EASY = [270, 285, 300, 315, 330];

/**
 * Event point rewards tables for lives on Normal difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var STORY_EVENT_POINT_TABLE_NORMAL = [337, 356, 375, 412, 450];

/**
 * Event point rewards tables for lives on Hard difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var STORY_EVENT_POINT_TABLE_HARD = [405, 427, 450, 517, 585];

/**
 * Array saving references to all point tables, for access using the difficulty ID from COMMON_DIFFICULTY_IDS.
 * @constant
 * @type {number[][]}
 */
var STORY_EVENT_POINTS = [];
STORY_EVENT_POINTS[COMMON_DIFFICULTY_IDS.EASY] = STORY_EVENT_POINT_TABLE_EASY;
STORY_EVENT_POINTS[COMMON_DIFFICULTY_IDS.NORMAL] = STORY_EVENT_POINT_TABLE_NORMAL;
STORY_EVENT_POINTS[COMMON_DIFFICULTY_IDS.HARD] = STORY_EVENT_POINT_TABLE_HARD;