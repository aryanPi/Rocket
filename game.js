const fs = require("fs");
var cursor = undefined;

function setCursor(c) {
  cursor = c;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

async function getGame(bet, res, uname) {
  var validate = await cursor(
    `select * from users where balance > ${Number(bet)} and uname = '${uname}';`
  );
  if (validate.length) {
    var d = undefined;
    var localBalance = validate[0].balance;

    fs.readFile("./outcomes/win-0.json", "utf-8", async (err, json) => {
      d = JSON.parse(json);
      d = d[getRandomInt(0, d.length)];
      localBalance -= bet;
      localBalance += d["state.gameparts.main.totalbetmultiplier"] * bet;
      await cursor(`update users set balance = ${localBalance};`);
      res.end(
        JSON.stringify({
          classname: "tk.ServerResponse",
          requestid: "2",
          serviceresponses: [
            {
              classname: "tk.gs.rs.NewGameRoundResponse",
              requesttype: "gs.newgameround",
              serviceid: "gameservice",
              gameresponses: [
                {
                  requesttype: "main.spin",
                  classname: "tk.g.slots.vanilla.rs.SpinResponse",
                  state: {
                    classname: "tk.d.slots.vanilla.state.ServerState",
                    respondinggamepartid: "main",
                    activegamepartid: "main",
                    gameparts: {
                      main: {
                        classname:
                          "com.thunderkick.game.slot.vanilla.gamespecific.astronaut.AstronautGamePartState",
                        name: "main",
                        ended: true,
                        reelindices: d["state.gameparts.main.reelindices"],
                        initialsymbols:
                          d["state.gameparts.main.initialsymbols"],
                        finalsymbols: d["state.gameparts.main.finalsymbols"],
                        excitingreelsfrom: [-1, -1, -1, -1, -1],
                        excitingreelsto: [-1, -1, -1, -1, -1],
                        excitingsymbolsfrom: [
                          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 5, 5, -1,
                          -1,
                        ],
                        excitingsymbolsto: [
                          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                          -1, -1,
                        ],
                        initialspins: 1,
                        spinsleft: 0,
                        totalspins: 1,
                        respins: 0,
                        initialPicks: 0,
                        picksTotal: 0,
                        picksLeft: 0,
                        winningsareprogressive: true,
                        multiplier: d["state.gameparts.main.multiplier"],
                        nextmultiplier: 1,
                        currentspinbetmultiplier:
                          d["state.gameparts.main.currentspinbetmultiplier"],
                        currentspinwinamount:
                          d["state.gameparts.main.currentspinwinamount"] * bet,
                        totalbetmultiplier:
                          d["state.gameparts.main.totalbetmultiplier"],
                        totalwinamount:
                          d["state.gameparts.main.totalbetmultiplier"] * bet,
                        currentreelstripstoreelmap: [0, 1, 2, 3, 4],
                        nextreelstripstoreelmap: [0, 1, 2, 3, 4],
                        hasinwinityspins: false,
                        pickedDoor: -1,
                        triggerCount: -1,
                        potwinsym: d["state.gameparts.main.potwinsym"],
                        generatedStickyWildLocation: -1,
                      },
                    },
                    gamepartsstack: ["main"],
                    totalbetmultiplier: d["state.totalbetmultiplier"],
                    totalwinamount: d["outcome.totalwinamount"] * bet,
                    iscapped: false,
                    bets: [
                      {
                        value: {
                          classname: "tk.d.finance.Money",
                          amount: bet,
                          currencyiso: "EUR",
                        },
                      },
                    ],
                  },
                  outcome: {
                    classname: "tk.d.slots.vanilla.outcome.SpinOutcome",
                    gamepartsstack: ["main"],
                    multiplier: 1,
                    winningsareprogressive: true,
                    totalbetmultiplier: d["outcome.totalbetmultiplier"],
                    totalwinamount: d["outcome.totalbetmultiplier"] * bet,
                    winnings: d["outcome.winnings"],
                  },
                },
              ],
              updatedaccounts: [
                {
                  classname: "tk.d.finance.Account",
                  id: "FPA-1634334227568240004",
                  type: "FREE",
                  balance: localBalance,
                  currencyiso: "EUR",
                  locked: false,
                  priority: 0,
                },
              ],
              gameover: true,
              replayid:
                "b2763677ac547cbd52f505991143ed64f43f7a29fb0694591b70cf220921950498d1f32cfe07c776d60de16788aa0b46",
              gameroundid: "1634334237627240001",
            },
          ],
        })
      );
    });
  }
}

async function getConfig(res) {
  fs.readFile("./outcomes/config.json", "utf-8", (err, json) => {
    res.end(json);
  });
}

module.exports.getGame = getGame;
module.exports.getConfig = getConfig;
module.exports.setCursor = setCursor;
