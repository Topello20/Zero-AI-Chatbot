const fs = require("fs");

let html = fs.readFileSync("src/index.html", "utf8");

html = html.replace("../dist/script.js", "script.js");

fs.writeFileSync("dist/index.html", html);
fs.copyFileSync("src/style.css", "dist/style.css");