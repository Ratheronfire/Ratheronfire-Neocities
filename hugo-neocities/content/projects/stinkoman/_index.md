---
title: "Stinkoman 20X6: Godot Remake"
type: "detailed-manual"
date: 2023-01-02T00:00:00-04:00
draft: false
caption: |
    My newest project, a clone of the Homestar Runner game [Stinkoman 20X6](https://homestarrunner.com/stinkogame/).
    Written in Godot.  

    *Last updated: September 22, 2023 - Version 1.0.0*
caption_mainpage: |
    Thanks for checking out my remake of Stinkoman 20X6, in Godot!  
    Keep in mind this game is still unfinished, so expect things to break often.  
    You can play the game in your browser now, or download for the platform of your choice:  
    - [Play in the browser](https://storage.ratheronfire.com/stinkoman/web)
    - [Windows](https://storage.ratheronfire.com/stinkoman/stinkoman-windows.zip)
    - [Mac](https://storage.ratheronfire.com/stinkoman/stinkoman-mac.zip)
    - [Linux](https://storage.ratheronfire.com/stinkoman/stinkoman-linux.zip)
    - [Android](https://storage.ratheronfire.com/stinkoman/stinkoman-android.apk)
thumbnail: "stinkoman/img/title.png"
thumbnail_alt: "The title screen for my Stinkoman remake."
thumbnail_mainpage: "img/gameplay.png"
categories: ["Projects"]
---

## Credits & Thanks

Original Game Developed by Mike Chapman, Matt Chapman, Jonathan Howe, and [Jez Swanson](https://twitter.com/jezzamonn)  
Remastered Tracks by [Jude Friesen](https://scratch.mit.edu/users/CoolGuyBug/)  
Additional art design & concepts by KirbychuHRD  
Playtesting by [fortran](https://cheeselandrestaurant.neocities.org/), ChrisHighwind, [@PetrarchEleven](https://twitter.com/PetrarchEleven), KirbychuHRD, and retroshaffer  

Sprite assets ripped courtesy of A.J. Nitro and Mr. C of [The Spriters Resource](https://www.spriters-resource.com/browser_games/stinkoman20x6)
Controller button images by [Xelu](https://thoseawesomeguys.com/prompts/)  
OpenDyslexic font created by [Abbie Gonzalez](https://gumroad.com/l/OpenDyslexic)  
Kylarzio font created by [@AdigunPolack](https://twitter.com/AdigunPolack/status/1392692685228630019)

Godot plugins used:
- [Godot Console](https://github.com/quentincaffeino/godot-console)
- [Integer Resolution Handler](https://github.com/Yukitty/godot-addon-integer_resolution_handler)

## Version History
- [Nightly Build](nightly)
- Version 1.0.0 (Latest): September 22, 2023
  - Added the final level.
  - Added some remastered music/sound effects.
  - Overhauled a lot of stuff: collision, enemy behavior, save file format, and so on.
  - Added classic difficulty.
  - Minor improvements:
    - Added ability to launch enemies in random directions on death
    - Overhauled some boss death animations
    - Added cheat code menu
    - Tweaked sound effect volumes
    - Re-timed all cutscenes to be more accurate to Flash version
    - Added toggle for rounded screen border
    - Added attract mode
    - Added Stinkomanuel
    - Made some extra features unlock as levels are beaten
    - Added extra sounds in a few places
    - Fixes for controller UI navigation
    - Re-added original Flash quality music for levels 1 and 2 as a toggle
    - Improved camera behavior on level 4
    - Slowed down 1-Up on level 4
    - Made Grundy's cool older brother cooler
    - Fixed breakable platforms sometimes not responding when landing on them
    - Added save export/delete buttons
    - Added confirm button for quitting
    - Added buttons to return to title screen/time attack menu from time attack resutls screen
    - Fixed setting button mappings when using keyboard to navigate buttons
    - Added some extra polish to level 9
  - A whole host of bugfixes:
    - Updated URL for bug reporting tool
    - Improved behavior of enemies with activation points
    - Improvements to enemy turning behavior
    - Fixed various save data issues
    - Muted sounds in some cases where they were kinda obnoxious
    - Enemies moving while paused
    - Fixes for player momentum
    - Fixed desync between options menu on title screen and pause menu
    - Way too many to list 
- [Version 0.9.1](0.9.1): January 2, 2023
    - Fixed camera issue on 4.2, adjusted some object placements.
- [Version 0.9.0](0.9.0): December 24, 2022
    - Added Level 9
    - Added NES/Game Boy/GBC Palettes (Very early concepts currently)
    - Minor collision and movement fixes
- [Version 0.8.0](0.8.0): September 9, 2022
    - Added Level 8
    - Added support for alternate sprite palettes
- [Version 0.7.0](0.7.0): June 7, 2022
    - Added Level 7
    - Some improvements to collision boxes
    - Re-timed player animations for greater accuracy
    - Added integer scale and aspect ratio settings
    - Added touch controls toggle
    - Improvements for controller input on menus
    - Improved ladder controls
    - Cleaned up death animations
- [Version 0.6.0](0.6.0): January 6, 2022
    - Added Level 6
    - Added more context menu functionality to level editor
    - Improved camera behavior in level editor
    - Changed sprites for 2-Up
- [Version 0.5.0](0.5.0): September 18, 2021
    - Added Level 5
    - Added proof-of-concept level editor
    - Various balances/tweaks
      - Added fall velocity cap
      - Better ladder behavior
      - Collision detection improvements
      - Improved camera usability
      - Several enemy bugfixes
- [Version 0.4.1](0.4.1): June 7, 2021
    - Fixed extra lives not reflecting on UI after collecting
    - Fixed issues with cutscene viewer.
    - Fixed Stlunko's conveyor belt not stopping on death.
- [Version 0.4.0](0.4.0): June 6, 2021
    - Added Levels 4.1-4.3
    - Added options screen to pause menu
    - Added Boss Rush mode & level select
    - Added persistent time trial records
    - Added bug reporting interface
    - Level progress is now saved between sessions
    - Added extra font options
    - Various UI improvements
    - Fixed issue with bottomless pit recovery placing the player in a death loop
    - A whole host of other minor fixes/tweaks
- [Version 0.3.0](0.3.0): April 30, 2021
    - Added levels 2.1-3.3
    - Reduced build size
    - Added time attack mode with Stinkoman and 1-Up playable
    - Replaced inaccurate sound effects
    - Made Stinkoman's attack more accurate to the original
    - Added a couple easter eggs
    - Improved controller support
    - Various bugflxes/accuracy improvements
- [Version 0.2.1](0.2.1): March 7, 2021
    - Fixed hidden portion of drills sometimes rendering
    - Fixed tiling issues in 1.1
    - Fixed level display being cut off
    - Fixed post-boss battle behavior
    - Improved background appearance
    - Added the hidden power crunch in 1.1
- [Version 0.2.0](0.2.0): March 6, 2021
  - Added Level 1.2, 1.3
  - Added title menu, intro screens, and cutscenes
  - Added rebindable controls & audio settings
  - Implemented death, lives, checkpoints, end-of-level flags
  - Generally more accurate to the original
  - Various Bugfixes
- [Version 0.1.0](0.1.0): February 22, 2021
    - Initial release
    - Added level 1.1