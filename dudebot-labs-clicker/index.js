"use strict";
// Load the fs module and stuff into memory
const fs = require("fs");
const website = fs.readFileSync("./index.html");
let clicks = parseInt(fs.readFileSync("./clicks.txt", "utf8")) || 0;

// Load servers
const http = require("http").createServer();
http.port = process.env.PORT || 80;
const ws = new (require("ws").WebSocketServer)({server: http});

http.on("request", (req, res)=>{
  // We'll just help them out a bit
  if (req.url !== "/") {
    res.statusCode = 301;
    res.setHeader("Location", "/");
    res.end();
    return;
  };
  
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(website);
});
ws.on("connection", (client)=>{
  client.on("message", (data)=>{
    // fuck off trolls
    if (data.length !== 1) {
      client.terminate();
      return;
    };
    
    data = parseInt(data.toString());
    // I don't know why I can't just send the raw Array but at this point I don't care
    if (data === 0) {
      // Send click count
      client.send(Buffer.from(JSON.stringify([0, clicks]), "utf8"));
    } else if (data === 1) {
      // Confirm click received
      clicks++;
      client.send(Buffer.from(JSON.stringify([1]), "utf8"));
    };
  });
});

// Save those clicks
process.on("exit", ()=>{
  fs.writeFileSync("./clicks.txt", clicks.toString());
});
setInterval(()=>{
  process.emit("exit");
}, 15000);

// It's go time
http.listen(http.port);
console.log("Listening on port " + http.port);