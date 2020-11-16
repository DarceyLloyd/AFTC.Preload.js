@echo off

:: Might need to do
:: npm cache clean --force
:: npm install -g npm@latest

:: call npm init -y
:: Update package.json with
::  "scripts": {
::    "build": "gulp build",
::    "watch": "gulp watch"
::  },

del "package.json"
del "package-lock.json"
rmdir /S /Q "node_modules"

call npm init -y

:: main
call npm i -D aftc.js


:: libs


:: build
call npm i -D gulp
call npm i -D gulp-concat
call npm i -D gulp-terser


::call npm i -D yarn-upgrade-all