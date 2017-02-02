'use strict';

// "lint": "eclint check test/**/* && bemlint --elem='__' --mod='--' test/**/*.html && htmllint test/**/*.html",

const gulp = require('gulp');
const eclint = require('eclint');
const path = require('path');
const chalk = require('chalk');
const error = chalk.red;
const exec = require('child_process').exec;

const testPath = 'test/**/*';

gulp.task('bemlint:check', function (callback) {
  return exec('bemlint --elem="__" --mod="--" -f="json" test/**/*.html', function (err, stdout, stderr) {
    if (stdout) {
      let out = JSON.parse(stdout);
      out.forEach(function(fileData, i) {
        if (fileData.messages) {
          let relativePath = path.relative('.', fileData.filePath);
          let now = new Date();
          fileData.messages.forEach(function(message) {
            console.log(error(formatDate(now) + 'BEM ERROR: ') + relativePath + ':', 'line ' + message.line + ':' + message.column + ': ' + message.message + '(' + message.isBlockModNoBlock + ')');
          });
        }
      });
    }
    if (stderr) {
      console.log('stderr: ' + stderr);
    }
    if (err) {
      callback(err);
    }
  });
});

gulp.task('editorconfig:check', function(callback) {
  let hasErrors = false;
  let stream = gulp.src(testPath)
    .pipe(eclint.check({
      reporter: function(file, message) {
        hasErrors = true;
        let relativePath = path.relative('.', file.path);
        let now = new Date();
        console.log(error(formatDate(now) + 'FORMATTING ERROR: ') + relativePath + ':', message);
      }
    }));
  stream.on('finish', function() {
    callback();
    if (hasErrors) {
      process.exit(1);
    }
  });
  return stream;
});

gulp.task('lint', gulp.series(
  'bemlint:check',
  'editorconfig:check'
));

gulp.task('default',  gulp.series(
  'lint'
));

function formatDate(date) {
  var hh = date.getHours();
  if (hh < 10) hh = '0' + hh;
  var mm = date.getMinutes();
  if (mm < 10) mm = '0' + mm;
  var ss = date.getSeconds();
  if (ss < 10) ss = '0' + ss;
  return '[' +hh + ':' + mm + ':' + ss + '] ';
}
