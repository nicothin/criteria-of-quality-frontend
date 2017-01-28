'use strict';

const exec = require('child_process').execSync;


// Ну, поазербайджаним!


console.log('Соответствие .editorconfig...');

exec('node_modules/.bin/eclint check test/**/*', (stdio) => {
  if (error) {
    console.error(`Ошибка exec: ${error}`);
    return;
  }
  if (stderr) {
    console.log(`Что-то пошло не так: ${stderr}`);
  }
  if (stdio) {
    console.log(stdio);
  }
  else {
    console.log('Соответствие .editorconfig: Успешно');
  }
});



// console.log('В разметке БЭМ...');
//
// exec('node_modules/.bin/bemlint --elem="__" --mod="--" test/**/*', (stdio) => {
//   if (error) {
//     console.error(`Ошибка exec: ${error}`);
//     return;
//   }
//   if (stderr) {
//     console.log(`Что-то пошло не так: ${stderr}`);
//   }
//   if (stdio) {
//     console.log(stdio);
//   }
//   else {
//     console.log('В разметке БЭМ: Успешно');
//   }
// });
