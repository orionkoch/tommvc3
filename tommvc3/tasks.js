const sass = require("node-sass"),
    fs = require("fs"),
    uglify = require("uglify-es"),
    glob = require("globby"),
    headerFile = "./Views/Shared/_Layout.cshtml";

let ENV = "Production";

console.log("***** Starting Node Build *****");
console.log("***** Environment: ", ENV);

buildStyles();  // Compile Sass with sourcemaps
updateHeader(); // Update cache-busting query strings on client assets

function buildStyles() {
    console.log("***** Building Styles - ", (new Date()).toLocaleTimeString());
    let g = glob("./Content/sass/*.scss")
        g.then((files) => {
        let i = files.length - 1;
        for (; i >= 0; i--) {
            buildStylesheet(files[i]);
        }
    }).catch((error) => console.log("Error building stylesheet: ", error));
}

function buildStylesheet(file, output) {
    let fileName = file.split("/").pop().replace(".scss", "");
    output = output || "./Content/css/" + fileName + ".css";
    if (fileName[0] == "_") return;
    let options = {
        file: "./Content/sass/" + fileName + ".scss",
        outFile: output,
        outputStyle: "compressed",
    };
    if (ENV == "debug") {
        Object.assign(options, {
            outputStyle: "nested",
            sourceMap: true,
            sourceMapEmbed: true,
        });
    }
    sass.render(options, function (err, result) {
        if (!err) {
            fs.writeFile(output, result.css, function (error) {
                if (error) console.log("Error (sass writeFile): " + error);
            });
        } else {
            console.log("Error (sass.render): " + err);
        }
    });
};

function updateHeader() {
    console.log("***** Updating Header");
    fs.readFile(headerFile, "utf8", function (err, data) {
        if (err) console.log("Error (header file read): ", err);
        fs.writeFile(headerFile, rewriteQueryString(data), "utf8", (err) => { if (err) console.log("Error (header file write): ", err); });
    });
}

function rewriteQueryString(input) {
    let queryString = /\?version=[0-9]+/g,
		newQueryString = "?version=" + dateString();
    return input.replace(queryString, newQueryString);
}

function dateString() {
    var now = new Date(),
        DD = dateFormat(now.getDate()),
        MM = dateFormat(now.getMonth() + 1),
        YYYY = now.getFullYear(),
        hh = dateFormat(now.getHours()),
        mm = dateFormat(now.getMinutes()),
        ss = dateFormat(now.getSeconds());
    return MM + DD + YYYY + hh + mm + ss;
}

function dateFormat(date) {
    if (date < 10) { date = '0' + date; }
    return date.toString();
}