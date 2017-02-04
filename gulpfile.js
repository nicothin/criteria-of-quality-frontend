'use strict';

// "lint": "eclint check test/**/* && bemlint --elem='__' --mod='--' test/**/*.html && htmllint test/**/*.html",

const gulp = require('gulp');
const eclint = require('eclint');
const path = require('path');
const exec = require('child_process').exec;

const testPath = 'test/**/*';

gulp.task('bemlint:check', function (callback) {
  return exec('bemlint --elem="__" --mod="--" -f="json" '+testPath+'.html', function (err, stdout, stderr) {
    if (stdout) {
      let out = JSON.parse(stdout);
      out.forEach(function(fileData, i) {
        if (fileData.messages) {
          let relativePath = path.relative('.', fileData.filePath);
          fileData.messages.forEach(function(message) {
            console.log(relativePath + ': line ' + message.line + ', col ' + message.column + ', BEM: ' + message.message);
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
        console.log(relativePath + ':', message);
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
