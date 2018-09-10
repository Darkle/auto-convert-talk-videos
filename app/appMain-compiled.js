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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("folktale/maybe");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = undefined;

var _os = __webpack_require__(5);

var _os2 = _interopRequireDefault(_os);

var _path = __webpack_require__(2);

var _path2 = _interopRequireDefault(_path);

var _chokidar = __webpack_require__(6);

var _chokidar2 = _interopRequireDefault(_chokidar);

var _maybe = __webpack_require__(0);

var _maybe2 = _interopRequireDefault(_maybe);

var _jsonfile = __webpack_require__(7);

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _ffmpeg = __webpack_require__(8);

var _logging = __webpack_require__(3);

var _utils = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configFilePath = _path2.default.join(_os2.default.homedir(), 'auto-convert-talk-videos-config.json');
var config = _jsonfile2.default.readFileSync(configFilePath);

function getConfig() {
  return config;
}var watcher = _chokidar2.default.watch(getConfig().dirToWatch, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  awaitWriteFinish: true,
  ignoreInitial: true
});

watcher.on('add', function (filePath) {
  if (!shouldConvertVideo(filePath)) return _maybe2.default.Nothing();
  (0, _ffmpeg.addFileToConversionQueue)(filePath);
  return (0, _ffmpeg.convertVideo)();
});

/*****
* The file will have .part or .dashVideo or .dashAudio if it's a jDownloader download,
* so we need to ignore that until the download completes.
*
* We also need to check for a unique string, becuase once ffmpeg has finished converting,
* the new converted file shows up which triggers the watcher. So we need to ignore the new
* converted file as its already converted.
*/
function shouldConvertVideo(filePath) {
  return !filePath.endsWith('.part') && !filePath.endsWith('.dashVideo') && !filePath.endsWith('.dashAudio') && !filePath.includes((0, _utils.getUniqueString)());
}process.on('unhandledRejection', _logging.logger.error);
process.on('uncaughtException', _logging.logger.error);

exports.getConfig = getConfig;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;

var _winston = __webpack_require__(11);

var _winston2 = _interopRequireDefault(_winston);

__webpack_require__(12);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileTransport = new _winston2.default.transports.DailyRotateFile({
  filename: 'auto-convert-talk-videos-%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: 5
});

var transports = [fileTransport];

if (false) {}

var logger = _winston2.default.createLogger({
  level: 'info',
  format:  false ? undefined : _winston2.default.format.json(),
  transports: transports
});

exports.logger = logger;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUniqueString = exports.noop = exports.MaybeGetPath = undefined;

var _crypto = __webpack_require__(13);

var _crypto2 = _interopRequireDefault(_crypto);

var _maybe = __webpack_require__(0);

var _maybe2 = _interopRequireDefault(_maybe);

var _lodash = __webpack_require__(14);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uniqueString = _crypto2.default.randomBytes(6).toString('hex');
function getUniqueString() {
  return uniqueString;
}function MaybeGetPath() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var path = arguments[1];

  var prop = _lodash2.default.get(obj, path);
  return prop ? _maybe2.default.Just(prop) : _maybe2.default.Nothing();
}function noop() {
  return _maybe2.default.Nothing();
}exports.MaybeGetPath = MaybeGetPath;
exports.noop = noop;
exports.getUniqueString = getUniqueString;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("chokidar");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("jsonfile");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFileToConversionQueue = exports.convertVideo = undefined;

var _child_process = __webpack_require__(9);

var _path = __webpack_require__(2);

var _path2 = _interopRequireDefault(_path);

var _maybe = __webpack_require__(0);

var _maybe2 = _interopRequireDefault(_maybe);

var _del = __webpack_require__(10);

var _del2 = _interopRequireDefault(_del);

var _logging = __webpack_require__(3);

var _utils = __webpack_require__(4);

var _appMain = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://docs.microsoft.com/en-us/windows/desktop/CIMWin32Prov/setpriority-method-in-class-win32-process
var belowNormalProcessPriorityId = 16384;
var queue = [];
var conversionInProgress = false; // eslint-disable-line fp/no-let

function addFileToConversionQueue(filePath) {
  _logging.logger.info(_path2.default.basename(filePath) + ' has been added to convert queue.');
  queue.push(filePath);
  return _maybe2.default.Nothing();
}function convertVideo() {
  if (!conversionInProgress && queue.length > 0) {
    _logging.logger.info('Converting ' + _path2.default.basename(queue[0]));
    conversionInProgress = true; // eslint-disable-line fp/no-mutation
    var spawnedFFmpeg = (0, _child_process.spawn)('ffmpeg', generateFFmpegParams(queue[0]));
    /*****
    * For some reason if you omit the stderr/stdout listeners sometimes ffmpeg
    * wont exit properly. ¯\_(ツ)_/¯
    */
    spawnedFFmpeg.stderr.on('data', _utils.noop);
    spawnedFFmpeg.stdout.on('data', _utils.noop);
    spawnedFFmpeg.on('exit', cleanUpAndStartNewVideoConversion);
    lowerFFmpegProcessPriority(spawnedFFmpeg.pid);
  }return _maybe2.default.Nothing();
}function cleanUpAndStartNewVideoConversion(exitCode) {
  _logging.logger.info('spawnedFFmpeg exited with code ' + exitCode);
  _logging.logger.info('Finished converting ' + _path2.default.basename(queue[0]));
  deleteOriginalFile(queue[0]);
  queue.shift();
  conversionInProgress = false; // eslint-disable-line fp/no-mutation
  convertVideo();
  return _maybe2.default.Nothing();
} /*****
  * Based on https://github.com/soyuka/renice/blob/master/index.js
  */
function lowerFFmpegProcessPriority(pid) {
  (0, _child_process.spawn)('cmd.exe', ['/c', 'wmic process where processid=' + pid + ' CALL setpriority ' + belowNormalProcessPriorityId]);
  return _maybe2.default.Nothing();
}function generateOutputFilePath(srcFilePath) {
  var fileBaseName = _path2.default.basename(srcFilePath);
  var fileExtension = _path2.default.extname(fileBaseName);
  var outputFileName = fileBaseName.slice(0, fileBaseName.lastIndexOf(fileExtension)) + ('-converted-' + (0, _utils.getUniqueString)()) + fileExtension;

  return _path2.default.join((0, _appMain.getConfig)().dirToWatch, outputFileName);
}function generateFFmpegParams(srcFilePath) {
  return ['-i', srcFilePath, '-filter:v', 'setpts=PTS/' + (0, _appMain.getConfig)().speed, '-filter:a', 'atempo=' + (0, _appMain.getConfig)().speed, '-threads', '1', generateOutputFilePath(srcFilePath, (0, _utils.getUniqueString)())];
}function deleteOriginalFile(origFilePath) {
  (0, _del2.default)([origFilePath]).then(function () {
    return _logging.logger.info('Deleted orignal ' + _path2.default.basename(origFilePath) + ' file');
  }).catch(_logging.logger.error);
  return _maybe2.default.Nothing();
}exports.convertVideo = convertVideo;
exports.addFileToConversionQueue = addFileToConversionQueue;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("del");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("winston-daily-rotate-file");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ })
/******/ ]);