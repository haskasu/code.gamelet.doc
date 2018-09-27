var gulp = require("gulp");
var gutil = require("gulp-util");
var ftp = require("vinyl-ftp");
var replace = require("gulp-replace");
var rename = require("gulp-rename");
var prompt = require("gulp-prompt");
var clean = require("gulp-clean");
var spawn = require("child_process").spawn;
const fs = require("fs");
var insert = require("gulp-insert");
var concat = require("gulp-concat");
var minify = require("gulp-minify");
let cleanCSS = require('gulp-clean-css');
var open = require('gulp-open');

let serverJson = JSON.parse(fs.readFileSync("server.json", "utf8"));
let locale_zh = { code: "zh", label: "繁體中文" };
let locale_en = { code: "en", label: "English" };
let locales_all = [locale_en, locale_zh];

function initLocalEnv() {
  local = true;
}

function ftpLog(message, params) {
  if (message.indexOf("UP ") == 0) {
    gutil.log(message, params);
  }
}
function getServerConnection() {
  return targetServer == "Release"
    ? getPubServerConnection()
    : getDevServerConnection();
}
function getPubServerConnection() {
  return ftp.create(
    Object.assign(
      {
        parallel: 6,
        log: ftpLog
      },
      serverJson
    )
  );
}

function cleanFolder(paths) {
  return new Promise((resolve, reject) => {
    gulp
      .src(paths, { read: false, allowEmpty: true })
      .pipe(clean())
      .resume()
      .on("end", () => {
        resolve();
      });
  });
}
function replaceContent(path, file, destFile, search, replaceString) {
  return new Promise((resolve, reject) => {
    gulp
      .src(path + file, { base: path })
      .pipe(replace(search, replaceString))
      .pipe(rename(destFile))
      .pipe(gulp.dest(path))
      .on("end", () => {
        resolve();
      });
  });
}

function execute(command, params, cb) {
  let process = spawn(command, params);
  process.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
  });

  process.on("error", err => {
    cb(err);
  });

  process.on("close", code => {
    console.log(`child process exited with code ${code}`);
    cb();
  });
}

function buildIntl(cb) {
  execute("sphinx-intl", ["build"], cb);
}

function replaceConfigTranslates(translates, locale) {
  if (!translates) {
    let translateJson = JSON.parse(
      fs.readFileSync("source/conf.translate.json", "utf8")
    );
    translates = [];
    for (let key in translateJson) {
      let value = translateJson[key][locale.code];
      translates.push({
        search: "%" + key + "%",
        replaceValue: value
      });
    }
  }

  if (translates.length) {
    let trans = translates.shift();
    return replaceContent(
      "./source/",
      "conf.py",
      "conf.py",
      new RegExp(trans.search, "g"),
      trans.replaceValue
    ).then(() => replaceConfigTranslates(translates, locale));
  }
  return Promise.resolve();
}

function buildAll() {
  return new Promise((resolve, reject) => {
    buildLocales(locales_all.slice(), err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function buildOne() {
  return new Promise((resolve, reject) => {
    buildLocales([locale_zh], err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function buildCgCss(_locale) {
  return new Promise((resolve, reject) => {
    gulp
      .src([
        "source/_assets/css/custom_pre.css",
        "source/_assets/css/custom." + _locale.code + ".css",
        "source/_assets/css/custom_post.css"
      ])
      .pipe(concat("cg.min.css"))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest("source/_static/css"))
      .on("end", () => {
        resolve();
      });
  });
}

function buildLocales(_locales, cb) {
  if (_locales.length) {
    let locale = _locales.shift();
    cleanFolder(["build/html", "docs/" + locale.code])
      .then(() =>
        replaceContent(
          "./source/",
          "conf.template.py",
          "conf.py",
          /%language%/g,
          locale.code
        )
      )
      .then(() =>
        replaceContent(
          "./source/",
          "conf.py",
          "conf.py",
          /%languages%/g,
          JSON.stringify(locales_all)
        )
      )
      .then(() =>
        replaceContent(
          "./source/",
          "conf.py",
          "conf.py",
          /%currentLanguageName%/g,
          locale.label
        )
      )
      .then(() => buildCgCss(locale))
      .then(() => replaceConfigTranslates(null, locale))
      .then(() => {
        execute(
          "make",
          ["-e", `SPHINXOPTS="-D language='${locale.code}'"`, "html"],
          err => {
            if (err) {
              cb(err);
            } else {
              gulp
                .src("build/html/**", { base: "./build/html" })
                .pipe(gulp.dest("docs/" + locale.code))
                .on("end", () => {
                  buildLocales(_locales, cb);
                });
            }
          }
        );
      });
  } else {
    cb();
  }
}

function getText(cb) {
  execute("make", ["gettext"], cb);
}

function updatePo(cb) {
  execute("sphinx-intl", ["update", "-p", "build/gettext"], cb);
}

gulp.task("build", gulp.series(buildIntl, buildAll));
gulp.task("buildone", gulp.series(buildOne));
gulp.task("intl", gulp.series(getText, updatePo));
gulp.task("open", function() {
    return gulp.src('./docs/index.html')
    .pipe(open({app: 'chrome'}));
})