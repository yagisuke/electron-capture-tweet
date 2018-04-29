/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main/index.js":
/*!***************************!*\
  !*** ./src/main/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _electron = __webpack_require__(/*! electron */ "electron");

var _trimDesktop = __webpack_require__(/*! ./trimDesktop */ "./src/main/trimDesktop.js");

var _trimDesktop2 = _interopRequireDefault(_trimDesktop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_electron.app.on('ready', function () {
    (0, _trimDesktop2.default)().then(function (_ref) {
        var sourceDisplay = _ref.sourceDisplay,
            trimmendBounds = _ref.trimmendBounds;

        console.log(sourceDisplay, trimmendBounds);
    });
});

/***/ }),

/***/ "./src/main/trimDesktop.js":
/*!*********************************!*\
  !*** ./src/main/trimDesktop.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _electron = __webpack_require__(/*! electron */ "electron");

function trimDesktop() {
    var displays = _electron.screen.getAllDisplays();
    return new Promise(function (resolve, reject) {
        var windows = displays.map(function (display, i) {
            var _display$bounds = display.bounds,
                x = _display$bounds.x,
                y = _display$bounds.y,
                width = _display$bounds.width,
                height = _display$bounds.height;

            display.name = 'Screen ' + (i + 1);
            var win = new _electron.BrowserWindow({
                frame: false,
                transparent: true,
                alwaysOnTop: true,
                x: x, y: y, width: width, height: height
            });

            win.loadURL('file://' + __dirname + '/../../index.html');

            return { win: win, display: display };
        });

        _electron.ipcMain.once('SEND_BOUNDS', function (e, _ref) {
            var trimmendBounds = _ref.trimmendBounds;

            var sourceDisplay = windows.find(function (w) {
                return w.win.webContents.id === e.sender.id;
            }).display;
            var profile = { sourceDisplay: sourceDisplay, trimmendBounds: trimmendBounds };
            windows.forEach(function (w) {
                return w.win.close();
            });
            resolve(profile);
        });
    });
}

exports.default = trimDesktop;

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map