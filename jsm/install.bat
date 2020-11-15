@echo off

:: Might need to do
:: npm cache clean --force
:: npm install -g npm@latest

:: call npm init -y
:: Update package.json with
::  "scripts": {
::    "build": "webpack --config webpack.prod.js",
::    "buildDev": "webpack --config webpack.dev.js",
::  },

del "package.json"
del "package-lock.json"
rmdir /S /Q "node_modules"

call npm init -y

:: main
call npm i -S aftc-modules 

:: libs
call npm i -D aftc.js

:: build
call npm i -D @babel/core
call npm i -D @babel/plugin-proposal-class-properties
call npm i -D @babel/plugin-transform-classes
call npm i -D @babel/polyfill
call npm i -D @babel/preset-env
call npm i -D @webpack-cli/init
call npm i -D babel-loader
call npm i -D core-js
call npm i -D webpack
call npm i -D webpack-cli
call npm i -D webpack-dev-server
call npm i -D webpack-merge

::call npm i -D yarn-upgrade-all