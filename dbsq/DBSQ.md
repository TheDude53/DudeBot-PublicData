# DudeBot Scripted Sequence (DBSQ)
**This is currently a working draft. Everything is subject to change.**
> Version 0 (DRAFT)  
November 2021  
DudeBot Multimedia Studios

## FAQ
### What is it?
TL;DR: You know how `#stillalive` sends the lyrics of Still Alive in real time? We made a file format for that.

DBSQ (DudeBot Scripted seQuence) is a file format for printing text at a specified offset time, similar to subtitles. Unlike subtitle formats such as WebVTT and SubRip however, DBSQ supports infinite custom metadata properties and is arguably easier to write.
### What's the difference between this and WebVTT?
DBSQ is just better. Don't question it.
## File format
The file should be UTF-8 encoded with Unix (LF) line endings. Examples use `\n` to signify a line ending.
### Header
The header consists of the letters "DBSQ" followed by the version number and a line feed.  
Example: `DBSQ0\n`
### Metadata
The second line should contain a JSON object formatted in the same way as JavaScript's `JSON.stringify` output. No JSON keys are required, and any JSON key can be added. Even if there are no JSON keys, a blank JSON object (`{}`) must be present. The only officially recognized keys are `title`, `description`, and `scriptwriter`.  
Example: `{"title":"Oasis - Wonderwall","description":"Track 3\nFrom the album \"(What's the Story) Morning Glory?\"","scriptwriter":"TheDude53","not_a_standard_key":"lol"}`
### Data
Scripted text can be added with the offset time in milliseconds (positive integers only) followed by a comma, space, and then the displayed text. `\n`, `\r`, and `\u{00A9}` can be used to escape line feeds, carriage returns, and other Unicode characters respectively. Comments can be added by typing them on a empty line.  
Example: `Epic intro\n22150, Today is gonna be the day that they're gonna throw it back to you`
### Footer
There is no footer.
### Example file
```
DBSQ0
{"title":"Oasis - Wonderwall","description":"Track 3\nFrom the album \"(What's the Story) Morning Glory?\"","scriptwriter":"TheDude53"}
Comment on the how epic the intro is
22150, Today is gonna be the day that they're gonna throw it back to you
27690, By now you should've somehow realized what you gotta do
32950, I don't believe that anybody feels the way I do about you now
```
### Simpler example file
```
DBSQ0
{}
Cool comment here


The blank lines above are also considered comments
0000, 0 seconds in
1000, 1 second in
2000, 2 seconds in
3000, 3 seconds (3000 milliseconds) in
```

## Example player (Node.js)
```js
"use strict";
const dbsq = require("fs").readFileSync(process.argv[2], "utf8").split("\n");
if (dbsq[0] !== "DBSQ0") {
  console.log("Header missing/invalid");
  process.exit(1);
};
dbsq[1] = JSON.parse(dbsq[1]);
console.log(
  "-- Now Playing --\n" +
  "Title: " + (dbsq[1].title || "none specified").replace(/[\r\n]/g, "") + "\n" +
  "Description: " + (dbsq[1].description || "none specified").replace(/\n/g, "\n             ") + "\n" +
  "Scripted by: " + (dbsq[1].scriptwriter || "none specified").replace(/[\r\n]/g, "") + "\n"
);
dbsq.slice(2).forEach((line)=>{
  line = {
    offset: (line.match(/^[0-9]+, /) || [""])[0].slice(0, -2),
    text: line.replace(/^[0-9]+, (.+)/, "$1")
  };
  if (!line.offset) {
    return;
  };
  setTimeout(()=>{
    console.log(line.text.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\u{([0-9A-Z]+)}/gi, (char)=>{
      return String.fromCharCode(parseInt(char.slice(3, -1), 16));
    }));
  }, parseInt(line.offset));
});
```