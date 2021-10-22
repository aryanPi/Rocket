var isStart = false;

function cashout() {
  socket.emit("user-call", { call: "cashout" });
}

var currentBid = 0;

var inGroup = false;
var myAuto = undefined;
var isIn = false;

var r = document.querySelector(":root");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
gameBody = document.getElementsByClassName("game-body")[0];
count = 150;
i = 0;

r.style.setProperty("--star-opac", `0`);


function plugins() {
  app.plugins.createHexagon({
    container: ".hexagon-border-40-44",
    width: 40,
    height: 44,
    lineWidth: 3,
    roundedCorners: true,
    roundedCornerRadius: 1,
    lineColor: "#293249",
  });
  app.plugins.createHexagon({
    container: ".hexagon-image-30-32",
    width: 30,
    height: 32,
    roundedCorners: true,
    roundedCornerRadius: 1,
    clip: true,
  });

  app.plugins.createHexagon({
    container: ".hexagon-progress-40-44",
    width: 40,
    height: 44,
    lineWidth: 3,
    roundedCorners: true,
    roundedCornerRadius: 1,
    gradient: {
      colors: ["#d9ff65", "#40d04f"],
    },
    scale: {
      start: 0,
      end: 1,
      stop: 0.8,
    },
  });
  app.plugins.createHexagon({
    container: ".hexagon-dark-16-18",
    width: 16,
    height: 18,
    roundedCorners: true,
    roundedCornerRadius: 1,
    lineColor: "#7750f8",
    fill: true,
  });
}

function PLAY() {
  if (
    !document
      .getElementById("play-btn")
      .parentElement.classList.contains("disable")
  )
    if (logedIn) {
      var bidAmt = document.getElementById("bid-amt");
      if (bidAmt.value == "" || !bidAmt.value) {
        bidAmt.classList.add("inp-error");
      } else {
        bidAmt.classList.remove("inp-error");
        socket.emit("user-call", {
          call: "bid",
          bid: bidAmt.value,
          auto: document.getElementById("auto-cashout").value,
        });
        myAuto=Number(document.getElementById("auto-cashout").value)
      }
    } else {
      login();
    }
}


function LOADED() {
  document.querySelectorAll(".simplebar-content")[2].innerHTML = "";
}
