var messageHandler = function (s) {
    "POST" === s.data.type
      ? post(
          s.data,
          function (s) {
            postMessage(s);
          },
          function (s) {
            postMessage(s);
          }
        )
      : "GET" === s.data.type
      ? get(
          s.data,
          function (s) {
            postMessage(s);
          },
          function (s) {
            postMessage(s);
          }
        )
      : postMessage(0);
  },
  post = function (s, t, e) {
    try {
      var n = new XMLHttpRequest(),
        a = s.url;
      s = s.data;
      n.open("POST", a, !0),
        n.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded; charset=UTF-8"
        ),
        n.addEventListener
          ? n.addEventListener("loadend", function () {
              200 == n.status
                ? t({ status: n.status, response: n.responseText })
                : e({ status: n.status, response: n.responseText });
            })
          : (n.onloadend = function () {
              200 == n.status
                ? t({ status: n.status, response: n.responseText })
                : e({ status: n.status, response: n.responseText });
            }),
        n.send(s);
    } catch (s) {
      e(0);
    }
  },
  get = function (s, t, e) {
    try {
      var n = new XMLHttpRequest(),
        a = s.url;
      n.open("GET", a, !0),
        (n.onreadystatechange = function () {
          4 == n.readyState &&
            (200 == n.status
              ? t({ status: n.status, response: n.responseText })
              : e({ status: n.status, response: n.responseText }));
        }),
        n.send();
    } catch (s) {
      e(0);
    }
  };
onmessage = messageHandler;
