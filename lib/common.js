var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    app.tab.query.active(function (tab) {
      app.button.icon(tab.id, config.addon.state[tab.id] !== undefined ? config.addon.state[tab.id] : "OFF");
    });
  },
  "update": {
    "page": function (tab, state) {
      app.page.send("gridmode", {
        "x": config.options.x,
        "y": config.options.y,
        "size": config.options.size,
        "width": config.options.width,
        "color": config.options.color,
        "zindex": config.options.zindex,
        ...(tab && state) && ({"state": config.addon.state[tab.id] !== undefined ? config.addon.state[tab.id] : "OFF"})
      }, tab ? tab.id : null, null);
    }
  },
  "action": {
    "storage": function (changes, namespace) {
      /*  */
    },
    "button": function () {
      app.tab.query.active(function (tab) {
        config.addon.state[tab.id] = config.addon.state[tab.id] === "ON" ? "OFF" : "ON";
        /*  */
        core.action.page.ruler(tab);
      });
    },
    "tab": {
      "removed": function (tabId) {
        const error = app.error();
        delete config.addon.state[tabId];
      },
      "updated": function (tab) {
        const error = app.error();
        config.addon.state[tab.id] = "OFF";
        app.button.icon(tab.id, config.addon.state[tab.id]);
      }
    },
    "options": {
      "x": function (e) {
        config.options.x = e;
        core.update.page(null, false);
      },
      "y": function (e) {
        config.options.y = e;
        core.update.page(null, false);
      },
      "size": function (e) {
        config.options.size = e;
        core.update.page(null, false);
      },
      "zindex": function (e) {
        config.options.zindex = e;
        core.update.page(null, false);
      },
      "width": function (e) {
        config.options.width = e;
        core.update.page(null, false);
      },
      "color": function (e) {
        config.options.color = e;
        core.update.page(null, false);
      },
      "load": function () {
        app.options.send("storage", {
          "x": config.options.x,
          "y": config.options.y,
          "size": config.options.size,
          "width": config.options.width,
          "color": config.options.color,
          "zindex": config.options.zindex
        });
      }
    },
    "page": {
      "button": function (e) {
        app.tab.query.active(function (tab) {
          app.button.icon(tab.id, e.icon);
        });
      },
      "escape": function (e) {
        app.tab.query.active(function (tab) {
          config.addon.state[tab.id] = e.state;
          /*  */
          core.action.page.ruler(tab);
        });
      },
      "ruler": function (tab) {
        if (tab) {
          if (tab.url) {
            const cond_1 = tab.url.indexOf("http") === 0;
            const cond_2 = tab.url.indexOf("file") === 0;
            /*  */
            if (cond_1 || cond_2) {
              app.button.icon(tab.id, config.addon.state[tab.id] !== undefined ? config.addon.state[tab.id] : "OFF");
              /*  */
              app.tab.inject.js({"target": {"tabId": tab.id}, "files": ["/data/content_script/inject.js"]}, function () {
                app.tab.inject.css({"target": {"tabId": tab.id}, "files": ["/data/content_script/inject.css"]}, function () {
                  if (config.timeout) clearTimeout(config.timeout);
                  config.timeout = setTimeout(function () {
                    core.update.page(tab, true);
                  }, 100);
                });
              });
            }
          }
        }
      }
    }
  }
};

app.button.on.clicked(core.action.button);

app.tab.on.updated(core.action.tab.updated);
app.tab.on.removed(core.action.tab.removed);

app.page.receive("button", core.action.page.button);
app.page.receive("escape", core.action.page.escape);

app.options.receive("load", core.action.options.load);
app.options.receive("size", core.action.options.size);
app.options.receive("width", core.action.options.width);
app.options.receive("color", core.action.options.color);
app.options.receive("position-x", core.action.options.x);
app.options.receive("position-y", core.action.options.y);
app.options.receive("zindex", core.action.options.zindex);

app.on.startup(core.start);
app.on.installed(core.install);
app.on.storage(core.action.storage);
