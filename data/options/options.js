var background = (function () {
  let tmp = {};
  chrome.runtime.onMessage.addListener(function (request) {
    for (let id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-options") {
          if (request.method === id) {
            tmp[id](request.data);
          }
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {
      tmp[id] = callback;
    },
    "send": function (id, data) {
      chrome.runtime.sendMessage({
        "method": id, 
        "data": data,
        "path": "options-to-background"
      }, function () {
        return chrome.runtime.lastError;
      });
    }
  }
})();

var config = {
  "render": function (e) {
    const size = document.getElementById("size");
    const width = document.getElementById("width");
    const color = document.getElementById("color");
    const x = document.getElementById("position-x");
    const y = document.getElementById("position-y");
    const zindex = document.getElementById("zindex");
    /*  */
    x.value = e.x;
    y.value = e.y;
    size.value = e.size;
    width.value = e.width;
    color.value = e.color;
    zindex.value = e.zindex;
  },
  "load": function () {
    const size = document.getElementById("size");
    const width = document.getElementById("width");
    const color = document.getElementById("color");
    const x = document.getElementById("position-x");
    const y = document.getElementById("position-y");
    const zindex = document.getElementById("zindex");
    /*  */
    color.addEventListener("input", function (e) {
      background.send("color", e.target.value);
    });
    /*  */
    size.addEventListener("input", function (e) {
      const value = e.target.value;
      background.send("size", value >= 0 ? value : 0);
    });
    /*  */
    zindex.addEventListener("input", function (e) {
      const value = e.target.value;
      background.send("zindex", value);
    });
    /*  */
    width.addEventListener("input", function (e) {
      const value = e.target.value;
      background.send("width", value >= 0 ? value : 0);
    });
    /*  */
    x.addEventListener("input", function (e) {
      const value = e.target.value;
      background.send("position-x", value);
    });
    /*  */
    y.addEventListener("input", function (e) {
      const value = e.target.value;
      background.send("position-y", value);
    });
    /*  */
    background.send("load");
  }
};

background.receive("storage", config.render);
window.addEventListener("load", config.load, false);
