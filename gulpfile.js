var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var prompt = require('gulp-prompt');
var clean = require('gulp-clean');
var spawn = require('child_process').spawn;
const fs = require('fs');
var insert = require('gulp-insert');
var concat = require('gulp-concat');
var minify = require('gulp-minify');


let serverJson = JSON.parse(fs.readFileSync("server.json", "utf8"));
let locales = [
    {code: 'en', label: 'English'},
    {code: 'zh', label: '繁體中文'},
];

function initLocalEnv() {
    local = true;
}

function ftpLog(message, params) {
    if (message.indexOf('UP ') == 0) {
        gutil.log(message, params);
    }
}
function getServerConnection() {
    return targetServer == 'Release' ? getPubServerConnection() : getDevServerConnection();
}
function getPubServerConnection() {
    return ftp.create(Object.assign({
        parallel: 6,
        log: ftpLog
    }, serverJson));
}

function cleanFolder(paths) {
    return new Promise((resolve, reject) => {
        gulp.src(paths, { read: false, allowEmpty: true })
            .pipe(clean())
            .resume()
            .on('end', () => {
                resolve();
            });
    })
}
function replaceContent(path, file, search, replaceString) {
    return new Promise((resolve, reject) => {
        gulp.src(path + file, { base: path })
            .pipe(replace(search, replaceString))
            .pipe(gulp.dest(path))
            .on('end', () => {
                resolve();
            });
    })
}

function execute(command, params, cb) {
    let process = spawn(command, params);
    process.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    process.on('error', (err) => {
        cb(err);
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        cb();
    });
}

function buildIntl(cb) {
    execute('sphinx-intl', ['build'], cb);
}

function buildAll() {
    return new Promise((resolve, reject) => {
        buildLocales(locales.slice(), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })

}

function buildLocales(_locales, cb) {
    if (_locales.length) {
        let locale = _locales.shift();
        let html_context = JSON.stringify({languages: locales});
        cleanFolder(['build/html', 'docs/' + locale.code])
            .then(() => replaceContent('./source/', 'conf.py', /^language\s*=\s*\'.*\'/m, `language = '${locale.code}'`))
            .then(() => replaceContent('./source/', 'conf.py', /^html_context\s*=.*$/m, `html_context = ${html_context}`))
            .then(() => replaceContent('./source/_templates/', 'header.html', /\<span class=\"language-label\"\>.*\<\/span\>/, `<span class="language-label">${locale.label}</span>`))
            .then(() => {
                execute('make', ['-e', `SPHINXOPTS="-D language='${locale.code}'"`, 'html'], err => {
                    if (err) {
                        cb(err);
                    } else {
                        gulp.src('build/html/**', { base: './build/html' })
                            .pipe(gulp.dest('docs/' + locale.code))
                            .on('end', () => {
                                buildLocales(_locales, cb);
                            });
                    }
                });
            });
    } else {
        cb();
    }
}


function getText(cb) {
    execute('make', ['gettext'], cb);
}

function updatePo(cb) {
    execute('sphinx-intl', ['update', '-p', 'build/gettext'], cb);
}

gulp.task('build', gulp.series(buildIntl, buildAll));
gulp.task('intl', gulp.series(getText, updatePo));


