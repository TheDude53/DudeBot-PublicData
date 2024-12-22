"use strict";
try {
/* Check for duplicate processes (only works on Windows)
   const bin = require("path").parse(process.argv[0]).base; */
  if ((require("child_process").execSync("tasklist").toString("utf8").toLowerCase().match(/jamesbot/g) || {length: 0}).length>1) {
    console.log("duplicate process found. either close it now, or prepare for unforseen consequences.");
  };
} catch (e) {};

process.title = "jamesBot 0.4.7";
console.log("jamesBot 0.4.7");
console.log("built 3/31/2021");
console.log("\nloading...");
var fs = require("fs");
var JSDOM = require("jsdom").JSDOM;
var headers = {
  forceNew: true,
  transportOptions: {
    polling: {
      extraHeaders: {
        "Accept": "*/*",
        "Accept-Encoding": "identity",
        "Accept-Language": "*",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": "",
        "Host": "www.windows93.net",
        "Origin": "http://www.windows93.net",
        "Pragma": "no-cache",
        "Referer": "http://www.windows93.net/trollbox/index.php",
        "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)"
      }
    }
  }
};

if (!fs.existsSync("./jamesBot.json")) {
  fs.writeFileSync("./jamesBot.json", "{\"count\":0,\"quotes\":[],\"crashes\":{}}", {encoding: "utf8"});
};
var config = JSON.parse(fs.readFileSync("./jamesBot.json", {encoding: "utf8"}));
function saveConfig() {
  fs.promises.writeFile("./jamesBot.json", JSON.stringify(config), {encoding: "utf8"}).then(()=>{}).catch((err)=>{
    console.log("Error while saving config: " + err.stack);
  });
};
if (!config.count) {
  config.count=0; saveConfig();
};
if (!config.quotes) {
  config.quotes=[]; saveConfig();
};
if (!config.crashes) {
  config.crashes={}; saveConfig();
};
process.on("uncaughtException", (err)=>{
  console.log("ass-blasting attempt captured");
  config.crashes[Date.now()] = err.stack;
  saveConfig();
});
console.log("ass-saver ready");

var interval = Math.round((Math.random() * (parseFloat(1801) - 300) + 300) * 1000);
console.log("interval: " + interval / 1000 + "s");
// var nick = process.argv[2] || "anonymous";
var nick = "jamesBot [?]";
console.log("nickname: " + nick);
// var color = process.argv[3] || "gray";
var color = "orange";
console.log("color: " + color);
var io = require("socket.io-client");
var socket = io("http://www.windows93.net:8081", headers);

function ping(forced) {
  if (!color.endsWith(";bot")) {
    color += ";bot";
  };
  if (forced) {
    socket.emit("user joined", nick, color, "", "", "");
    setTimeout(()=>{
      nick = "jamesBot [?]";
    }, 1000);
  } else {
    console.log("pinging");
    socket.connect();
    socket.emit("user joined", nick, color, "", "", "");
    setTimeout(()=>{
      console.log("connected: " + socket.connected);
    }, 10000);
  };
};
var odd = true;
function s(message) {
  odd = !odd;
  socket.emit("message", message + (odd ? "" : " "));
};
socket.on("disconnect", ()=>{
  console.log("disconnected. reconnecting...");
  ping();
});

var users;
var rooms = {};
socket.on("update users", (data)=>{
  // room logging code
  users = data;
  rooms = {};
  Object.keys(users).forEach((e)=>{
    if (!rooms["~"+users[e].room]) {
      rooms["~"+users[e].room] = [];
    };
    rooms["~"+users[e].room].push(new JSDOM(users[e].nick).window.document.body.textContent);
  });
});
socket.on("message", (data)=>{
  // room logging code
  if (data.nick == "~" && data.color == "white" && data.home == "trollbox" && data.style != 0 && data.msg.includes(" has entered room: ")) {
    const tempNick = new JSDOM(data.msg).window.document.getElementsByTagName("span")[0].textContent;
    const tempRoom = new JSDOM(data.msg).window.document.getElementsByTagName("b")[0].textContent;
    if (!rooms["~"+tempRoom]) {
      rooms["~"+tempRoom] = [];
    };
    rooms["~"+tempRoom].push(tempNick);
  };

  // everything else is below
  if (data.msg.startsWith("?help")) {
    // help message
    s("jamesBot\n?help - help command\n?users <room> - shows users in a room\n?check - shows how many times ?users has been used\n?jamessays - shows a quote by james\n?disc - gives an invite to the Dis\u{200c}cord server\n?name - changes the nickname\n?say - says the provided text\n\nsome parts powered by DudeBot℠");
  };
  if (data.msg.startsWith("?users ") && data.msg.slice(7) != 0) {
    if (Array.isArray(rooms["~"+data.msg.slice(7)])) {
      let resp = "";
      rooms["~"+data.msg.slice(7)].forEach((f)=>{
        resp += f + "\n";
      });
      resp = resp.slice(0, -1);
      s(resp);
      config.count++;
      saveConfig();
    } else {
      s("invalid room");
    };
  };
  if (data.msg.startsWith("?check")) {
    s(config.count+"");
  };
  if (data.msg.startsWith("?jamessays") || data.msg.startsWith("?quote")) {
    s("\"" + config.quotes[Math.floor(Math.random() * config.quotes.length)] + "\"\n -james");
  };
  if (data.msg.startsWith("?disc")) {
    s("a cunts hell\nhttps://discord.gg/gNYymZFt4b");
  };
  if (data.msg.startsWith("?name")) {
    nick = data.msg.slice(6) || "jamesBot [?]";
    ping(true);
    s("changed nickname to \"" + nick + "\"");
  };
  if (data.msg.startsWith("?say ")) {
    if (data.msg.slice(5) != 0) {
      s(data.msg.slice(5).replace(/\//, "/\u{200d}"));
    };
  };
});
console.log("room logging active");

var server = require("http").createServer();
server.on("request", (q, rs)=>{
  rs.setHeader("Access-Control-Allow-Headers", "*");
  rs.setHeader("Access-Control-Allow-Methods", "*");
  rs.setHeader("Access-Control-Allow-Origin",  "*");
  rs.setHeader("Content-Type", "text/plain;charset=utf-8");
  if (q.method == "GET") {
    let url = q.url;
    try {
      url = decodeURIComponent(q.url);
    } catch (e) {}
    rs.statusCode = 200;
    if (url.startsWith("/rooms")) {
      let resp = "";
      Object.keys(rooms).forEach((e)=>{
        rooms[e].forEach((f)=>{
          resp += e + ": \"" + f + "\"\n";
        });
      });
      rs.end(resp);
    };
    if (url.startsWith("/nick/")) {
      nick = url.slice(6) || "anonymous";
      ping(true);
      rs.end("changed nickname to \"" + nick + "\"");
    };
    if (url.startsWith("/say/")) {
      socket.emit("message", url.slice(5));
      rs.end("chatted message");
    };
    if (url.startsWith("/s/")) {
      socket.emit("message", url.slice(3));
      rs.end("chatted message");
    };
    if (url.startsWith("/color/")) {
      color = url.slice(7) || "orange";
      ping();
      rs.end("changed color to \"" + color + "\"");
    };
    if (url.startsWith("/addquote/")) {
      if (url.slice(10) != 0) {
        const resp = config.quotes.push(url.slice(10));
        saveConfig();
        rs.end("added quote \"" + url.slice(10) + "\" as index " + resp);
      } else {
        rs.statusCode = 400;
        rs.end("missing quote");
      };
    };
    if (url.startsWith("/quotes")) {
      let resp = "# | Quote\n--|------\n";
      for (let i = 0; i < config.quotes.length; i++) {
        resp += i + " | " + config.quotes[i] + "\n";
      };
      rs.end(resp);
    };
    if (url.startsWith("/delquote/")) {
      if (url.slice(10) != "" && !isNaN(parseInt(url.slice(10)))) {
        const resp = config.quotes.splice(parseInt(url.slice(10)), 1);
        saveConfig();
        rs.end("deleted quote \"" + resp[0] + "\"");
      } else {
        rs.statusCode = 400;
        rs.end("missing quote index");
      };
    };
    if (url.startsWith("/crash") && url.slice(7) == 0) {
      let resp = "Timestamp     | Human-readable date\n--------------|--------------------\n";
      Object.keys(config.crashes).forEach((e)=>{
        resp += e + " | " + new Date(parseInt(e)).toString() + "\n";
      });
      rs.end(resp);
    };
    if (url.startsWith("/crash/") && url.slice(7) != 0) {
      if (/^\d+$/.test(url.slice(7)) && config.crashes[url.slice(7)]) {
        rs.end(config.crashes[url.slice(7)]);
      } else {
        rs.end("invalid timestamp");
      };
    };
    if (url == "/ferr") {
      rs.end("forcing error");
      throw new Error("forced error");
    };
    if (url.startsWith("/eval/") && url.slice(6) != 0) {
      try {
        rs.end(eval(decodeURIComponent(url.slice(6))));
      } catch (e) {
        rs.end(e.stack);
      };
    };
    if (url.startsWith("/update")) {
      rs.statusCode = 302;
      rs.setHeader("Location", "http://drive.google.com/drive/folders/1u_SQ4hg-S03mRG9nMitAfSK0qavHkI3O");
      rs.end("redirecting...");
    };
    if (url == "/" || url == "/index.html") {
      rs.end("jamesBot@0.4.7 web dashboard\nsome parts used from idle-tb-bot with permission\n\nhttp://localhost:1337/rooms - See users and rooms\nhttp://localhost:1337/nick/<nickname> - Changes the nickname\nhttp://localhost:1337/color/<color> - Changes the color\nhttp://localhost:1337/say/<text> - Chats text\nhttp://localhost:1337/addquote/<quote> - Adds quote\nhttp://localhost:1337/quotes - Lists quotes\nhttp://localhost:1337/delquote/<quote index> - Delete quote from index\nhttp://localhost:1337/crash/ - Lists all captured ass-blasting attempts\nhttp://localhost:1337/crash/<timestamp> - Shows crash info from timestamp\nhttp://localhost:1337/update - Redirects to the update repository\n\n< > = required parameter");
    };
    if (!s.writableEnded) {
      rs.statusCode = 404;
      rs.end("");
    };
  } else {
    rs.statusCode = 404;
    rs.end("");
  };
});

console.log("starting connection");
ping();
setInterval(()=>{
  ping();
}, interval);
server.listen(1337);
console.log("web portal active. possible addresses:");
var nifaces = require("os").networkInterfaces();
Object.keys(nifaces).forEach((e)=>{
  nifaces[e].forEach((f)=>{
    if (f.family == "IPv6") {
      console.log("http://[" + f.address + "]:1337");
    };
    if (f.family == "IPv4") {
      console.log("http://" + f.address + ":1337");
    };
  });
});
console.log("http://localhost:1337");
console.log("");
