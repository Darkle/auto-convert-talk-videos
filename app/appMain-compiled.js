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

var _delay = __webpack_require__(/*! delay */ "./node_modules/delay/index.js");

var _delay2 = _interopRequireDefault(_delay);

var _trash = __webpack_require__(/*! trash */ "./node_modules/trash/index.js");

var _trash2 = _interopRequireDefault(_trash);

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
  _logging.logger.info(filePath + ' has been added to folder. Converting...');
  return (0, _delay2.default)(tenSecondsAsMilliseconds).then(function () {
    return (0, _ffmpeg.convertVideo)(filePath, uniqueString);
  }).then(function () {
    return console.log('finished conversion');
  }).then(function () {
    return (0, _trash2.default)([filePath]);
  }) //move original file to trash
  .catch(_logging.logger.error);
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

var _path = __webpack_require__(/*! path */ "path");

var _path2 = _interopRequireDefault(_path);

var _ffmkek = __webpack_require__(/*! ffmkek */ "./node_modules/ffmkek/src/FFmkek.js");

var _ffmkek2 = _interopRequireDefault(_ffmkek);

var _config = __webpack_require__(/*! ../config.json */ "./config.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertVideo(srcFilePath, uniqueString) {
  return new _ffmkek2.default().addInput(srcFilePath).addOption('-filter:v', 'setpts=PTS/' + _config.speed).addOption('-filter:a', 'atempo=' + _config.speed).write(generateOutputFilePath(srcFilePath, uniqueString));
}function generateOutputFilePath(srcFilePath, uniqueString) {
  var fileBaseName = _path2.default.basename(srcFilePath);
  var fileExtension = _path2.default.extname(fileBaseName);
  var outputFileName = fileBaseName.slice(0, fileBaseName.lastIndexOf(fileExtension)) + ('-converted-' + uniqueString) + fileExtension;

  return _path2.default.join(_config.dirToWatch, outputFileName);
}exports.convertVideo = convertVideo;

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

/***/ "./node_modules/@sindresorhus/df/index.js":
/*!************************************************!*\
  !*** ./node_modules/@sindresorhus/df/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const execa = __webpack_require__(/*! execa */ "execa");

const run = args => execa('df', args).then(res =>
	res.stdout.trim().split('\n').slice(1).map(x => {
		const cl = x.split(/\s+(?=[\d\/])/);

		return {
			filesystem: cl[0],
			size: parseInt(cl[1], 10) * 1024,
			used: parseInt(cl[2], 10) * 1024,
			available: parseInt(cl[3], 10) * 1024,
			capacity: parseInt(cl[4], 10) / 100,
			mountpoint: cl[5]
		};
	})
);

const df = module.exports = () => run(['-kP']);

df.fs = name => {
	if (typeof name !== 'string') {
		return Promise.reject(new Error('name required'));
	}

	return run(['-kP']).then(data => {
		for (const x of data) {
			if (x.filesystem === name) {
				return x;
			}
		}

		throw new Error(`The specified filesystem \`${name}\` doesn't exist`);
	});
};

df.file = file => {
	if (typeof file !== 'string') {
		return Promise.reject(new Error('file required'));
	}

	return run(['-kP', file])
		.then(data => data[0])
		.catch(err => {
			if (/No such file or directory/.test(err.message)) {
				err = new Error(`The specified file \`${file}\` doesn't exist`);
			}

			throw err;
		});
};


/***/ }),

/***/ "./node_modules/delay/index.js":
/*!*************************************!*\
  !*** ./node_modules/delay/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay = willResolve => (ms, {value, signal} = {}) => {
	if (signal && signal.aborted) {
		return Promise.reject(createAbortError());
	}

	let timeoutId;
	let settle;
	let rejectFn;

	const signalListener = () => {
		clearTimeout(timeoutId);
		rejectFn(createAbortError());
	};

	const cleanup = () => {
		if (signal) {
			signal.removeEventListener('abort', signalListener);
		}
	};

	const delayPromise = new Promise((resolve, reject) => {
		settle = () => {
			cleanup();
			if (willResolve) {
				resolve(value);
			} else {
				reject(value);
			}
		};
		rejectFn = reject;
		timeoutId = setTimeout(settle, ms);
	});

	if (signal) {
		signal.addEventListener('abort', signalListener, {once: true});
	}

	delayPromise.clear = () => {
		cleanup();
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
			settle();
		}
	};

	return delayPromise;
};

const delay = createDelay(true);
delay.reject = createDelay(false);
module.exports = delay;
module.exports.default = delay;


/***/ }),

/***/ "./node_modules/escape-string-applescript/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/escape-string-applescript/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = x => typeof x === 'string' ? x.replace(/[\\"]/g, '\\$&') : x;


/***/ }),

/***/ "./node_modules/ffmkek/src/FFmkek.js":
/*!*******************************************!*\
  !*** ./node_modules/ffmkek/src/FFmkek.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Part = __webpack_require__(/*! ./Part */ "./node_modules/ffmkek/src/Part.js")
const { EventEmitter } = __webpack_require__(/*! events */ "events")
const { spawn } = __webpack_require__(/*! child_process */ "child_process")
const { Stream, PassThrough } = __webpack_require__(/*! stream */ "stream")

class FFmkek extends EventEmitter {
  constructor(source) {
    super()
    this.path = 'ffmpeg'
    
    this.currentPart = new Part(this, 0)
    this.parts = []

    this.inputStream = null
    this.outputStream = null

    this.force = true

    if (source) this.addInput(source)
    this._setAliases()
  }
  
  setPath(path) {
    this.path = path
    return this
  }

  addInput(input) {
    return this._addPart(input, Part.INPUT)
  }

  setOutput(output) {
    return this._addPart(output, Part.OUTPUT)
  }

  addOption(name, ...values) {
    this.currentPart.addOption(name, ...values)
    return this
  }

  setForce(flag) {
    this.force = Boolean(flag)
    return this
  }

  getArguments() {
    const args = []
    for (const part of this.parts) part.apply(args)
    if (this.force) args.push('-y')
    return args
  }

  run() {
    if (!this._outputPart) this.setOutput(new PassThrough())
    const proc = spawn(this.path, this.getArguments())
    if (this.inputStream) this.inputStream.pipe(proc.stdin)
    if (this.outputStream) proc.stdout.pipe(this.outputStream)

    proc.stderr.on('data', data => this.emit('info', data.toString()))

    return new Promise(resolve => {
      if (this.outputStream) {
        return resolve(this.outputStream)
      }
      proc.stderr.once('end', () => resolve(this._outputPart.name))
    })
  }

  write(output) {
    if (output) this.setOutput(output)
    return this.run()
  }

  get _outputPart() {
    return this.parts.find(part => part.type === Part.OUTPUT)
  }

  _addPart(io, type) {
    if (io instanceof Stream) {
      const isOutput = type === Part.OUTPUT
      const prop = isOutput  ? 'outputStream' : 'inputStream'
      if (this[prop]) {
        throw new Error('only one input or output stream is supported')
      }

      this[prop] = io
      this.currentPart.setName(`pipe:${isOutput ? 1 : 0}`)
    } else {
      this.currentPart.setName(io)
    }

    this.currentPart.setType(type)
    this.parts.push(this.currentPart)
    this.currentPart = new Part(this, this.parts.length)
    return this
  }

  _setAliases() {
    const proto = FFmkek.prototype
    this._alias(proto.addInput, 'in', 'input')
      ._alias(proto.setOutput, 'out', 'output', 'addOutput')
      ._alias(proto.addOption, 'opt', 'option')
      ._alias(proto.getArguments, 'args', 'arguments')
      ._alias(proto.write, 'save')
  }

  _alias(method, ...aliases) {
    for (const alias of aliases) this[alias] = method.bind(this)
    return this
  }

  static get Part() {
    return Part
  }
}

module.exports = FFmkek


/***/ }),

/***/ "./node_modules/ffmkek/src/Part.js":
/*!*****************************************!*\
  !*** ./node_modules/ffmkek/src/Part.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class Part {
  constructor(command, id, name, type) {
    this.command = command
    this.id = id
    this.name = name || null
    this.type = type || null
    this.options = new Map()

    this.setName(name).setType(type)
  }

  addOption(name, ...values) {
    if (!this.options.has(name)) this.options.set(name, [])
    this.options.get(name).push(...values)
    return this
  }

  setName(name) {
    this.name = name
    return this
  }

  setType(type) {
    if (![Part.INPUT, Part.OUTPUT].includes(type)) type = Part.INPUT
    this.type = type
    return this
  }

  apply(args) {
    for (const [name, values] of this.options) {
      args.push(name)
      if (values.length) args.push(values.join(', '))
    }

    if (this.type === Part.INPUT) args.push('-i')
    args.push(this.name)
    return args
  }

  isPipe() {
    return this.name.startsWith('pipe')
  }

  isInput() {
    return this.type === Part.INPUT
  }

  isOutput() {
    return this.type === Part.OUTPUT
  }

  remove() {
    this.command.parts.splice(this.id, 1)

    if (this.isPipe()) {
      if (this.isInput()) this.command.inputStream = null
      else this.command.outputStream = null
    }

    return this
  }

  static get INPUT() {
    return 'input'
  }

  static get OUTPUT() {
    return 'output'
  }
}

module.exports = Part


/***/ }),

/***/ "./node_modules/fs-extra/lib/copy-sync/copy-file-sync.js":
/*!***************************************************************!*\
  !*** ./node_modules/fs-extra/lib/copy-sync/copy-file-sync.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")

var BUF_LENGTH = 64 * 1024
var _buff = new Buffer(BUF_LENGTH)

function copyFileSync (srcFile, destFile, options) {
  var clobber = options.clobber
  var preserveTimestamps = options.preserveTimestamps

  if (fs.existsSync(destFile)) {
    if (clobber) {
      fs.chmodSync(destFile, parseInt('777', 8))
      fs.unlinkSync(destFile)
    } else {
      throw Error('EEXIST')
    }
  }

  var fdr = fs.openSync(srcFile, 'r')
  var stat = fs.fstatSync(fdr)
  var fdw = fs.openSync(destFile, 'w', stat.mode)
  var bytesRead = 1
  var pos = 0

  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos)
    fs.writeSync(fdw, _buff, 0, bytesRead)
    pos += bytesRead
  }

  if (preserveTimestamps) {
    fs.futimesSync(fdw, stat.atime, stat.mtime)
  }

  fs.closeSync(fdr)
  fs.closeSync(fdw)
}

module.exports = copyFileSync


/***/ }),

/***/ "./node_modules/fs-extra/lib/copy-sync/copy-sync.js":
/*!**********************************************************!*\
  !*** ./node_modules/fs-extra/lib/copy-sync/copy-sync.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var path = __webpack_require__(/*! path */ "path")
var copyFileSync = __webpack_require__(/*! ./copy-file-sync */ "./node_modules/fs-extra/lib/copy-sync/copy-file-sync.js")
var mkdir = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js")

function copySync (src, dest, options) {
  if (typeof options === 'function' || options instanceof RegExp) {
    options = {filter: options}
  }

  options = options || {}
  options.recursive = !!options.recursive

  // default to true for now
  options.clobber = 'clobber' in options ? !!options.clobber : true
  options.dereference = 'dereference' in options ? !!options.dereference : false
  options.preserveTimestamps = 'preserveTimestamps' in options ? !!options.preserveTimestamps : false

  options.filter = options.filter || function () { return true }

  var stats = (options.recursive && !options.dereference) ? fs.lstatSync(src) : fs.statSync(src)
  var destFolder = path.dirname(dest)
  var destFolderExists = fs.existsSync(destFolder)
  var performCopy = false

  if (stats.isFile()) {
    if (options.filter instanceof RegExp) performCopy = options.filter.test(src)
    else if (typeof options.filter === 'function') performCopy = options.filter(src)

    if (performCopy) {
      if (!destFolderExists) mkdir.mkdirsSync(destFolder)
      copyFileSync(src, dest, {clobber: options.clobber, preserveTimestamps: options.preserveTimestamps})
    }
  } else if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) mkdir.mkdirsSync(dest)
    var contents = fs.readdirSync(src)
    contents.forEach(function (content) {
      var opts = options
      opts.recursive = true
      copySync(path.join(src, content), path.join(dest, content), opts)
    })
  } else if (options.recursive && stats.isSymbolicLink()) {
    var srcPath = fs.readlinkSync(src)
    fs.symlinkSync(srcPath, dest)
  }
}

module.exports = copySync


/***/ }),

/***/ "./node_modules/fs-extra/lib/copy-sync/index.js":
/*!******************************************************!*\
  !*** ./node_modules/fs-extra/lib/copy-sync/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  copySync: __webpack_require__(/*! ./copy-sync */ "./node_modules/fs-extra/lib/copy-sync/copy-sync.js")
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/copy/copy.js":
/*!************************************************!*\
  !*** ./node_modules/fs-extra/lib/copy/copy.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var path = __webpack_require__(/*! path */ "path")
var ncp = __webpack_require__(/*! ./ncp */ "./node_modules/fs-extra/lib/copy/ncp.js")
var mkdir = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js")

function copy (src, dest, options, callback) {
  if (typeof options === 'function' && !callback) {
    callback = options
    options = {}
  } else if (typeof options === 'function' || options instanceof RegExp) {
    options = {filter: options}
  }
  callback = callback || function () {}
  options = options || {}

  // don't allow src and dest to be the same
  var basePath = process.cwd()
  var currentPath = path.resolve(basePath, src)
  var targetPath = path.resolve(basePath, dest)
  if (currentPath === targetPath) return callback(new Error('Source and destination must not be the same.'))

  fs.lstat(src, function (err, stats) {
    if (err) return callback(err)

    var dir = null
    if (stats.isDirectory()) {
      var parts = dest.split(path.sep)
      parts.pop()
      dir = parts.join(path.sep)
    } else {
      dir = path.dirname(dest)
    }

    fs.exists(dir, function (dirExists) {
      if (dirExists) return ncp(src, dest, options, callback)
      mkdir.mkdirs(dir, function (err) {
        if (err) return callback(err)
        ncp(src, dest, options, callback)
      })
    })
  })
}

module.exports = copy


/***/ }),

/***/ "./node_modules/fs-extra/lib/copy/index.js":
/*!*************************************************!*\
  !*** ./node_modules/fs-extra/lib/copy/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  copy: __webpack_require__(/*! ./copy */ "./node_modules/fs-extra/lib/copy/copy.js")
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/copy/ncp.js":
/*!***********************************************!*\
  !*** ./node_modules/fs-extra/lib/copy/ncp.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// imported from ncp (this is temporary, will rewrite)

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var path = __webpack_require__(/*! path */ "path")
var utimes = __webpack_require__(/*! ../util/utimes */ "./node_modules/fs-extra/lib/util/utimes.js")

function ncp (source, dest, options, callback) {
  if (!callback) {
    callback = options
    options = {}
  }

  var basePath = process.cwd()
  var currentPath = path.resolve(basePath, source)
  var targetPath = path.resolve(basePath, dest)

  var filter = options.filter
  var transform = options.transform
  var clobber = options.clobber !== false
  var dereference = options.dereference
  var preserveTimestamps = options.preserveTimestamps === true

  var errs = null

  var started = 0
  var finished = 0
  var running = 0
  // this is pretty useless now that we're using graceful-fs
  // consider removing
  var limit = options.limit || 512

  startCopy(currentPath)

  function startCopy (source) {
    started++
    if (filter) {
      if (filter instanceof RegExp) {
        if (!filter.test(source)) {
          return doneOne(true)
        }
      } else if (typeof filter === 'function') {
        if (!filter(source)) {
          return doneOne(true)
        }
      }
    }
    return getStats(source)
  }

  function getStats (source) {
    var stat = dereference ? fs.stat : fs.lstat
    if (running >= limit) {
      return setImmediate(function () {
        getStats(source)
      })
    }
    running++
    stat(source, function (err, stats) {
      if (err) return onError(err)

      // We need to get the mode from the stats object and preserve it.
      var item = {
        name: source,
        mode: stats.mode,
        mtime: stats.mtime, // modified time
        atime: stats.atime, // access time
        stats: stats // temporary
      }

      if (stats.isDirectory()) {
        return onDir(item)
      } else if (stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice()) {
        return onFile(item)
      } else if (stats.isSymbolicLink()) {
        // Symlinks don't really need to know about the mode.
        return onLink(source)
      }
    })
  }

  function onFile (file) {
    var target = file.name.replace(currentPath, targetPath)
    isWritable(target, function (writable) {
      if (writable) {
        copyFile(file, target)
      } else {
        if (clobber) {
          rmFile(target, function () {
            copyFile(file, target)
          })
        } else {
          doneOne()
        }
      }
    })
  }

  function copyFile (file, target) {
    var readStream = fs.createReadStream(file.name)
    var writeStream = fs.createWriteStream(target, { mode: file.mode })

    readStream.on('error', onError)
    writeStream.on('error', onError)

    if (transform) {
      transform(readStream, writeStream, file)
    } else {
      writeStream.on('open', function () {
        readStream.pipe(writeStream)
      })
    }

    writeStream.once('finish', function () {
      fs.chmod(target, file.mode, function (err) {
        if (err) return onError(err)
        if (preserveTimestamps) {
          utimes.utimesMillis(target, file.atime, file.mtime, function (err) {
            if (err) return onError(err)
            return doneOne()
          })
        } else {
          doneOne()
        }
      })
    })
  }

  function rmFile (file, done) {
    fs.unlink(file, function (err) {
      if (err) return onError(err)
      return done()
    })
  }

  function onDir (dir) {
    var target = dir.name.replace(currentPath, targetPath)
    isWritable(target, function (writable) {
      if (writable) {
        return mkDir(dir, target)
      }
      copyDir(dir.name)
    })
  }

  function mkDir (dir, target) {
    fs.mkdir(target, dir.mode, function (err) {
      if (err) return onError(err)
      // despite setting mode in fs.mkdir, doesn't seem to work
      // so we set it here.
      fs.chmod(target, dir.mode, function (err) {
        if (err) return onError(err)
        copyDir(dir.name)
      })
    })
  }

  function copyDir (dir) {
    fs.readdir(dir, function (err, items) {
      if (err) return onError(err)
      items.forEach(function (item) {
        startCopy(path.join(dir, item))
      })
      return doneOne()
    })
  }

  function onLink (link) {
    var target = link.replace(currentPath, targetPath)
    fs.readlink(link, function (err, resolvedPath) {
      if (err) return onError(err)
      checkLink(resolvedPath, target)
    })
  }

  function checkLink (resolvedPath, target) {
    if (dereference) {
      resolvedPath = path.resolve(basePath, resolvedPath)
    }
    isWritable(target, function (writable) {
      if (writable) {
        return makeLink(resolvedPath, target)
      }
      fs.readlink(target, function (err, targetDest) {
        if (err) return onError(err)

        if (dereference) {
          targetDest = path.resolve(basePath, targetDest)
        }
        if (targetDest === resolvedPath) {
          return doneOne()
        }
        return rmFile(target, function () {
          makeLink(resolvedPath, target)
        })
      })
    })
  }

  function makeLink (linkPath, target) {
    fs.symlink(linkPath, target, function (err) {
      if (err) return onError(err)
      return doneOne()
    })
  }

  function isWritable (path, done) {
    fs.lstat(path, function (err) {
      if (err) {
        if (err.code === 'ENOENT') return done(true)
        return done(false)
      }
      return done(false)
    })
  }

  function onError (err) {
    if (options.stopOnError) {
      return callback(err)
    } else if (!errs && options.errs) {
      errs = fs.createWriteStream(options.errs)
    } else if (!errs) {
      errs = []
    }
    if (typeof errs.write === 'undefined') {
      errs.push(err)
    } else {
      errs.write(err.stack + '\n\n')
    }
    return doneOne()
  }

  function doneOne (skipped) {
    if (!skipped) running--
    finished++
    if ((started === finished) && (running === 0)) {
      if (callback !== undefined) {
        return errs ? callback(errs) : callback(null)
      }
    }
  }
}

module.exports = ncp


/***/ }),

/***/ "./node_modules/fs-extra/lib/empty/index.js":
/*!**************************************************!*\
  !*** ./node_modules/fs-extra/lib/empty/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! fs */ "fs")
var path = __webpack_require__(/*! path */ "path")
var mkdir = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js")
var remove = __webpack_require__(/*! ../remove */ "./node_modules/fs-extra/lib/remove/index.js")

function emptyDir (dir, callback) {
  callback = callback || function () {}
  fs.readdir(dir, function (err, items) {
    if (err) return mkdir.mkdirs(dir, callback)

    items = items.map(function (item) {
      return path.join(dir, item)
    })

    deleteItem()

    function deleteItem () {
      var item = items.pop()
      if (!item) return callback()
      remove.remove(item, function (err) {
        if (err) return callback(err)
        deleteItem()
      })
    }
  })
}

function emptyDirSync (dir) {
  var items
  try {
    items = fs.readdirSync(dir)
  } catch (err) {
    return mkdir.mkdirsSync(dir)
  }

  items.forEach(function (item) {
    item = path.join(dir, item)
    remove.removeSync(item)
  })
}

module.exports = {
  emptyDirSync: emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir: emptyDir,
  emptydir: emptyDir
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/file.js":
/*!**************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/file.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "path")
var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var mkdir = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js")

function createFile (file, callback) {
  function makeFile () {
    fs.writeFile(file, '', function (err) {
      if (err) return callback(err)
      callback()
    })
  }

  fs.exists(file, function (fileExists) {
    if (fileExists) return callback()
    var dir = path.dirname(file)
    fs.exists(dir, function (dirExists) {
      if (dirExists) return makeFile()
      mkdir.mkdirs(dir, function (err) {
        if (err) return callback(err)
        makeFile()
      })
    })
  })
}

function createFileSync (file) {
  if (fs.existsSync(file)) return

  var dir = path.dirname(file)
  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir)
  }

  fs.writeFileSync(file, '')
}

module.exports = {
  createFile: createFile,
  createFileSync: createFileSync,
  // alias
  ensureFile: createFile,
  ensureFileSync: createFileSync
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var file = __webpack_require__(/*! ./file */ "./node_modules/fs-extra/lib/ensure/file.js")
var link = __webpack_require__(/*! ./link */ "./node_modules/fs-extra/lib/ensure/link.js")
var symlink = __webpack_require__(/*! ./symlink */ "./node_modules/fs-extra/lib/ensure/symlink.js")

module.exports = {
  // file
  createFile: file.createFile,
  createFileSync: file.createFileSync,
  ensureFile: file.createFile,
  ensureFileSync: file.createFileSync,
  // link
  createLink: link.createLink,
  createLinkSync: link.createLinkSync,
  ensureLink: link.createLink,
  ensureLinkSync: link.createLinkSync,
  // symlink
  createSymlink: symlink.createSymlink,
  createSymlinkSync: symlink.createSymlinkSync,
  ensureSymlink: symlink.createSymlink,
  ensureSymlinkSync: symlink.createSymlinkSync
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/link.js":
/*!**************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/link.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "path")
var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var mkdir = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js")

function createLink (srcpath, dstpath, callback) {
  function makeLink (srcpath, dstpath) {
    fs.link(srcpath, dstpath, function (err) {
      if (err) return callback(err)
      callback(null)
    })
  }

  fs.exists(dstpath, function (destinationExists) {
    if (destinationExists) return callback(null)
    fs.lstat(srcpath, function (err, stat) {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureLink')
        return callback(err)
      }

      var dir = path.dirname(dstpath)
      fs.exists(dir, function (dirExists) {
        if (dirExists) return makeLink(srcpath, dstpath)
        mkdir.mkdirs(dir, function (err) {
          if (err) return callback(err)
          makeLink(srcpath, dstpath)
        })
      })
    })
  })
}

function createLinkSync (srcpath, dstpath, callback) {
  var destinationExists = fs.existsSync(dstpath)
  if (destinationExists) return undefined

  try {
    fs.lstatSync(srcpath)
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink')
    throw err
  }

  var dir = path.dirname(dstpath)
  var dirExists = fs.existsSync(dir)
  if (dirExists) return fs.linkSync(srcpath, dstpath)
  mkdir.mkdirsSync(dir)

  return fs.linkSync(srcpath, dstpath)
}

module.exports = {
  createLink: createLink,
  createLinkSync: createLinkSync,
  // alias
  ensureLink: createLink,
  ensureLinkSync: createLinkSync
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/symlink-paths.js":
/*!***********************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/symlink-paths.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "path")
// path.isAbsolute shim for Node.js 0.10 support
path.isAbsolute = (path.isAbsolute) ? path.isAbsolute : __webpack_require__(/*! path-is-absolute */ "path-is-absolute")
var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")

/**
 * Function that returns two types of paths, one relative to symlink, and one
 * relative to the current working directory. Checks if path is absolute or
 * relative. If the path is relative, this function checks if the path is
 * relative to symlink or relative to current working directory. This is an
 * initiative to find a smarter `srcpath` to supply when building symlinks.
 * This allows you to determine which path to use out of one of three possible
 * types of source paths. The first is an absolute path. This is detected by
 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
 * see if it exists. If it does it's used, if not an error is returned
 * (callback)/ thrown (sync). The other two options for `srcpath` are a
 * relative url. By default Node's `fs.symlink` works by creating a symlink
 * using `dstpath` and expects the `srcpath` to be relative to the newly
 * created symlink. If you provide a `srcpath` that does not exist on the file
 * system it results in a broken symlink. To minimize this, the function
 * checks to see if the 'relative to symlink' source file exists, and if it
 * does it will use it. If it does not, it checks if there's a file that
 * exists that is relative to the current working directory, if does its used.
 * This preserves the expectations of the original fs.symlink spec and adds
 * the ability to pass in `relative to current working direcotry` paths.
 */

function symlinkPaths (srcpath, dstpath, callback) {
  if (path.isAbsolute(srcpath)) {
    return fs.lstat(srcpath, function (err, stat) {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureSymlink')
        return callback(err)
      }
      return callback(null, {
        'toCwd': srcpath,
        'toDst': srcpath
      })
    })
  } else {
    var dstdir = path.dirname(dstpath)
    var relativeToDst = path.join(dstdir, srcpath)
    return fs.exists(relativeToDst, function (exists) {
      if (exists) {
        return callback(null, {
          'toCwd': relativeToDst,
          'toDst': srcpath
        })
      } else {
        return fs.lstat(srcpath, function (err, stat) {
          if (err) {
            err.message = err.message.replace('lstat', 'ensureSymlink')
            return callback(err)
          }
          return callback(null, {
            'toCwd': srcpath,
            'toDst': path.relative(dstdir, srcpath)
          })
        })
      }
    })
  }
}

function symlinkPathsSync (srcpath, dstpath) {
  var exists
  if (path.isAbsolute(srcpath)) {
    exists = fs.existsSync(srcpath)
    if (!exists) throw new Error('absolute srcpath does not exist')
    return {
      'toCwd': srcpath,
      'toDst': srcpath
    }
  } else {
    var dstdir = path.dirname(dstpath)
    var relativeToDst = path.join(dstdir, srcpath)
    exists = fs.existsSync(relativeToDst)
    if (exists) {
      return {
        'toCwd': relativeToDst,
        'toDst': srcpath
      }
    } else {
      exists = fs.existsSync(srcpath)
      if (!exists) throw new Error('relative srcpath does not exist')
      return {
        'toCwd': srcpath,
        'toDst': path.relative(dstdir, srcpath)
      }
    }
  }
}

module.exports = {
  'symlinkPaths': symlinkPaths,
  'symlinkPathsSync': symlinkPathsSync
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/symlink-type.js":
/*!**********************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/symlink-type.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")

function symlinkType (srcpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type
  if (type) return callback(null, type)
  fs.lstat(srcpath, function (err, stats) {
    if (err) return callback(null, 'file')
    type = (stats && stats.isDirectory()) ? 'dir' : 'file'
    callback(null, type)
  })
}

function symlinkTypeSync (srcpath, type) {
  if (type) return type
  try {
    var stats = fs.lstatSync(srcpath)
  } catch (e) {
    return 'file'
  }
  return (stats && stats.isDirectory()) ? 'dir' : 'file'
}

module.exports = {
  symlinkType: symlinkType,
  symlinkTypeSync: symlinkTypeSync
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/ensure/symlink.js":
/*!*****************************************************!*\
  !*** ./node_modules/fs-extra/lib/ensure/symlink.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "path")
var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var _mkdirs = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js")
var mkdirs = _mkdirs.mkdirs
var mkdirsSync = _mkdirs.mkdirsSync

var _symlinkPaths = __webpack_require__(/*! ./symlink-paths */ "./node_modules/fs-extra/lib/ensure/symlink-paths.js")
var symlinkPaths = _symlinkPaths.symlinkPaths
var symlinkPathsSync = _symlinkPaths.symlinkPathsSync

var _symlinkType = __webpack_require__(/*! ./symlink-type */ "./node_modules/fs-extra/lib/ensure/symlink-type.js")
var symlinkType = _symlinkType.symlinkType
var symlinkTypeSync = _symlinkType.symlinkTypeSync

function createSymlink (srcpath, dstpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type

  fs.exists(dstpath, function (destinationExists) {
    if (destinationExists) return callback(null)
    symlinkPaths(srcpath, dstpath, function (err, relative) {
      if (err) return callback(err)
      srcpath = relative.toDst
      symlinkType(relative.toCwd, type, function (err, type) {
        if (err) return callback(err)
        var dir = path.dirname(dstpath)
        fs.exists(dir, function (dirExists) {
          if (dirExists) return fs.symlink(srcpath, dstpath, type, callback)
          mkdirs(dir, function (err) {
            if (err) return callback(err)
            fs.symlink(srcpath, dstpath, type, callback)
          })
        })
      })
    })
  })
}

function createSymlinkSync (srcpath, dstpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type

  var destinationExists = fs.existsSync(dstpath)
  if (destinationExists) return undefined

  var relative = symlinkPathsSync(srcpath, dstpath)
  srcpath = relative.toDst
  type = symlinkTypeSync(relative.toCwd, type)
  var dir = path.dirname(dstpath)
  var exists = fs.existsSync(dir)
  if (exists) return fs.symlinkSync(srcpath, dstpath, type)
  mkdirsSync(dir)
  return fs.symlinkSync(srcpath, dstpath, type)
}

module.exports = {
  createSymlink: createSymlink,
  createSymlinkSync: createSymlinkSync,
  // alias
  ensureSymlink: createSymlink,
  ensureSymlinkSync: createSymlinkSync
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/index.js":
/*!********************************************!*\
  !*** ./node_modules/fs-extra/lib/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assign = __webpack_require__(/*! ./util/assign */ "./node_modules/fs-extra/lib/util/assign.js")

var fse = {}
var gfs = __webpack_require__(/*! graceful-fs */ "graceful-fs")

// attach fs methods to fse
Object.keys(gfs).forEach(function (key) {
  fse[key] = gfs[key]
})

var fs = fse

assign(fs, __webpack_require__(/*! ./copy */ "./node_modules/fs-extra/lib/copy/index.js"))
assign(fs, __webpack_require__(/*! ./copy-sync */ "./node_modules/fs-extra/lib/copy-sync/index.js"))
assign(fs, __webpack_require__(/*! ./mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js"))
assign(fs, __webpack_require__(/*! ./remove */ "./node_modules/fs-extra/lib/remove/index.js"))
assign(fs, __webpack_require__(/*! ./json */ "./node_modules/fs-extra/lib/json/index.js"))
assign(fs, __webpack_require__(/*! ./move */ "./node_modules/fs-extra/lib/move/index.js"))
assign(fs, __webpack_require__(/*! ./empty */ "./node_modules/fs-extra/lib/empty/index.js"))
assign(fs, __webpack_require__(/*! ./ensure */ "./node_modules/fs-extra/lib/ensure/index.js"))
assign(fs, __webpack_require__(/*! ./output */ "./node_modules/fs-extra/lib/output/index.js"))
assign(fs, __webpack_require__(/*! ./walk */ "./node_modules/fs-extra/lib/walk/index.js"))

module.exports = fs

// maintain backwards compatibility for awhile
var jsonfile = {}
Object.defineProperty(jsonfile, 'spaces', {
  get: function () {
    return fs.spaces // found in ./json
  },
  set: function (val) {
    fs.spaces = val
  }
})

module.exports.jsonfile = jsonfile // so users of fs-extra can modify jsonFile.spaces


/***/ }),

/***/ "./node_modules/fs-extra/lib/json/index.js":
/*!*************************************************!*\
  !*** ./node_modules/fs-extra/lib/json/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var jsonFile = __webpack_require__(/*! ./jsonfile */ "./node_modules/fs-extra/lib/json/jsonfile.js")

jsonFile.outputJsonSync = __webpack_require__(/*! ./output-json-sync */ "./node_modules/fs-extra/lib/json/output-json-sync.js")
jsonFile.outputJson = __webpack_require__(/*! ./output-json */ "./node_modules/fs-extra/lib/json/output-json.js")
// aliases
jsonFile.outputJSONSync = __webpack_require__(/*! ./output-json-sync */ "./node_modules/fs-extra/lib/json/output-json-sync.js")
jsonFile.outputJSON = __webpack_require__(/*! ./output-json */ "./node_modules/fs-extra/lib/json/output-json.js")

module.exports = jsonFile


/***/ }),

/***/ "./node_modules/fs-extra/lib/json/jsonfile.js":
/*!****************************************************!*\
  !*** ./node_modules/fs-extra/lib/json/jsonfile.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var jsonFile = __webpack_require__(/*! jsonfile */ "./node_modules/jsonfile/index.js")

module.exports = {
  // jsonfile exports
  readJson: jsonFile.readFile,
  readJSON: jsonFile.readFile,
  readJsonSync: jsonFile.readFileSync,
  readJSONSync: jsonFile.readFileSync,
  writeJson: jsonFile.writeFile,
  writeJSON: jsonFile.writeFile,
  writeJsonSync: jsonFile.writeFileSync,
  writeJSONSync: jsonFile.writeFileSync,
  spaces: 2 // default in fs-extra
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/json/output-json-sync.js":
/*!************************************************************!*\
  !*** ./node_modules/fs-extra/lib/json/output-json-sync.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var path = __webpack_require__(/*! path */ "path")
var jsonFile = __webpack_require__(/*! ./jsonfile */ "./node_modules/fs-extra/lib/json/jsonfile.js")
var mkdir = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js")

function outputJsonSync (file, data, options) {
  var dir = path.dirname(file)

  if (!fs.existsSync(dir)) {
    mkdir.mkdirsSync(dir)
  }

  jsonFile.writeJsonSync(file, data, options)
}

module.exports = outputJsonSync


/***/ }),

/***/ "./node_modules/fs-extra/lib/json/output-json.js":
/*!*******************************************************!*\
  !*** ./node_modules/fs-extra/lib/json/output-json.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var path = __webpack_require__(/*! path */ "path")
var jsonFile = __webpack_require__(/*! ./jsonfile */ "./node_modules/fs-extra/lib/json/jsonfile.js")
var mkdir = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js")

function outputJson (file, data, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  var dir = path.dirname(file)

  fs.exists(dir, function (itDoes) {
    if (itDoes) return jsonFile.writeJson(file, data, options, callback)

    mkdir.mkdirs(dir, function (err) {
      if (err) return callback(err)
      jsonFile.writeJson(file, data, options, callback)
    })
  })
}

module.exports = outputJson


/***/ }),

/***/ "./node_modules/fs-extra/lib/mkdirs/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fs-extra/lib/mkdirs/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  mkdirs: __webpack_require__(/*! ./mkdirs */ "./node_modules/fs-extra/lib/mkdirs/mkdirs.js"),
  mkdirsSync: __webpack_require__(/*! ./mkdirs-sync */ "./node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js"),
  // alias
  mkdirp: __webpack_require__(/*! ./mkdirs */ "./node_modules/fs-extra/lib/mkdirs/mkdirs.js"),
  mkdirpSync: __webpack_require__(/*! ./mkdirs-sync */ "./node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js"),
  ensureDir: __webpack_require__(/*! ./mkdirs */ "./node_modules/fs-extra/lib/mkdirs/mkdirs.js"),
  ensureDirSync: __webpack_require__(/*! ./mkdirs-sync */ "./node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js")
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js":
/*!*********************************************************!*\
  !*** ./node_modules/fs-extra/lib/mkdirs/mkdirs-sync.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var path = __webpack_require__(/*! path */ "path")
var invalidWin32Path = __webpack_require__(/*! ./win32 */ "./node_modules/fs-extra/lib/mkdirs/win32.js").invalidWin32Path

var o777 = parseInt('0777', 8)

function mkdirsSync (p, opts, made) {
  if (!opts || typeof opts !== 'object') {
    opts = { mode: opts }
  }

  var mode = opts.mode
  var xfs = opts.fs || fs

  if (process.platform === 'win32' && invalidWin32Path(p)) {
    var errInval = new Error(p + ' contains invalid WIN32 path characters.')
    errInval.code = 'EINVAL'
    throw errInval
  }

  if (mode === undefined) {
    mode = o777 & (~process.umask())
  }
  if (!made) made = null

  p = path.resolve(p)

  try {
    xfs.mkdirSync(p, mode)
    made = made || p
  } catch (err0) {
    switch (err0.code) {
      case 'ENOENT':
        if (path.dirname(p) === p) throw err0
        made = mkdirsSync(path.dirname(p), opts, made)
        mkdirsSync(p, opts, made)
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        var stat
        try {
          stat = xfs.statSync(p)
        } catch (err1) {
          throw err0
        }
        if (!stat.isDirectory()) throw err0
        break
    }
  }

  return made
}

module.exports = mkdirsSync


/***/ }),

/***/ "./node_modules/fs-extra/lib/mkdirs/mkdirs.js":
/*!****************************************************!*\
  !*** ./node_modules/fs-extra/lib/mkdirs/mkdirs.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var path = __webpack_require__(/*! path */ "path")
var invalidWin32Path = __webpack_require__(/*! ./win32 */ "./node_modules/fs-extra/lib/mkdirs/win32.js").invalidWin32Path

var o777 = parseInt('0777', 8)

function mkdirs (p, opts, callback, made) {
  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  } else if (!opts || typeof opts !== 'object') {
    opts = { mode: opts }
  }

  if (process.platform === 'win32' && invalidWin32Path(p)) {
    var errInval = new Error(p + ' contains invalid WIN32 path characters.')
    errInval.code = 'EINVAL'
    return callback(errInval)
  }

  var mode = opts.mode
  var xfs = opts.fs || fs

  if (mode === undefined) {
    mode = o777 & (~process.umask())
  }
  if (!made) made = null

  callback = callback || function () {}
  p = path.resolve(p)

  xfs.mkdir(p, mode, function (er) {
    if (!er) {
      made = made || p
      return callback(null, made)
    }
    switch (er.code) {
      case 'ENOENT':
        if (path.dirname(p) === p) return callback(er)
        mkdirs(path.dirname(p), opts, function (er, made) {
          if (er) callback(er, made)
          else mkdirs(p, opts, callback, made)
        })
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        xfs.stat(p, function (er2, stat) {
          // if the stat fails, then that's super weird.
          // let the original error be the failure reason.
          if (er2 || !stat.isDirectory()) callback(er, made)
          else callback(null, made)
        })
        break
    }
  })
}

module.exports = mkdirs


/***/ }),

/***/ "./node_modules/fs-extra/lib/mkdirs/win32.js":
/*!***************************************************!*\
  !*** ./node_modules/fs-extra/lib/mkdirs/win32.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var path = __webpack_require__(/*! path */ "path")

// get drive on windows
function getRootPath (p) {
  p = path.normalize(path.resolve(p)).split(path.sep)
  if (p.length > 0) return p[0]
  else return null
}

// http://stackoverflow.com/a/62888/10333 contains more accurate
// TODO: expand to include the rest
var INVALID_PATH_CHARS = /[<>:"|?*]/

function invalidWin32Path (p) {
  var rp = getRootPath(p)
  p = p.replace(rp, '')
  return INVALID_PATH_CHARS.test(p)
}

module.exports = {
  getRootPath: getRootPath,
  invalidWin32Path: invalidWin32Path
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/move/index.js":
/*!*************************************************!*\
  !*** ./node_modules/fs-extra/lib/move/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// most of this code was written by Andrew Kelley
// licensed under the BSD license: see
// https://github.com/andrewrk/node-mv/blob/master/package.json

// this needs a cleanup

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var ncp = __webpack_require__(/*! ../copy/ncp */ "./node_modules/fs-extra/lib/copy/ncp.js")
var path = __webpack_require__(/*! path */ "path")
var rimraf = __webpack_require__(/*! rimraf */ "rimraf")
var mkdirp = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js").mkdirs

function mv (source, dest, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  var shouldMkdirp = ('mkdirp' in options) ? options.mkdirp : true
  var clobber = ('clobber' in options) ? options.clobber : false

  var limit = options.limit || 16

  if (shouldMkdirp) {
    mkdirs()
  } else {
    doRename()
  }

  function mkdirs () {
    mkdirp(path.dirname(dest), function (err) {
      if (err) return callback(err)
      doRename()
    })
  }

  function doRename () {
    if (clobber) {
      fs.rename(source, dest, function (err) {
        if (!err) return callback()

        if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST') {
          rimraf(dest, function (err) {
            if (err) return callback(err)
            options.clobber = false // just clobbered it, no need to do it again
            mv(source, dest, options, callback)
          })
          return
        }

        // weird Windows shit
        if (err.code === 'EPERM') {
          setTimeout(function () {
            rimraf(dest, function (err) {
              if (err) return callback(err)
              options.clobber = false
              mv(source, dest, options, callback)
            })
          }, 200)
          return
        }

        if (err.code !== 'EXDEV') return callback(err)
        moveAcrossDevice(source, dest, clobber, limit, callback)
      })
    } else {
      fs.link(source, dest, function (err) {
        if (err) {
          if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM') {
            moveAcrossDevice(source, dest, clobber, limit, callback)
            return
          }
          callback(err)
          return
        }
        fs.unlink(source, callback)
      })
    }
  }
}

function moveAcrossDevice (source, dest, clobber, limit, callback) {
  fs.stat(source, function (err, stat) {
    if (err) {
      callback(err)
      return
    }

    if (stat.isDirectory()) {
      moveDirAcrossDevice(source, dest, clobber, limit, callback)
    } else {
      moveFileAcrossDevice(source, dest, clobber, limit, callback)
    }
  })
}

function moveFileAcrossDevice (source, dest, clobber, limit, callback) {
  var outFlags = clobber ? 'w' : 'wx'
  var ins = fs.createReadStream(source)
  var outs = fs.createWriteStream(dest, {flags: outFlags})

  ins.on('error', function (err) {
    ins.destroy()
    outs.destroy()
    outs.removeListener('close', onClose)

    // may want to create a directory but `out` line above
    // creates an empty file for us: See #108
    // don't care about error here
    fs.unlink(dest, function () {
      // note: `err` here is from the input stream errror
      if (err.code === 'EISDIR' || err.code === 'EPERM') {
        moveDirAcrossDevice(source, dest, clobber, limit, callback)
      } else {
        callback(err)
      }
    })
  })

  outs.on('error', function (err) {
    ins.destroy()
    outs.destroy()
    outs.removeListener('close', onClose)
    callback(err)
  })

  outs.once('close', onClose)
  ins.pipe(outs)

  function onClose () {
    fs.unlink(source, callback)
  }
}

function moveDirAcrossDevice (source, dest, clobber, limit, callback) {
  var options = {
    stopOnErr: true,
    clobber: false,
    limit: limit
  }

  function startNcp () {
    ncp(source, dest, options, function (errList) {
      if (errList) return callback(errList[0])
      rimraf(source, callback)
    })
  }

  if (clobber) {
    rimraf(dest, function (err) {
      if (err) return callback(err)
      startNcp()
    })
  } else {
    startNcp()
  }
}

module.exports = {
  move: mv
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/output/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fs-extra/lib/output/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "path")
var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var mkdir = __webpack_require__(/*! ../mkdirs */ "./node_modules/fs-extra/lib/mkdirs/index.js")

function outputFile (file, data, encoding, callback) {
  if (typeof encoding === 'function') {
    callback = encoding
    encoding = 'utf8'
  }

  var dir = path.dirname(file)
  fs.exists(dir, function (itDoes) {
    if (itDoes) return fs.writeFile(file, data, encoding, callback)

    mkdir.mkdirs(dir, function (err) {
      if (err) return callback(err)

      fs.writeFile(file, data, encoding, callback)
    })
  })
}

function outputFileSync (file, data, encoding) {
  var dir = path.dirname(file)
  if (fs.existsSync(dir)) {
    return fs.writeFileSync.apply(fs, arguments)
  }
  mkdir.mkdirsSync(dir)
  fs.writeFileSync.apply(fs, arguments)
}

module.exports = {
  outputFile: outputFile,
  outputFileSync: outputFileSync
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/remove/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fs-extra/lib/remove/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rimraf = __webpack_require__(/*! rimraf */ "rimraf")

function removeSync (dir) {
  return rimraf.sync(dir)
}

function remove (dir, callback) {
  return callback ? rimraf(dir, callback) : rimraf(dir, function () {})
}

module.exports = {
  remove: remove,
  removeSync: removeSync
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/util/assign.js":
/*!**************************************************!*\
  !*** ./node_modules/fs-extra/lib/util/assign.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// simple mutable assign
function assign () {
  var args = [].slice.call(arguments).filter(function (i) { return i })
  var dest = args.shift()
  args.forEach(function (src) {
    Object.keys(src).forEach(function (key) {
      dest[key] = src[key]
    })
  })

  return dest
}

module.exports = assign


/***/ }),

/***/ "./node_modules/fs-extra/lib/util/utimes.js":
/*!**************************************************!*\
  !*** ./node_modules/fs-extra/lib/util/utimes.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
var path = __webpack_require__(/*! path */ "path")
var os = __webpack_require__(/*! os */ "os")

// HFS, ext{2,3}, FAT do not, Node.js v0.10 does not
function hasMillisResSync () {
  var tmpfile = path.join('millis-test-sync' + Date.now().toString() + Math.random().toString().slice(2))
  tmpfile = path.join(os.tmpdir(), tmpfile)

  // 550 millis past UNIX epoch
  var d = new Date(1435410243862)
  fs.writeFileSync(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141')
  var fd = fs.openSync(tmpfile, 'r+')
  fs.futimesSync(fd, d, d)
  fs.closeSync(fd)
  return fs.statSync(tmpfile).mtime > 1435410243000
}

function hasMillisRes (callback) {
  var tmpfile = path.join('millis-test' + Date.now().toString() + Math.random().toString().slice(2))
  tmpfile = path.join(os.tmpdir(), tmpfile)

  // 550 millis past UNIX epoch
  var d = new Date(1435410243862)
  fs.writeFile(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141', function (err) {
    if (err) return callback(err)
    fs.open(tmpfile, 'r+', function (err, fd) {
      if (err) return callback(err)
      fs.futimes(fd, d, d, function (err) {
        if (err) return callback(err)
        fs.close(fd, function (err) {
          if (err) return callback(err)
          fs.stat(tmpfile, function (err, stats) {
            if (err) return callback(err)
            callback(null, stats.mtime > 1435410243000)
          })
        })
      })
    })
  })
}

function timeRemoveMillis (timestamp) {
  if (typeof timestamp === 'number') {
    return Math.floor(timestamp / 1000) * 1000
  } else if (timestamp instanceof Date) {
    return new Date(Math.floor(timestamp.getTime() / 1000) * 1000)
  } else {
    throw new Error('fs-extra: timeRemoveMillis() unknown parameter type')
  }
}

function utimesMillis (path, atime, mtime, callback) {
  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
  fs.open(path, 'r+', function (err, fd) {
    if (err) return callback(err)
    fs.futimes(fd, atime, mtime, function (err) {
      if (err) return callback(err)
      fs.close(fd, callback)
    })
  })
}

module.exports = {
  hasMillisRes: hasMillisRes,
  hasMillisResSync: hasMillisResSync,
  timeRemoveMillis: timeRemoveMillis,
  utimesMillis: utimesMillis
}


/***/ }),

/***/ "./node_modules/fs-extra/lib/walk/index.js":
/*!*************************************************!*\
  !*** ./node_modules/fs-extra/lib/walk/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var klaw = __webpack_require__(/*! klaw */ "./node_modules/klaw/src/index.js")

module.exports = {
  walk: klaw
}


/***/ }),

/***/ "./node_modules/jsonfile/index.js":
/*!****************************************!*\
  !*** ./node_modules/jsonfile/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _fs
try {
  _fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
} catch (_) {
  _fs = __webpack_require__(/*! fs */ "fs")
}

function readFile (file, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }

  if (typeof options === 'string') {
    options = {encoding: options}
  }

  options = options || {}
  var fs = options.fs || _fs

  var shouldThrow = true
  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
  if ('passParsingErrors' in options) {
    shouldThrow = options.passParsingErrors
  } else if ('throws' in options) {
    shouldThrow = options.throws
  }

  fs.readFile(file, options, function (err, data) {
    if (err) return callback(err)

    data = stripBom(data)

    var obj
    try {
      obj = JSON.parse(data, options ? options.reviver : null)
    } catch (err2) {
      if (shouldThrow) {
        err2.message = file + ': ' + err2.message
        return callback(err2)
      } else {
        return callback(null, null)
      }
    }

    callback(null, obj)
  })
}

function readFileSync (file, options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {encoding: options}
  }

  var fs = options.fs || _fs

  var shouldThrow = true
  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
  if ('passParsingErrors' in options) {
    shouldThrow = options.passParsingErrors
  } else if ('throws' in options) {
    shouldThrow = options.throws
  }

  var content = fs.readFileSync(file, options)
  content = stripBom(content)

  try {
    return JSON.parse(content, options.reviver)
  } catch (err) {
    if (shouldThrow) {
      err.message = file + ': ' + err.message
      throw err
    } else {
      return null
    }
  }
}

function writeFile (file, obj, options, callback) {
  if (callback == null) {
    callback = options
    options = {}
  }
  options = options || {}
  var fs = options.fs || _fs

  var spaces = typeof options === 'object' && options !== null
    ? 'spaces' in options
    ? options.spaces : this.spaces
    : this.spaces

  var str = ''
  try {
    str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n'
  } catch (err) {
    if (callback) return callback(err, null)
  }

  fs.writeFile(file, str, options, callback)
}

function writeFileSync (file, obj, options) {
  options = options || {}
  var fs = options.fs || _fs

  var spaces = typeof options === 'object' && options !== null
    ? 'spaces' in options
    ? options.spaces : this.spaces
    : this.spaces

  var str = JSON.stringify(obj, options.replacer, spaces) + '\n'
  // not sure if fs.writeFileSync returns anything, but just in case
  return fs.writeFileSync(file, str, options)
}

function stripBom (content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8')
  content = content.replace(/^\uFEFF/, '')
  return content
}

var jsonfile = {
  spaces: null,
  readFile: readFile,
  readFileSync: readFileSync,
  writeFile: writeFile,
  writeFileSync: writeFileSync
}

module.exports = jsonfile


/***/ }),

/***/ "./node_modules/klaw/src/assign.js":
/*!*****************************************!*\
  !*** ./node_modules/klaw/src/assign.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// simple mutable assign (extracted from fs-extra)
// I really like object-assign package, but I wanted a lean package with zero deps
function _assign () {
  var args = [].slice.call(arguments).filter(function (i) { return i })
  var dest = args.shift()
  args.forEach(function (src) {
    Object.keys(src).forEach(function (key) {
      dest[key] = src[key]
    })
  })

  return dest
}

// thank you baby Jesus for Node v4 and Object.assign
module.exports = Object.assign || _assign


/***/ }),

/***/ "./node_modules/klaw/src/index.js":
/*!****************************************!*\
  !*** ./node_modules/klaw/src/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! assert */ "assert")
var fs
try {
  fs = __webpack_require__(/*! graceful-fs */ "graceful-fs")
} catch (e) {
  fs = __webpack_require__(/*! fs */ "fs")
}
var path = __webpack_require__(/*! path */ "path")
var Readable = __webpack_require__(/*! stream */ "stream").Readable
var util = __webpack_require__(/*! util */ "util")
var assign = __webpack_require__(/*! ./assign */ "./node_modules/klaw/src/assign.js")

function Walker (dir, options) {
  assert.strictEqual(typeof dir, 'string', '`dir` parameter should be of type string. Got type: ' + typeof dir)
  var defaultStreamOptions = { objectMode: true }
  var defaultOpts = { queueMethod: 'shift', pathSorter: undefined, filter: undefined }
  options = assign(defaultOpts, options, defaultStreamOptions)

  Readable.call(this, options)
  this.root = path.resolve(dir)
  this.paths = [this.root]
  this.options = options
  this.fs = options.fs || fs // mock-fs
}
util.inherits(Walker, Readable)

Walker.prototype._read = function () {
  if (this.paths.length === 0) return this.push(null)
  var self = this
  var pathItem = this.paths[this.options.queueMethod]()

  self.fs.lstat(pathItem, function (err, stats) {
    var item = { path: pathItem, stats: stats }
    if (err) return self.emit('error', err, item)
    if (!stats.isDirectory()) return self.push(item)

    self.fs.readdir(pathItem, function (err, pathItems) {
      if (err) {
        self.push(item)
        return self.emit('error', err, item)
      }

      pathItems = pathItems.map(function (part) { return path.join(pathItem, part) })
      if (self.options.filter) pathItems = pathItems.filter(self.options.filter)
      if (self.options.pathSorter) pathItems.sort(self.options.pathSorter)
      pathItems.forEach(function (pi) { self.paths.push(pi) })

      self.push(item)
    })
  })
}

function walk (root, options) {
  return new Walker(root, options)
}

module.exports = walk


/***/ }),

/***/ "./node_modules/mount-point/index.js":
/*!*******************************************!*\
  !*** ./node_modules/mount-point/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var df = __webpack_require__(/*! @sindresorhus/df */ "./node_modules/mount-point/node_modules/@sindresorhus/df/index.js");
var pify = __webpack_require__(/*! pify */ "pify");
var Promise = __webpack_require__(/*! pinkie-promise */ "pinkie-promise");

module.exports = function (file) {
	return pify(df.file, Promise)(file).then(function (data) {
		return data.mountpoint;
	});
};


/***/ }),

/***/ "./node_modules/mount-point/node_modules/@sindresorhus/df/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/mount-point/node_modules/@sindresorhus/df/index.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var childProcess = __webpack_require__(/*! child_process */ "child_process");

function run(args, cb) {
	childProcess.execFile('df', args, function (err, stdout) {
		if (err) {
			cb(err);
			return;
		}

		cb(null, stdout.trim().split('\n').slice(1).map(function (el) {
			var cl = el.split(/\s+(?=[\d\/])/);

			return {
				filesystem: cl[0],
				size: parseInt(cl[1], 10) * 1024,
				used: parseInt(cl[2], 10) * 1024,
				available: parseInt(cl[3], 10) * 1024,
				capacity: parseInt(cl[4], 10) / 100,
				mountpoint: cl[5]
			};
		}));
	});
};

var df = module.exports = function (cb) {
	run(['-kP'], cb);
};

df.fs = function (name, cb) {
	if (typeof name !== 'string') {
		throw new Error('name required');
	}

	run(['-kP'], function (err, data) {
		if (err) {
			cb(err);
			return;
		}

		var ret;

		data.forEach(function (el) {
			if (el.filesystem === name) {
				ret = el;
			}
		});

		cb(null, ret);
	});
};

df.file = function (file, cb) {
	if (typeof file !== 'string') {
		throw new Error('file required');
	}

	run(['-kP', file], function (err, data) {
		if (err) {
			cb(err);
			return;
		}

		cb(null, data[0]);
	});
};


/***/ }),

/***/ "./node_modules/p-map/index.js":
/*!*************************************!*\
  !*** ./node_modules/p-map/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (iterable, mapper, opts) => new Promise((resolve, reject) => {
	opts = Object.assign({
		concurrency: Infinity
	}, opts);

	if (typeof mapper !== 'function') {
		throw new TypeError('Mapper function is required');
	}

	const concurrency = opts.concurrency;

	if (!(typeof concurrency === 'number' && concurrency >= 1)) {
		throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${concurrency}\` (${typeof concurrency})`);
	}

	const ret = [];
	const iterator = iterable[Symbol.iterator]();
	let isRejected = false;
	let iterableDone = false;
	let resolvingCount = 0;
	let currentIdx = 0;

	const next = () => {
		if (isRejected) {
			return;
		}

		const nextItem = iterator.next();
		const i = currentIdx;
		currentIdx++;

		if (nextItem.done) {
			iterableDone = true;

			if (resolvingCount === 0) {
				resolve(ret);
			}

			return;
		}

		resolvingCount++;

		Promise.resolve(nextItem.value)
			.then(el => mapper(el, i))
			.then(
				val => {
					ret[i] = val;
					resolvingCount--;
					next();
				},
				err => {
					isRejected = true;
					reject(err);
				}
			);
	};

	for (let i = 0; i < concurrency; i++) {
		next();

		if (iterableDone) {
			break;
		}
	}
});


/***/ }),

/***/ "./node_modules/run-applescript/index.js":
/*!***********************************************!*\
  !*** ./node_modules/run-applescript/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const execa = __webpack_require__(/*! execa */ "execa");

module.exports = script => {
	if (process.platform !== 'darwin') {
		return Promise.reject(new Error('macOS only'));
	}

	return execa.stdout('osascript', ['-e', script]);
};

module.exports.sync = script => {
	if (process.platform !== 'darwin') {
		throw new Error('macOS only');
	}

	return execa.sync('osascript', ['-e', script]).stdout;
};


/***/ }),

/***/ "./node_modules/trash/index.js":
/*!*************************************!*\
  !*** ./node_modules/trash/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const globby = __webpack_require__(/*! globby */ "globby");
const pTry = __webpack_require__(/*! p-try */ "p-try");
const macos = __webpack_require__(/*! ./lib/macos */ "./node_modules/trash/lib/macos.js");
const linux = __webpack_require__(/*! ./lib/linux */ "./node_modules/trash/lib/linux.js");
const win = __webpack_require__(/*! ./lib/win */ "./node_modules/trash/lib/win.js");

module.exports = (iterable, opts) => pTry(() => {
	iterable = Array.from(typeof iterable === 'string' ? [iterable] : iterable).map(String);
	opts = Object.assign({glob: true}, opts);

	const paths = (opts.glob === false ? iterable : globby.sync(iterable, {
		expandDirectories: false,
		nodir: false,
		nonull: true
	}))
		.map(x => path.resolve(x))
		.filter(x => {
			try {
				return fs.lstatSync(x);
			} catch (err) {
				if (err.code === 'ENOENT') {
					return false;
				}

				throw err;
			}
		});

	if (paths.length === 0) {
		return;
	}

	switch (process.platform) {
		case 'darwin': return macos(paths);
		case 'win32': return win(paths);
		default: return linux(paths);
	}
});


/***/ }),

/***/ "./node_modules/trash/lib/linux.js":
/*!*****************************************!*\
  !*** ./node_modules/trash/lib/linux.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const path = __webpack_require__(/*! path */ "path");
const fsExtra = __webpack_require__(/*! fs-extra */ "./node_modules/fs-extra/lib/index.js");
const pify = __webpack_require__(/*! pify */ "pify");
const uuid = __webpack_require__(/*! uuid */ "./node_modules/uuid/index.js");
const xdgTrashdir = __webpack_require__(/*! xdg-trashdir */ "./node_modules/xdg-trashdir/index.js");
const pMap = __webpack_require__(/*! p-map */ "./node_modules/p-map/index.js");

const fs = pify(fsExtra);

function trash(src) {
	return xdgTrashdir(src).then(dir => {
		const name = uuid.v4();
		const dest = path.join(dir, 'files', name);
		const info = path.join(dir, 'info', `${name}.trashinfo`);
		const msg = `
[Trash Info]
Path=${src.replace(/\s/g, '%20')}
DeletionDate=${(new Date()).toISOString()}
		`.trim();

		return Promise.all([
			fs.move(src, dest, {mkdirp: true}),
			fs.outputFile(info, msg)
		]).then(() => ({
			path: dest,
			info
		}));
	});
}

module.exports = paths => pMap(paths, trash, {concurrency: os.cpus().length});


/***/ }),

/***/ "./node_modules/trash/lib/macos.js":
/*!*****************************************!*\
  !*** ./node_modules/trash/lib/macos.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const path = __webpack_require__(/*! path */ "path");
const execFile = __webpack_require__(/*! child_process */ "child_process").execFile;
const escapeStringApplescript = __webpack_require__(/*! escape-string-applescript */ "./node_modules/escape-string-applescript/index.js");
const runApplescript = __webpack_require__(/*! run-applescript */ "./node_modules/run-applescript/index.js");
const pify = __webpack_require__(/*! pify */ "pify");

const olderThanMountainLion = Number(os.release().split('.')[0]) < 12;

// Binary source: https://github.com/sindresorhus/macos-trash
const bin = path.join(__dirname, 'macos-trash');

function legacy(paths) {
	const pathStr = paths.map(x => `"${escapeStringApplescript(x)}"`).join(',');
	const script = `
set deleteList to {}
repeat with currentPath in {${pathStr}}
set end of deleteList to POSIX file currentPath
end repeat
tell app "Finder" to delete deleteList
	`.trim();

	return runApplescript(script).catch(err => {
		if (/10010/.test(err.message)) {
			err = new Error('Item doesn\'t exist');
		}

		throw err;
	});
}

module.exports = paths => {
	if (olderThanMountainLion) {
		return legacy(paths);
	}

	return pify(execFile)(bin, paths);
};


/***/ }),

/***/ "./node_modules/trash/lib/win.js":
/*!***************************************!*\
  !*** ./node_modules/trash/lib/win.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const path = __webpack_require__(/*! path */ "path");
const execFile = __webpack_require__(/*! child_process */ "child_process").execFile;
const pify = __webpack_require__(/*! pify */ "pify");

// Binary source: https://github.com/sindresorhus/recycle-bin
const bin = path.join(__dirname, 'win-trash.exe');

module.exports = paths => pify(execFile)(bin, paths);


/***/ }),

/***/ "./node_modules/user-home/index.js":
/*!*****************************************!*\
  !*** ./node_modules/user-home/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(/*! os-homedir */ "os-homedir")();


/***/ }),

/***/ "./node_modules/uuid/index.js":
/*!************************************!*\
  !*** ./node_modules/uuid/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(/*! ./v1 */ "./node_modules/uuid/v1.js");
var v4 = __webpack_require__(/*! ./v4 */ "./node_modules/uuid/v4.js");

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ "./node_modules/uuid/lib/rng.js":
/*!**************************************!*\
  !*** ./node_modules/uuid/lib/rng.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var crypto = __webpack_require__(/*! crypto */ "crypto");

module.exports = function nodeRNG() {
  return crypto.randomBytes(16);
};


/***/ }),

/***/ "./node_modules/uuid/v1.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v1.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ "./node_modules/xdg-basedir/index.js":
/*!*******************************************!*\
  !*** ./node_modules/xdg-basedir/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var path = __webpack_require__(/*! path */ "path");
var osHomedir = __webpack_require__(/*! os-homedir */ "os-homedir");
var home = osHomedir();
var env = process.env;

exports.data = env.XDG_DATA_HOME ||
	(home ? path.join(home, '.local', 'share') : null);

exports.config = env.XDG_CONFIG_HOME ||
	(home ? path.join(home, '.config') : null);

exports.cache = env.XDG_CACHE_HOME || (home ? path.join(home, '.cache') : null);

exports.runtime = env.XDG_RUNTIME_DIR || null;

exports.dataDirs = (env.XDG_DATA_DIRS || '/usr/local/share/:/usr/share/').split(':');

if (exports.data) {
	exports.dataDirs.unshift(exports.data);
}

exports.configDirs = (env.XDG_CONFIG_DIRS || '/etc/xdg').split(':');

if (exports.config) {
	exports.configDirs.unshift(exports.config);
}


/***/ }),

/***/ "./node_modules/xdg-trashdir/index.js":
/*!********************************************!*\
  !*** ./node_modules/xdg-trashdir/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const df = __webpack_require__(/*! @sindresorhus/df */ "./node_modules/@sindresorhus/df/index.js");
const mountPoint = __webpack_require__(/*! mount-point */ "./node_modules/mount-point/index.js");
const userHome = __webpack_require__(/*! user-home */ "./node_modules/user-home/index.js");
const xdgBasedir = __webpack_require__(/*! xdg-basedir */ "./node_modules/xdg-basedir/index.js");
const pify = __webpack_require__(/*! pify */ "pify");

const check = file => {
	const topuid = `${file}-${process.getuid()}`;
	const stickyBitMode = 17407;

	return pify(fs.lstat)(file)
		.then(stats => {
			if (stats.isSymbolicLink() || stats.mode !== stickyBitMode) {
				return topuid;
			}

			return path.join(file, String(process.getuid()));
		})
		.catch(err => {
			if (err.code === 'ENOENT') {
				return topuid;
			}

			return path.join(xdgBasedir.data, 'Trash');
		});
};

module.exports = file => {
	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	if (!file) {
		return Promise.resolve(path.join(xdgBasedir.data, 'Trash'));
	}

	return Promise.all([
		mountPoint(userHome),
		// Ignore errors in case `file` is a dangling symlink
		mountPoint(file).catch(() => {})
	]).then(mountPoints => {
		const homeMountPoint = mountPoints[0];
		const fileMountPoint = mountPoints[1];
		if (!fileMountPoint || fileMountPoint === homeMountPoint) {
			return path.join(xdgBasedir.data, 'Trash');
		}

		return check(path.join(fileMountPoint, '.Trash'));
	});
};

module.exports.all = () => {
	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	return df().then(list => Promise.all(list.map(file => {
		if (file.mountpoint === '/') {
			return path.join(xdgBasedir.data, 'Trash');
		}

		return check(path.join(file.mountpoint, '.Trash'));
	})));
};


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("assert");

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

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "execa":
/*!************************!*\
  !*** external "execa" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("execa");

/***/ }),

/***/ "folktale/maybe":
/*!*********************************!*\
  !*** external "folktale/maybe" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("folktale/maybe");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "globby":
/*!*************************!*\
  !*** external "globby" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("globby");

/***/ }),

/***/ "graceful-fs":
/*!******************************!*\
  !*** external "graceful-fs" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graceful-fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "os-homedir":
/*!*****************************!*\
  !*** external "os-homedir" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os-homedir");

/***/ }),

/***/ "p-try":
/*!************************!*\
  !*** external "p-try" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("p-try");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "path-is-absolute":
/*!***********************************!*\
  !*** external "path-is-absolute" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path-is-absolute");

/***/ }),

/***/ "pify":
/*!***********************!*\
  !*** external "pify" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("pify");

/***/ }),

/***/ "pinkie-promise":
/*!*********************************!*\
  !*** external "pinkie-promise" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("pinkie-promise");

/***/ }),

/***/ "rimraf":
/*!*************************!*\
  !*** external "rimraf" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rimraf");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

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