These values, especially the skill ones, are as incomplete as the song database (which means, if I don't have any songs
where a certain effect appears I don't have it added. Feel free to make guesses, but I'm only putting confirmed ones
here)

# Live Difficulty
The live difficulty ID can be read as `ABCCCDDE`:  
`A`: Live type, see below  
`B`: Group, see below  
`CCC`: Song ID  
`DD`: (Real) Difficulty, see below  
`E`: Version (starts at 1)

## Live type
- 1: Free Live
- 2: Story Live
- 4: Sukusuta Big Live
- 5: Dream Live Parade

## Group
- 0: µ's
- 1: Aqours
- 2: Nijigaku

## Attributes
- 0: None
- 1: Smile
- 2: Pure
- 3: Cool
- 4: Active
- 5: Natural
- 6: Elegant

## Difficulty
- 10: Beginner
- 20: Intermediate
- 30: Advanced
- 40: Advanced+ / Expert

Note: the difficulty in the `song_difficulty` field might be different from the one read from the live difficulty ID,
because the one in `song_difficulty` is the one the game uses for timing judgement. Advanced+ songs will have a 40 in
the live difficulty ID, but `song_difficulty` will be set to 30.

# Notes
`time`: Note timing, in milliseconds  
`rail`: 1 for left, 2 for right  
`type`: Note type, see below  
`action`: Note action, see below  
`gimmick`: Index of the gimmick this note triggers, in the `note_gimmicks` array

## Types
- 1: normal note
- 2: hold
- 3: release

Note: in the server live data, there are two more types, 4 and 5, for AC start and AC end.
These notes are invisible in-game, and are always -1, 0 or 1 msec off, next to the start or finish note of the AC.
The `song_db.json` file you can find in this repo has these notes merged together, so you can easily get the note count
of a song by just using the length of the `notes` array.

## Actions
- 1: tap
- 4: swipe up
- 5: swipe down
- 6: swipe left
- 7: swipe right

## Gimmick Triggers
- 1: on hit (WONDERFUL, GREAT or NICE)
- 2: on miss (BAD or MISS)
- 3: always (no matter what timing)

# Appeal Chances
`mission_type`: Mission type, see below  
`mission_value`: Target for the AC mission  
`penalty_damage`: Stamina damage taken if AC is failed  
`reward_voltage`: Voltage gained if AC is cleared  
`range_note_ids`: Position and length of AC, represented as indexes of the start and finish notes in the `notes` array  
`gimmick`: A skill object representing this AC's gimmick, see below
## Mission Types
- 1: Get Voltage
- 2: Get NICEs
- 3: Get GREATs
- 4: Get WONDERFULs
- 5: Get Voltage in a single tap
- 6: Get Voltage from SP skills
- 7: Appeal with unique units
- 8: Get Criticals
- 9: Activate Tap Skills
    
## Gimmick Triggers
- 1: On AC Start (start note hit or missed)
- 2: On AC Success
- 3: On AC Failure
- 4: On AC End (finish note hit or missed)

# Skills
`target`: Targeting type, see below  
`effect_type`: Effect type, see below  
`effect_amount`: Effect strength  
`trigger`: For song gimmicks, this is always 2 so far. For note and AC gimmicks, see the respective Gimmick Trigger sections above.  
`finish_type`: Finish condition, see below  
`finish_amount`: Value for the finish condition  
`scale_type` and `calc_type`: Probably something about how the skills stack (additive/multiplicative)? Haven't looked into these much

## Targets
- 1: All units  
- 30: Aqours  
- 31: Nijigaku  
- 38: Vo Type  
- 39: Sp Type  
- 40: Gd Type  
- 41: Sk Type  
- 58: No target (skill affects SP gauge or stamina)
- 61: Smile  
- 62: Pure  
- 63: Cool  
- 64: Active  
- 65: Natural  
- 66: Elegant  
- 67: Non-Smile  
- 68: Non-Vo Type  
- 72: Non-Pure  
- 73: Non-Cool  
- 74: Non-Active  
- 75: Non-Natural  
- 76: Non-Elegant  
- 77: Non-Sp Type  
- 78: Non-Gd Type  
- 79: Non-Sk Type

## Effects
- 3: SP Gauge Charge (fixed amount)  
- 5: Stamina Restore (fixed amount)  
- 17: Appeal Up  
- 18: Voltage Gain Up  
- 19: SP Gauge Fill Rate Up  
- 20: Critical Rate Up  
- 22: Skill Activation Rate Up  
- 23: SP Voltage Gain Up  
- 45: Base SP Gauge Fill Rate Up  
- 46: Base Critical Rate Up  
- 47: Base Critical Power Up  
- 48: Base Skill Activation Rate Up  
- 49: Base Appeal Up  
- 50: Base SP Voltage Gain Up  
- 51: Base Voltage Gain Up  
- 68: Stamina Damage (fixed amount)  
- 69: SP Gauge Discharge (percentage of max)  
- 71: Appeal Down  
- 73: SP Gauge Fill Rate Down  
- 76: Skill Activation Rate Down  
- 78: Base Skill Activation Rate Down  
- 81: Base Appeal Down  
- 83: Base SP Gauge Fill Rate Down  
- 84: Base Appeal Down (dupe?)  
- 85: Base SP Gauge Fill Rate Down (dupe?)  
- 86: Base Skill Activation Rate Down (dupe?)  
- 91: SP Gauge Charge (percentage of max)  
- 96: Stamina Restore (percentage of max)  
- 134: Stamina Restore (fixed amount), for each Gd type  
- 141: Base Appeal Up, for each Sk type  
- 143: Base Appeal Up, for each Gd type  

## Finish Conditions
- 1: until song end  
- 2: for X notes  
- 3: instant effect, no finishing (stamina or SP gauge effects)
- 4: until AC ends  
- 7: one time only  
- 8: until next switch  