Mega Man 2 Quality of Life Fixes
Hack Written by Ratheronfire

[Introduction]

Hey, thanks for checking out this hack! I wrote these as a bit of a learning exercise and a way of learning a bit more about the way NES games were developed, but also as a means of introducing some improvements and fixes that I think improve the original game over its original design. I don't wish to imply that I'm trying to one-up the developers by fixing their work; in fact, a lot of the improvements in this pack are inspired by design improvements in later Mega Man games, as well as general changes in game design since the '80s.

For your convenience, I've split the different fixes into separate .ini files, as well as adding a couple alternative scripts in a few cases.

[Fixes/Improvements]

1. Faster post-boss UI
	I changed some values to speed up the text scrolling and a few other animations during the post-level sequences. Now they waste much less of your time, even on the levels where Items 1-3 are unlocked.

2. Quick Man AI Fix
	Quick Man's AI is frequently cited as being bugged, due to him running fast enough to partially clip into walls occasionally. This has the side effect of making his attack sequences upredictable: Normally, Quick Man will jump two times in a row, and fire an attack at the apex of his second jump. However, when he gets stuck, he can sometimes seem to skip the first jump, skipping immediately to the second jump with the attack. (In reality, he is jumping twice, it's just that the first jump is imperceptible because it ends immediately because he's still colliding with the wall).
	
	My fix simply forces him to turn around before jumping, which seems to prevent the issue from occurring, since Quick Man always jumps away from the wall and out of its collision area. The effects of this fix are a lot more noticeable in the Wily 5 refight, because it has a more standard arena.

3. Wily 4 Level Edit
	There's one portion towards the end of Wily 4 where a Sniper Joe is placed underneath a low wall in such a way that it's impossible to dodge its attack. This was always a minor pet peeve of mine, so I've updated the level to give him a bit more of a roof. Since this hack was first published I altered it slightly to keep the low ceiling on the far left/right sides, to prevent the Sniper Armors from entering the corridor.

4. Life Max
	While working on these hacks, I spotted a very minor and otherwise unnoticeable bug: The game caps your lives at 98, rather than 99. Because the game displays 0 lives on your final life, while the game internally stores your lives count as 0x01 on your last life, I suspect this was a simple math error. To fix this I've provided a patch that makes the max 99 as expected, as well as a separate patch to limit it to 10 lives.

5. E-Tank Improvements
	This fix allows the player to collect more than 4 E-Tanks, the game's original limit. To accomodate this, the pause menu UI had to be updated with a numeric E-Tank display, as opposed to the original showing a dot for each E-Tank. There are two separate patches availaible: one with a max of 10 E-Tanks, and one with 99. In addition, this patch prevents you from spending E-Tanks if your health is already full.
	
	There's also an extra patch which removes the bit of code that clears out all your E-Tanks when you run out of lives.
	
	Unfortunately when you generate a password, it can only remember up to 4 E-Tanks, because of the way the original password system was designed. (A very minor change, but it's also worth noting that I disabled playing the collect sound when you're already maxed on E-Tanks, to mimic the behavior of the other items.)

6. Energy Balancer
	This hack implements a feature introduced later in the series, which automatically distributes energy pickups that would otherwise be wasted. If you grab an energy refill when you have the Mega Buster equipped (or when your current weapon is already full), the game will instead spend that energy on whichever weapon has the least ammo.
	
	When this happens, the energy refill sound is played and whichever weapon was selected is immediately increased. If that weapon's ammo is now full, the Atomic Blaster's max charge sound is used instead, to indicate one of your weapons has been fully charged.

[Included Files]

The main patch for this hack is Mega Man 2 QoL Fixes.ips. This patch includes all of the changes listed above. In addition, I have provided separate patches for each individual fix, in the Partial Patches folder. I've also provided a couple extra optional patches to limit the maximum lives and E-Tanks, in the Extras folder.

[Version History]

Version 1.0 (October 19, 2020):
	Attempting to use an E-Tank when your health is full does not deplete your E-Tanks.
	E-Tanks are preserved on game over.
	When you have no weapon selected (or your current weapon has full energy), any energy pickups you collect will automatically be spent on your lowest weapon. (One of the Atomic Fire charging sounds is used to indicate that a weapon has been fully charged, similar to some of the later Mega Man games.)

Version 1.1 (October 30, 2020):
	Redesigned the E-Tank display on the pause screen to match the lives display, and increased the E-Tank limit from 4 to 99.
	Collecting an E-Tank while you already have the max amount will no longer cause the collect sound to play.
	Fixed an issue with the original game causing lives to be capped at 98 instead of 99.
	Increased the ceiling height on a screen in Wily 4 where it was too low to dodge a Sniper Joe’s attacks.
	Fixed an issue with Quick Man’s behavior that caused him to get stuck in walls, making his movements more unpredictable than intended.
	Increased the text scroll speed on the “get equipped” screen.

Version 1.2 (October 15, 2021):
	Updated password generator to cap E-Tanks at 4, due to issues with >4 E-Tanks.
	Sped up more UI elements (Mega Man flashing when receiving upgrades, screen flashing before Dr. Light's messages)
	Added separate patches per feature, more documentation.

[Technical Info]

Each separate patch in this collection is compatible with each other, and they should also be compatible with other hacks, as long as they don't use the same portions of the ROM that my hack uses. For any other developers looking to use parts of these hacks, here are the ROM/RAM addresses I've used for this hack:

1. Faster post-boss UI
	Edits at $37B95, $37C8C, $37D07, $37D4A, $37DBC

2. Quick Man AI Fix
	New function at $2EABF-$2EADC
	References to new function at $2C834 and $2C8F1

3. Wily 4 Level Edit
	Edits ranging from $CDDC to $CE05

4. Life Max
	Life max at $38390 (Should be equal to Intended Max + 1)

5. E-Tank Improvements
	New function at $3F2F3-$3F303 (referenced at $352A2-$352A7): Uses E-Tank and checks if health is already maxed first
	New function at $37F87-$37F90 (referenced at $37250-$37252): Gets E-Tank amount capped to 4 (for passwords)
	New function at $3F359-$3F3F8 (referenced at $35457-$35481): Draws updated E-Tank display on pause screen
	
	E-Tank max at $38382
	Edit at $38384 to skip E-Tank sound if already maxed
	Code at $3C1CA-$3C1CD replaced with NOP to prevent losing E-Tanks on game over
	
	Sprite data for pause screen added at $3FF97-$3FFAA

6. Energy Balancer
	New subroutines at $3F304-$3F339 and $3F33A-$3F358 (Referenced at $3833F-$38344, additional edit at $38350)
	Reference at $$3833F-$38344 and $230224

Remember that if you need to move any of these additions, any places where their addresses are referenced will need to be updated as well. In addition, there seems to be a pretty considerable amount of free space at $2BB46-$2BFEF, $2EADD-$2EE0F, and $3F3F9-$3F908 (as well as a few other places scattered throughout the ROM), though your mileage may vary.

[To Do]

These hacks were made using the Mesen emulator, which I'm still learning the ins and outs of. As a result there are a few places in my hack where my new subroutines use a series of NOP commands that can probably be safely ommitted. I'm also far from an expert in assembly code, so there are undoubtedly plenty of places where my code could be optimized.

I'd also like to investigate a more robust solution to storing arbitrary amounts of E-Tanks using the game's password system. This might not be possible however, since it's designed to use a fixed number of 9 bits: One to represent the E-Tank count ranging from 0-5, and the other 8 representing the defeated/undefeated states of each boss. I could remove this requirement, which would require the player to input their password with a variable number of dots, and then manually submit it (currently, the game assumes the password has been fully entered after the ninth dot is placed).