const electron = require("electron");
const fs = require("fs");
const moment = require("moment");
const needle = require("needle");
const url = require("url");
const path = require("path");
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
//creates the main window
app.on("ready", function () {
  mainWindow = new BrowserWindow({
    height: 250,
    width: 300,
    icon: "assests/icons/win/swiss3.ico",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //properties of the window
  // mainWindow.removeMenu();
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "home.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  //the request from the api
  const download = (uri, filename) => {
    let out = fs.createWriteStream(filename);
    needle
      .get(uri, (error, res) => {
        if (!error && res.statusCode == 200) return res.body;
        else mainWindow.webContents.send("error1", error);
      })
      .pipe(out)
      .on("finish", function () {
        mainWindow.webContents.send("finishDownload", "whoooooooh!");
      })
      .on("error", function (err) {
        console.log("ERROR:" + err);
        mainWindow.webContents.send("error1", err);
        out.read();
      });
  };

  //the from the user to the server
  ipcMain.on("item:add", (e, item) => {
    const desktop = path.join("E://User//Desktop//", date);
    // item is the name from the form
    //triggres the request
    download(
      "https://www.google.com/images/srpr/logo3w.png",
      path.join(downloadPath(desktop), item.concat(".png"))
    );
  });

  //close it
  mainWindow.on("closed", function () {
    app.quit();
  });
});

//extras

//makes the path to download to
const date = moment().format("DD-MM-YYYY");
const downloadPath = (path1) => {
  if (!fs.existsSync(path1)) {
    fs.mkdirSync(path1);
  }
  return path1;
};
