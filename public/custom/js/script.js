var socket = undefined;
var r = document.querySelector(":root");

const login = () => {
  if (logedIn) {
    document.querySelector(".card").innerHTML = `
    <h3>Hi, ${uname}</h3>
    <br/>
    <p>You have $${balance} balance </p><br/><a style='cursor:pointer;color:#ee2;'>Depost Now</a>
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

function getFullNum(num) {
  a = Number(num).toFixed(2);
  return (
    (String(a).split(".")[0].length == 1
      ? "0" + String(a).split(".")[0]
      : String(a).split(".")[0]) +
    "." +
    (String(a).split(".")[1].length == 1
      ? String(a).split(".")[1] + "0"
      : String(a).split(".")[1])
  );
}

function userAuthLogin() {
  if(uname==undefined)
  socket.emit("login", { uname: document.getElementById("uname").value });
}


document.getElementById("play-btn").setAttribute("onclick", "PLAY()");


function parent(data){
  if(data.type=='timer'){
    if(isIn)
    if(myAuto<=data.d)
    socket.emit('user-call',{call:'check-auto'})
  }else
  if(data.type=='socket'){
    socket=data.data;
    socket.on("logged-in", (data) => {
      document.getElementById("balance").innerHTML = "$" + Number(data.balance).toFixed(2);
      logedIn = true;
      uname = data.uname;
      balance = data.balance;
      document.getElementById('login-2').style.backgroundColor='rgb(64 208 79)'
      document.getElementById('login-2').innerHTML='Success'
    });
    
    socket.on("balance", (data) => {
      document.getElementById("balance").innerHTML = "$" + Number(data).toFixed(2);
      balance = data;
    });

    
    socket.on("user-call", (data) => {
      console.log(data, "user call");
      if (data.call == "new") {
        console.log("new user");
        if (data.uname == uname) {
          document.getElementById("play-btn").innerHTML = "Cashout";
          document.getElementById("enter-btn").setAttribute("onclick", "cashout()");
          document.getElementById('enter-btn').classList.add('disable')
          isIn = true;
        }
        var div = document.createElement("div");
    
        div.className = "chat-widget-message";
        div.innerHTML = `
        
              <div class="user-status">
                <div class="user-status-avatar">
                  <div class="user-avatar small no-outline online">
                    <div class="user-avatar-content">
                      <div class="hexagon-image-30-32" data-src="img/avatar/12.jpg" style="width: 30px; height: 32px; position: relative;"><canvas width="30" height="32" style="position: absolute; top: 0px; left: 0px;"></canvas></div>
                    </div>
                    <div class="user-avatar-progress" >
                      <div id='${
                        data.uname
                      }-progress' hidden class="hexagon-progress-40-44" style="width: 40px; height: 44px; position: relative;"><canvas width="40" height="44" style="position: absolute; top: 0px; left: 0px;"></canvas></div>
                    </div>
                    <div class="user-avatar-progress-border">
                      <div class="hexagon-border-40-44" style="width: 40px; height: 44px; position: relative;"><canvas width="40" height="44" style="position: absolute; top: 0px; left: 0px;"></canvas></div>
                    </div>
                    <div class="user-avatar-badge">
                      <div class="user-avatar-badge-border">
                        <div class="hexagon-22-24" style="width: 22px; height: 24px; position: relative;"><canvas width="22" height="24" style="position: absolute; top: 0px; left: 0px;"></canvas></div>
                      </div>
              
                      <div class="user-avatar-badge-content">
                        <div class="hexagon-dark-16-18" style="width: 16px; height: 18px; position: relative;"><canvas width="16" height="18" style="position: absolute; top: 0px; left: 0px;"></canvas></div>
                      </div>
                      <p class="user-avatar-badge-text">${
                        document.querySelectorAll(".simplebar-content")[2].children
                          .length + 1
                      }</p>
                    </div>
                  </div>
                </div>
                <p class="user-status-title">
                  <span class="bold">${data.uname}</span>
                </p>
                <p class="user-status-text small" id=''>
                  Bid of $${data.bid} 
                </p>
                <p class="user-status-timestamp floaty" id='${data.uname}-res' ></p>
              </div>
            `;
        document.querySelectorAll(".simplebar-content")[2].appendChild(div);
        plugins();
      } else if ((data.call = "user-cashout")) {
        if (data.uname == uname) {
          document
            .getElementById("play-btn")
            .parentElement.classList.add("disable");
          isIn = false;
        }
        //peopleOut(data.uname, data.cashout);
        document.getElementById(data.uname + "-res").innerHTML =
          "$" + data.cashout.toFixed(2);
        document.getElementById(`${data.uname}-progress`).hidden = false;
        document.getElementById(
          data.uname + "-res"
        ).previousElementSibling.innerHTML += ` Cashout on : <span style='color:greenyellow'>x${Number(data.multi).toFixed(2)}</span>`;
      }
    });

  }else{
    console.log(JSON.parse(data.data).payload.state)
    if(JSON.parse(data.data).payload.state=='ready'){
      isIn = false;
      document.getElementById('play-btn').innerHTML='Place Bet'
      document.getElementById('play-btn').setAttribute('onclick','PLAY()')
      document.querySelectorAll(".simplebar-content")[2].innerHTML='' 
      document.getElementById('play-btn').parentElement.classList.remove('disable')
    }else if(JSON.parse(data.data).payload.state=='launch'){
      if(isIn){
        document.getElementById('play-btn').parentElement.classList.remove('disable')
      }else{
        document.getElementById('play-btn').parentElement.classList.add('disable')
      }
    }
  }
}

var logedIn = false;
var uname = undefined;
var balance = 0;
