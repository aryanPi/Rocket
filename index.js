const express = require("express");
const app = express();
const path = require("path");
const crypto = require("crypto");
const session = require("express-session");

// const WebSocket = require("ws").Server;
// const HttpsServer = require("https").createServer;
// const fs = require("fs");
const socketIO = require('socket.io', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] })

app.use(express.static(path.join(__dirname, "public")));


app.get("/", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "public", "main.html"));
});
app.get('/game',(req,res)=>{
  res.status(200).sendFile(path.join(__dirname, "public", "game.html"));
})


const MemoryStore = new session.MemoryStore();


app.use(
  session({
    store: MemoryStore,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: "secretCode!",

    cookie: {
      httpOnly: false,
      sameSite: true,
    },
  })
);


const http = require('http')
const server = http.createServer(app)



const io = socketIO(server)


const salt = "0000000000000000000fa3b65e43e4240d71762a5bf397d5304b2596d116859c";
var game_hash =
  "100af1b49f5e9f87efc81f838bf9b1f5e38293e5b4cf6d0b366c004e0a8d9987";
function getNewTime() {
  var h = crypto.createHmac("sha256", game_hash).update(salt).digest("hex");
  //cursor(`update data set hash = '${h}' where hash != '' ;`);
  game_hash = h;
  var res = -1;
  if (parseInt(h, 16) % 33 == 0) {
    res = 1;
  } else {
    h = parseInt(h.substr(0, 13), 16);
    var e = Math.pow(2, 52);
    res = (100 * e - h) / (e - h) / 100.0;
  }
  //return 1000000
  return Number(res.toFixed(4));
}







functions = require("./functions");

functions.initCrash(io);

io.on("connection", (socket) => {
  functions.initSocket(socket)
})



server.listen(80, (res) => {
  functions.IN(io,MemoryStore)  
  console.log("Running")
})



// io.on("connection-2", (ws) => {
//   console.log("connection");
//   var req = ws;
// //   setTimeout(()=>{
// //     ws.emit('onopen');
// //   },2000)
  
//   ws.on('test',(r)=>{
//     ws.emit('onmessage',r)
//   })
//   ws.on("message", function (msg) {
//     console.log('mess')
//     var d = "";
//     //console.log(typeof msg,msg)
//     for (var i of JSON.parse(JSON.stringify(msg)).data) {
//       d += String.fromCharCode(i);
//     }
//     //    console.log(JSON.stringify(d));
//     d = JSON.parse(d);

//     // setTimeout(()=>{
//     //     ws.send(JSON.stringify({"name":"on_state","payload":{"state":"ready","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":0}}))
//     // setTimeout(()=>{
//     //     ws.send(JSON.stringify({"name":"on_state","payload":{"state":"betend","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":0}}))
//     //     setTimeout(()=>{
//     //         ws.send(JSON.stringify({"name":"on_state","payload":{"state":"launch","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":0}}))
//     //     },800)
//     // },10)})

//     return;
//     if ((d.type = "login")) {
//       ws.send(
//         JSON.stringify(
//           {
//             type: "server",
//             body: {
//               name: "on_response",
//               type: "login",
//               pid: 2,
//               payload: {
//                 id: "not",
//                 gameID: 1,
//                 userID: "guest",
//                 state: "launch",
//                 timespan: 25107,
//                 leftMS: 0,
//                 bettings: [],
//                 history: [],
//                 lastBet: null,
//                 userCount: 0,
//                 playCount: 0,
//                 balances: [],
//                 success: true,
//               },
//             },
//           },
//           null,
//           "\t"
//         )
//       );
//       setTimeout(() => {
//         ws.send(
//           JSON.stringify(
//             {
//               type: "server",
//               body: {
//                 name: "on_response",
//                 type: "login",
//                 pid: 2,
//                 payload: {
//                   id: "not",
//                   gameID: 1,
//                   userID: "guest",
//                   state: "launch",
//                   timespan: 25107,
//                   leftMS: 0,
//                   bettings: [],
//                   history: [],
//                   lastBet: null,
//                   userCount: 0,
//                   playCount: 0,
//                   balances: [20],
//                   success: true,
//                 },
//               },
//             },
//             null,
//             "\t"
//           )
//         );
//       }, 5000);
//     } else if (d.type == "get_game_data") {
//       ws.send(
//         JSON.stringify({
//           name: "on_response",
//           type: "get_game_data",
//           pid: 1,
//           payload: { result: "not exists gameID undefined", success: true },
//         })
//       );
//     } else if (d.type == "get_account") {
//       ws.send(
//         JSON.stringify({
//           name: "on_response",
//           type: "get_account",
//           pid: 3,
//           payload: { result: "not handled request", success: true },
//         })
//       );
//     } else if (d.type == "get_account_data") {
//       ws.send(
//         JSON.stringify({
//           name: "on_response",
//           type: "get_game_data",
//           pid: 4,
//           payload: {
//             id: "23ae158f-f342-41e4-93d5-74862ce8123c",
//             gameID: 1,
//             userID: "guest",
//             state: "launch",
//             timespan: 25287,
//             leftMS: 0,
//             bettings: [],
//             history: [],
//             lastBet: null,
//             userCount: 0,
//             playCount: 0,
//             balances: [10],
//             success: true,
//           },
//         })
//       );
//     }

//     //     setTimeout(()=>{
//     //         ws.send(JSON.stringify({"name":"on_state","payload":{"state":"ready","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":0}}))
//     //     setTimeout(()=>{
//     //         ws.send(JSON.stringify({"name":"on_state","payload":{"state":"betend","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":0}}))
//     //         setTimeout(()=>{
//     //             ws.send(JSON.stringify({"name":"on_state","payload":{"state":"launch","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":0}}))
//     //         },800)
//     //     },10)

//     //     setTimeout(()=>{
//     //         ws.send(JSON.stringify({"name":"on_state","payload":{"state":"bust","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":1.07}}))
//     //         ws.send(JSON.stringify({"name":"on_state","payload":{"state":"end","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":1.07}}))
//     //         setTimeout(()=>{

//     //             ws.send(JSON.stringify({"name":"on_state","payload":{"state":"ready","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":0}}))
//     //             setTimeout(()=>{
//     //                 ws.send(JSON.stringify({"name":"on_state","payload":{"state":"betend","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":0}}))
//     //                 setTimeout(()=>{
//     //                     ws.send(JSON.stringify({"name":"on_state","payload":{"state":"launch","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":0}}))
//     //                 },800)
//     //             },10)

//     // setTimeout(()=>{
//     //     ws.send(JSON.stringify({"name":"on_state","payload":{"state":"bust","gameID":1,"rocketID":6028,"chainID":191,"leftMS":0,"bust":1.07}}))
//     // },3000)

//     //         },3000)
//     //     },30000)

//     //     },2000)
//   });
// });




// socket.on('on_response', function(){console.log('event') });
// socket.on('get_account', function(){console.log('event') });
// socket.on('get_game_data', function(){console.log('event') });

// socket.on('response', function(){console.log('event') });
// socket.on('account', function(){console.log('event') });
// socket.on('get_game_data', function(){console.log('event') });

// socket.on("get_game_data",(soc)=>{
//     console.log('get_game_data');
// });
// socket.on("login",(soc)=>{
//     console.log('login');
// });


//server.listen(443);



