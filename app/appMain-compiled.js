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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/appMain.lsc");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/appMain.lsc":
/*!*************************!*\
  !*** ./app/appMain.lsc ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _crypto = __webpack_require__(/*! crypto */ "crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _chokidar = __webpack_require__(/*! chokidar */ "chokidar");

var _chokidar2 = _interopRequireDefault(_chokidar);

var _maybe = __webpack_require__(/*! folktale/maybe */ "folktale/maybe");

var _maybe2 = _interopRequireDefault(_maybe);

var _delay = __webpack_require__(/*! delay */ "delay");

var _delay2 = _interopRequireDefault(_delay);

var _del = __webpack_require__(/*! del */ "del");

var _del2 = _interopRequireDefault(_del);

var _config = __webpack_require__(/*! ../config.json */ "./config.json");

var _ffmpeg = __webpack_require__(/*! ./ffmpeg.lsc */ "./app/ffmpeg.lsc");

var _logging = __webpack_require__(/*! ./logging.lsc */ "./app/logging.lsc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tenSecondsAsMilliseconds = 10000;

// import { MaybeGetPath } from './utils.lsc'

var uniqueString = _crypto2.default.randomBytes(6).toString('hex');

var watcher = _chokidar2.default.watch(_config.dirToWatch, {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 6000,
    pollInterval: 100
  },
  ignoreInitial: true
});

watcher.on('add', function (filePath) {
  if (!shouldConvertVideo(filePath)) return _maybe2.default.Nothing();
  _logging.logger.info(filePath + ' has been added to folder. \nConversion will start in a moment...');
  return (0, _delay2.default)(tenSecondsAsMilliseconds).then(function () {
    return (0, _ffmpeg.convertVideo)(filePath, uniqueString);
  }).then(function () {
    return _logging.logger.info('finished conversion');
  }).then(function () {
    return (0, _del2.default)([filePath]);
  }) //move original file to trash
  .then(function () {
    return _logging.logger.info('deleted original file');
  }).catch(_logging.logger.error);
});

/*****
* The file will have .part if it's a jDownloader download, so we need to ignore that
* untill the download completes.
*
* We also need to check for a unique string, becuase once ffmpeg has finished converting,
* the new converted file shows up which triggers the watcher. So we need to ignore the new
* converted file as its already converted.
*/
function shouldConvertVideo(filePath) {
  return !filePath.endsWith('.part') && !filePath.includes(uniqueString);
}process.on('unhandledRejection', _logging.logger.error);
process.on('uncaughtException', _logging.logger.error);

/***/ }),

/***/ "./app/ffmpeg.lsc":
/*!************************!*\
  !*** ./app/ffmpeg.lsc ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertVideo = undefined;

var _util = __webpack_require__(/*! util */ "util");

var _child_process = __webpack_require__(/*! child_process */ "child_process");

var _path = __webpack_require__(/*! path */ "path");

var _path2 = _interopRequireDefault(_path);

var _ffmkek = __webpack_require__(/*! ffmkek */ "ffmkek");

var _ffmkek2 = _interopRequireDefault(_ffmkek);

var _config = __webpack_require__(/*! ../config.json */ "./config.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pExecFile = (0, _util.promisify)(_child_process.execFile);

function convertVideo(srcFilePath, uniqueString) {
  return new _ffmkek2.default().addInput(srcFilePath).addOption('-filter:v', 'setpts=PTS/' + _config.speed).addOption('-filter:a', 'atempo=' + _config.speed).addOption('-threads', '1').write(generateOutputFilePath(srcFilePath, uniqueString));
} // convertVideo(srcFilePath:string, uniqueString:string):Promise ->
//   pExecFile('ffmpeg', generateFFmpegParams(srcFilePath, uniqueString))
//     .then()


function generateOutputFilePath(srcFilePath, uniqueString) {
  var fileBaseName = _path2.default.basename(srcFilePath);
  var fileExtension = _path2.default.extname(fileBaseName);
  var outputFileName = fileBaseName.slice(0, fileBaseName.lastIndexOf(fileExtension)) + ('-converted-' + uniqueString) + fileExtension;

  return _path2.default.join(_config.dirToWatch, outputFileName);
} // generateFFmpegCommand(srcFilePath:string, uniqueString:string):string ->
//   `START /BELOWNORMAL ffmpeg -i ` +
//   srcFilePath +
//   ` -filter:v setpts=PTS/${ speed }` +
//   ` -filter:a atempo=${ speed }` +
//   ` -threads 1 ` +
//   generateOutputFilePath(srcFilePath, uniqueString)

// generateFFmpegParams(srcFilePath:string, uniqueString:string):Array<string> ->
//   [
//     '-i',
//     srcFilePath,
//     '-filter:v',
//     `"setpts=PTS/${ speed }"`,
//     '-filter:a',
//     `"atempo=${ speed }"`,
//     `-threads`,
//     `1`,
//     generateOutputFilePath(srcFilePath, uniqueString)
//   ]

exports.convertVideo = convertVideo;

/***/ }),

/***/ "./app/logging.lsc":
/*!*************************!*\
  !*** ./app/logging.lsc ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;

var _winston = __webpack_require__(/*! winston */ "winston");

var _winston2 = _interopRequireDefault(_winston);

__webpack_require__(/*! winston-daily-rotate-file */ "winston-daily-rotate-file");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileTransport = new _winston2.default.transports.DailyRotateFile({
  filename: 'auto-convert-talk-videos-%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 5
});

var transports = [fileTransport];

if (true) transports.push(new _winston2.default.transports.Console());

var logger = _winston2.default.createLogger({
  level: 'info',
  format:  true ? _winston2.default.format.prettyPrint() : undefined,
  transports: transports
});

exports.logger = logger;

/***/ }),

/***/ "./config.json":
/*!*********************!*\
  !*** ./config.json ***!
  \*********************/
/*! exports provided: dirToWatch, speed, default */
/***/ (function(module) {

module.exports = {"dirToWatch":"C:\\Users\\Coop\\Coding\\auto-convert-talk-videos\\testDir","speed":1.33};

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "chokidar":
/*!***************************!*\
  !*** external "chokidar" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("chokidar");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "del":
/*!**********************!*\
  !*** external "del" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("del");

/***/ }),

/***/ "delay":
/*!************************!*\
  !*** external "delay" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("delay");

/***/ }),

/***/ "ffmkek":
/*!*************************!*\
  !*** external "ffmkek" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ffmkek");

/***/ }),

/***/ "folktale/maybe":
/*!*********************************!*\
  !*** external "folktale/maybe" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("folktale/maybe");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),

/***/ "winston-daily-rotate-file":
/*!********************************************!*\
  !*** external "winston-daily-rotate-file" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston-daily-rotate-file");

/***/ })

/******/ });
//# sourceMappingURL=appMain-compiled.js.map