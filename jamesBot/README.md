# jamesBot Source
This folder contains the source code for the last version (0.4.7 - March 31st, 2021) of jamesBot, as well as its sibling bot "sewer slide" and the upstream project `idle-tb-bot`. All code files are provided as-is without any modifications, however the accompanying `package.json` files have been changed to better fit this public release.

Disclaimer: the questionable programming practices featured in this release are not reflective of the author's current code style or knowledge in the field.

## History
`idle-tb-bot` was written at the request of james in late November/December 2020 by TheDude53, with the goal of creating a bot for Windows 93's trollbox that ultimately just sat there without doing anything to eventually take the crown in the user list. The original project was completely quite quickly, and on January 28th, 2021 was modified to strip out some unnecessary features, add a few novelty ones and include a new nickname+color combination; this variant was named "sewer slide". It received one maintenance update outside of the initial release on April 9th, bumping the version from `0.0.4-sc1` to `0.0.4-sc2` (the one in this release).

Simultaneously, another `idle-tb-bot`-based project was in the works, with the eventual goal of becoming a fully fledged chatbot known as "jamesBot". jamesBot featured a small user-facing collection of commands, and became popular largely because it was one of the first trollbox bots to list currently open rooms and the users in each (using the same code as DudeBot at the time). It also managed to become DudeBot's sibling in the official DudeBot lore (because yes, that does exist), although we're not quite sure where that started.

## Changelog
### 0.0.1-0.0.3
no notes

### 0.0.4
added ass-saving functionality (gives the finger to errors)

### 0.0.4-r2
start implementing ideas from idea list, such as `?disc`, `?say`, and `?name`

### Versioning change
At this point jamesBot officially adopted the SemVer format, making the next version 0.4.4 instead of 0.0.4-r3.

### 0.4.4
Changed to a better versioning system, added a quotes list and eval on the dashboard, and fixed `?name`

### 0.4.5
Changed TheDude53 copyright to "powered by DudeBot℠", check for duplicate processes, and add redirect url for updates

### 0.4.6
Return to default nickname after interval if changed, change to strict mode (should make things a little faster), and make ESLint happy.

### 0.4.7
Add ";bot" suffix to color and fix room functionality

## License
Separate from the rest of this repository, `idle-tb-bot` and its related child projects have been licensed under the permissive MIT License.