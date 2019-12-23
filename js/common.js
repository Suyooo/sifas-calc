/**
 * @file Functions and types used across all calculators, such as event timers, display functions and LP recovery.
 */

/**
 * A class serving static methods used across all calculators, such as event timers, display functions and LP recovery.
 * @class Common
 * @constructor
 */
function Common() {

}

/**
 * An object used to store information about rank ups and loveca use during calculation.
 * @class LpRecoveryInfo
 * @property {number} totalRankUpLpRecovery - Total LP gained through rank ups.
 * @property {number} lpToRecover - LP required to recover in order to reach the target.
 * @property {number} rankUpCount - How often the player will rank up before they reach the target.
 * @property {number} lovecaLpRecovery - Average LP gained when using a loveca.
 * @property {number} lovecaUses - Total amount of loveca used.
 * @property {number} finalRank - The player's final rank after reaching the target.
 * @property {number} finalRankExp - The player's final EXP in the final rank after reaching the target.
 * @property {boolean} sleepWarning - Whether to display a warning about having to interrupt sleep.
 * @param {number} initialRank The player's initial rank.
 * @constructor
 */
function LpRecoveryInfo(initialRank) {
    this.totalRankUpLpRecovery = 0;
    this.lpToRecover = 0;
    this.rankUpCount = 0;
    this.lovecaLpRecovery = 0;
    this.refills = 0;
    this.finalRank = initialRank;
    this.finalRankExp = 0;
    this.sleepWarning = false;
}

/**
 * Attempt to automatically generate event time. JP Events begin and end at 6:00 UTC. It's unclear whether there's any
 * pattern to events yet, so we just return the manual override for now.
 * @returns {Date[]} An array containing start and end date of the current event, index 0 and 1 respectively
 */
Common.getEventBeginEndTime = function () {
    // Handle overrides define in networkinfo.js
    return jpDateOverride;
};

/**
 * Calculate the amount of minutes left in an event.
 * @returns {number} The amount of minutes left in the event, using the dates from getEventBeginEndTime
 * @see getEventBeginEndTime
 */
Common.getAutoRestTimeInMinutes = function () {
    var eventDates = this.getEventBeginEndTime();
    var currentTime = new Date();
    if (currentTime < eventDates[0]) {
        return this.minsBetween(eventDates[1], eventDates[0]);
    } else {
        return this.minsBetween(eventDates[1], currentTime);
    }
};

Common.getAutoResetsLeftInEvent = function () {
    var dates = this.getEventBeginEndTime();
    var lastReset;
    if (dates[1].getUTCHours() > 15) {
        lastReset = new Date(Date.UTC(dates[1].getUTCFullYear(), dates[1].getUTCMonth(), dates[1].getUTCDate(), 15));
    } else {
        lastReset =
            new Date(Date.UTC(dates[1].getUTCFullYear(), dates[1].getUTCMonth(), dates[1].getUTCDate() - 1, 15));
    }

    var hours = this.hoursBetween(lastReset, new Date());
    if (hours < 24) {
        return 0;
    } else {
        return Math.floor(hours / 24);
    }
};

/**
 * It seems like the max LP in SIFAS is fixed at 100 but I'll keep this here just in case...
 * @param {number} playerRank The player's current rank.
 * @returns {number} Maximum LP at the given rank.
 */
Common.getMaxLp = function (playerRank) {
    return 100;
};

/**
 * Calculates the experience points needed to rank up to the next rank, given a player's rank.
 * @param {number} playerRank The player's current rank.
 * @returns {number} EXP needed to rank up at the given rank, or -1 if the rank is the current max rank.
 */
Common.getNextRankUpExp = function (playerRank) {
    if (playerRank < COMMON_RANK_UP_EXP.length) {
        return COMMON_RANK_UP_EXP[playerRank];
    } else {
        return -1;
    }
};

/**
 * Calculate total LP gain through rank ups, assuming the player earns totalExpGained XP through lives.
 * @param {number} playerRank The player's initial rank.
 * @param {number} totalExpGained Total amount of EXP gained during the event.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @returns {?LpRecoveryInfo} A new LpRecoveryInfo object containing only rank up information, or null if reaching the
 *      target would require more than COMMON_RANKUP_LIMITATION rankups.
 */
Common.calculateTotalRankUpLpRecovery = function (playerRank, totalExpGained, playerExp) {
    var recoveryInfo = new LpRecoveryInfo(playerRank);
    totalExpGained += playerExp;
    while (COMMON_RANKUP_LIMITATION > recoveryInfo.rankUpCount) {
        var expForNextRank = this.getNextRankUpExp(recoveryInfo.finalRank);
        if (expForNextRank === -1 || expForNextRank > totalExpGained) {
            recoveryInfo.finalRankExp = totalExpGained;
            return recoveryInfo;
        }
        totalExpGained -= expForNextRank;
        recoveryInfo.totalRankUpLpRecovery += this.getMaxLp(recoveryInfo.finalRank);
        recoveryInfo.finalRank++;
        recoveryInfo.rankUpCount++;
    }
    return null;
};

/**
 * It seems like the max LP in SIFAS is fixed at 100 but I'll keep this here just in case...
 * @param {number} playerRank The player's initial rank.
 * @param {number} totalExpGained Total amount of EXP gained during the event.
 * @returns {number} Weighted average max LP of the player, given their initial rank and EXP they will collect, or -1
 *      if reaching the target would require more than COMMON_RANKUP_LIMITATION rankups.
 */
Common.calculateAverageLovecaLpRecovery = function (playerRank, totalExpGained) {
    return this.getMaxLp(playerRank);
};

/**
 * Calculate required loveca in order to reach the event point target.
 * Using the two other recovery calculation functions, we can subtract the LP gained through rank ups from the required
 * total, then subtract the natural LP regen, and finally divide the leftover LP by the average max LP to find the
 * amount of loveca required. It does not take into account *when* the loveca are used, to make the calculation
 * simpler.
 * @param {number} playerRank The player's initial rank.
 * @param {number} totalExpGained Total amount of EXP gained during the event.
 * @param {number} playerExp The player's initial EXP in the initial rank.
 * @param {number} lpRequired Sum of the LP cost of all lives required to reach the target.
 * @param {number} playerLp The player's initial LP.
 * @param {number} eventTimeLeftInMinutes Minutes left until the event ends.
 * @param {number} regenTimeLostToSleep Minutes of LP regeneration lost to sleep.
 * @returns {?LpRecoveryInfo} A completed LpRecoveryInfo object, or null if reaching the target is impossible.
 * @see calculateTotalRankUpLpRecovery
 * @see calculateAverageLovecaLpRecovery
 */
Common.calculateLpRecoveryInfo =
    function (playerRank, totalExpGained, playerExp, lpRequired, playerLp, eventTimeLeftInMinutes, regenTimeLostToSleep) {
        var recoveryInfo = this.calculateTotalRankUpLpRecovery(playerRank, totalExpGained, playerExp);
        recoveryInfo.lovecaLpRecovery = this.calculateAverageLovecaLpRecovery(playerRank, totalExpGained);

        lpRequired -= recoveryInfo.totalRankUpLpRecovery;
        lpRequired -= playerLp;
        if (0 >= lpRequired) {
            return recoveryInfo;
        }

        // Subtract a single live from the time left - after all, it doesn't help if enough LP recover just in time for
        // the event ending, the live must be completed before the event end or it will not count. Use the skipped live
        // duration for this, because you can just sneak it in with a skip ticket in the last second.
        eventTimeLeftInMinutes -= COMMON_SKIP_LIVE_TIME_IN_MINUTES;

        // Small correction: partially regenerated LP are lost on refills because of overflow. Assuming you'll lose
        // "half an LP" per rank up, consider that LP recovery time lost by subtracting it from the time left
        eventTimeLeftInMinutes -= (recoveryInfo.rankUpCount) * (COMMON_LP_RECOVERY_TIME_IN_MINUTES / 2);
        if (0 > eventTimeLeftInMinutes - regenTimeLostToSleep) {
            return null;
        }

        recoveryInfo.lpToRecover =
            Math.max(0,
                (lpRequired - (eventTimeLeftInMinutes - regenTimeLostToSleep) / COMMON_LP_RECOVERY_TIME_IN_MINUTES));

        // Similar small correction here: on average, lose "half an LP" per refill
        recoveryInfo.refills =
            Math.ceil(recoveryInfo.lpToRecover / (recoveryInfo.lovecaLpRecovery - 0.5));

        // No loveca necessary, but check whether we should display the sleep warning:
        // Calculate how much time we lose every night due to full LP tank. Do the lost LP make a difference?
        // If so, that means the player has to wake up during the night to play
        var lpRegenTimeLostPerSleep = COMMON_SLEEP_WARNING_TIME_IN_MINUTES - recoveryInfo.lovecaLpRecovery *
                                      COMMON_LP_RECOVERY_TIME_IN_MINUTES;
        if (lpRegenTimeLostPerSleep > 0) {
            var nightsLeft = Math.floor(eventTimeLeftInMinutes / (24 * 60));
            var timeLeftWithMaxSleep = eventTimeLeftInMinutes - lpRegenTimeLostPerSleep * nightsLeft;
            var lpToRecoverWithMaxSleep = Math.max(0,
                (lpRequired - timeLeftWithMaxSleep / COMMON_LP_RECOVERY_TIME_IN_MINUTES));
            var refillsWithMaxSleep =
                Math.ceil(lpToRecoverWithMaxSleep / (recoveryInfo.lovecaLpRecovery - 0.5));
            if (recoveryInfo.refills < refillsWithMaxSleep) {
                recoveryInfo.sleepWarning = true;
            }
        }

        /*if (recoveryInfo.lovecaLpRecovery * COMMON_LP_RECOVERY_TIME_IN_MINUTES >= COMMON_SLEEP_WARNING_TIME_IN_MINUTES) {
            recoveryInfo.sleepWarning = false;
        }*/

        return recoveryInfo;
    };

/**
 * @param {number} g Amount of gold to be converted in a readable string.
 * @returns {string} String representing the gold, adding a suffix and digit grouping
 */
Common.goldToString = function (g) {
    return g.toLocaleString() + " G";
};

/**
 * @param {number} m Amount of minutes to be converted in a readable string.
 * @returns {string} String representing the time, split into hours and minutes
 */
Common.minutesToString = function (m) {
    m = Math.floor(m);
    if (m <= 0) {
        return "Less than a minute";
    }

    var hours = Math.floor(m / 60);
    var minutes = m % 60;
    var hoursPlural = (hours == 1) ? "" : "s";
    var minutesPlural = (minutes == 1) ? "" : "s";

    return ((hours > 0) ? hours + " hour" + hoursPlural + ", " : "") + minutes + " minute" + minutesPlural;
};

/**
 * @param {number} h Amount of hours to be converted in a readable string.
 * @returns {string} String representing the time, split into days and hours
 */
Common.hoursToString = function (h) {
    h = Math.floor(h);
    if (h <= 0) {
        return "Less than an hour";
    }

    var days = Math.floor(h / 24);
    var hours = h % 24;
    var daysPlural = (days == 1) ? "" : "s";
    var hoursPlural = (hours == 1) ? "" : "s";

    return ((days > 0) ? days + " day" + daysPlural + ", " : "") + hours + " hour" + hoursPlural;
};

/**
 * @param {Date} datea The later date.
 * @param {Date} dateb The earlier date.
 * @returns {number} Amount of minutes between datea and dateb.
 */
Common.minsBetween = function (datea, dateb) {
    return Math.floor((datea.getTime() - dateb.getTime()) / 60 / 1000);
};

/**
 * @param {Date} datea The later date.
 * @param {Date} dateb The earlier date.
 * @returns {number} Amount of hours between datea and dateb.
 */
Common.hoursBetween = function (datea, dateb) {
    return Math.floor(this.minsBetween(datea, dateb) / 60);
};

/**
 * A string, representing a live difficulty.
 * @typedef {('EASY'|'NORMAL'|'HARD')} difficulty
 */

/**
 * A string, representing a score or combo rank.
 * @typedef {('D'|'C'|'B'|'A'|'S')} rank
 */

/**
 * Difficulty names used across all events.
 * @constant
 * @type {Object.<difficulty, number>}
 */
var COMMON_DIFFICULTY_IDS = {
    "EASY": 0,
    "NORMAL": 1,
    "HARD": 2,
    "HARD_PLUS": 3,
    "ERROR": -1
};

/**
 * Experience point rewards used across all events.
 * @constant
 * @type {number[]}
 */
var COMMON_EXP_REWARD = [];
COMMON_EXP_REWARD[COMMON_DIFFICULTY_IDS.EASY] = 8;
COMMON_EXP_REWARD[COMMON_DIFFICULTY_IDS.NORMAL] = 13;
COMMON_EXP_REWARD[COMMON_DIFFICULTY_IDS.HARD] = 21;
COMMON_EXP_REWARD[COMMON_DIFFICULTY_IDS.HARD_PLUS] = 34;

/**
 * LP cost used across all events.
 * @constant
 * @type {number[]}
 */
var COMMON_LP_COST = [];
COMMON_LP_COST[COMMON_DIFFICULTY_IDS.EASY] = 10;
COMMON_LP_COST[COMMON_DIFFICULTY_IDS.NORMAL] = 12;
COMMON_LP_COST[COMMON_DIFFICULTY_IDS.HARD] = 15;
COMMON_LP_COST[COMMON_DIFFICULTY_IDS.HARD_PLUS] = 20;

/**
 * Length of one live (including things like team/guest selection), used as a rough estimate for calculation.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_LIVE_TIME_IN_MINUTES = 3;

/**
 * Length of one live (including things like team/guest selection) if using a skip ticket, used as a rough estimate for
 * calculation.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_SKIP_LIVE_TIME_IN_MINUTES = 0.5;

/**
 * Time in minutes it takes to regenerate one LP in SIFAS, used for natural LP regen calculation.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_LP_RECOVERY_TIME_IN_MINUTES = 4;

/**
 * The amount of loveca stars required per LP refill.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_LOVECA_PER_REFILL = 10;

/**
 * The factor the event point reward is multiplied with when using a Booster Item.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_BOOSTER_ITEM_BOOST_FACTOR = 1.5;

/**
 * The number of Booster Items gained per day from daily missions.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_BOOSTER_ITEM_DAILY_MISSION_REWARD = 8;

/**
 * The amount of hours we consider a good night of sleep for the sleep warning.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_SLEEP_WARNING_TIME_IN_MINUTES = 480;

/**
 * Upper limit of simulated rank ups during recovery calculation functions to avoid endless loops.
 * @constant
 * @type {number}
 * @default
 */
var COMMON_RANKUP_LIMITATION = 500000;

/**
 * Array of EXP rank up requirements for the available ranks, used by getNextRankUpExp.
 * @constant
 * @type {number[]}
 * @default
 * @see getNextRankUpExp
 */
var COMMON_RANK_UP_EXP = [0, 100, 115, 130, 145, 190, 240, 285, 335, 385, 435, 485, 535, 590, 640, 690, 745, 800, 850,
    905, 960, 1015, 1065, 1120, 1175, 1230, 1285, 1345, 1400, 1455, 1510, 1570, 1625, 1680, 1740, 1795, 1850, 1910,
    1970, 2025, 2085, 2140, 2200, 2260, 2315, 2375, 2435, 2495, 2550, 2610, 2670, 2730, 2790, 2850, 2910, 2970, 3030,
    3090, 3150, 3210, 3270, 3330, 3390, 3450, 3510, 3575, 3635, 3695, 3755, 3815, 3880, 3940, 4000, 4065, 4125, 4185,
    4250, 4310, 4370, 4435, 4495, 4560, 4620, 4685, 4745, 4810, 4870, 4935, 4995, 5060, 5125, 5185, 5250, 5310, 5375,
    5440, 5500, 5565, 5630, 5690, 5755, 5820, 5885, 5945, 6010, 6075, 6140, 6205, 6265, 6330, 6395, 6460, 6525, 6590,
    6655, 6715, 6780, 6845, 6910, 6975, 7040, 7105, 7170, 7235, 7300, 7365, 7430, 7495, 7560, 7625, 7690, 7755, 7820,
    7885, 7955, 8020, 8085, 8150, 8215, 8280, 8345, 8415, 8480, 8545, 8610, 8675, 8745, 8810, 8875, 8940, 9005, 9075,
    9140, 9205, 9275, 9340, 9405, 9470, 9540, 9605, 9670, 9740, 9805, 9875, 9940, 10005, 10075, 10140, 10205, 10275,
    10340, 10410, 10475, 10545, 10610, 10675, 10745, 10810, 10880, 10945, 11015, 11080, 11150, 11215, 11285, 11350,
    11420, 11490, 11555, 11625, 11690, 11760, 11825, 11895, 11965, 12030, 12100, 12165, 12235, 12305];
