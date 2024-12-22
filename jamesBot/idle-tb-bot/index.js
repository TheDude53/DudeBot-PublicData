console.log("loading...");
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
        "Referer": 'http://www.windows93.net/trollbox/index.php',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko"
      }
    }
  }
};
var interval = Math.round((Math.random() * (parseFloat(1801) - 300) + 300) * 1000);
console.log("interval: " + interval / 1000 + "s");
var nick = process.argv[2] || "anonymous";
console.log("nickname: " + nick);
var color = process.argv[3] || "gray";
console.log("color: " + color);
var io = require("socket.io-client");
var socket = io("http://www.windows93.net:8081", headers);

function ping() {
  console.log("pinging");
  socket.connect();
  socket.emit('user joined', nick, color, "", "", "");
  setTimeout(function() {
    console.log("connected: " + socket.connected)
  }, 10000);
};
socket.on('disconnect', () => {
  console.log("disconnected. reconnecting...");
  ping()
});

var users;
var rooms = {};
socket.on('update users', (data) => {
  users = data;
  rooms = {};
  Object.keys(users).forEach((e) => {
    if (!rooms[users[e].room]) {rooms[users[e].room] = []};
    rooms[users[e].room].push((new JSDOM(users[e].nick).window.document.body.textContent));
  });
});
socket.on('message', (data) => {
  if (data.nick == "~" && data.color == "white" && data.msg.includes(" has entered room: ")) {
    var tempNick = (new JSDOM(data.msg).window.document.getElementsByTagName("span")[0].textContent);
    var tempRoom = (new JSDOM(data.msg).window.document.getElementsByTagName("b")[0].textContent);
    if (!rooms[tempRoom]) {rooms[tempRoom] = [];};
    rooms[tempRoom].push(tempNick);
  };
});
console.log("room logging active");

var server = require('http').createServer();
server.on('request', (q, s) => {
  s.setHeader("Access-Control-Allow-Headers", "*");
  s.setHeader("Access-Control-Allow-Methods", "*");
  s.setHeader("Access-Control-Allow-Origin",  "*");
  s.setHeader("Content-Type", "text/plain;charset=utf-8");
  try {
    if (q.method == "GET") {
      var url = decodeURIComponent(q.url);
      s.statusCode = 200;

      if (url.startsWith("/room/")) {
        socket.emit('message', '/r ' + (url.slice(6) || "atrium"));
        s.end('moved to room "' + url.slice(6) + '"');
      };
      if (url.startsWith("/r/")) {
        socket.emit('message', '/r ' + (url.slice(3) || "atrium"));
        s.end('moved to room "' + url.slice(3) + '"');
      };
      if (url.startsWith("/atrium")) {
        socket.emit('message', '/a');
        s.end('moved to atrium');
      };
      if (url.startsWith("/a")) {
        socket.emit('message', '/a');
        s.end('moved to atrium');
      };
      if (url.startsWith("/rooms")) {
        var resp = "";
        Object.keys(rooms).forEach((e)=>{
          rooms[e].forEach((f)=>{
            resp += e + ': "' + f + '"\n';
          });
        });
        s.end(resp);
      };
      if (url.startsWith("/nick/")) {
        nick = url.slice(6) || "anonymous";
        ping();
        s.end('changed nickname to "' + nick + '"');
      };
      if (url.startsWith("/say/")) {
        socket.emit('message',url.slice(5));
        s.end('chatted message');
      };
      if (url.startsWith("/s/")) {
        socket.emit('message',url.slice(3));
        s.end('chatted message');
      };
      if (url.startsWith("/color/")) {
        color = url.slice(7) || "orange";
        ping();
        s.end('changed color to "' + color + '"');
      };
      if (url == "/" || url == "/index.html") {
        s.end('idle-tb-bot web portal\n\nhttp://localhost:1337/room/<room> - Go to specified room\nhttp://localhost:1337/atrium - Return to atrium\nhttp://localhost:1337/rooms - See users and rooms\nhttp://localhost:1337/nick/<nickname> - Changes the nickname\nhttp://localhost:1337/color/<color> - Changes the color\nhttp://localhost:1337/say/<text> - Chats text\n\n< > = required parameter');
      };

      if (!s.writableEnded) {
        s.statusCode = 404;
        s.end("");
      };
    } else {
      s.statusCode = 404;
      s.end("");
    };
  } catch (e) {
    s.statusCode = 500;
    s.end(e.stack);
  };
});

console.log("starting connection");
ping();
setInterval(function() {
  ping()
}, interval);
server.listen(1337);
console.log("web portal active at http://localhost:1337/");