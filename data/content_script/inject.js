if (!background) {
  var background = (function () {
    let tmp = {};
    /*  */
    chrome.runtime.onMessage.addListener(function (request) {
      for (let id in tmp) {
        if (tmp[id] && (typeof tmp[id] === "function")) {
          if (request.path === "background-to-page") {
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
          "path": "page-to-background"
        }, function () {
          return chrome.runtime.lastError;
        });
      }
    }
  })();

  var config = {
    "action": function (e) {
      const root = document.querySelector(":root");
      /*  */
      root.style.setProperty("--grid-x", e.x + "px");
      root.style.setProperty("--grid-y", e.y + "px");
      root.style.setProperty("--line-color", e.color);
      root.style.setProperty("--grid-zindex", e.zindex);
      root.style.setProperty("--grid-size", e.size + "px");
      root.style.setProperty("--line-width", e.width + "px");
      /*  */
      if ("state" in e) {
        config.grid[e.state === "ON" ? "show" : "hide"]();
      }
    },
    "grid": {
      "element": {},
      "hide": function () {
        if (config.grid.element.container) {
          config.grid.element.container.remove();
        }
        /*  */
        document.removeEventListener("keydown", config.grid.keydown);
      },
      "show": function () {
        let target = document.querySelector(".gridmode-container");
        if (!target) {
          config.grid.element.container = document.createElement("div");
          config.grid.element.container.className = "gridmode-container";
          /*  */
          background.send("button", {"icon": "ON"});
          document.body.appendChild(config.grid.element.container);
          document.addEventListener("keydown", config.grid.keydown);
        }
      },
      "keydown": function (e) {
        if (e.keyCode) {
          if (e.isTrusted) {
            if (e.keyCode === 27) {
              e.stopPropagation();
              if (e.cancelable) e.preventDefault();
              /*  */
              background.send("escape", {"state": "OFF"});
            }
          }
        }
      }
    }
  };
  /*  */
  background.receive("gridmode", config.action);
}
