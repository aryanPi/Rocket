var logedIn = false;
var r = document.querySelector(":root");
const parentChannel = new BroadcastChannel("parent");
var parentBalance = undefined;
function PLACEBET() {
  var betAmt = document.getElementById("bid-amt");
  if (!betAmt.value || betAmt.value == 0) {
    betAmt.classList.add("inp-error");
  } else {
    betAmt.classList.remove("inp-error");
    if (logedIn) {
      parentChannel.postMessage({
        type: "click",
        btn: "run",
        bet: betAmt.value,
      });
    } else {
      login();
    }
  }
}

document.getElementById("play-btn").setAttribute("onclick", "PLACEBET()");

const login = () => {
  if (logedIn) {
    document.querySelector(".card").innerHTML = `
    <h3>Hi, ${uname}</h3>
    <br/>
    <p>You have $${parentBalance} balance </p><br/><a style='cursor:pointer;color:#ee2;'>Depost Now</a>
    `;
  }
  r.style.setProperty("--bg-blur", "10px");
  document.querySelector(".modal").style.display = "flex";
  document.querySelector(".modal").classList.remove("fade-out");
  document.querySelector(".modal").classList.add("fade-in");
  document.getElementsByTagName("body")[0].classList.add("body-blur");
};
document.getElementsByTagName("body")[0].classList.add("blur-out");
$(".modal").click(function (event) {
  if (
    !$(event.target).closest(".card").length &&
    !$(event.target).is(".card")
  ) {
    document.getElementsByTagName("body")[0].classList.add("blur-out");
    document.querySelector(".modal").classList.remove("fade-in");
    document.querySelector(".modal").classList.add("fade-out");
    setTimeout(() => {
      document.getElementsByTagName("body")[0].classList.remove("body-blur");
      document.querySelector(".modal").style.display = "none";
    }, 450);
    r.style.setProperty("--bg-blur", "0px");
  }
});

document.getElementById("loginbtn").setAttribute("onclick", "userAuthLogin()");

function userAuthLogin() {
  var uname = document.getElementById("uname");
  if (uname.value) {
    uname.classList.remove("inp-error");
    POSTREQ(
      "/login",
      { uname: uname.value },
      (data) => {
        var lb = document.getElementById("loginbtn");
        lb.style.backgroundColor = "#85d30f";
        lb.style.color = "black";
        lb.style.borderColor = "green";
        lb.innerHTML = "Success";
        uname.disabled = true;
        parentBalance = JSON.parse(data).balance;
        document.getElementById("balance").innerHTML = `$${parentBalance}`;
        logedIn = true;
      },
      errorCB
    );
  } else {
    uname.classList.add("inp-error");
  }
}

const errorCB = (e) => {
  console.log(e);
};

function POSTREQ(url, data, callback, errorCallback) {
  try {
    var n = new XMLHttpRequest();
    n.open("POST", url, !0),
      n.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      ),
      n.addEventListener
        ? n.addEventListener("loadend", function () {
            200 == n.status
              ? callback(n.responseText)
              : errorCallback(n.responseText);
          })
        : (n.onloadend = function () {
            200 == n.status
              ? callback(n.responseText)
              : errorCallback(n.responseText);
          }),
      n.send(JSON.stringify(data));
  } catch (s) {
    e(0);
  }
}

const LOADED = () => {
  POSTREQ(
    "/login",
    { uname: "" },
    (data) => {
      var lb = document.getElementById("loginbtn");
      lb.style.backgroundColor = "#85d30f";
      lb.style.color = "black";
      lb.style.borderColor = "green";
      lb.innerHTML = "Success";
      uname.disabled = true;
      parentBalance = JSON.parse(data).balance;
      document.getElementById("balance").innerHTML = `$${parentBalance}`;
      logedIn = true;
    },
    errorCB
  );
};
parentChannel.onmessage = (event) => {
  switch (JSON.parse(event.data).type) {
    case "balance":
       parentBalance = JSON.parse(event.data).data;
       break;
    case "changebalance":
      document.getElementById("balance").innerHTML = `$${parentBalance}`;
      break;
    case "autoplay":
      var d = JSON.parse(event.data);
      var playBTN = document.getElementById("play-btn");
      if (d.state == "init") {
        document.getElementById("play-btn").parentElement.style;
        playBTN.innerHTML = `Place Bet <span style="font-size: 1.15rem;"><small>(${d.data} rounds)</small></span>`;
      } else if (d.state == "running") {
        if (d.data[0] == 0) {
          playBTN.parentElement.style.backgroundColor = "#40d04f";
          playBTN.innerHTML = `Place Bet <span style="font-size: 1.15rem;"><small>(${d.data[1]} rounds)</small></span>`;
        } else {
          playBTN.parentElement.style.backgroundColor = "#dc3545";
          playBTN.innerHTML = `Stop <span style="font-size: 1.15rem;"><small>(${d.data[0]} left)</small></span>`;
        }
      } else if (d.state == "stop") {
        playBTN.parentElement.style.backgroundColor = "#40d04f";
        playBTN.innerHTML = "Place Bet";
      }
  }
};
