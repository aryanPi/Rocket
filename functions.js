const mysql = require("mysql");
const util = require("util");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { config } = require("./config");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");

// ---------------------Crash-------------------------------
const salt = "0000000000000000000fa3b65e43e4240d71762a5bf397d5304b2596d116859c";
var game_hash =
  "100af1b49f5e9f87efc81f838bf9b1f5e38293e5b4cf6d0b366c004e0a8d9987";

game_hash = "c65e7a0cad7eb9eed50ba18d5106726da4bfc0542a4fdf6641c409a19050ec1a";

var GLOBAL = {
  a: 0,
  b: 0,
  multiplier: 0,
  time: 0,
  roundCount: 0,
  state: "WAITING",
  betting: false,
  isRunning:false,
  isBidding:true,
};

var multiplier = 0;

function getNewTime() {
  var h = crypto.createHmac("sha256", game_hash).update(salt).digest("hex");
  cursor(`update data set hash = '${h}' where hash != '' ;`);
  game_hash = h;
  console.log(h);
  var res = -1;
  if (parseInt(h, 16) % 33 == 0) {
    res = 1;
  } else {
    h = parseInt(h.substr(0, 13), 16);
    var e = Math.pow(2, 52);
    res = (100 * e - h) / (e - h) / 100.0;
  }

  return 1.3
  //return Number(res.toFixed(4));
}

// ---------------------------------------------------

init = () => {
  GLOBAL.state = "RUNNING";
  GLOBAL.time = new Date().getTime();
  GLOBAL.isRunning = true;
  GLOBAL.isBidding=false;
  console.log(new Date(GLOBAL.time).toLocaleTimeString());
  io.emit(
    "onmessage",
    JSON.stringify({
      name: "on_state",
      payload: {
        state: "launch",
        gameID: 1,
        rocketID: GLOBAL.roundCount,
        chainID: 191,
        leftMS: 50000,
        bust: 0,
      },
    })
  );
  GLOBAL.a = 0.1;
  GLOBAL.b = 0.005;
  GLOBAL.multiplier = 1;
  multiplier = getNewTime();
  console.log(multiplier);
  c();
};

c = () => {
  if (Number(multiplier) < Number(GLOBAL.multiplier)) {
    GLOBAL.roundCount++;
    GLOBAL.isRunning = false;
    GLOBAL.isBidding=false;
    io.emit(
      "onmessage",
      JSON.stringify({
        name: "on_state",
        payload: {
          state: "betend",
          gameID: 1,
          rocketID: GLOBAL.roundCount,
          chainID: 191,
          leftMS: 0,
          bust: GLOBAL.multiplier,
        },
      })
    );
    GLOBAL.state = "BUSTED";

    io.emit(
      "onmessage",
      JSON.stringify({
        name: "on_state",
        payload: {
          state: "bust",
          gameID: 1,
          rocketID: GLOBAL.roundCount,
          chainID: 191,
          leftMS: 0,
          bust: GLOBAL.multiplier,
        },
      })
    );
    setTimeout(() => {
      GLOBAL.state = "BETTING";
      io.emit(
        "onmessage",
        JSON.stringify({
          name: "on_state",
          payload: {
            state: "end",
            gameID: 1,
            rocketID: GLOBAL.roundCount,
            chainID: 191,
            leftMS: 0,
            bust: GLOBAL.multiplier,
          },
        })
      );
      setTimeout(() => {
        GLOBAL.isBidding=true;
        io.emit(
          "onmessage",
          JSON.stringify({
            name: "on_state",
            payload: {
              state: "ready",
              gameID: 1,
              rocketID: GLOBAL.roundCount,
              chainID: 191,
              leftMS: 12000,
              balances: 10,
              balance:10,
              bust: 0,
            },
          })
        );
        setTimeout(() => {
          GLOBAL.betting = false;
        }, 11500);
      }, 3000);
    }, 1000);

    setTimeout(() => {
      setTimeout(() => {
        init();
      });
    }, 15000);
    crash.reset()
    console.log("rr");
  } else {
    GLOBAL.a += GLOBAL.b;
    GLOBAL.multiplier = Math.pow(1.13, GLOBAL.a);
    // console.log(GLOBAL.multiplier);
    //GLOBAL.multiplier += (new Date().getTime() - GLOBAL.time) / 200000;
    io.emit("timmer", GLOBAL.multiplier);
    setTimeout(() => {
      c();
    }, 10);
  }
};

var io = undefined,
  MemoryStore = undefined;
function IN(i, ms) {
  io = i;
  MemoryStore = ms;
  init();
}

const sql = mysql.createConnection({
  host: config.databaseHost,
  port: config.databasePort,
  user: config.databaseUser,
  password: config.databasePassword,
  database: config.databaseDatabase,
});
const cursor = util.promisify(sql.query).bind(sql);

class CrashGame {
  constructor(io) {
    this.sql = mysql.createConnection({
      host: config.databaseHost,
      port: config.databasePort,
      user: config.databaseUser,
      password: config.databasePassword,
      database: config.databaseDatabase,
    });
    this.cursor = util.promisify(this.sql.query).bind(this.sql);

    this.isBidding = false;
    this.sockets = [];
    this.users = {};
    this.io = io;
    this.isRunning = false;
    this.currentTimer = 0;
    this.targetTimmer = 0;
    this.inGameUsers = {};
  }

  userJoin = (socket, uname, balance) => {
    if (this.users[socket.id] != undefined) return;
    console.log(uname)
    this.users[socket.id] = { uname: uname, balance: balance };

    socket.on("user-call", (data) => {
      console.log(data)
      if (data.call == "bid") {
        if (!GLOBAL.isRunning && GLOBAL.isBidding){
          console.log(GLOBAL.isBidding,GLOBAL.isRunning)
          if (data.bid > this.users[socket.id].balance) {
            socket.emit("bid-error");
          } else {
            if (this.inGameUsers[this.users[socket.id].uname] != undefined)
              return;
              console.log(this.users[socket.id].uname)
            this.inGameUsers[this.users[socket.id].uname] = {
              bid: data.bid,
              auto: data.auto,
              cashout: false,
            };
            this.users[socket.id].balance -= data.bid;
            socket.emit("balance", this.users[socket.id].balance);
            this.cursor(
              `update users set balance = ${
                this.users[socket.id].balance
              } where uname = '${this.users[socket.id].uname}';`
            );
  
            this.io.emit("user-call", {
              call: "new",
              uname: this.users[socket.id].uname,
              bid: data.bid,
            });
            console.log("usercall");
          }
        }
        
      } else if (data.call == "check-auto") {
        if (
          !GLOBAL.isBidding &&
          GLOBAL.isRunning &&
          this.inGameUsers[this.users[socket.id].uname].cashout == false &&
          this.inGameUsers[this.users[socket.id].uname].auto <=GLOBAL.multiplier
        ) {
          var cashout =
            this.inGameUsers[this.users[socket.id].uname].auto *
            this.inGameUsers[this.users[socket.id].uname].bid;
          this.inGameUsers[this.users[socket.id].uname].cashout = cashout;
          this.users[socket.id].balance += cashout;

          this.cursor(
            `update users set balance = ${
              this.users[socket.id].balance
            } where uname = '${this.users[socket.id].uname}';`
          );
          socket.emit("balance", this.users[socket.id].balance);
          this.io.emit("user-call", {
            call: "user-cashout",
            uname: this.users[socket.id].uname,
            cashout: cashout,
            multi: this.inGameUsers[this.users[socket.id].uname].auto,
          });
        }
      } else if (data.call == "cashout") {
        if (
          !GLOBAL.isBidding &&
          GLOBAL.isRunning &&
          this.inGameUsers[this.users[socket.id].uname].cashout == false
        ) {
          console.log('cashout');
          var multi = GLOBAL.multiplier;
          var cashout =
            multi * this.inGameUsers[this.users[socket.id].uname].bid;
          this.inGameUsers[this.users[socket.id].uname].cashout = cashout;
          this.users[socket.id].balance += cashout;

          this.cursor(
            `update users set balance = ${
              this.users[socket.id].balance
            } where uname = '${this.users[socket.id].uname}';`
          );
          socket.emit("balance", this.users[socket.id].balance);

          this.io.emit("user-call", {
            call: "user-cashout",
            uname: this.users[socket.id].uname,
            cashout: cashout,
            multi: multi,
          });
          console.log('cashout',cashout,multi);
        }else{
          console.log(!this.isBidding ,this.isRunning ,this.inGameUsers[this.users[socket.id].uname] )
        }
      }
    });
  };


  reset=()=>{
    this.inGameUsers = {}
  }
}

var crash = undefined;
function initCrash(io) {
  crash = new CrashGame(io);
}

async function login(data, socket) {
  var check = await cursor(
    `select * from users where uname = '${data.uname}';`
  );
  var uid = new Date().getTime() + uuidv4();
  if (!check.length) {
    await cursor(`insert into users values('${data.uname}',1000,'${uid}')`);
  } else {
    await cursor(
      `update users set login_key ='${uid}' where uname = '${data.uname}';`
    );
  }
  socket.emit("auth", { action: uid });
}

async function loginv2(req, res) {
  var check = await cursor(
    `select * from users where login_key='${req.params.id}';`
  );
  if (check.length) {
    req.session.uid = check[0].uname;
  }
  res.redirect("/");
}

var loggedInUsers = [];

async function initSocket(socket) {
  socket.on("login", async (data) => {
    console.log('ll')
    var data2 = await cursor(`select * from users where uname = '${data.uname}'`);
    var balance ;
    if (data2.length == 0) {
        balance = 1000;
        await cursor(`insert into users values('${data.uname}',1000)`)
    }else{
        balance = data2[0].balance;
    }
    socket.emit("logged-in", { balance: balance, uname: data.uname });
    crash.userJoin(socket, data.uname, balance);
    // socket.on("disconnect", (sock) => {
    //   loggedInUsers.splice(loggedInUsers.indexOf(sock.id), 1);
    // });
  });

  var uname = "";
  const cookieString = socket.request.headers.cookie;
  if (cookieString) {
    const cookieParsed = cookie.parse(cookieString);
    if (cookieParsed) {
      if (cookieParsed.sid) {
        MemoryStore.get(
          cookieParser.signedCookie(cookieParsed.sid, "secretCode!"),
          (err, session) => {
            if (err) console.log("error upper");
            if (JSON.stringify(session)) {
              if (JSON.parse(JSON.stringify(session))["uid"]) {
                uname = JSON.parse(JSON.stringify(session))["uid"];
              }
            }
          }
        );
      }
    }
  }

  if (uname == "") return;
  var data = await cursor(`select * from users where uname = '${uname}'`);
  if (data.length == 0) return;
  socket.emit("logged-in", { balance: data[0].balance, uname: uname });
  crash.userJoin(socket, data.uname, balance);

}

module.exports.login = login;
module.exports.loginv2 = loginv2;
module.exports.initSocket = initSocket;
module.exports.initCrash = initCrash;
module.exports.IN = IN;
