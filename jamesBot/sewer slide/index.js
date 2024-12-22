const colors = true;
console.log("terminal colors: " + (colors ? "\u001b[92menabled\u001b[39m" : "disabled"))
console.log = (text)=>{
  process.stdout.write((colors ? "\u001b[97m" : "") + (new Date().toISOString()) + (colors ? "\u001b[39m" : "") + ": " + text + "\r\n");
};
const os = require("os");
process.title = "sewer slide v2";
console.log("sewer slide v2 (forked from idle-tb-bot@0.0.4)");
console.log("loading...");
const headers = {
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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"
      }
    }
  }
};
const interval = Math.round(Math.random() * 600000);
console.log("interval: " + interval + "ms");
const nick = process.argv[2] || "sewer cide";
console.log("nickname: " + nick);
const color = process.argv[3] || "brown";
console.log("color: " + color);
const socket = require("socket.io-client")("http://www.windows93.net:8081", headers);
var hehec = 0;
function hehe() {
  if (hehec % 2) {
    return "";
  } else {
    return "\ufeff";
  };
};

function ping() {
  console.log("pinging");
  socket.connect();
  socket.emit("user joined", nick, color, "", "", "");
};

socket.on("connect", ()=>{
  console.log("connected");
  // Uncomment for development testing
  //setTimeout(function(){socket.emit("message", "/r sewer cide")}, 3579);
});
socket.on("disconnect", ()=>{
  console.log("disconnected. reconnecting...");
  ping();
});

socket.on("message", (d)=>{
  if (d.nick === nick) {
    return;
  };
  d.msg += "";
  if (/ti[ck]([ ]{0,1})to[ck]/gi.test(d.msg)) {
    socket.emit("message", "/sin fucktiktok" + hehe() + "\n");
    console.log("tiktok triggered");
    setTimeout(function(){socket.emit("message", "\u200b")}, 1234);
  } else if (/BonziBuddy[ ][\(\[].[\)\]]/.test(d.nick)) {
    socket.emit("message", "/sin thisbotisshit" + hehe() + "\n");
    console.log("BonziBuddy triggered");
    setTimeout(function(){socket.emit("message", "\u200b")}, 1234);
  };
});

console.log("ready on " + os.hostname());
console.log("");
console.log("starting connection");
ping();
setInterval(()=>{
  ping();
}, interval);
