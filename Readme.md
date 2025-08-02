# Functionality
Allows you to configure different expansion combinations for each character slot, akin to how each charactor slot has a mod profile. Also, in a similar way, will warn you, if you try to enter a character with the wrong active expansions.

**A few things of note**:
* The mod should work with both the "Offline client" beta and with the live version
* The mod is injected early on in the "(attempt to) enter character" process, because of which the warning will appear before any other popup. It also currently ignores the "force load" option
* As the mod will tell you when adjusting your settings, there is currently a delay until which the game reloads. The reason for that is that network requests are being made to preserve those changes. Those are asynchronous and unfortunately cannot be awaited by the mod. 5 seconds should ne enough time to ensure, that the game doesn't reload, before the new expansion settings have been saved
  * This may become redundant, when the offline client is finalized

---

# Contact
The best way to contact me, as in the one I'm most likely to respond to the fastest, is through Discord (`#___kuma___`). Either DMing me directly, or by writing in the Mod-bug-reports or other mod-related channels in the official Melvor Discord Server (preferably while tagging me).

Alternatively, you can also comment on this mod page, or create an issue in the GitHub repository linked behind "View homepage" at the top right of this page.

---

# Translations
Currently only has translations for English and German. Other languages will display English text.