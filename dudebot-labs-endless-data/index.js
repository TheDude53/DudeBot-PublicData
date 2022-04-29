"use strict";
// Load random data stream
const randomStream = require("random-bytes-readable-stream");

// Load server
const server = require("http").createServer();
server.port = process.env.PORT || 80;

server.on("request", (req, res)=>{
  res.on("error", ()=>{
    // Is this an overreaction? Probably.
    res.destroy();
    res.removeAllListeners();
  });

  res.setHeader("Content-Type", "application/octet-stream");
  //res.setHeader("Content-Length", "2147483648");
  res.setHeader("Content-Disposition", "attachment; filename=\"bin\"");
  res.flushHeaders();

  // data diaherra time
  randomStream().pipe(res);
});

// It's go time
server.listen(server.port);
console.log("Listening on port " + server.port);