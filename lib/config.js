var config = {};

config.timeout = null;
config.addon = {"state": {}};

config.welcome = {
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.options = {
  set x (val) {app.storage.write("x", val)},
  set y (val) {app.storage.write("y", val)},
  set size (val) {app.storage.write("size", val)},
  set width (val) {app.storage.write("width", val)},
  set color (val) {app.storage.write("color", val)},
  set zindex (val) {app.storage.write("zindex", val)},
  get x () {return app.storage.read("x") !== undefined ? app.storage.read("x") : "-1"},
  get y () {return app.storage.read("y") !== undefined ? app.storage.read("y") : "-1"},
  get size () {return app.storage.read("size") !== undefined ? app.storage.read("size") : "64"},
  get width () {return app.storage.read("width") !== undefined ? app.storage.read("width") : "1"},
  get color () {return app.storage.read("color") !== undefined ? app.storage.read("color") : "#b7b7b7"},
  get zindex () {return app.storage.read("zindex") !== undefined ? app.storage.read("zindex") : "2147483644"}
};
