/**
 * @file Story Event calculator.
 */

/**
 * An object used to store input values for the Story Event calculator.
 * @class StoryData
 * @property {boolean} storyTimerMethodAuto - Whether Automatic Timer is selected on the UI.
 * @property {region} storyRegion - Which server to use for the Automatic Timer, LP maximum and event point tables.
 * @property {boolean} storyTimerMethodManual - Whether Manual Input is selected on the UI.
 * @property {number} storyManualRestTimeInHours - The time left in hours, entered for Manual Input.
 * @property {number} storyMinimumSleepHours - How many hours to sleep, to calculate wasted LP regeneration.
 * @property {difficulty} storyLiveDifficulty - The difficulty lives are played on.
 * @property {rank} storyLiveScore - Which score rank the player clears lives with.
 * @property {number} storyUnitBonusPct - Event point bonus gained through bonus units, in percent
 * @property {number} storyBoostersStock - Amount of Booster Items available for use before daily missions.
 * @property {boolean} storyBoostersDaily - Whether to use Booster Items from daily missions.
 * @property {boolean} storyPassRefill - Whether to use the daily full refill from the Sukusuta Pass subscription.
 * @property {number} storyTargetEventPoints - The desired final amount of event points.
 * @property {number} storyCurrentEventPoints - The current amount of event points.
 * @property {number} storyCurrentRank - The player's current rank.
 * @property {number} storyCurrentLP - The player's current LP.
 * @property {number} storyCurrentEXP - The player's current EXP in the current rank.
 * @constructor
 */
function StoryData() {
    this.storyTimerMethodAuto = false;
    this.storyRegion = "en";
    this.storyTimerMethodManual = false;
    this.storyManualRestTimeInHours = 0;
    this.storyMinimumSleepHours = 8;
    this.storyLiveDifficulty = "EASY";
    this.storyLiveScore = "D";
    this.storyUnitBonusPct = 0;
    this.storyBoostersStock = 0;
    this.storyBoostersDaily = false;
    this.storyPassRefill = false;
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
 * @property {number} base - Base event point reward for one live.
 * @property {number} point - Event point reward (unit bonus added) for one live.
 * @property {number} exp - EXP reward for one live.
 * @constructor
 */
function StoryLiveInfo(lp, base, point, exp) {
    this.lp = lp;
    this.base = base;
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
 * @property {number} boostedLives - How many lives are played with Booster Items.
 * @property {number} exp - Total EXP reward of lives.
 * @property {number} lp - Total LP cost of normal lives.
 * @constructor
 */
function StoryLiveCount() {
    this.liveCount = 0;
    this.boostedLives = 0;
    this.exp = 0;
    this.lp = 0;
}

/**
 * An object storing the result of the calculation for StoryData objects.
 * @class StoryEstimationInfo
 * @property {StoryLiveCount} liveCount - Amount of lives to play and total rewards.
 * @property {LpRecoveryInfo} lpRecoveryInfo - Loveca use and rank ups.
 * @property {number} restTime - Event time left, in minutes.
 * @property {number} skipTickets - The amount of skip tickets to use.
 * @property {number} regenTimeLostToSleepInMinutes - LP regeneration time lost to sleep
 * @constructor
 */
function StoryEstimationInfo(liveCount, restTime, skippedLives, skippedLiveTickets, regenTimeLostToSleepInMinutes) {
    this.liveCount = liveCount;
    this.lpRecoveryInfo = null;
    this.restTime = restTime;
    this.skippedLives = skippedLives;
    this.skippedLiveTickets = skippedLiveTickets;
    this.regenTimeLostToSleepInMinutes = regenTimeLostToSleepInMinutes;
}

/**
 * Read input values from the UI.
 */
StoryData.prototype.readFromUi = function () {
    this.storyTimerMethodAuto = $("#storyTimerMethodAuto").prop("checked");
    this.storyRegion = $("input:radio[name=storyRegion]:checked").val();
    this.storyTimerMethodManual = $("#storyTimerMethodManual").prop("checked");
    this.storyManualRestTimeInHours = ReadHelpers.toNum($("#storyManualRestTime").val());
    this.storyMinimumSleepHours = ReadHelpers.toNum($("#storyMinimumSleepHours").val(), 8);
    this.storyLiveDifficulty = $("input:radio[name=storyLiveDifficulty]:checked").val();
    this.storyLiveScore = $("input:radio[name=storyLiveScore]:checked").val();
    this.storyUnitBonusPct = ReadHelpers.toNum($("#storyUnitBonusPct").val(), 0);
    this.storyBoostersStock = ReadHelpers.toNum($("#storyBoostersStock").val(), 0);
    this.storyBoostersDaily = $("#storyBoostersDailyOn").prop("checked");
    this.storyPassRefill = $("#storyPassRefillOn").prop("checked");
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
    SetHelpers.radioButtonHelper($("input:radio[name=storyRegion]"), savedData.storyRegion);
    if (savedData.storyRegion !== undefined) {
        updateTimerSection("story");
    }
    var manualButton = $("#storyTimerMethodManual");
    SetHelpers.checkBoxHelper(manualButton, savedData.storyTimerMethodManual);
    if (savedData.storyTimerMethodManual) {
        manualButton.click();
    }
    SetHelpers.inputHelper($("#storyManualRestTime"), savedData.storyManualRestTimeInHours);
    SetHelpers.inputHelper($("#storyMinimumSleepHours"), savedData.storyMinimumSleepHours);
    SetHelpers.radioButtonHelper($("input:radio[name=storyLiveDifficulty]"), savedData.storyLiveDifficulty);
    SetHelpers.radioButtonHelper($("input:radio[name=storyLiveScore]"), savedData.storyLiveScore);
    SetHelpers.inputHelper($("#storyUnitBonusPct"), savedData.storyUnitBonusPct);
    SetHelpers.inputHelper($("#storyBoostersStock"), savedData.storyBoostersStock);
    SetHelpers.radioButtonHelper($("input:radio[name=storyBoostersDaily]"), savedData.storyBoostersDaily ? "Y" : "N");
    SetHelpers.radioButtonHelper($("input:radio[name=storyPassRefill]"), savedData.storyPassRefill ? "Y" : "N");
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
        "storyRegion: " + this.storyRegion + "\n" +
        "storyTimerMethodManual: " + this.storyTimerMethodManual + "\n" +
        "storyManualRestTimeInHours: " + this.storyManualRestTimeInHours + "\n" +
        "storyMinimumSleepHours: " + this.storyMinimumSleepHours + "\n" +
        "storyLiveDifficulty: " + this.storyLiveDifficulty + "\n" +
        "storyLiveScore: " + this.storyLiveScore + "\n" +
        "storyUnitBonusPct: " + this.storyUnitBonusPct + "\n" +
        "storyBoostersStock: " + this.storyBoostersStock + "\n" +
        "storyBoostersDaily: " + this.storyBoostersDaily + "\n" +
        "storyPassRefill: " + this.storyPassRefill + "\n" +
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
        return Common.getAutoRestTimeInMinutes(this.storyRegion);
    }
    if (this.storyTimerMethodManual) {
        return 60 * this.storyManualRestTimeInHours;
    }
    return 0;
};

/**
 * @returns {number} The amount of daily resets left until the event ends.
 */
StoryData.prototype.getResetsLeft = function () {
    if (this.storyTimerMethodAuto) {
        return Common.getAutoResetsLeftInEvent(this.storyRegion);
    }
    if (this.storyTimerMethodManual) {
        return Math.floor(this.storyManualRestTimeInHours / 24);
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
    if (this.storyUnitBonusPct < 0) return 0;
    return 1 + (this.storyUnitBonusPct / 100.0);
};

/**
 * @returns {number} The amount of Booster Items gained from daily missions.
 */
StoryData.prototype.getDailyMissionBoosterCount = function () {
    if (!this.storyBoostersDaily) {
        return 0;
    }
    return this.getResetsLeft() * COMMON_BOOSTER_ITEM_DAILY_MISSION_REWARD;
};

/**
 * @returns {number} The amount of uses of full refills from the Sukusuta Pass subscription.
 */
StoryData.prototype.getPassRefillCount = function () {
    if (!this.storyPassRefill) {
        return 0;
    }
    return this.getResetsLeft();
};

/**
 * Creates a {@link StoryLiveInfo} object using the live input values, representing one play.
 * @returns {?StoryLiveInfo} A new object with all properties set, or null if the any live inputs are invalid.
 */
StoryData.prototype.createLiveInfo = function () {
    var diffId = this.getLiveDifficulty(),
        rankId = this.getLiveScore(),
        bonusFactor = this.getLiveBonusFactor();
    if (diffId == COMMON_DIFFICULTY_IDS.ERROR || rankId == STORY_RANK.ERROR || bonusFactor === 0) {
        return null;
    }

    var lpCost = COMMON_LP_COST[diffId],
        expReward = COMMON_EXP_REWARD[diffId],
        baseEP = STORY_EVENT_POINTS[diffId][rankId],
        pointReward = Math.ceil(baseEP * bonusFactor);
    if (undefined === pointReward) return null;
    return new StoryLiveInfo(lpCost, baseEP, pointReward, expReward);
};

/**
 * Calculates the amount of lives required to meet the point target.
 * @param {StoryLiveInfo} liveInfo Cost and reward info about one live play.
 * @param {number} eventPointsLeft The amount of event points left to meet the target.
 * @param {number} stockBoosterCount Amount of Booster Items available before daily missions.
 * @param {number} dailyBoosterCount Amount of Booster Items gained from daily missions to use.
 * @returns {StoryLiveCount} A new object with properties set.
 */
StoryEstimator.calculateLiveCount = function (liveInfo, eventPointsLeft, stockBoosterCount, dailyBoosterCount) {
    var liveCount = new StoryLiveCount();

    if (stockBoosterCount > 0) {
        // Use boosters from stock first
        var totalBoostedEventPoints = stockBoosterCount * (liveInfo.point + liveInfo.base * COMMON_BOOSTER_ITEM_BOOST_FACTOR);
        if (eventPointsLeft < totalBoostedEventPoints) {
            // We have more boosters than needed
            liveCount.liveCount = liveCount.boostedLives = Math.ceil(eventPointsLeft / (liveInfo.point + liveInfo.base * COMMON_BOOSTER_ITEM_BOOST_FACTOR));
            eventPointsLeft = 0;
        } else {
            liveCount.liveCount = liveCount.boostedLives = stockBoosterCount;
            eventPointsLeft -= totalBoostedEventPoints;
        }
    }

    if (eventPointsLeft > 0) {
        if (dailyBoosterCount > 0) {
            // If we want to use daily mission boosters, we must have at least five lives played before we can
            // Past those first five, we are guaranteed to have at least five boosters to clear the next daily mission
            if (liveCount.liveCount < 5) {
                var livesToPlayUntilDailyBoosters = 5 - liveCount.liveCount;
                liveCount.liveCount = 5;
                eventPointsLeft -= liveInfo.point * livesToPlayUntilDailyBoosters;
            }

            if (eventPointsLeft > 0) {
                totalBoostedEventPoints = dailyBoosterCount * (liveInfo.point + liveInfo.base * COMMON_BOOSTER_ITEM_BOOST_FACTOR);
                if (eventPointsLeft < totalBoostedEventPoints) {
                    // We have more boosters than needed
                    var boostedLivesPlayed = Math.ceil(eventPointsLeft / (liveInfo.point + liveInfo.base * COMMON_BOOSTER_ITEM_BOOST_FACTOR));
                    liveCount.liveCount += boostedLivesPlayed;
                    liveCount.boostedLives += boostedLivesPlayed;
                    eventPointsLeft = 0;
                } else {
                    liveCount.liveCount += dailyBoosterCount;
                    liveCount.boostedLives += dailyBoosterCount;
                    eventPointsLeft -= totalBoostedEventPoints;
                }
            }
        }

        if (eventPointsLeft > 0) {
            // All boosters gone, the event points left at this point need to be collected with unboosted lives
            liveCount.liveCount += Math.ceil(eventPointsLeft / liveInfo.point);
        }
    }

    liveCount.lp = liveCount.liveCount * liveInfo.lp;
    liveCount.exp = liveCount.liveCount * liveInfo.exp;
    return liveCount;
}
;

/**
 * Call {@link StoryEstimator.estimate} to begin calculations. It is assumed the input has been validated before
 * calling this function using {@link StoryData.validate}.
 * @returns {StoryEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
StoryData.prototype.estimate = function () {
    return StoryEstimator.estimate(this.createLiveInfo(), this.getEventPointsLeft(), this.getRestTimeInMinutes(),
        this.storyMinimumSleepHours, this.storyCurrentRank, this.storyCurrentEXP, this.storyCurrentLP,
        this.storyBoostersStock, this.getDailyMissionBoosterCount(), this.storyRegion, this.getPassRefillCount());
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
 * @param {number} minimumSleepHours How many hours to sleep, to calculate wasted LP regeneration.
 * @param {number} playerRank The player's initial rank.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} playerLp The player's initial LP.
 * @param {number} stockBoosterCount Amount of Booster Items available before daily missions.
 * @param {number} dailyBoosterCount Amount of Booster Items gained from daily missions to use.
 * @param {region} region The region to use for the max LP calculation.
 * @param {number} passRefillUses Amount of uses of full refills from the Sukusuta Pass subscription.
 * @returns {StoryEstimationInfo} A new object with all properties set, or the recoveryInfo property set to null if
 *      reaching the target is impossible.
 */
StoryEstimator.estimate =
    function (liveInfo, eventPointsLeft, timeLeft, minimumSleepHours, playerRank, playerExp, playerLp, stockBoosterCount, dailyBoosterCount, region, passRefillUses) {
        var liveCount = this.calculateLiveCount(liveInfo, eventPointsLeft, stockBoosterCount, dailyBoosterCount);
        var avgMaxLp = Common.calculateAverageLovecaLpRecovery(playerRank, liveCount.exp, region);

        var regenTimeLostToSleep = 0;
        var playTimeLostToSleep = 0;
        if (minimumSleepHours > 0) {
            var lpRegenTimeLostPerSleep = minimumSleepHours * 60 - avgMaxLp * COMMON_LP_RECOVERY_TIME_IN_MINUTES;
            var nightsLeft = Math.floor(timeLeft / (24 * 60));
            if (lpRegenTimeLostPerSleep > 0) {
                regenTimeLostToSleep = lpRegenTimeLostPerSleep * nightsLeft;
            }
            playTimeLostToSleep = minimumSleepHours * 60 * nightsLeft;
        }

        var estimation = new StoryEstimationInfo(liveCount, timeLeft, 0,
            Math.min(5, Math.floor(avgMaxLp / liveInfo.lp)), regenTimeLostToSleep);
        if (estimation.getPlayTime() > timeLeft - playTimeLostToSleep) {
            // check whether we can use skip tickets to meet the target

            var maxSkippedLivesNeeded = Math.ceil(liveCount.liveCount / estimation.skippedLiveTickets);
            if (maxSkippedLivesNeeded * COMMON_SKIP_LIVE_TIME_IN_MINUTES > timeLeft - playTimeLostToSleep) {
                // even with skipped lives, the goal is not possible
                return estimation;
            }

            var playTimeOverflow = estimation.getPlayTime() - (timeLeft - playTimeLostToSleep);
            var timeSavedPerSkippedLive = COMMON_LIVE_TIME_IN_MINUTES * estimation.skippedLiveTickets -
                COMMON_SKIP_LIVE_TIME_IN_MINUTES;
            estimation.skippedLives = Math.ceil(playTimeOverflow / timeSavedPerSkippedLive);
        }

        estimation.lpRecoveryInfo =
            Common.calculateLpRecoveryInfo(playerRank, liveCount.exp, playerExp, liveCount.lp, playerLp,
                timeLeft, regenTimeLostToSleep, region);
        if (minimumSleepHours * 60 >= COMMON_SLEEP_WARNING_TIME_IN_MINUTES) {
            estimation.lpRecoveryInfo.sleepWarning = false;
        }
        estimation.lpRecoveryInfo.refills = Math.max(0, estimation.lpRecoveryInfo.refills - passRefillUses);
        estimation.lpRecoveryInfo.lpToRecover = Math.max(0,
            estimation.lpRecoveryInfo.lpToRecover - passRefillUses * estimation.lpRecoveryInfo.lovecaLpRecovery);

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
    $("#storyResultRegenTimeLost").text(Math.floor(this.regenTimeLostToSleepInMinutes / COMMON_LP_RECOVERY_TIME_IN_MINUTES) +
        " LP" + (this.regenTimeLostToSleepInMinutes === 0 ? "" : " (" + Common.minutesToString(this.regenTimeLostToSleepInMinutes) + ")"));
    $("#storyResultPlayTime").text(Common.minutesToString(this.getPlayTime()));
    $("#storyResultPlayTimeRate").text((100 * this.getPlayTimeRate()).toFixed(2) + "%");
    var highlightSkippedLives = false;
    var showSleepWarning = false;

    if (this.lpRecoveryInfo !== null) {
        Results.setBigResult($("#storyResultRefills"), this.lpRecoveryInfo.refills);
        if (this.skippedLives === 0) {
            $("#storyResultSkippedLivesText").text("0");
        } else {
            $("#storyResultSkippedLivesText").text(this.skippedLives + " (" + this.skippedLiveTickets +
                " tickets per live)");
            highlightSkippedLives = true;
        }
        $("#storyResultBoostedLives").text(this.liveCount.boostedLives);
        showSleepWarning = this.lpRecoveryInfo.sleepWarning;
        $("#storyResultFinalRank").text(this.lpRecoveryInfo.finalRank + " (" +
            (this.lpRecoveryInfo.finalRank >= COMMON_RANK_UP_EXP.length
                ? "MAX"
                : this.lpRecoveryInfo.finalRankExp + "/" +
                Common.getNextRankUpExp(this.lpRecoveryInfo.finalRank)
                + " EXP") + ")");
        $("#storyResultLoveca").text(Math.ceil(this.lpRecoveryInfo.lpToRecover / 100) * 10);
        $("#storyResultLiveCandy50").text(Math.ceil(this.lpRecoveryInfo.lpToRecover / 50));
        $("#storyResultLiveCandy100").text(Math.ceil(this.lpRecoveryInfo.lpToRecover / 100));
    } else {
        Results.setBigResult($("#storyResultRefills"), "---");
        $("#storyResultSkippedLivesText").text("---");
        $("#storyResultBoostedLives").text("---");
        $("#storySleepWarning").hide(0);
        $("#storyResultFinalRank").text("---");
        $("#storyResultLoveca").text("---");
        $("#storyResultLiveCandy50").text("---");
        $("#storyResultLiveCandy100").text("---");
    }

    Results.show($("#storyResult"), highlightSkippedLives, showSleepWarning, this.lpRecoveryInfo.region === "en");
};

/**
 * Validates input and returns errors if there are any.
 * @returns {string[]} Array of errors as human readable strings, empty if the input is valid.
 */
StoryData.prototype.validate = function () {
    var errors = [];

    if (this.storyRegion != "en" && this.storyRegion != "jp") {
        errors.push("Choose a region");
        return errors;
    }

    var liveInfo = this.createLiveInfo();
    if (null === liveInfo) {
        errors.push("Live parameters have not been set");
    } else if (liveInfo.lp > Common.getMaxLp(this.storyCurrentRank, this.storyRegion)) {
        errors.push("The chosen live parameters result in an LP cost (" + liveInfo.lp +
            ") that's higher than your max LP (" + Common.getMaxLp(this.storyCurrentRank, this.storyRegion) + ")");
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

    if (0 > this.storyMinimumSleepHours) {
        errors.push("Enter a valid amount for minimum hours to sleep (cannot be negative)");
    } else if (this.storyMinimumSleepHours >= 24) {
        errors.push("Enter a valid amount for minimum hours to sleep (cannot sleep for 24 hours or more)");
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
var STORY_EVENT_POINT_TABLE_EASY = [225, 237, 250, 262, 275];

/**
 * Event point rewards tables for lives on Normal difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var STORY_EVENT_POINT_TABLE_NORMAL = [345, 360, 375, 390, 405];

/**
 * Event point rewards tables for lives on Hard difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var STORY_EVENT_POINT_TABLE_HARD = [525, 543, 562, 581, 600];

/**
 * Event point rewards tables for lives on Hard+ difficulty - index is rank.
 * @constant
 * @type {number[]}
 */
var STORY_EVENT_POINT_TABLE_HARD_PLUS = [815, 830, 845, 860, 875];

/**
 * Array saving references to all point tables, for access using the difficulty ID from COMMON_DIFFICULTY_IDS.
 * @constant
 * @type {number[][]}
 */
var STORY_EVENT_POINTS = [];
STORY_EVENT_POINTS[COMMON_DIFFICULTY_IDS.EASY] = STORY_EVENT_POINT_TABLE_EASY;
STORY_EVENT_POINTS[COMMON_DIFFICULTY_IDS.NORMAL] = STORY_EVENT_POINT_TABLE_NORMAL;
STORY_EVENT_POINTS[COMMON_DIFFICULTY_IDS.HARD] = STORY_EVENT_POINT_TABLE_HARD;
STORY_EVENT_POINTS[COMMON_DIFFICULTY_IDS.HARD_PLUS] = STORY_EVENT_POINT_TABLE_HARD_PLUS;