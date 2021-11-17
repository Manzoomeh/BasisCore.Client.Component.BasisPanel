/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 465:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;


/***/ }),

/***/ 98:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeMax = Math.max,
    nativeNow = Date.now;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack);
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
 * objects into destination objects that are passed thru.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
    stack['delete'](srcValue);
  }
  return objValue;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
 * // => { 'a': { 'b': 2, 'c': 3 } }
 */
var defaultsDeep = baseRest(function(args) {
  args.push(undefined, customDefaultsMerge);
  return apply(mergeWith, undefined, args);
});

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = defaultsDeep;


/***/ }),

/***/ 660:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof __webpack_require__.g === "object" ? __webpack_require__.g :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect || (Reflect = {}));


/***/ }),

/***/ 884:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ src_ComponentCollection)
});

// EXTERNAL MODULE: ./node_modules/tsyringe/dist/esm5/index.js + 25 modules
var esm5 = __webpack_require__(195);
// EXTERNAL MODULE: ./src/enum.ts
var src_enum = __webpack_require__(397);
// EXTERNAL MODULE: ./src/component/Component.ts
var Component = __webpack_require__(737);
;// CONCATENATED MODULE: ./src/component/text-base/AttributeComponent.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class AttributeComponent extends Component/* default */.Z {
    constructor(element, context, attribute) {
        super(element, context);
        this.priority = src_enum/* Priority.none */.UL.none;
        this.attribute = attribute;
        this.token = this.attribute.value.ToStringToken(context);
        this.addTrigger(this.token.getSourceNames());
    }
    initializeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.token.getValueAsync(false);
            this.setContent(value !== null && value !== void 0 ? value : "");
        });
    }
    renderAsync(source) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.token.getValueAsync();
            this.setContent(content);
        });
    }
    setContent(content) {
        this.attribute.value = content;
    }
}

// EXTERNAL MODULE: ./src/RangeObject/RangeObject.ts
var RangeObject = __webpack_require__(812);
;// CONCATENATED MODULE: ./src/component/text-base/TextComponent.ts
var TextComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class TextComponent extends Component/* default */.Z {
    constructor(node, context, start, end) {
        super(node, context);
        this.priority = src_enum/* Priority.none */.UL.none;
        const range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, end);
        this.rangeObject = new RangeObject/* default */.Z(range, this);
        this.token = this.rangeObject.initialContent.textContent.ToStringToken(context);
    }
    initializeAsync() {
        return TextComponent_awaiter(this, void 0, void 0, function* () {
            this.addTrigger(this.token.getSourceNames());
            const value = yield this.token.getValueAsync(false);
            this.setContent(value !== null && value !== void 0 ? value : "");
        });
    }
    renderAsync(source) {
        return TextComponent_awaiter(this, void 0, void 0, function* () {
            const content = yield this.token.getValueAsync();
            this.setContent(content);
        });
    }
    setContent(content) {
        return TextComponent_awaiter(this, void 0, void 0, function* () {
            this.rangeObject.setContent(content);
        });
    }
}

;// CONCATENATED MODULE: ./src/ComponentCollection.ts
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ComponentCollection_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ComponentCollection_1;




let ComponentCollection = ComponentCollection_1 = class ComponentCollection {
    constructor(context, container) {
        this._disposed = false;
        this.container = container;
        this.context = context;
        this.regex = this.context.options.getDefault("binding.regex");
        this.blockRegex = this.context.options.getDefault("binding.codeblock-regex");
    }
    get disposed() {
        return this._disposed;
    }
    get initializeTask() {
        return this._initializeTask;
    }
    processNodesAsync(nodes) {
        return ComponentCollection_awaiter(this, void 0, void 0, function* () {
            if (this.components) {
                throw new Error("Run ComponentCollection for more than one");
            }
            this.components = this.extractComponent(nodes);
            this._initializeTask = this.initializeAsync(this.components);
            yield this._initializeTask;
            yield this.runAsync(this.components);
        });
    }
    initializeAsync(components) {
        return ComponentCollection_awaiter(this, void 0, void 0, function* () {
            const tasks = components.map((x) => x.initializeAsync());
            yield Promise.all(tasks);
        });
    }
    runAsync(components) {
        return ComponentCollection_awaiter(this, void 0, void 0, function* () {
            const priorityMap = components.reduce((map, component) => {
                if (component.priority != src_enum/* Priority.none */.UL.none) {
                    let list = map.get(component.priority);
                    if (!list) {
                        list = new Array();
                        map.set(component.priority, list);
                    }
                    list.push(component);
                }
                return map;
            }, new Map());
            for (const priority of [src_enum/* Priority.high */.UL.high, src_enum/* Priority.normal */.UL.normal, src_enum/* Priority.low */.UL.low]) {
                const relatedComponent = priorityMap.get(priority);
                if (relatedComponent) {
                    const taskList = relatedComponent.map((x) => x.processAsync());
                    yield Promise.all(taskList);
                }
            }
        });
    }
    extractComponent(nodes) {
        const components = new Array();
        nodes.forEach((node) => {
            this.extractTextBaseComponents(node, components);
            this.extractBasisCommands(node, components);
        });
        return components;
    }
    extractBasisCommands(node, components) {
        const pair = this.findRootLevelComponentNode(node);
        for (const item of pair.coreList) {
            const core = item.getAttribute("core").split(".", 2)[0].toLowerCase();
            components.push(this.createCommandComponent(item, core));
        }
        for (const item of pair.tagList) {
            const tagName = item.tagName.toLowerCase();
            const key = ComponentCollection_1.knowHtmlElement.indexOf(tagName) != -1
                ? tagName
                : "unknown-html";
            components.push(this.createCommandComponent(item, key));
        }
    }
    extractTextComponent(node, components) {
        if (node.textContent.trim().length != 0) {
            do {
                let match = node.textContent.match(this.regex);
                if (!match) {
                    match = node.textContent.match(this.blockRegex);
                }
                if (match) {
                    var com = new TextComponent(node, this.context, match.index, match.index + match[0].length);
                    components.push(com);
                }
                else {
                    break;
                }
            } while (true);
        }
    }
    extractAttributeComponent(element, components) {
        return ComponentCollection_awaiter(this, void 0, void 0, function* () {
            for (const pair of element.attributes) {
                if (pair.value.trim().length != 0) {
                    let match = pair.value.match(this.regex);
                    if (!match) {
                        match = pair.value.match(this.blockRegex);
                    }
                    if (match) {
                        const com = new AttributeComponent(element, this.context, pair);
                        components.push(com);
                    }
                }
            }
        });
    }
    extractTextBaseComponents(element, components) {
        if (element.nodeType == Node.TEXT_NODE) {
            this.extractTextComponent(element, components);
        }
        else if (element.nodeType != Node.COMMENT_NODE) {
            if (element instanceof Element) {
                if (!element.isBasisCore()) {
                    this.extractAttributeComponent(element, components);
                    if (element.hasChildNodes()) {
                        for (const child of element.childNodes) {
                            this.extractTextBaseComponents(child, components);
                        }
                    }
                }
            }
            else {
                if (element.hasChildNodes()) {
                    for (const child of element.childNodes) {
                        this.extractTextBaseComponents(child, components);
                    }
                }
            }
        }
    }
    createCommandComponent(element, token) {
        const childContainer = this.container.createChildContainer();
        childContainer.register("element", { useValue: element });
        childContainer.register("context", { useValue: this.context });
        childContainer.register("container", { useValue: childContainer });
        return childContainer.resolve(token);
    }
    findRootLevelComponentNode(rootElement) {
        const coreList = new Array();
        const tagList = new Array();
        var process = (child) => {
            if (child instanceof Element) {
                if (child.isBasisCore()) {
                    coreList.push(child);
                    return;
                }
                else if (child.isBasisTag()) {
                    tagList.push(child);
                }
            }
            child.childNodes.forEach(process);
        };
        process(rootElement);
        return { coreList, tagList };
    }
    disposeAsync() {
        var _a, _b;
        return ComponentCollection_awaiter(this, void 0, void 0, function* () {
            if (!this._disposed) {
                this._disposed = true;
                const tasks = (_a = this.components) === null || _a === void 0 ? void 0 : _a.map((component) => component.disposeAsync());
                yield Promise.all(tasks);
                (_b = this.components) === null || _b === void 0 ? void 0 : _b.splice(0, this.components.length);
            }
        });
    }
};
ComponentCollection.knowHtmlElement = ["form", "input", "select"];
ComponentCollection = ComponentCollection_1 = __decorate([
    (0,esm5/* injectable */.b2)(),
    __param(0, (0,esm5/* inject */.f3)("context")),
    __param(1, (0,esm5/* inject */.f3)("container")),
    __metadata("design:paramtypes", [Object, Object])
], ComponentCollection);
/* harmony default export */ const src_ComponentCollection = (ComponentCollection);


/***/ }),

/***/ 812:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ RangeObject)
/* harmony export */ });
class RangeObject {
    constructor(range, owner) {
        this._startNode = document.createTextNode("");
        this._endNode = document.createTextNode("");
        this.initialContent = range.extractContents();
        range.insertNode(this._endNode);
        range.insertNode(this._startNode);
        range.detach();
    }
    getRange() {
        const range = new Range();
        range.setStartAfter(this._startNode);
        range.setEndBefore(this._endNode);
        return range;
    }
    deleteContents() {
        const range = this.getRange();
        range.deleteContents();
        range.detach();
    }
    setContent(content, append = false) {
        const range = this.getRange();
        if (!append) {
            range.deleteContents();
        }
        const oldContent = range.extractContents();
        if (content instanceof Node) {
            oldContent.appendChild(content);
        }
        else if (Array.isArray(content)) {
            oldContent.appendChild(range.createContextualFragment(content.join(",")));
        }
        else {
            oldContent.appendChild(range.createContextualFragment(content.toString()));
        }
        range.insertNode(oldContent);
        range.detach();
    }
}


/***/ }),

/***/ 102:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Util)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Util {
    static HasValue(data) {
        return data !== undefined && data != null;
    }
    static isEqual(stringA, stringB) {
        return (stringA || "").isEqual(stringB);
    }
    static Equal(a, b) {
        var retVal = true;
        if (!Util.HasValue(a) || !Util.HasValue(b)) {
            retVal = false;
        }
        else {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                retVal = false;
            }
            else {
                for (var i = 0; i < aProps.length; i++) {
                    var propName = aProps[i];
                    if (a[propName] !== b[propName]) {
                        retVal = false;
                        break;
                    }
                }
            }
        }
        return retVal;
    }
    static ReplaceEx(source, searchValue, replaceValue) {
        return source.replace(new RegExp(searchValue, "gi"), replaceValue);
    }
    static IsNullOrEmpty(data) {
        return data === undefined || data == null || data === "";
    }
    static getDataAsync(url) {
        return Util.fetchDataAsync(url, "GET");
    }
    static fetchDataAsync(url, method, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const init = { method: method };
            if (data) {
                init.headers = {
                    "Content-Type": "application/json",
                };
                init.body = JSON.stringify(data);
            }
            const result = yield fetch(url, init);
            return yield result.json();
        });
    }
    static formatString(pattern, params) {
        const paraNameList = [...Object.getOwnPropertyNames(params)];
        const formatter = new Function(...paraNameList, `return \`${pattern}\``);
        return formatter(...paraNameList.map((x) => Reflect.get(params, x)));
    }
    static formatUrl(url, paramsObject, queryStringObject) {
        let retVal = paramsObject ? Util.formatString(url, paramsObject) : url;
        if (queryStringObject) {
            const queryPartList = Object.getOwnPropertyNames(queryStringObject).map((x) => `${encodeURIComponent(x)}=${encodeURIComponent(Reflect.get(queryStringObject, x))}`);
            retVal = `${retVal}?${queryPartList.join("&")}`;
        }
        return retVal;
    }
    static parse(template) {
        return Util.parser.parseFromString(template, "text/html");
    }
    static Move(oldParent, newParent) {
        while (oldParent.childNodes.length > 0) {
            newParent.appendChild(oldParent.childNodes[0]);
        }
    }
}
Util.parser = new DOMParser();


/***/ }),

/***/ 210:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ CommandComponent)
/* harmony export */ });
/* harmony import */ var _RangeObject_RangeObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(812);
/* harmony import */ var _ElementBaseComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(986);


class CommandComponent extends _ElementBaseComponent__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z {
    constructor(element, context) {
        super(element, context);
        this.core = this.node.getAttribute("core");
        const range = document.createRange();
        range.selectNode(this.node);
        this.range = new _RangeObject_RangeObject__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z(range, this);
        this.content = this.range.initialContent;
    }
    setContent(newContent, append) {
        this.range.setContent(newContent, append);
    }
}


/***/ }),

/***/ 737:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Component)
/* harmony export */ });
/* harmony import */ var _enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(397);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Component {
    constructor(node, context) {
        this._handlingSource = new Array();
        this.priority = _enum__WEBPACK_IMPORTED_MODULE_0__/* .Priority.low */ .UL.low;
        this.allowMultiProcess = false;
        this._busy = false;
        this._disposed = false;
        this.node = node;
        this.context = context;
        this._handler = this.onTrigger.bind(this);
    }
    get disposed() {
        return this._disposed;
    }
    get busy() {
        return this._busy;
    }
    processAsync() {
        return this.onTrigger();
    }
    onTrigger(source) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._disposed && (!this._busy || this.allowMultiProcess)) {
                this._busy = true;
                try {
                    yield this.renderAsync(source);
                }
                finally {
                    this._busy = false;
                }
            }
        });
    }
    addTrigger(sourceIds) {
        sourceIds === null || sourceIds === void 0 ? void 0 : sourceIds.forEach((sourceId) => {
            if (this._handlingSource.indexOf(sourceId) === -1) {
                this.context.addOnSourceSetHandler(sourceId, this._handler);
                this._handlingSource.push(sourceId);
            }
        });
    }
    disposeAsync() {
        this._handlingSource.forEach((sourceId) => {
            this.context.removeOnSourceSetHandler(sourceId, this._handler);
        });
        this._disposed = true;
        return Promise.resolve();
    }
}


/***/ }),

/***/ 986:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ ElementBaseComponent)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(737);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class ElementBaseComponent extends _Component__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z {
    constructor(element, context) {
        super(element, context);
    }
    get triggers() {
        return this._triggers;
    }
    initializeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ifToken = this.getAttributeToken("if");
            const onRendering = yield this.getAttributeValueAsync("OnRendering");
            if (onRendering) {
                this.onRenderingAsync = new Function("callbackArgument", `return ${onRendering}(callbackArgument);`);
            }
            const onRendered = yield this.getAttributeValueAsync("OnRendered");
            if (onRendered) {
                this.onRenderedAsync = new Function("callbackArgument", `return ${onRendered}(callbackArgument);`);
            }
            const onProcessing = yield this.getAttributeValueAsync("OnProcessing");
            if (onProcessing) {
                this.onProcessingAsync = new Function("callbackArgument", `return ${onProcessing}(callbackArgument);`);
            }
            const onProcessed = yield this.getAttributeValueAsync("OnProcessed");
            if (onProcessed) {
                this.onProcessedAsync = new Function("callbackArgument", `return ${onProcessed}(callbackArgument);`);
            }
            const value = yield this.getAttributeValueAsync("triggers");
            this._triggers = value === null || value === void 0 ? void 0 : value.split(" ");
            this.addTrigger(this._triggers);
        });
    }
    getIfValueAsync() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const rawValue = yield ((_a = this.ifToken) === null || _a === void 0 ? void 0 : _a.getValueAsync());
            let retVal = true;
            if (rawValue != null && rawValue != undefined) {
                try {
                    const fn = new Function(`try{return ${rawValue};}catch{return false;}`);
                    retVal = fn();
                }
                catch (e) {
                    console.error(`Error in parse 'if' attribute expression in command: '${rawValue}'`);
                    throw e;
                }
            }
            return retVal;
        });
    }
    renderAsync(source) {
        return __awaiter(this, void 0, void 0, function* () {
            let canRender = yield this.getIfValueAsync();
            if (canRender && this.onRenderingAsync) {
                const renderingArgs = this.createCallbackArgument({
                    prevent: false,
                    source: source,
                });
                yield this.onRenderingAsync(renderingArgs);
                canRender = !renderingArgs.prevent;
            }
            let runResult = null;
            if (canRender) {
                runResult = yield this.runAsync(source);
                if (runResult !== null && this.onRenderedAsync) {
                    yield this.onRenderedAsync(this.createCallbackArgument({
                        result: runResult,
                        source: source,
                    }));
                }
            }
        });
    }
    getAttributeValueAsync(attributeName, defaultValue = null) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.getAttributeToken(attributeName);
            return (_a = (yield (token === null || token === void 0 ? void 0 : token.getValueAsync()))) !== null && _a !== void 0 ? _a : defaultValue;
        });
    }
    getAttributeObjectValueAsync(attributeName, defaultValue = null) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.node.GetObjectToken(attributeName, this.context);
            return (_a = (yield (token === null || token === void 0 ? void 0 : token.getValueAsync()))) !== null && _a !== void 0 ? _a : defaultValue;
        });
    }
    getAttributeBooleanValueAsync(attributeName, defaultValue = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const token = this.node.GetBooleanToken(attributeName, this.context);
            return (_a = (yield (token === null || token === void 0 ? void 0 : token.getValueAsync()))) !== null && _a !== void 0 ? _a : defaultValue;
        });
    }
    getAttributeToken(attributeName) {
        return this.node.GetStringToken(attributeName, this.context);
    }
    createCallbackArgument(data) {
        return Object.assign({ context: this.context, node: this.node }, data);
    }
}


/***/ }),

/***/ 26:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var tsyringe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(195);
/* harmony import */ var _ComponentCollection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(884);
/* harmony import */ var _CommandComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(210);
/* harmony import */ var _context_LocalRootContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(523);
/* harmony import */ var lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(98);
/* harmony import */ var lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_4__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





let GroupComponent = class GroupComponent extends _CommandComponent__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z {
    constructor(element, context, container) {
        super(element, context);
        this.container = container;
        const content = document.createDocumentFragment();
        this.childNodes = [...element.childNodes];
        this.childNodes.forEach((node) => content.appendChild(node));
        this.range.setContent(content);
    }
    runAsync() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.oldLocalContext) === null || _a === void 0 ? void 0 : _a.dispose();
            this.currentDC = this.container.createChildContainer();
            this.currentDC.register("OwnerContext", {
                useValue: this.context,
            });
            this.currentDC.register("container", {
                useValue: this.currentDC,
            });
            const options = yield this.getAttributeValueAsync("options");
            if (options) {
                const newOptions = lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_4___default()(eval(options), this.context.options.originalOptions);
                this.currentDC.register("IHostOptions", {
                    useValue: newOptions,
                });
                this.oldLocalContext = this.currentDC.resolve(_context_LocalRootContext__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z);
            }
            else {
                this.oldLocalContext = this.currentDC.resolve("ILocalContext");
            }
            this.currentDC.register("context", {
                useValue: this.oldLocalContext,
            });
            this.collection = this.currentDC.resolve(_ComponentCollection__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z);
            yield this.collection.processNodesAsync(this.childNodes);
        });
    }
    disposeAsync() {
        const _super = Object.create(null, {
            disposeAsync: { get: () => super.disposeAsync }
        });
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.oldLocalContext) === null || _a === void 0 ? void 0 : _a.dispose();
            yield ((_b = this.collection) === null || _b === void 0 ? void 0 : _b.disposeAsync());
            (_c = this.currentDC) === null || _c === void 0 ? void 0 : _c.clearInstances();
            return _super.disposeAsync.call(this);
        });
    }
};
GroupComponent = __decorate([
    (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .injectable */ .b2)(),
    __param(0, (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .inject */ .f3)("element")),
    __param(1, (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .inject */ .f3)("context")),
    __param(2, (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .inject */ .f3)("container")),
    __metadata("design:paramtypes", [Element, Object, Object])
], GroupComponent);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GroupComponent);


/***/ }),

/***/ 242:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var tsyringe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(195);
/* harmony import */ var _enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(397);
/* harmony import */ var _CommandComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(210);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



let CallbackComponent = class CallbackComponent extends _CommandComponent__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z {
    constructor(element, context) {
        super(element, context);
        this.priority = _enum__WEBPACK_IMPORTED_MODULE_1__/* .Priority.none */ .UL.none;
        this.allowMultiProcess = true;
        this.methodToken = this.getAttributeToken("method");
    }
    runAsync(source) {
        return __awaiter(this, void 0, void 0, function* () {
            let retVal = true;
            let callbackFunction = null;
            if (this.methodToken) {
                const methodName = yield this.methodToken.getValueAsync();
                const method = eval(methodName);
                callbackFunction = (arg) => {
                    const param = this.createCallbackArgument({
                        source: arg,
                    });
                    try {
                        Reflect.apply(method, null, [param]);
                    }
                    catch (e) {
                        this.context.logger.logError(`error in execute callback method '${methodName}'.`, e);
                        retVal = e;
                    }
                };
            }
            else {
                callbackFunction = (arg) => {
                    this.context.logger.logSource(arg);
                };
            }
            if (source) {
                callbackFunction(source);
            }
            else {
                this.triggers.forEach((sourceId) => {
                    const source = this.context.tryToGetSource(sourceId);
                    if (source) {
                        callbackFunction(source);
                    }
                });
            }
            return retVal;
        });
    }
};
CallbackComponent = __decorate([
    (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .injectable */ .b2)(),
    __param(0, (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .inject */ .f3)("element")),
    __param(1, (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .inject */ .f3)("context")),
    __metadata("design:paramtypes", [Element, Object])
], CallbackComponent);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CallbackComponent);


/***/ }),

/***/ 294:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Context)
/* harmony export */ });
/* harmony import */ var _event_EventManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(919);
/* harmony import */ var _data_Source__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(877);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class Context {
    constructor(repository, options, logger) {
        this.repository = repository;
        this.logger = logger;
        this.options = options;
        this.onDataSourceSet = new _event_EventManager__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z();
    }
    checkSourceHeartbeatAsync(source) {
        //TODO: must complete
        throw new Error("Method not implemented.");
    }
    onDataSourceSetHandler(source) {
        var handler = this.repository.resolves.get(source.id);
        if (handler) {
            handler.Trigger(source);
            this.repository.resolves.delete(source.id);
        }
        this.onDataSourceSet.Trigger(source);
    }
    addOnSourceSetHandler(sourceId, handler) {
        this.repository.addHandler(sourceId, handler);
    }
    removeOnSourceSetHandler(sourceId, handler) {
        this.repository.removeHandler(sourceId, handler);
    }
    tryToGetSource(sourceId) {
        return this.repository.tryToGet(sourceId);
    }
    waitToGetSourceAsync(sourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            var retVal = this.tryToGetSource(sourceId);
            if (!retVal) {
                retVal = yield this.repository.waitToGetAsync(sourceId);
            }
            return retVal;
        });
    }
    setAsSource(sourceId, data, options, preview) {
        var source = new _data_Source__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(sourceId, data, options);
        this.setSource(source, preview);
    }
    setSource(source, preview) {
        const resultSource = this.repository.setSource(source, preview);
        this.onDataSourceSetHandler(resultSource);
    }
    setSourceFromOwner(source) {
        this.repository.setSourceFromOwner(source);
        this.onDataSourceSetHandler(source);
    }
    dispose() { }
}


/***/ }),

/***/ 523:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var tsyringe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(195);
/* harmony import */ var _options_HostOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(818);
/* harmony import */ var _Context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(294);
/* harmony import */ var _RootContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(887);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




let LocalRootContext = class LocalRootContext extends _RootContext__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z {
    constructor(repository, owner, options) {
        super(repository, options, owner.logger);
        this.owner = owner;
        this.handler = this.owner.onDataSourceSet.Add(this.setSourceFromOwner.bind(this));
    }
    tryToGetSource(sourceId) {
        var _a;
        return ((_a = super.tryToGetSource(sourceId)) !== null && _a !== void 0 ? _a : this.owner.tryToGetSource(sourceId));
    }
    dispose() {
        this.owner.onDataSourceSet.Remove(this.handler);
    }
};
LocalRootContext = __decorate([
    (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .injectable */ .b2)(),
    __param(0, (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .inject */ .f3)("IContextRepository")),
    __param(1, (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .inject */ .f3)("OwnerContext")),
    __metadata("design:paramtypes", [Object, _Context__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z,
        _options_HostOptions__WEBPACK_IMPORTED_MODULE_1__/* .HostOptions */ .G])
], LocalRootContext);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LocalRootContext);


/***/ }),

/***/ 887:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ RootContext)
});

// EXTERNAL MODULE: ./src/exception/ClientException.ts
var ClientException = __webpack_require__(479);
// EXTERNAL MODULE: ./src/exception/ConfigNotFoundException.ts
var ConfigNotFoundException = __webpack_require__(441);
;// CONCATENATED MODULE: ./src/options/connection-options/ConnectionOptions.ts

class ConnectionOptions {
    constructor(name) {
        this.Name = name;
    }
    ParseJsonString(json) {
        try {
            var obj = JSON.parse(json);
            return this.ConvertObject(obj);
        }
        catch (ex) {
            throw new ClientException/* default */.Z(`Invalid Json Format:${json}.${ex}`);
        }
    }
    ConvertObject(obj) {
        var retVal = new ParsedData();
        try {
            retVal.Setting = obj["_"];
        }
        catch (_a) { }
        Object.getOwnPropertyNames(obj).forEach((tblName) => {
            if (tblName !== "_") {
                var rawTbl = obj[tblName];
                var cols = rawTbl.shift();
                //for add case insensitive to alasql lib
                //cols = cols?.map((x) => x.toLowerCase().trim()) ?? [];
                var rows = new Array();
                rawTbl.forEach((rawRow) => {
                    var row = {};
                    cols.forEach((col, index) => {
                        row[col] = rawRow[index];
                    });
                    rows.push(row);
                });
                retVal.Tables.push(new Pair(tblName, rows));
            }
        });
        return retVal;
    }
}
class ParsedData {
    constructor() {
        this.Tables = [];
    }
}
class Pair {
    constructor(Key, Value) {
        this.Key = Key;
        this.Value = Value;
    }
}

// EXTERNAL MODULE: ./src/data/Data.ts
var Data = __webpack_require__(231);
;// CONCATENATED MODULE: ./src/options/connection-options/LocalStorageConnectionOptions.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class LocalStorageConnectionOptions extends ConnectionOptions {
    constructor(name, setting, context) {
        super(name);
        this.context = context;
        if (typeof setting === "string") {
            var parts = setting.split("|");
            this.Url = parts[0];
            if (parts.length != 2) {
                throw new ClientException/* default */.Z(`For Local Storage Connection '${name}', Setting In Not Valid`);
            }
            this.FunctionName = parts[1];
        }
        else {
            this.Url = setting.Url;
            this.FunctionName = setting.Function;
        }
        this.Function = null;
    }
    LoadLibAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.Function) {
                this.Function = yield $bc.util.getLibAsync(this.FunctionName, this.Url);
            }
        });
    }
    TestConnectionAsync(context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.LoadLibAsync();
            return this.FunctionName !== null;
        });
    }
    loadDataAsync(context, sourceId, parameters, onDataReceived) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.LoadLibAsync();
            var tmp = yield this.Function(parameters);
            var data = this.ConvertObject(tmp);
            onDataReceived(data.Tables.map((x) => new Data/* default */.Z(x.Key, x.Value)));
        });
    }
    loadPageAsync(context, pageName, parameters) {
        throw new ClientException/* default */.Z("LoadPageAsync Method not Supported In LocalStorage Provider.");
    }
}

;// CONCATENATED MODULE: ./src/options/connection-options/UrlBaseConnectionOptions.ts

class UrlBaseConnectionOptions extends ConnectionOptions {
    constructor(name, setting) {
        super(name);
        if (typeof setting === "string") {
            this.Url = setting;
        }
        else {
            this.Url = setting.Url;
            this.Heartbeat = setting.Heartbeat;
            this.Verb = setting.Verb;
            this.HeartbeatVerb = setting.HeartbeatVerb;
        }
    }
}

;// CONCATENATED MODULE: ./src/options/connection-options/RESTConnectionOptions.ts


class RESTConnectionOptions extends UrlBaseConnectionOptions {
    constructor(name, setting) {
        super(name, setting);
    }
    TestConnectionAsync(context) {
        throw new Error("Method not implemented.");
    }
    loadDataAsync(context, sourceId, parameters, onDataReceived) {
        throw new Error("Method not implemented.");
    }
    loadPageAsync(context, pageName, parameters, method) {
        throw new ClientException/* default */.Z("LoadPageAsync Method not Supported In REST API Provider.");
    }
}

// EXTERNAL MODULE: ./src/Util.ts
var Util = __webpack_require__(102);
;// CONCATENATED MODULE: ./src/options/connection-options/WebConnectionOptions.ts
var WebConnectionOptions_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class WebConnectionOptions extends UrlBaseConnectionOptions {
    constructor(name, setting) {
        super(name, setting);
    }
    TestConnectionAsync(context) {
        var _a;
        return WebConnectionOptions_awaiter(this, void 0, void 0, function* () {
            var isOk;
            if (Util/* default.HasValue */.Z.HasValue(this.Heartbeat)) {
                try {
                    yield WebConnectionOptions.ajax(this.Heartbeat, (_a = this.HeartbeatVerb) !== null && _a !== void 0 ? _a : context.options.getDefault("source.heartbeatVerb"));
                    isOk = true;
                }
                catch (_b) {
                    isOk = false;
                }
            }
            else {
                isOk = true;
            }
            return isOk;
        });
    }
    loadDataAsync(context, sourceId, parameters, onDataReceived) {
        var _a;
        return WebConnectionOptions_awaiter(this, void 0, void 0, function* () {
            var rawJson = yield WebConnectionOptions.ajax(this.Url, (_a = this.Verb) !== null && _a !== void 0 ? _a : context.options.getDefault("source.verb"), parameters);
            const json = JSON.parse(rawJson);
            onDataReceived(json.sources.map((x) => new Data/* default */.Z(x.options.tableName, x.data, x.options)));
        });
    }
    loadPageAsync(context, pageName, parameters, method) {
        var _a;
        return WebConnectionOptions_awaiter(this, void 0, void 0, function* () {
            return yield WebConnectionOptions.ajax(`${this.Url}${pageName}`, (_a = method !== null && method !== void 0 ? method : this.Verb) !== null && _a !== void 0 ? _a : context.options.getDefault("call.verb"), parameters);
        });
    }
    static ajax(url, method, parameters = null) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.open(method, url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                    else {
                        reject(xhr.statusText);
                    }
                }
            };
            xhr.onerror = function (e) {
                reject(xhr.statusText);
            };
            var encodedDataPairs;
            if (Util/* default.HasValue */.Z.HasValue(parameters)) {
                encodedDataPairs = [];
                ///https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started
                Object.getOwnPropertyNames(parameters).forEach((name, _i, _) => encodedDataPairs.push(encodeURIComponent(name) +
                    "=" +
                    encodeURIComponent(parameters[name])));
                encodedDataPairs = encodedDataPairs.join("&").replace(/%20/g, "+");
            }
            xhr.send(encodedDataPairs);
        });
    }
}

// EXTERNAL MODULE: ./src/options/connection-options/StreamPromise.ts
var StreamPromise = __webpack_require__(314);
;// CONCATENATED MODULE: ./src/options/connection-options/WebSocketConnectionOptions.ts



class WebSocketConnectionOptions extends ConnectionOptions {
    constructor(name, setting) {
        super(name);
        this.activeSockets = new Map();
        this.maxRetry = 5;
        if (typeof setting === "string") {
            this.url = setting;
        }
        else {
            this.url = setting.Connection;
        }
    }
    loadDataAsync(context, sourceId, parameters, onDataReceived) {
        const url = this.url;
        const maxRetry = this.maxRetry;
        const activeSockets = this.activeSockets;
        const preOpenSocket = activeSockets.get(sourceId);
        if (preOpenSocket) {
            preOpenSocket.close();
            context.logger.logInformation("Disconnect from %s by client request", url);
            activeSockets.delete(sourceId);
        }
        return new StreamPromise/* default */.Z((resolve, reject) => {
            let retry = 0;
            function initAndConnect(reconnect) {
                retry++;
                const socket = new WebSocket(url);
                let error = null;
                socket.onopen = (e) => {
                    activeSockets.set(sourceId, socket);
                    console.log("%s %s", url, reconnect ? "Reconnected" : "Connected");
                    socket.send(JSON.stringify(parameters));
                };
                socket.onclose = (e) => {
                    activeSockets.delete(sourceId);
                    if (error != null) {
                        context.logger.logInformation("Try reconnect To %s", url);
                        if (retry < maxRetry) {
                            initAndConnect(true);
                            error = null;
                        }
                        else {
                            reject(error);
                        }
                    }
                    else {
                        resolve();
                        context.logger.logInformation(`${url} Disconnected`);
                    }
                };
                socket.onerror = (e) => {
                    context.logger.logError(`Error On '${url}'`, e);
                    error = e;
                };
                socket.onmessage = (e) => {
                    try {
                        var json = JSON.parse(e.data);
                        if (json.setting &&
                            json.setting.keepalive !== undefined &&
                            !json.setting.keepalive) {
                            context.logger.logInformation("Disconnect from %s by server request", url);
                            socket.close();
                        }
                        if (json.sources) {
                            const dataList = json === null || json === void 0 ? void 0 : json.sources.map((x) => new Data/* default */.Z(x.options.tableName, x.data, x.options));
                            if (dataList.length > 0) {
                                const receiverIsOk = onDataReceived(dataList);
                                if (!receiverIsOk) {
                                    context.logger.logInformation("Disconnect from %s by receiver request. maybe disposed!", url);
                                    socket.close();
                                }
                            }
                        }
                    }
                    catch (ex) {
                        context.logger.logError("Error in process WebSocket received message", ex);
                    }
                };
            }
            initAndConnect(false);
        });
    }
    TestConnectionAsync(context) {
        return Promise.resolve(true);
    }
    loadPageAsync(context, pageName, parameters) {
        throw new Error("WebSocket call not implemented.");
    }
}

;// CONCATENATED MODULE: ./src/options/connection-options/ConnectionOptionsManager.ts





class ConnectionOptionsManager {
    constructor(hostSettings, context) {
        this.connections = new Map();
        Object.getOwnPropertyNames(hostSettings)
            .map((x) => {
            var _a, _b;
            var parts = x.split(".", 3);
            return {
                type: (_a = parts[0]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase(),
                provider: (_b = parts[1]) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase(),
                name: parts[2],
                value: hostSettings[x],
            };
        })
            .filter((x) => x.type.isEqual("connection"))
            .forEach((x) => {
            var obj;
            switch (x.provider) {
                case "web": {
                    obj = new WebConnectionOptions(x.name, x.value);
                    break;
                }
                case "websocket": {
                    obj = new WebSocketConnectionOptions(x.name, x.value);
                    break;
                }
                case "local": {
                    obj = new LocalStorageConnectionOptions(x.name, x.value, context);
                    break;
                }
                case "rest": {
                    obj = new RESTConnectionOptions(x.name, x.value);
                    break;
                }
            }
            this.connections.set(obj.Name, obj);
        });
    }
    getConnection(connectionName) {
        var retVal = this.connections.get(connectionName);
        if (!retVal) {
            throw new ConfigNotFoundException/* default */.Z("host.settings", connectionName);
        }
        return retVal;
    }
}

// EXTERNAL MODULE: ./src/context/Context.ts
var Context = __webpack_require__(294);
;// CONCATENATED MODULE: ./src/context/RootContext.ts
var RootContext_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class RootContext extends Context/* default */.Z {
    constructor(repository, options, logger) {
        super(repository, options, logger);
        this.loadLibDic = {};
        this.connections = new ConnectionOptionsManager(options.settings, this);
        this.addHostOptionsSource();
    }
    loadPageAsync(pageName, parameters, method) {
        var connectionInfo = this.connections.getConnection("callcommand");
        return connectionInfo.loadPageAsync(this, pageName, parameters, method);
    }
    loadDataAsync(sourceId, connectionName, parameters, onDataReceived) {
        let connectionInfo = this.connections.getConnection(connectionName);
        return connectionInfo.loadDataAsync(this, sourceId, parameters, onDataReceived);
    }
    getOrLoadDbLibAsync() {
        return RootContext_awaiter(this, void 0, void 0, function* () {
            let retVal;
            if (typeof alasql === "undefined") {
                if (Util/* default.IsNullOrEmpty */.Z.IsNullOrEmpty(this.options.dbLibPath)) {
                    throw new ClientException/* default */.Z(`Error in load 'alasql'. 'DbLibPath' not configure properly in host object.`);
                }
                retVal = yield $bc.util.getLibAsync("alasql", this.options.dbLibPath);
            }
            else {
                retVal = alasql;
            }
            return retVal;
        });
    }
    addHostOptionsSource() {
        if (this.options.sources) {
            Object.getOwnPropertyNames(this.options.sources).forEach((key) => {
                const source = this.options.sources[key];
                if (source instanceof Array) {
                    this.setAsSource(key.toLowerCase(), source);
                }
                else {
                    this.setAsSource(key.toLowerCase(), source.data, source.options);
                }
            });
        }
    }
}


/***/ }),

/***/ 231:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Data)
/* harmony export */ });
class Data {
    constructor(id, data, options) {
        this.id = id;
        this.options = options;
        if (Array.isArray(data)) {
            this.rows = data;
        }
        else if (typeof data === "object") {
            this.rows = [data];
        }
        else {
            this.rows = [{ value: data }];
        }
    }
}


/***/ }),

/***/ 877:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Source)
/* harmony export */ });
/* harmony import */ var _enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(397);

class Source {
    constructor(id, data, options) {
        var _a;
        this._id = id.toLowerCase();
        this.mergeType = (_a = options === null || options === void 0 ? void 0 : options.mergeType) !== null && _a !== void 0 ? _a : _enum__WEBPACK_IMPORTED_MODULE_0__/* .MergeType.replace */ .dx.replace;
        this.keyFieldName = options === null || options === void 0 ? void 0 : options.keyFieldName;
        this.statusFieldName = options === null || options === void 0 ? void 0 : options.statusFieldName;
        this.extra = options === null || options === void 0 ? void 0 : options.extra;
        if (Array.isArray(data)) {
            this._rows = data;
        }
        else if (typeof data === "object") {
            this._rows = [data];
        }
        else {
            this._rows = [{ value: data }];
        }
        this._versions = Array(this._rows.length).fill(0);
    }
    get id() {
        return this._id;
    }
    get rows() {
        return this._rows;
    }
    get versions() {
        return this._versions;
    }
    cloneOptions() {
        return {
            keyFieldName: this.keyFieldName,
            mergeType: this.mergeType,
            statusFieldName: this.statusFieldName,
            extra: this.extra,
        };
    }
    removeRowFormIndex(index) {
        this._rows.splice(index, 1);
        this._versions.splice(index, 1);
    }
    replaceRowFromIndex(index, newRow) {
        this._rows.splice(index, 1, newRow);
        this._versions[index] += 1;
    }
    addRow(row) {
        this._rows.push(row);
        this._versions.push(0);
    }
    addRows(rows) {
        this.rows.splice(this.rows.length, rows.length, ...rows);
        this._versions.splice(this.rows.length, rows.length, ...Array(rows.length));
    }
    getVersion(row) {
        const index = this._rows.indexOf(row);
        return index != -1 ? this._versions[index] : 0;
    }
    replace(source) {
        var _a;
        const oldCount = this._rows.length;
        const newCount = source.rows.length;
        this._rows.splice(0, oldCount, ...source.rows);
        if (oldCount > newCount) {
            this._versions.splice(newCount, oldCount - newCount);
        }
        else if (oldCount < newCount) {
            this._versions.splice(newCount, 0, ...Array(newCount - oldCount).fill(-1));
        }
        this._versions.forEach((ver, index, arr) => (arr[index] = ++ver));
        this.mergeType = (_a = source.mergeType) !== null && _a !== void 0 ? _a : _enum__WEBPACK_IMPORTED_MODULE_0__/* .MergeType.replace */ .dx.replace;
        this.keyFieldName = source.keyFieldName;
        this.statusFieldName = source.statusFieldName;
        this.extra = source.extra;
    }
}


/***/ }),

/***/ 397:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A$": () => (/* binding */ FaceRowType),
/* harmony export */   "dx": () => (/* binding */ MergeType),
/* harmony export */   "UL": () => (/* binding */ Priority),
/* harmony export */   "rq": () => (/* binding */ DataStatus)
/* harmony export */ });
/* unused harmony export JoinType */
var FaceRowType;
(function (FaceRowType) {
    FaceRowType[FaceRowType["NotSet"] = 0] = "NotSet";
    FaceRowType[FaceRowType["Odd"] = 1] = "Odd";
    FaceRowType[FaceRowType["Even"] = 2] = "Even";
})(FaceRowType || (FaceRowType = {}));
var MergeType;
(function (MergeType) {
    MergeType[MergeType["replace"] = 0] = "replace";
    MergeType[MergeType["append"] = 1] = "append";
})(MergeType || (MergeType = {}));
var JoinType;
(function (JoinType) {
    JoinType[JoinType["innerjoin"] = 0] = "innerjoin";
    JoinType[JoinType["leftjoin"] = 1] = "leftjoin";
    JoinType[JoinType["rightjoin"] = 2] = "rightjoin";
})(JoinType || (JoinType = {}));
var Priority;
(function (Priority) {
    Priority[Priority["high"] = 0] = "high";
    Priority[Priority["normal"] = 1] = "normal";
    Priority[Priority["low"] = 2] = "low";
    Priority[Priority["none"] = 3] = "none";
})(Priority || (Priority = {}));
var DataStatus;
(function (DataStatus) {
    DataStatus[DataStatus["added"] = 0] = "added";
    DataStatus[DataStatus["edited"] = 1] = "edited";
    DataStatus[DataStatus["deleted"] = 2] = "deleted";
})(DataStatus || (DataStatus = {}));


/***/ }),

/***/ 919:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ EventManager)
/* harmony export */ });
class EventManager {
    constructor() {
        this.handlers = new Set();
    }
    Add(handler) {
        let retVal = null;
        if (!this.handlers.has(handler)) {
            this.handlers.add(handler);
            retVal = handler;
        }
        return retVal;
    }
    Remove(handler) {
        let retVal = null;
        if (this.handlers.has(handler)) {
            this.handlers.delete(handler);
            retVal = handler;
        }
        return retVal;
    }
    Trigger(args) {
        this.handlers.forEach((handler) => {
            try {
                handler(args);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}


/***/ }),

/***/ 479:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ ClientException)
/* harmony export */ });
class ClientException extends Error {
    constructor(message) {
        super(message);
    }
}


/***/ }),

/***/ 441:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ ConfigNotFoundException)
/* harmony export */ });
/* harmony import */ var _ClientException__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(479);

class ConfigNotFoundException extends _ClientException__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z {
    constructor(configFile, configKey) {
        super(`In '${configFile}' object, property '${configKey}' not configured!`);
    }
}


/***/ }),

/***/ 570:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _exception_ClientException__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(479);
/* harmony import */ var _token_TokenUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(157);
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(102);



Object.defineProperty(String.prototype, "Evaluating", {
    value: function Evaluating() {
        var _a;
        try {
            return _Util__WEBPACK_IMPORTED_MODULE_2__/* ["default"].isEqual */ .Z.isEqual((_a = eval(this.toString())) === null || _a === void 0 ? void 0 : _a.toString(), "true");
        }
        catch (er) {
            throw new _exception_ClientException__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(`Error In Evaluating '${this.toString()}': ${er}`);
        }
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(String.prototype, "ToObjectToken", {
    value: function ToObjectToken(context) {
        return _token_TokenUtil__WEBPACK_IMPORTED_MODULE_1__/* ["default"].ToObjectToken */ .Z.ToObjectToken(this.toString(), context);
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(String.prototype, "ToStringToken", {
    value: function ToStringToken(context) {
        return _token_TokenUtil__WEBPACK_IMPORTED_MODULE_1__/* ["default"].ToStringToken */ .Z.ToStringToken(this.toString(), context);
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(String.prototype, "ToIntegerToken", {
    value: function ToIntegerToken(context) {
        return _token_TokenUtil__WEBPACK_IMPORTED_MODULE_1__/* ["default"].ToIntegerToken */ .Z.ToIntegerToken(this.toString(), context);
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(String.prototype, "ToBooleanToken", {
    value: function ToBooleanToken(context) {
        return _token_TokenUtil__WEBPACK_IMPORTED_MODULE_1__/* ["default"].ToBooleanToken */ .Z.ToBooleanToken(this.toString(), context);
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(String.prototype, "isEqual", {
    value: function isEqual(value) {
        var stringA = this.toString();
        return (stringA.localeCompare(value !== null && value !== void 0 ? value : "", undefined, {
            sensitivity: "accent",
        }) == 0);
    },
    writable: true,
    configurable: true,
});


/***/ }),

/***/ 818:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "G": () => (/* binding */ HostOptions)
/* harmony export */ });
/* harmony import */ var tsyringe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(195);
/* harmony import */ var _exception_ConfigNotFoundException__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(441);
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(102);
/* harmony import */ var lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(98);
/* harmony import */ var lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(465);
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_clonedeep__WEBPACK_IMPORTED_MODULE_4__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var HostOptions_1;





let HostOptions = HostOptions_1 = class HostOptions {
    constructor(options) {
        const originalOptions = lodash_clonedeep__WEBPACK_IMPORTED_MODULE_4___default()(options);
        if (options !== HostOptions_1.defaultSettings) {
            options = lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_3___default()(lodash_clonedeep__WEBPACK_IMPORTED_MODULE_4___default()(options), HostOptions_1.defaultSettings);
            Object.assign(this, options);
        }
        else {
            Object.assign(this, lodash_clonedeep__WEBPACK_IMPORTED_MODULE_4___default()(options));
        }
        this.originalOptions = originalOptions;
    }
    static get defaultSettings() {
        if (!HostOptions_1._defaultSettings) {
            let defaults = {
                debug: false,
                autoRender: true,
                serviceWorker: false,
                dbLibPath: "/alasql.min.js",
                settings: {
                    "default.binding.regex": /\[##([^#]*)##\]/,
                    "default.binding.codeblock-regex": /{{((?:[^{}][{}]?)*)}}/,
                    "default.binding.face-regex": /([^@]|^)@(?:([^@\s]+)@|([^@\s]+))/,
                    "default.call.verb": "POST",
                    "default.dmnid": "",
                    "default.source.verb": "POST",
                    "default.ViewCommand.GroupColumn": "prpid",
                    "default.source.heartbeatVerb": "GET",
                },
                repositories: {},
            };
            if (typeof host != "undefined") {
                defaults = lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_3___default()(lodash_clonedeep__WEBPACK_IMPORTED_MODULE_4___default()(host), defaults);
            }
            HostOptions_1._defaultSettings = defaults;
        }
        return HostOptions_1._defaultSettings;
    }
    getDefault(key, defaultValue = null) {
        return this.getSetting(`default.${key}`, defaultValue);
    }
    getSetting(key, defaultValue) {
        var find = Object.getOwnPropertyNames(this.settings).filter((x) => _Util__WEBPACK_IMPORTED_MODULE_2__/* ["default"].isEqual */ .Z.isEqual(x, key));
        var retVal = find.length == 1 ? this.settings[find[0]] : null;
        if (!retVal) {
            if (defaultValue !== undefined) {
                retVal = defaultValue;
            }
            else {
                throw new _exception_ConfigNotFoundException__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z("host.settings", key);
            }
        }
        return retVal;
    }
};
HostOptions = HostOptions_1 = __decorate([
    (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .injectable */ .b2)(),
    __param(0, (0,tsyringe__WEBPACK_IMPORTED_MODULE_0__/* .inject */ .f3)("IHostOptions")),
    __metadata("design:paramtypes", [Object])
], HostOptions);



/***/ }),

/***/ 314:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ StreamPromise)
/* harmony export */ });
class StreamPromise extends Promise {
}


/***/ }),

/***/ 827:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ CodeBlockToken)
/* harmony export */ });
/* harmony import */ var _type_alias__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(222);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class CodeBlockToken {
    constructor(expression, context) {
        this.context = context;
        expression = expression.replaceAll("&quot;", '"');
        this.fn = new _type_alias__WEBPACK_IMPORTED_MODULE_0__/* .AsyncFunction */ .s("$bc", "$data", `try{
        ${expression}
      }catch(e){
        console.error(e);
        return e;
      }`);
        const r = /\$bc\.(?:waitToGetSourceAsync|tryToGetSource)\('(.*)'\)/g;
        const matches = expression.matchAll(r);
        if (matches) {
            this.sourceNames = new Array();
            for (const match of matches) {
                this.sourceNames.push(match[1]);
            }
        }
    }
    getValueAsync(wait) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this.fn(this.context))) !== null && _a !== void 0 ? _a : "";
        });
    }
    executeAsync(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this.fn(this.context, data))) !== null && _a !== void 0 ? _a : "";
        });
    }
    getSourceNames() {
        return this.sourceNames;
    }
    getDefault() {
        return "";
    }
}


/***/ }),

/***/ 157:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ TokenUtil)
});

// EXTERNAL MODULE: ./src/Util.ts
var Util = __webpack_require__(102);
// EXTERNAL MODULE: ./src/token/CodeBlockToken.ts
var CodeBlockToken = __webpack_require__(827);
// EXTERNAL MODULE: ./src/token/base/ArrayToken.ts
var ArrayToken = __webpack_require__(629);
// EXTERNAL MODULE: ./src/token/base/ObjectToken.ts + 2 modules
var ObjectToken = __webpack_require__(421);
;// CONCATENATED MODULE: ./src/token/boolean/BooleanObject.ts

class BooleanObject extends ObjectToken/* default */.Z {
    constructor(rawValue, context) {
        super(rawValue, context);
    }
    static tryParse(value) {
        return value == null ? null : value.toLowerCase() === "true";
    }
    tryParse(value) {
        return BooleanObject.tryParse(value);
    }
}

;// CONCATENATED MODULE: ./src/token/boolean/BooleanArray.ts


class BooleanArray extends ArrayToken/* default */.Z {
    constructor(context, ...collection) {
        super(context, ...collection);
    }
    tryParse(value) {
        return BooleanObject.tryParse(value);
    }
}

;// CONCATENATED MODULE: ./src/token/base/ValueToken.ts
class ValueToken {
    constructor(value, context) {
        this.context = context;
        this.value = value;
    }
    getDefault() {
        return this.value;
    }
    getSourceNames() {
        return new Array();
    }
    getValueAsync(wait = true) {
        return new Promise((resolve) => resolve(this.value));
    }
}

;// CONCATENATED MODULE: ./src/token/boolean/BooleanValue.ts

class BooleanValue extends ValueToken {
    constructor(data, context) {
        super(data, context);
    }
}

;// CONCATENATED MODULE: ./src/token/integer/IntegerArray.ts

class IntegerArray extends ArrayToken/* default */.Z {
    constructor(context, ...collection) {
        super(context, ...collection);
    }
    tryParse(value) {
        let retVal = 0;
        try {
            retVal = parseInt(value);
        }
        catch (_a) {
            /*Nothing*/
        }
        return retVal;
    }
}

;// CONCATENATED MODULE: ./src/token/integer/IntegerObject.ts

class IntegerObject extends ObjectToken/* default */.Z {
    constructor(rawValue, context) {
        super(rawValue, context);
    }
    tryParse(value) {
        let retVal = 0;
        try {
            retVal = parseInt(value);
        }
        catch (_a) {
            /*Nothing*/
        }
        return retVal;
    }
}

;// CONCATENATED MODULE: ./src/token/integer/IntegerValue.ts

class IntegerValue extends ValueToken {
    constructor(data, context) {
        super(data, context);
    }
}

;// CONCATENATED MODULE: ./src/token/string/StringArray.ts

class StringArray extends ArrayToken/* default */.Z {
    constructor(context, ...collection) {
        super(context, ...collection);
    }
    tryParse(value) {
        return value;
    }
}

;// CONCATENATED MODULE: ./src/token/string/StringObject.ts

class StringObject extends ObjectToken/* default */.Z {
    constructor(rawValue, context) {
        super(rawValue, context);
    }
    tryParse(value) {
        return value;
    }
}

;// CONCATENATED MODULE: ./src/token/string/StringValue.ts

class StringValue extends ValueToken {
    constructor(data, context) {
        super(data, context);
    }
}

// EXTERNAL MODULE: ./src/token/object/ObjectArray.ts
var ObjectArray = __webpack_require__(69);
// EXTERNAL MODULE: ./src/token/object/ObjectObject.ts
var ObjectObject = __webpack_require__(800);
;// CONCATENATED MODULE: ./src/token/object/ObjectValue.ts

class ObjectValue extends ValueToken {
    constructor(data, context) {
        super(data, context);
    }
}

;// CONCATENATED MODULE: ./src/token/TokenUtil.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};














class TokenUtil {
    static ToObjectToken(data, context) {
        return TokenUtil.ToToken(data, context, (x) => new ObjectValue(x, context), (x) => new ObjectObject/* default */.Z(x, context), (...x) => new ObjectArray/* default */.Z(context, ...x));
    }
    static ToStringToken(data, context) {
        return TokenUtil.ToToken(data, context, (x) => new StringValue(x, context), (x) => new StringObject(x, context), (...x) => new StringArray(context, ...x));
    }
    static ToIntegerToken(data, context) {
        return TokenUtil.ToToken(data, context, (x) => new IntegerValue(parseInt(x), context), (x) => new IntegerObject(x, context), (...x) => new IntegerArray(context, ...x));
    }
    static ToBooleanToken(data, context) {
        return TokenUtil.ToToken(data, context, (x) => new BooleanValue(Util/* default.isEqual */.Z.isEqual(x, "true"), context), (x) => new BooleanObject(x, context), (...x) => new BooleanArray(context, ...x));
    }
    static ToToken(content, context, newValueToken, newObjectToken, newArrayToken) {
        //https://javascript.info/regexp-methods
        var retVal;
        if (content) {
            const regex = context.options.getDefault("binding.regex");
            const blockRegex = context.options.getDefault("binding.codeblock-regex");
            var list = new Array();
            do {
                let match = content.match(regex);
                if (!match) {
                    match = content.match(blockRegex);
                    if (!match) {
                        list.push(newValueToken(content));
                        break;
                    }
                    else {
                        if (match.index != 0) {
                            list.push(newValueToken(content.substring(0, match.index)));
                        }
                        list.push(new CodeBlockToken/* default */.Z(match[1], context));
                        content = content.substring(match.index + match[0].length);
                    }
                }
                else {
                    if (match.index != 0) {
                        list.push(newValueToken(content.substring(0, match.index)));
                    }
                    list.push(newObjectToken(match[1]));
                    content = content.substring(match.index + match[0].length);
                }
            } while (content.length > 0);
            if (list.length == 1) {
                retVal = list[0];
            }
            else {
                retVal = newArrayToken(...list);
            }
        }
        return retVal;
    }
    static GetValueOrSystemDefaultAsync(token, context, key) {
        return __awaiter(this, void 0, void 0, function* () {
            var retVal;
            if (Util/* default.HasValue */.Z.HasValue(token)) {
                retVal = yield token.getValueAsync();
            }
            else {
                retVal = context.options.getDefault(key);
            }
            return retVal;
        });
    }
}


/***/ }),

/***/ 629:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ ArrayToken)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ArrayToken extends Array {
    constructor(context, ...data) {
        super(...data);
        this.context = context;
    }
    getDefault() {
        const value = this.reduce((r, x) => { var _a; return (r += (_a = x.getDefault()) !== null && _a !== void 0 ? _a : ""); }, "");
        return this.tryParse(value);
    }
    getSourceNames() {
        return this.reduce((r, x) => r.concat(x.getSourceNames()), new Array());
    }
    getValueAsync(wait = true) {
        return __awaiter(this, void 0, void 0, function* () {
            var tasks = new Array();
            this.forEach((token) => tasks.push(token.getValueAsync(wait)));
            var result = yield Promise.all(tasks);
            var retVal = this.tryParse(result.join(""));
            return retVal;
        });
    }
}


/***/ }),

/***/ 421:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ ObjectToken)
});

;// CONCATENATED MODULE: ./src/token/token-element/SourceTokenElement.ts
class SourceTokenElement {
    constructor(parts, expression) {
        this.source = parts[0].toLowerCase();
        this.member = parts[1].toLowerCase();
        this.column = parts.length > 2 ? parts.slice(2).join(".") : null;
        this.expression = expression;
        this.extractValue = new Function("source", `let retVal = null;
      if (source.rows.length == 1) {
        try{
        retVal = source.rows[0].${this.column};
        }catch(e){
          try{
            retVal = source.rows[0]['${this.column}'];
          }catch{
            throw e;
          }
        }
      } else if (source.rows.length > 1) {
        retVal = source.rows
              .map((row) => row.${this.column});
      }
      return retVal;`);
        // this.extractValue = new Function(
        //   "source",
        //   `const ${this.source}={${this.member}:source.rows.length == 1? source.rows[0]:source.rows}; return ${expression}??null;`
        // ) as any;
    }
    get sourceName() {
        return `${this.source}.${this.member}`;
    }
}

;// CONCATENATED MODULE: ./src/token/token-element/ValueTokenElement.ts
class ValueTokenElement {
    constructor(value) {
        this.value = value;
    }
}

;// CONCATENATED MODULE: ./src/token/base/ObjectToken.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class ObjectToken {
    constructor(rawValue, context) {
        this.context = context;
        this.parts = rawValue.split("|").map((part) => {
            var partSlices = part.split(".");
            const matchValue = partSlices[0].match(/^\s*\((.*)\)\s*$/);
            return matchValue
                ? new ValueTokenElement(this.tryParse(matchValue[1]))
                : new SourceTokenElement(partSlices, part);
        });
    }
    getDefault() {
        var _a, _b;
        var part = this.parts.filter((x) => x instanceof ValueTokenElement);
        return (_b = (_a = part[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null;
    }
    getSourceNames() {
        return this.parts
            .filter((x) => x instanceof SourceTokenElement)
            .map((x) => x.sourceName);
    }
    getValueAsync(wait = true) {
        return __awaiter(this, void 0, void 0, function* () {
            var retVal = null;
            for (var i = 0; i < this.parts.length; i++) {
                var item = this.parts[i];
                if (item instanceof ValueTokenElement) {
                    retVal = item.value;
                }
                else if (item instanceof SourceTokenElement) {
                    if (item.member) {
                        const sourceName = item.sourceName;
                        var source = this.context.tryToGetSource(sourceName);
                        if (item.column) {
                            if (source == null) {
                                //if is last item
                                if (i + 1 == this.parts.length) {
                                    if (item.source === "cms") {
                                        break;
                                    }
                                    if (wait) {
                                        source = yield this.context.waitToGetSourceAsync(sourceName);
                                    }
                                    else {
                                        break;
                                    }
                                }
                                else {
                                    continue;
                                }
                            }
                            let value = null;
                            try {
                                value = item.extractValue(source);
                            }
                            catch (ex) {
                                /*Nothing*/
                            }
                            if (value != null && value !== "") {
                                retVal = value; //this.tryParse(value);
                                break;
                            }
                            else {
                                continue;
                            }
                        }
                        else {
                            retVal = this.tryParse(source ? "true" : "false");
                            break;
                        }
                    }
                    else {
                        const result = yield this.context.checkSourceHeartbeatAsync(item.source);
                        retVal = this.tryParse(result.toString());
                        break;
                    }
                }
            }
            return retVal;
        });
    }
}


/***/ }),

/***/ 69:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ ObjectArray)
/* harmony export */ });
/* harmony import */ var _base_ArrayToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(629);

class ObjectArray extends _base_ArrayToken__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z {
    constructor(context, ...collection) {
        super(context, ...collection);
    }
    tryParse(value) {
        return eval(value);
    }
}


/***/ }),

/***/ 800:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ ObjectObject)
/* harmony export */ });
/* harmony import */ var _base_ObjectToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(421);

class ObjectObject extends _base_ObjectToken__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z {
    constructor(rawValue, context) {
        super(rawValue, context);
    }
    tryParse(value) {
        return eval(value);
    }
}


/***/ }),

/***/ 222:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": () => (/* binding */ AsyncFunction)
/* harmony export */ });
const AsyncFunction = eval("Object.getPrototypeOf(async function () {}).constructor");


/***/ }),

/***/ 361:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Q": () => (/* binding */ SourceWrapper)
/* harmony export */ });
/* harmony import */ var _data_Data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(231);
/* harmony import */ var _data_Source__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(877);
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(102);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class SourceWrapper {
    new(sourceId, data, options) {
        return new _data_Source__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(sourceId, data, options);
    }
    sortAsync(source, sort, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const lib = yield context.getOrLoadDbLibAsync();
            return new _data_Source__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(source.id, lib(`SELECT * FROM ? order by ${sort}`, [source.rows]), source.cloneOptions());
        });
    }
    filterAsync(source, filter, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var retVal;
            if (this.isNullOrEmpty(filter)) {
                retVal = source.rows;
            }
            else {
                var lib = yield context.getOrLoadDbLibAsync();
                retVal = lib(`SELECT * FROM ? [${source.id}] where ${filter}`, [
                    source.rows,
                ]);
            }
            return retVal;
        });
    }
    isNullOrEmpty(data) {
        return data === undefined || data == null || data === "";
    }
    runSqlAsync(source, sql, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const lib = yield context.getOrLoadDbLibAsync();
            return new _data_Source__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(source.id, lib(_Util__WEBPACK_IMPORTED_MODULE_1__/* ["default"].ReplaceEx */ .Z.ReplaceEx(sql, `\\[${source.id}\\]`, "?"), [source.rows]), source.cloneOptions());
        });
    }
    data(id, data, options) {
        return new _data_Data__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z(id, data, options);
    }
}


/***/ }),

/***/ 835:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ UtilWrapper)
/* harmony export */ });
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(465);
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_clonedeep__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _SourceWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(361);
/* harmony import */ var lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(98);
/* harmony import */ var lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _exception_ClientException__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(479);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class UtilWrapper {
    constructor() {
        this.source = new _SourceWrapper__WEBPACK_IMPORTED_MODULE_1__/* .SourceWrapper */ .Q();
        this.parser = new DOMParser();
    }
    getRandomName(prefix, postfix) {
        return `${prefix !== null && prefix !== void 0 ? prefix : ""}_${(new Date()).getTime()}_${Math.random().toString(36).substring(2)}_${postfix !== null && postfix !== void 0 ? postfix : ""}`;
    }
    storeAsGlobal(data, name, prefix, postfix) {
        if (!name) {
            name = this.getRandomName(prefix, postfix);
        }
        Reflect.set(window, name, data);
        return name;
    }
    cloneDeep(obj) {
        return lodash_clonedeep__WEBPACK_IMPORTED_MODULE_0___default()(obj);
    }
    getLibAsync(objectName, url) {
        let retVal = null;
        let type = "undefined";
        try {
            type = eval(`typeof(${objectName})`);
        }
        catch (e) {
            /*Nothing*/
        }
        if (type === "undefined") {
            retVal = new Promise((resolve, reject) => {
                let script = document.querySelector(`script[src='${url}']`);
                if (!script) {
                    script = document.createElement("script");
                    script.setAttribute("type", "text/javascript");
                    script.setAttribute("src", url);
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
                const loadListener = (_) => {
                    script.removeEventListener("load", loadListener);
                    script.removeEventListener("error", errorListener);
                    console.log("%s loaded from %s", objectName, url);
                    resolve(eval(objectName));
                };
                const errorListener = (error) => {
                    script.removeEventListener("load", loadListener);
                    script.removeEventListener("error", errorListener);
                    reject(error);
                };
                script.addEventListener("load", loadListener);
                script.addEventListener("error", errorListener);
            });
        }
        else {
            return Promise.resolve(eval(objectName));
        }
        return retVal;
    }
    defaultsDeep(data, defaults) {
        return lodash_defaultsdeep__WEBPACK_IMPORTED_MODULE_2___default()(this.cloneDeep(data), defaults);
    }
    toNode(rawHtml) {
        return document.createRange().createContextualFragment(rawHtml);
    }
    toHTMLElement(rawXML) {
        const xmlDocument = this.parser.parseFromString(rawXML, "application/xml");
        const XMLElementToHTMLElementConvertor = (xmlElement) => {
            const element = document.createElement(xmlElement.tagName);
            if (xmlElement.attributes) {
                for (let index = 0; index < xmlElement.attributes.length; index++) {
                    const attr = xmlElement.attributes[index];
                    element.setAttribute(attr.name, attr.value);
                }
            }
            xmlElement.childNodes.forEach((child) => {
                const childElement = child;
                if (childElement.nodeType === Node.TEXT_NODE) {
                    const textContent = child.nodeValue.trim();
                    if (textContent.length > 0) {
                        element.appendChild(document.createTextNode(textContent));
                    }
                }
                else {
                    element.appendChild(XMLElementToHTMLElementConvertor(childElement));
                }
            });
            return element;
        };
        return xmlDocument.documentElement.tagName === "parsererror"
            ? xmlDocument.documentElement
            : XMLElementToHTMLElementConvertor(xmlDocument.documentElement);
    }
    getComponentAsync(context, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let retVal;
            if (key) {
                if (key.indexOf("local.") == 0) {
                    const lib = key.slice(key.indexOf(".") + 1);
                    retVal = eval(lib);
                    console.log("%s loaded from local", lib);
                }
                else {
                    let tmpKey = key;
                    while (true) {
                        const url = context.options.repositories[tmpKey];
                        if (url) {
                            retVal = yield this.getLibAsync(key, url);
                            break;
                        }
                        else {
                            const lastDotIndex = tmpKey.lastIndexOf(".");
                            if (lastDotIndex == -1) {
                                break;
                            }
                            tmpKey = tmpKey.slice(0, lastDotIndex);
                        }
                    }
                }
            }
            if (retVal) {
                return retVal;
            }
            throw new _exception_ClientException__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z(`'${key}' related repository setting not found`);
        });
    }
    format(pattern, ...params) {
        return pattern.replace(/{(\d+)}/g, function (match, number) {
            return typeof params[number] !== 'undefined'
                ? params[number]
                : match;
        });
    }
}


/***/ }),

/***/ 195:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "nC": () => (/* reexport */ instance),
  "f3": () => (/* reexport */ decorators_inject),
  "b2": () => (/* reexport */ decorators_injectable),
  "ri": () => (/* reexport */ decorators_singleton)
});

// UNUSED EXPORTS: Lifecycle, autoInjectable, delay, injectAll, injectAllWithTransform, injectWithTransform, instanceCachingFactory, instancePerContainerCachingFactory, isClassProvider, isFactoryProvider, isNormalToken, isTokenProvider, isValueProvider, predicateAwareClassFactory, registry, scoped

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/types/lifecycle.js
var Lifecycle;
(function (Lifecycle) {
    Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
    Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
    Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
    Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));
/* harmony default export */ const lifecycle = (Lifecycle);

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/types/index.js


;// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function tslib_es6_extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function tslib_es6_rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function tslib_es6_spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/providers/class-provider.js
function isClassProvider(provider) {
    return !!provider.useClass;
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/providers/factory-provider.js
function isFactoryProvider(provider) {
    return !!provider.useFactory;
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/lazy-helpers.js

var DelayedConstructor = (function () {
    function DelayedConstructor(wrap) {
        this.wrap = wrap;
        this.reflectMethods = [
            "get",
            "getPrototypeOf",
            "setPrototypeOf",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "set",
            "deleteProperty",
            "apply",
            "construct",
            "ownKeys"
        ];
    }
    DelayedConstructor.prototype.createProxy = function (createObject) {
        var _this = this;
        var target = {};
        var init = false;
        var value;
        var delayedObject = function () {
            if (!init) {
                value = createObject(_this.wrap());
                init = true;
            }
            return value;
        };
        return new Proxy(target, this.createHandler(delayedObject));
    };
    DelayedConstructor.prototype.createHandler = function (delayedObject) {
        var handler = {};
        var install = function (name) {
            handler[name] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args[0] = delayedObject();
                var method = Reflect[name];
                return method.apply(void 0, tslib_es6_spread(args));
            };
        };
        this.reflectMethods.forEach(install);
        return handler;
    };
    return DelayedConstructor;
}());

function delay(wrappedConstructor) {
    if (typeof wrappedConstructor === "undefined") {
        throw new Error("Attempt to `delay` undefined. Constructor must be wrapped in a callback");
    }
    return new DelayedConstructor(wrappedConstructor);
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/providers/injection-token.js

function isNormalToken(token) {
    return typeof token === "string" || typeof token === "symbol";
}
function injection_token_isTokenDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "multiple" in descriptor);
}
function injection_token_isTransformDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "transform" in descriptor);
}
function isConstructorToken(token) {
    return typeof token === "function" || token instanceof DelayedConstructor;
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/providers/token-provider.js
function isTokenProvider(provider) {
    return !!provider.useToken;
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/providers/value-provider.js
function isValueProvider(provider) {
    return provider.useValue != undefined;
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/providers/index.js






;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/providers/provider.js




function isProvider(provider) {
    return (isClassProvider(provider) ||
        isValueProvider(provider) ||
        isTokenProvider(provider) ||
        isFactoryProvider(provider));
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/registry-base.js
var RegistryBase = (function () {
    function RegistryBase() {
        this._registryMap = new Map();
    }
    RegistryBase.prototype.entries = function () {
        return this._registryMap.entries();
    };
    RegistryBase.prototype.getAll = function (key) {
        this.ensure(key);
        return this._registryMap.get(key);
    };
    RegistryBase.prototype.get = function (key) {
        this.ensure(key);
        var value = this._registryMap.get(key);
        return value[value.length - 1] || null;
    };
    RegistryBase.prototype.set = function (key, value) {
        this.ensure(key);
        this._registryMap.get(key).push(value);
    };
    RegistryBase.prototype.setAll = function (key, value) {
        this._registryMap.set(key, value);
    };
    RegistryBase.prototype.has = function (key) {
        this.ensure(key);
        return this._registryMap.get(key).length > 0;
    };
    RegistryBase.prototype.clear = function () {
        this._registryMap.clear();
    };
    RegistryBase.prototype.ensure = function (key) {
        if (!this._registryMap.has(key)) {
            this._registryMap.set(key, []);
        }
    };
    return RegistryBase;
}());
/* harmony default export */ const registry_base = (RegistryBase);

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/registry.js


var Registry = (function (_super) {
    tslib_es6_extends(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Registry;
}(registry_base));
/* harmony default export */ const registry = (Registry);

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/resolution-context.js
var ResolutionContext = (function () {
    function ResolutionContext() {
        this.scopedResolutions = new Map();
    }
    return ResolutionContext;
}());
/* harmony default export */ const resolution_context = (ResolutionContext);

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/error-helpers.js

function formatDependency(params, idx) {
    if (params === null) {
        return "at position #" + idx;
    }
    var argName = params.split(",")[idx].trim();
    return "\"" + argName + "\" at position #" + idx;
}
function composeErrorMessage(msg, e, indent) {
    if (indent === void 0) { indent = "    "; }
    return tslib_es6_spread([msg], e.message.split("\n").map(function (l) { return indent + l; })).join("\n");
}
function error_helpers_formatErrorCtor(ctor, paramIdx, error) {
    var _a = __read(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), _b = _a[1], params = _b === void 0 ? null : _b;
    var dep = formatDependency(params, paramIdx);
    return composeErrorMessage("Cannot inject the dependency " + dep + " of \"" + ctor.name + "\" constructor. Reason:", error);
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/interceptors.js


var PreResolutionInterceptors = (function (_super) {
    tslib_es6_extends(PreResolutionInterceptors, _super);
    function PreResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PreResolutionInterceptors;
}(registry_base));

var PostResolutionInterceptors = (function (_super) {
    tslib_es6_extends(PostResolutionInterceptors, _super);
    function PostResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PostResolutionInterceptors;
}(registry_base));

var Interceptors = (function () {
    function Interceptors() {
        this.preResolution = new PreResolutionInterceptors();
        this.postResolution = new PostResolutionInterceptors();
    }
    return Interceptors;
}());
/* harmony default export */ const interceptors = (Interceptors);

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/dependency-container.js










var typeInfo = new Map();
var InternalDependencyContainer = (function () {
    function InternalDependencyContainer(parent) {
        this.parent = parent;
        this._registry = new registry();
        this.interceptors = new interceptors();
    }
    InternalDependencyContainer.prototype.register = function (token, providerOrConstructor, options) {
        if (options === void 0) { options = { lifecycle: lifecycle.Transient }; }
        var provider;
        if (!isProvider(providerOrConstructor)) {
            provider = { useClass: providerOrConstructor };
        }
        else {
            provider = providerOrConstructor;
        }
        if (isTokenProvider(provider)) {
            var path = [token];
            var tokenProvider = provider;
            while (tokenProvider != null) {
                var currentToken = tokenProvider.useToken;
                if (path.includes(currentToken)) {
                    throw new Error("Token registration cycle detected! " + tslib_es6_spread(path, [currentToken]).join(" -> "));
                }
                path.push(currentToken);
                var registration = this._registry.get(currentToken);
                if (registration && isTokenProvider(registration.provider)) {
                    tokenProvider = registration.provider;
                }
                else {
                    tokenProvider = null;
                }
            }
        }
        if (options.lifecycle === lifecycle.Singleton ||
            options.lifecycle == lifecycle.ContainerScoped ||
            options.lifecycle == lifecycle.ResolutionScoped) {
            if (isValueProvider(provider) || isFactoryProvider(provider)) {
                throw new Error("Cannot use lifecycle \"" + lifecycle[options.lifecycle] + "\" with ValueProviders or FactoryProviders");
            }
        }
        this._registry.set(token, { provider: provider, options: options });
        return this;
    };
    InternalDependencyContainer.prototype.registerType = function (from, to) {
        if (isNormalToken(to)) {
            return this.register(from, {
                useToken: to
            });
        }
        return this.register(from, {
            useClass: to
        });
    };
    InternalDependencyContainer.prototype.registerInstance = function (token, instance) {
        return this.register(token, {
            useValue: instance
        });
    };
    InternalDependencyContainer.prototype.registerSingleton = function (from, to) {
        if (isNormalToken(from)) {
            if (isNormalToken(to)) {
                return this.register(from, {
                    useToken: to
                }, { lifecycle: lifecycle.Singleton });
            }
            else if (to) {
                return this.register(from, {
                    useClass: to
                }, { lifecycle: lifecycle.Singleton });
            }
            throw new Error('Cannot register a type name as a singleton without a "to" token');
        }
        var useClass = from;
        if (to && !isNormalToken(to)) {
            useClass = to;
        }
        return this.register(from, {
            useClass: useClass
        }, { lifecycle: lifecycle.Singleton });
    };
    InternalDependencyContainer.prototype.resolve = function (token, context) {
        if (context === void 0) { context = new resolution_context(); }
        var registration = this.getRegistration(token);
        if (!registration && isNormalToken(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "Single");
        if (registration) {
            var result = this.resolveRegistration(registration, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        if (isConstructorToken(token)) {
            var result = this.construct(token, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
    };
    InternalDependencyContainer.prototype.executePreResolutionInterceptor = function (token, resolutionType) {
        var e_1, _a;
        if (this.interceptors.preResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = __values(this.interceptors.preResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, resolutionType);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.interceptors.preResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.executePostResolutionInterceptor = function (token, result, resolutionType) {
        var e_2, _a;
        if (this.interceptors.postResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = __values(this.interceptors.postResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, result, resolutionType);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.interceptors.postResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.resolveRegistration = function (registration, context) {
        if (registration.options.lifecycle === lifecycle.ResolutionScoped &&
            context.scopedResolutions.has(registration)) {
            return context.scopedResolutions.get(registration);
        }
        var isSingleton = registration.options.lifecycle === lifecycle.Singleton;
        var isContainerScoped = registration.options.lifecycle === lifecycle.ContainerScoped;
        var returnInstance = isSingleton || isContainerScoped;
        var resolved;
        if (isValueProvider(registration.provider)) {
            resolved = registration.provider.useValue;
        }
        else if (isTokenProvider(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.resolve(registration.provider.useToken, context))
                : this.resolve(registration.provider.useToken, context);
        }
        else if (isClassProvider(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.construct(registration.provider.useClass, context))
                : this.construct(registration.provider.useClass, context);
        }
        else if (isFactoryProvider(registration.provider)) {
            resolved = registration.provider.useFactory(this);
        }
        else {
            resolved = this.construct(registration.provider, context);
        }
        if (registration.options.lifecycle === lifecycle.ResolutionScoped) {
            context.scopedResolutions.set(registration, resolved);
        }
        return resolved;
    };
    InternalDependencyContainer.prototype.resolveAll = function (token, context) {
        var _this = this;
        if (context === void 0) { context = new resolution_context(); }
        var registrations = this.getAllRegistrations(token);
        if (!registrations && isNormalToken(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "All");
        if (registrations) {
            var result_1 = registrations.map(function (item) {
                return _this.resolveRegistration(item, context);
            });
            this.executePostResolutionInterceptor(token, result_1, "All");
            return result_1;
        }
        var result = [this.construct(token, context)];
        this.executePostResolutionInterceptor(token, result, "All");
        return result;
    };
    InternalDependencyContainer.prototype.isRegistered = function (token, recursive) {
        if (recursive === void 0) { recursive = false; }
        return (this._registry.has(token) ||
            (recursive &&
                (this.parent || false) &&
                this.parent.isRegistered(token, true)));
    };
    InternalDependencyContainer.prototype.reset = function () {
        this._registry.clear();
        this.interceptors.preResolution.clear();
        this.interceptors.postResolution.clear();
    };
    InternalDependencyContainer.prototype.clearInstances = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), token = _d[0], registrations = _d[1];
                this._registry.setAll(token, registrations
                    .filter(function (registration) { return !isValueProvider(registration.provider); })
                    .map(function (registration) {
                    registration.instance = undefined;
                    return registration;
                }));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    InternalDependencyContainer.prototype.createChildContainer = function () {
        var e_4, _a;
        var childContainer = new InternalDependencyContainer(this);
        try {
            for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), token = _d[0], registrations = _d[1];
                if (registrations.some(function (_a) {
                    var options = _a.options;
                    return options.lifecycle === lifecycle.ContainerScoped;
                })) {
                    childContainer._registry.setAll(token, registrations.map(function (registration) {
                        if (registration.options.lifecycle === lifecycle.ContainerScoped) {
                            return {
                                provider: registration.provider,
                                options: registration.options
                            };
                        }
                        return registration;
                    }));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return childContainer;
    };
    InternalDependencyContainer.prototype.beforeResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.preResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.afterResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.postResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.getRegistration = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.get(token);
        }
        if (this.parent) {
            return this.parent.getRegistration(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.getAllRegistrations = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.getAll(token);
        }
        if (this.parent) {
            return this.parent.getAllRegistrations(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.construct = function (ctor, context) {
        var _this = this;
        if (ctor instanceof DelayedConstructor) {
            return ctor.createProxy(function (target) {
                return _this.resolve(target, context);
            });
        }
        var paramInfo = typeInfo.get(ctor);
        if (!paramInfo || paramInfo.length === 0) {
            if (ctor.length === 0) {
                return new ctor();
            }
            else {
                throw new Error("TypeInfo not known for \"" + ctor.name + "\"");
            }
        }
        var params = paramInfo.map(this.resolveParams(context, ctor));
        return new (ctor.bind.apply(ctor, tslib_es6_spread([void 0], params)))();
    };
    InternalDependencyContainer.prototype.resolveParams = function (context, ctor) {
        var _this = this;
        return function (param, idx) {
            var _a, _b, _c;
            try {
                if (injection_token_isTokenDescriptor(param)) {
                    if (injection_token_isTransformDescriptor(param)) {
                        return param.multiple
                            ? (_a = _this.resolve(param.transform)).transform.apply(_a, tslib_es6_spread([_this.resolveAll(param.token)], param.transformArgs)) : (_b = _this.resolve(param.transform)).transform.apply(_b, tslib_es6_spread([_this.resolve(param.token, context)], param.transformArgs));
                    }
                    else {
                        return param.multiple
                            ? _this.resolveAll(param.token)
                            : _this.resolve(param.token, context);
                    }
                }
                else if (injection_token_isTransformDescriptor(param)) {
                    return (_c = _this.resolve(param.transform, context)).transform.apply(_c, tslib_es6_spread([_this.resolve(param.token, context)], param.transformArgs));
                }
                return _this.resolve(param, context);
            }
            catch (e) {
                throw new Error(error_helpers_formatErrorCtor(ctor, idx, e));
            }
        };
    };
    return InternalDependencyContainer;
}());
var instance = new InternalDependencyContainer();
/* harmony default export */ const dependency_container = ((/* unused pure expression or super */ null && (instance)));

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/decorators/auto-injectable.js





function autoInjectable() {
    return function (target) {
        var paramInfo = getParamInfo(target);
        return (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _super.apply(this, __spread(args.concat(paramInfo.slice(args.length).map(function (type, index) {
                    var _a, _b, _c;
                    try {
                        if (isTokenDescriptor(type)) {
                            if (isTransformDescriptor(type)) {
                                return type.multiple
                                    ? (_a = globalContainer
                                        .resolve(type.transform)).transform.apply(_a, __spread([globalContainer.resolveAll(type.token)], type.transformArgs)) : (_b = globalContainer
                                    .resolve(type.transform)).transform.apply(_b, __spread([globalContainer.resolve(type.token)], type.transformArgs));
                            }
                            else {
                                return type.multiple
                                    ? globalContainer.resolveAll(type.token)
                                    : globalContainer.resolve(type.token);
                            }
                        }
                        else if (isTransformDescriptor(type)) {
                            return (_c = globalContainer
                                .resolve(type.transform)).transform.apply(_c, __spread([globalContainer.resolve(type.token)], type.transformArgs));
                        }
                        return globalContainer.resolve(type);
                    }
                    catch (e) {
                        var argIndex = index + args.length;
                        throw new Error(formatErrorCtor(target, argIndex, e));
                    }
                })))) || this;
            }
            return class_1;
        }(target));
    };
}
/* harmony default export */ const auto_injectable = ((/* unused pure expression or super */ null && (autoInjectable)));

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/reflection-helpers.js
var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
function reflection_helpers_getParamInfo(target) {
    var params = Reflect.getMetadata("design:paramtypes", target) || [];
    var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    Object.keys(injectionTokens).forEach(function (key) {
        params[+key] = injectionTokens[key];
    });
    return params;
}
function defineInjectionTokenMetadata(data, transform) {
    return function (target, _propertyKey, parameterIndex) {
        var descriptors = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
        descriptors[parameterIndex] = transform
            ? {
                token: data,
                transform: transform.transformToken,
                transformArgs: transform.args || []
            }
            : data;
        Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, descriptors, target);
    };
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/decorators/inject.js

function inject(token) {
    return defineInjectionTokenMetadata(token);
}
/* harmony default export */ const decorators_inject = (inject);

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/decorators/injectable.js


function injectable_injectable() {
    return function (target) {
        typeInfo.set(target, reflection_helpers_getParamInfo(target));
    };
}
/* harmony default export */ const decorators_injectable = (injectable_injectable);

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/decorators/registry.js


function registry_registry(registrations) {
    if (registrations === void 0) { registrations = []; }
    return function (target) {
        registrations.forEach(function (_a) {
            var token = _a.token, options = _a.options, provider = __rest(_a, ["token", "options"]);
            return globalContainer.register(token, provider, options);
        });
        return target;
    };
}
/* harmony default export */ const decorators_registry = ((/* unused pure expression or super */ null && (registry_registry)));

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/decorators/singleton.js


function singleton() {
    return function (target) {
        decorators_injectable()(target);
        instance.registerSingleton(target);
    };
}
/* harmony default export */ const decorators_singleton = (singleton);

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/decorators/scoped.js


function scoped(lifecycle, token) {
    return function (target) {
        injectable()(target);
        globalContainer.register(token || target, target, {
            lifecycle: lifecycle
        });
    };
}

;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/decorators/index.js










;// CONCATENATED MODULE: ./node_modules/tsyringe/dist/esm5/index.js
if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
    throw new Error("tsyringe requires a reflect polyfill. Please add 'import \"reflect-metadata\"' to the top of your entry point.");
}








/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/reflect-metadata/Reflect.js
var reflect_metadata_Reflect = __webpack_require__(660);
// EXTERNAL MODULE: ./node_modules/tsyringe/dist/esm5/index.js + 25 modules
var esm5 = __webpack_require__(195);
// EXTERNAL MODULE: ./src/ComponentCollection.ts + 2 modules
var ComponentCollection = __webpack_require__(884);
// EXTERNAL MODULE: ./src/options/HostOptions.ts
var HostOptions = __webpack_require__(818);
// EXTERNAL MODULE: ./src/context/RootContext.ts + 7 modules
var RootContext = __webpack_require__(887);
;// CONCATENATED MODULE: ./src/context/BasisCoreRootContext.ts
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



let BasisCoreRootContext = class BasisCoreRootContext extends RootContext/* default */.Z {
    constructor(repository, logger, container, options) {
        super(repository, options, logger);
        container.register("HostOptions", { useValue: options });
        const queryString = window.location.search.substring(1);
        this.addQueryString(queryString);
        this.addRequestRelatedSources();
    }
    addQueryString(queryString) {
        if (queryString.length > 0) {
            const data = queryString
                .split("&")
                .map((x) => x.split("="))
                .reduce((data, pair) => {
                var _a;
                data[pair[0]] = decodeURIComponent((_a = pair[1]) !== null && _a !== void 0 ? _a : "");
                return data;
            }, {});
            this.setAsSource("cms.query", data);
        }
    }
    addRequestRelatedSources() {
        if (document.cookie) {
            const cookieValues = document.cookie.split(";").map((x) => x.split("="));
            const data = cookieValues.reduce((data, pair) => {
                data[pair[0]] = pair[1];
                return data;
            }, {});
            this.setAsSource("cms.cookie", data);
        }
        const request = {
            requestId: -1,
            hostip: window.location.hostname,
            hostport: window.location.port,
        };
        this.setAsSource("cms.request", request);
        const toTwoDigit = (x) => ("0" + x).slice(-2);
        const d = new Date();
        const ye = d.getFullYear();
        const mo = toTwoDigit(d.getMonth());
        const da = toTwoDigit(d.getDay());
        const ho = toTwoDigit(d.getHours());
        const mi = toTwoDigit(d.getMinutes());
        const se = toTwoDigit(d.getSeconds());
        const cms = {
            date: `${ye}/${mo}/${da}`,
            time: `${ho}:${mi}`,
            date2: `${ye}${mo}${da}`,
            time2: `${ho}${mi}${se}`,
            date3: `${ye}.${mo}.${da}`,
        };
        this.setAsSource("cms.cms", cms);
    }
};
BasisCoreRootContext = __decorate([
    (0,esm5/* injectable */.b2)(),
    __param(0, (0,esm5/* inject */.f3)("IContextRepository")),
    __param(1, (0,esm5/* inject */.f3)("ILogger")),
    __param(2, (0,esm5/* inject */.f3)("container")),
    __metadata("design:paramtypes", [Object, Object, Object, HostOptions/* HostOptions */.G])
], BasisCoreRootContext);
/* harmony default export */ const context_BasisCoreRootContext = (BasisCoreRootContext);

;// CONCATENATED MODULE: ./src/BasisCore.ts
var BasisCore_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BasisCore_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BasisCore_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



let BasisCore = class BasisCore {
    constructor(context, container, nodes) {
        this.context = context;
        container.register("root.context", { useValue: context });
        container.register("context", { useToken: "root.context" });
        this.content = container.resolve(ComponentCollection/* default */.Z);
        this.content.processNodesAsync(nodes);
    }
    setSource(sourceId, data, options) {
        this.content.initializeTask.then((_) => {
            this.context.setAsSource(sourceId, data, options);
        });
    }
};
BasisCore = BasisCore_decorate([
    (0,esm5/* injectable */.b2)(),
    BasisCore_param(1, (0,esm5/* inject */.f3)("container")),
    BasisCore_param(2, (0,esm5/* inject */.f3)("root.nodes")),
    BasisCore_metadata("design:paramtypes", [context_BasisCoreRootContext, Object, Array])
], BasisCore);
/* harmony default export */ const src_BasisCore = (BasisCore);

// EXTERNAL MODULE: ./src/enum.ts
var src_enum = __webpack_require__(397);
// EXTERNAL MODULE: ./src/component/CommandComponent.ts
var CommandComponent = __webpack_require__(210);
;// CONCATENATED MODULE: ./src/component/collection/CallComponent.ts
var CallComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CallComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CallComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




let CallComponent = class CallComponent extends CommandComponent/* default */.Z {
    constructor(element, context, container) {
        super(element, context);
        this.defaultAttributeNames = ["core", "run", "file", "method"];
        this.priority = src_enum/* Priority.high */.UL.high;
        this.container = container;
    }
    runAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = yield this.getAttributeValueAsync("file");
            const pageSize = yield this.getAttributeValueAsync("pagesize");
            const command = yield this.node.outerHTML
                .ToStringToken(this.context)
                .getValueAsync();
            const methodValue = yield this.getAttributeValueAsync("method");
            const method = (methodValue !== null && methodValue !== void 0 ? methodValue : this.context.options.getDefault("call.verb")).toUpperCase();
            let parameters = null;
            if (method === "POST") {
                parameters = {};
                for (let i = 0; i < this.node.attributes.length; i++) {
                    const attr = this.node.attributes[i];
                    const name = attr.name.toLowerCase();
                    if (this.defaultAttributeNames.indexOf(name) == -1) {
                        parameters[name] = yield this.getAttributeValueAsync(attr.name);
                    }
                }
            }
            else {
                parameters = {
                    fileNames: filename,
                    dmnid: this.context.options.getDefault("dmnid"),
                    siteSize: pageSize,
                    command: command,
                };
            }
            const result = yield this.context.loadPageAsync(filename, parameters, method);
            const content = $bc.util.toNode(result);
            const childNodes = [...content.childNodes];
            this.range.setContent(content);
            this.collection = this.container.resolve(ComponentCollection/* default */.Z);
            yield this.collection.processNodesAsync(childNodes);
        });
    }
    disposeAsync() {
        const _super = Object.create(null, {
            disposeAsync: { get: () => super.disposeAsync }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.collection) === null || _a === void 0 ? void 0 : _a.disposeAsync());
            return _super.disposeAsync.call(this);
        });
    }
};
CallComponent = CallComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    CallComponent_param(0, (0,esm5/* inject */.f3)("element")),
    CallComponent_param(1, (0,esm5/* inject */.f3)("context")),
    CallComponent_param(2, (0,esm5/* inject */.f3)("container")),
    CallComponent_metadata("design:paramtypes", [Element, Object, Object])
], CallComponent);
/* harmony default export */ const collection_CallComponent = (CallComponent);

// EXTERNAL MODULE: ./src/component/collection/GroupComponent.ts
var GroupComponent = __webpack_require__(26);
;// CONCATENATED MODULE: ./src/component/SourceBaseComponent.ts
var SourceBaseComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class SourceBaseComponent extends CommandComponent/* default */.Z {
    constructor(element, context) {
        super(element, context);
    }
    processAsync() {
        const _super = Object.create(null, {
            processAsync: { get: () => super.processAsync }
        });
        var _a;
        return SourceBaseComponent_awaiter(this, void 0, void 0, function* () {
            this.sourceId = (_a = (yield this.getAttributeValueAsync("dataMemberName"))) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            this.addTrigger([this.sourceId]);
            yield _super.processAsync.call(this);
        });
    }
    runAsync(source) {
        return SourceBaseComponent_awaiter(this, void 0, void 0, function* () {
            let result = null;
            if ((source === null || source === void 0 ? void 0 : source.id) !== this.sourceId) {
                source = this.context.tryToGetSource(this.sourceId);
            }
            if (source) {
                if (this.onProcessingAsync) {
                    const args = this.createCallbackArgument({
                        source: source,
                    });
                    yield this.onProcessingAsync(args);
                    source = args.source;
                }
                result = yield this.renderSourceAsync(source);
            }
            return result;
        });
    }
}

;// CONCATENATED MODULE: ./src/component/collection/RepeaterComponent.ts
var RepeaterComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RepeaterComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RepeaterComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RepeaterComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



let RepeaterComponent = class RepeaterComponent extends SourceBaseComponent {
    constructor(element, context, container) {
        super(element, context);
        this.oldChildContexts = new Array();
        this.collections = new Array();
        this.container = container;
    }
    renderSourceAsync(dataSource) {
        return RepeaterComponent_awaiter(this, void 0, void 0, function* () {
            const name = yield this.getAttributeValueAsync("name");
            const replace = yield this.getAttributeBooleanValueAsync("replace", true);
            if (replace) {
                this.range.deleteContents();
                yield this.disposeExistingObjectAsync();
            }
            for (let index = 0; index < dataSource.rows.length; index++) {
                const row = dataSource.rows[index];
                const template = this.content.firstChild.cloneNode(true);
                var fragment = document.createDocumentFragment();
                const childNodes = [...template.childNodes];
                childNodes.forEach((node) => fragment.appendChild(node));
                this.setContent(fragment, true);
                const childContainer = this.container.createChildContainer();
                childContainer.register("OwnerContext", { useValue: this.context });
                childContainer.register("container", { useValue: childContainer });
                const localContext = childContainer.resolve("ILocalContext");
                this.oldChildContexts.push(localContext);
                localContext.setAsSource(`${name}.current`, row, dataSource.cloneOptions());
                childContainer.register("context", { useValue: localContext });
                const collection = childContainer.resolve(ComponentCollection/* default */.Z);
                this.collections.push(collection);
                yield collection.processNodesAsync(childNodes);
            }
        });
    }
    disposeExistingObjectAsync() {
        return RepeaterComponent_awaiter(this, void 0, void 0, function* () {
            if (this.oldChildContexts.length > 0) {
                this.oldChildContexts.forEach((x) => x.dispose());
                this.oldChildContexts.splice(0, this.oldChildContexts.length);
            }
            if (this.collections.length > 0) {
                const tasks = this.collections.map((x) => x.disposeAsync());
                yield Promise.all(tasks);
                this.collections.splice(0, this.collections.length);
            }
        });
    }
    disposeAsync() {
        const _super = Object.create(null, {
            disposeAsync: { get: () => super.disposeAsync }
        });
        return RepeaterComponent_awaiter(this, void 0, void 0, function* () {
            yield this.disposeExistingObjectAsync();
            return _super.disposeAsync.call(this);
        });
    }
};
RepeaterComponent = RepeaterComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    RepeaterComponent_param(0, (0,esm5/* inject */.f3)("element")),
    RepeaterComponent_param(1, (0,esm5/* inject */.f3)("context")),
    RepeaterComponent_param(2, (0,esm5/* inject */.f3)("container")),
    RepeaterComponent_metadata("design:paramtypes", [Element, Object, Object])
], RepeaterComponent);
/* harmony default export */ const collection_RepeaterComponent = (RepeaterComponent);

// EXTERNAL MODULE: ./src/data/Source.ts
var Source = __webpack_require__(877);
// EXTERNAL MODULE: ./src/component/ElementBaseComponent.ts
var ElementBaseComponent = __webpack_require__(986);
;// CONCATENATED MODULE: ./src/component/html-element/HTMLComponent.ts
var HTMLComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class HTMLComponent extends ElementBaseComponent/* default */.Z {
    constructor(element, context) {
        super(element, context);
        this.priority = src_enum/* Priority.none */.UL.none;
        this.keyFieldNameToken = this.getAttributeToken("bc-keyField");
        this.statusFieldNameToken = this.getAttributeToken("bc-statusField");
        this.mergeTypeToken = this.getAttributeToken("bc-merge");
        this.eventHandler = this.onEventTriggerAsync.bind(this);
    }
    initializeAsync() {
        const _super = Object.create(null, {
            initializeAsync: { get: () => super.initializeAsync }
        });
        var _a;
        return HTMLComponent_awaiter(this, void 0, void 0, function* () {
            yield _super.initializeAsync.call(this);
            const value = yield this.getAttributeValueAsync("bc-triggers");
            const init = this.node.hasAttribute("data-bc-init");
            if (value && !init) {
                this.eventTriggers = value.split(" ");
                (_a = this.eventTriggers) === null || _a === void 0 ? void 0 : _a.forEach((eventName) => this.node.addEventListener(eventName, this.eventHandler));
                this.node.setAttribute("data-bc-init", "");
            }
        });
    }
    runAsync(source) {
        return this.onEventTriggerAsync();
    }
    onEventTriggerAsync(event) {
        const _super = Object.create(null, {
            createCallbackArgument: { get: () => super.createCallbackArgument }
        });
        var _a, _b;
        return HTMLComponent_awaiter(this, void 0, void 0, function* () {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            let id = yield this.getSourceIdAsync();
            let value = yield this.getSourceValueAsync(event);
            if (this.onProcessingAsync) {
                const args = _super.createCallbackArgument.call(this, {
                    id: id,
                    value: value,
                });
                yield this.onProcessingAsync(args);
                id = args.id;
                value = args.value;
            }
            let mergeType;
            if (this.mergeTypeToken) {
                const rawValue = yield this.mergeTypeToken.getValueAsync();
                if (rawValue) {
                    mergeType = src_enum/* MergeType */.dx[rawValue.toLowerCase()];
                }
            }
            var source = new Source/* default */.Z(id !== null && id !== void 0 ? id : "cms.unknown", value, {
                keyFieldName: yield ((_a = this.keyFieldNameToken) === null || _a === void 0 ? void 0 : _a.getValueAsync()),
                statusFieldName: yield ((_b = this.statusFieldNameToken) === null || _b === void 0 ? void 0 : _b.getValueAsync()),
                mergeType: mergeType,
            });
            let canRender = yield this.getIfValueAsync();
            if (canRender && this.onRenderingAsync) {
                const renderingArgs = this.createCallbackArgument({
                    prevent: false,
                    source: source,
                });
                yield this.onRenderingAsync(renderingArgs);
                canRender = !renderingArgs.prevent;
            }
            if (canRender) {
                this.context.setSource(source);
                if (this.onRenderedAsync) {
                    yield this.onRenderedAsync(this.createCallbackArgument({
                        result: null,
                        source: source,
                    }));
                }
            }
            if (this.onProcessedAsync) {
                const args = _super.createCallbackArgument.call(this, {
                    id: id,
                    value: value,
                });
                yield this.onProcessedAsync(args);
            }
        });
    }
    getSourceIdAsync() {
        return HTMLComponent_awaiter(this, void 0, void 0, function* () {
            let retVal = yield this.getAttributeValueAsync(`bc-name`);
            if (!retVal) {
                retVal = yield this.getAttributeValueAsync("name");
            }
            return retVal;
        });
    }
    getSourceValueAsync(event) {
        return HTMLComponent_awaiter(this, void 0, void 0, function* () {
            let retVal = yield this.getAttributeValueAsync(`bc-value`);
            if (!retVal) {
                try {
                    retVal = this.node.value;
                }
                catch (_a) {
                    /*Nothing*/
                }
            }
            return retVal;
        });
    }
    disposeAsync() {
        var _a;
        (_a = this.eventTriggers) === null || _a === void 0 ? void 0 : _a.forEach((eventName) => this.node.removeEventListener(eventName, this.eventHandler));
        this.node.removeAttribute("data-bc-init");
        return super.disposeAsync();
    }
}

;// CONCATENATED MODULE: ./src/component/html-element/HTMLFormComponent.ts
var HTMLFormComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HTMLFormComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HTMLFormComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


let HTMLFormComponent = class HTMLFormComponent extends HTMLComponent {
    constructor(element, context) {
        super(element, context);
    }
    getSourceValueAsync(event) {
        const data = new FormData(this.node);
        const _rootList = new Map();
        const value = Array.from(data.keys()).reduce((result, key) => {
            const value = data.get(key);
            if (key.startsWith("_")) {
                _rootList.set(key, value);
            }
            else {
                result[key] = value;
            }
            return result;
        }, {});
        if (_rootList.size > 0) {
            const _roots = this.convertRootList(_rootList);
            [..._roots.keys()].forEach((key) => (value[key] = _roots.get(key)));
        }
        return Promise.resolve(value);
    }
    convertRootList(values) {
        const retVal = new Map();
        [...values.keys()].forEach((key) => {
            const value = values.get(key);
            const [rootKey, ...parts] = key.split(".");
            let root = retVal.get(rootKey);
            if (!root) {
                root = {};
                retVal.set(rootKey, root);
            }
            parts.forEach((part, i) => {
                const [subRoot, index] = part.split("__", 2);
                if (index) {
                    let tmpRoot = root[subRoot];
                    if (!tmpRoot) {
                        root[subRoot] = tmpRoot = [];
                    }
                    let obj = tmpRoot[index];
                    if (!obj) {
                        tmpRoot[index] = obj = {};
                    }
                    root = obj;
                }
                else {
                    if (i + 1 == parts.length) {
                        root[part] = value;
                    }
                    else {
                        let obj = root[part];
                        if (!obj) {
                            root[part] = obj = {};
                        }
                        root = obj;
                    }
                }
            });
        });
        [...retVal.values()].forEach((root) => {
            function removeArrayEmptySlots(value) {
                Object.keys(value).forEach((prop) => {
                    let val = value[prop];
                    if (Array.isArray(val)) {
                        value[prop] = val = val.filter(String);
                        val.forEach((item) => removeArrayEmptySlots(item));
                    }
                    else if (typeof val === "object") {
                        removeArrayEmptySlots(val);
                    }
                });
            }
            removeArrayEmptySlots(root);
        });
        return retVal;
    }
};
HTMLFormComponent = HTMLFormComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    HTMLFormComponent_param(0, (0,esm5/* inject */.f3)("element")),
    HTMLFormComponent_param(1, (0,esm5/* inject */.f3)("context")),
    HTMLFormComponent_metadata("design:paramtypes", [HTMLFormElement, Object])
], HTMLFormComponent);
/* harmony default export */ const html_element_HTMLFormComponent = (HTMLFormComponent);

;// CONCATENATED MODULE: ./src/component/html-element/HTMLInputComponent.ts
var HTMLInputComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HTMLInputComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HTMLInputComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var HTMLInputComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


let HTMLInputComponent = class HTMLInputComponent extends HTMLComponent {
    constructor(element, context) {
        super(element, context);
    }
    getSourceValueAsync(event) {
        const _super = Object.create(null, {
            getSourceValueAsync: { get: () => super.getSourceValueAsync }
        });
        return HTMLInputComponent_awaiter(this, void 0, void 0, function* () {
            let value = yield _super.getSourceValueAsync.call(this, event);
            if (!value) {
                switch (this.node.type) {
                    case "checkbox": {
                        value = this.node.checked;
                        break;
                    }
                    case "file": {
                        value = { value: this.node.files };
                        break;
                    }
                    default: {
                        value = this.node.value;
                        break;
                    }
                }
            }
            return value;
        });
    }
};
HTMLInputComponent = HTMLInputComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    HTMLInputComponent_param(0, (0,esm5/* inject */.f3)("element")),
    HTMLInputComponent_param(1, (0,esm5/* inject */.f3)("context")),
    HTMLInputComponent_metadata("design:paramtypes", [HTMLInputElement, Object])
], HTMLInputComponent);
/* harmony default export */ const html_element_HTMLInputComponent = (HTMLInputComponent);

;// CONCATENATED MODULE: ./src/component/html-element/HTMLIUnknownComponent.ts
var HTMLIUnknownComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HTMLIUnknownComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HTMLIUnknownComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


let HTMLIUnknownComponent = class HTMLIUnknownComponent extends HTMLComponent {
    constructor(element, context) {
        super(element, context);
    }
};
HTMLIUnknownComponent = HTMLIUnknownComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    HTMLIUnknownComponent_param(0, (0,esm5/* inject */.f3)("element")),
    HTMLIUnknownComponent_param(1, (0,esm5/* inject */.f3)("context")),
    HTMLIUnknownComponent_metadata("design:paramtypes", [HTMLElement, Object])
], HTMLIUnknownComponent);
/* harmony default export */ const html_element_HTMLIUnknownComponent = (HTMLIUnknownComponent);

;// CONCATENATED MODULE: ./src/component/html-element/HTMLSelectComponent.ts
var HTMLSelectComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HTMLSelectComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HTMLSelectComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var HTMLSelectComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


let HTMLSelectComponent = class HTMLSelectComponent extends HTMLComponent {
    constructor(element, context) {
        super(element, context);
    }
    getSourceValueAsync(event) {
        const _super = Object.create(null, {
            getSourceValueAsync: { get: () => super.getSourceValueAsync }
        });
        var _a;
        return HTMLSelectComponent_awaiter(this, void 0, void 0, function* () {
            return (_a = this.node.value) !== null && _a !== void 0 ? _a : (yield _super.getSourceValueAsync.call(this, event));
        });
    }
};
HTMLSelectComponent = HTMLSelectComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    HTMLSelectComponent_param(0, (0,esm5/* inject */.f3)("element")),
    HTMLSelectComponent_param(1, (0,esm5/* inject */.f3)("context")),
    HTMLSelectComponent_metadata("design:paramtypes", [HTMLSelectElement, Object])
], HTMLSelectComponent);
/* harmony default export */ const html_element_HTMLSelectComponent = (HTMLSelectComponent);

;// CONCATENATED MODULE: ./src/component/management/CookieComponent.ts
var CookieComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CookieComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CookieComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CookieComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


//https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
//https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
//https://www.w3schools.com/js/js_cookies.asp
let CookieComponent = class CookieComponent extends CommandComponent/* default */.Z {
    constructor(element, context) {
        super(element, context);
    }
    runAsync() {
        return CookieComponent_awaiter(this, void 0, void 0, function* () {
            var name = yield this.getAttributeValueAsync("name");
            var value = yield this.getAttributeValueAsync("value");
            var maxAge = yield this.getAttributeValueAsync("max-age");
            var path = yield this.getAttributeValueAsync("path");
            var str = `${name.trim()}=${value || ""}`;
            if (maxAge) {
                str += `;max-age=${maxAge}`;
            }
            if (path) {
                str += `;path=${path.trim()}`;
            }
            document.cookie = str;
        });
    }
};
CookieComponent = CookieComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    CookieComponent_param(0, (0,esm5/* inject */.f3)("element")),
    CookieComponent_param(1, (0,esm5/* inject */.f3)("context")),
    CookieComponent_metadata("design:paramtypes", [Element, Object])
], CookieComponent);
/* harmony default export */ const management_CookieComponent = (CookieComponent);

// EXTERNAL MODULE: ./src/Util.ts
var Util = __webpack_require__(102);
;// CONCATENATED MODULE: ./src/component/renderable/base/FaceRenderResult.ts
class FaceRenderResult {
    constructor(key, version, element) {
        this.key = key;
        this.version = version;
        this.nodes = Array.from(element.childNodes);
    }
    AppendTo(newParent) {
        if (newParent instanceof Node) {
            this.nodes.forEach((node) => newParent.appendChild(node));
        }
        else if (newParent instanceof Range) {
            const content = newParent.extractContents();
            this.nodes.forEach((node) => content.appendChild(node));
            newParent.insertNode(content);
        }
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/FaceRenderResultRepository.ts
class FaceRenderResultRepository {
    constructor() {
        this.groups = new Map();
    }
    set(key, value, groupName = "default") {
        let group = this.groups[groupName];
        if (!group) {
            group = new Map();
            this.groups[groupName] = group;
        }
        group.set(key !== null && key !== void 0 ? key : value, value);
    }
    get(key, groupName = "default") {
        var _a;
        return (_a = this.groups[groupName]) === null || _a === void 0 ? void 0 : _a.get(key);
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/IRenderDataPartResult.ts
class RenderDataPartResult {
    constructor(result, repository) {
        this.result = result;
        this.repository = repository;
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/FaceCollection.ts
var FaceCollection_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class FaceCollection extends Array {
    constructor(...faces) {
        super(...faces);
        Object.setPrototypeOf(this, FaceCollection.prototype);
    }
    renderAsync(param, data) {
        return FaceCollection_awaiter(this, void 0, void 0, function* () {
            let retVal = null;
            if (this.length == 0) {
                param.setRendered();
            }
            else {
                var rowType = param.rowType;
                var firstMatchFace = this.filter((x) => {
                    var con1 = x.RelatedRows.some((x) => Util/* default.Equal */.Z.Equal(x, data));
                    var con2 = x.RowType == src_enum/* FaceRowType.NotSet */.A$.NotSet || x.RowType == rowType;
                    var con3 = x.Levels == null ||
                        x.Levels.some((y) => param.Levels.some((x) => x == y));
                    return con1 && con2 && con3;
                })[0];
                if (firstMatchFace) {
                    const [dataKey, version, preRenderResult] = yield param.getRenderedResultAsync(data);
                    if (preRenderResult) {
                        retVal = preRenderResult;
                    }
                    else {
                        const rawHtml = yield firstMatchFace.template.getValueAsync(data);
                        const renderResult = $bc.util.toHTMLElement(rawHtml);
                        retVal = param.factory(dataKey, version, renderResult);
                    }
                    param.setRendered();
                }
                else {
                    param.setIgnored();
                }
            }
            return retVal;
        });
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/RawFace.ts

class RawFace {
    constructor(element, context, placeHolder) {
        this.Level = element.GetStringToken("level", context);
        this.RowType = element.GetStringToken("rowtype", context);
        this.Filter = element.GetStringToken("filter", context);
        this.Template = element.getXMLTemplate();
        if (placeHolder) {
            this.Template = Util/* default.ReplaceEx */.Z.ReplaceEx(this.Template, `@child`, `<basis-core-template-tag data-type="${placeHolder}"></basis-core-template-tag>`);
        }
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/template/ExpressionTemplate.ts
class ExpressionTemplate {
    constructor(rawExpression, reservedKeys) {
        this.rawExpression = rawExpression;
        this.reservedKeys = reservedKeys;
    }
    getValueAsync(data) {
        var _a, _b;
        if (!this.getValue) {
            try {
                this.getValue = new Function("$functionArgumentData", `${(_b = (_a = this.reservedKeys) === null || _a === void 0 ? void 0 : _a.map((key) => `const ${key} = '@${key}'`).join(";")) !== null && _b !== void 0 ? _b : ""}
          ${Object.getOwnPropertyNames(data)
                    .map((key) => `const ${key} = $functionArgumentData["${key}"]`)
                    .join(";")}
            return ${this.rawExpression};`);
            }
            catch (ex) {
                console.error(`Error in create binding expression for '${this.rawExpression}'`, ex);
                throw ex;
            }
        }
        return Promise.resolve(this.getValue(data));
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/template/StringTemplate.ts
class StringTemplate {
    constructor(content) {
        this.content = content;
    }
    getValueAsync(_) {
        return Promise.resolve(this.content);
    }
}

// EXTERNAL MODULE: ./src/token/CodeBlockToken.ts
var CodeBlockToken = __webpack_require__(827);
;// CONCATENATED MODULE: ./src/component/renderable/base/template/CodeBlockTemplate.ts
var CodeBlockTemplate_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class CodeBlockTemplate {
    constructor(expression, context) {
        this.token = new CodeBlockToken/* default */.Z(expression, context);
    }
    getValueAsync(data) {
        return CodeBlockTemplate_awaiter(this, void 0, void 0, function* () {
            return yield this.token.executeAsync(data);
        });
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/template/ContentTemplate.ts
var ContentTemplate_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class ContentTemplate {
    constructor(context, template, reservedKeys) {
        this.contents = new Array();
        this.context = context;
        this.template = template;
        this.reservedKeys = reservedKeys;
        if (template) {
            this.extractContents();
        }
    }
    extractContents() {
        var _a, _b, _c;
        const faceRegex = this.context.options.getDefault("binding.face-regex");
        const blockRegex = this.context.options.getDefault("binding.codeblock-regex");
        const pattern = new RegExp(`${faceRegex.source}|${blockRegex.source}`, "gi");
        let matchResult;
        let startIndex = 0;
        while ((matchResult = pattern.exec(this.template)) !== null) {
            const finding = matchResult[0];
            const preChar = matchResult[1];
            const index = matchResult.index + ((_a = preChar === null || preChar === void 0 ? void 0 : preChar.length) !== null && _a !== void 0 ? _a : 0);
            if (startIndex != index) {
                this.contents.push(new StringTemplate(this.template.slice(startIndex, index)));
            }
            startIndex = index + finding.length;
            const expression = (_b = matchResult[2]) !== null && _b !== void 0 ? _b : matchResult[3];
            if (expression) {
                this.contents.push(new ExpressionTemplate(expression, this.reservedKeys));
                startIndex -= (_c = preChar === null || preChar === void 0 ? void 0 : preChar.length) !== null && _c !== void 0 ? _c : 0;
            }
            else {
                const blockToken = matchResult[4];
                this.contents.push(new CodeBlockTemplate(blockToken, this.context));
            }
        }
        if (startIndex != this.template.length) {
            this.contents.push(new StringTemplate(this.template.slice(startIndex)));
        }
    }
    getValueAsync(data) {
        return ContentTemplate_awaiter(this, void 0, void 0, function* () {
            const tasks = this.contents.map((x) => x.getValueAsync(data));
            const result = yield Promise.all(tasks);
            return result.reduce((r, v) => (r += v), "");
        });
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/RawFaceCollection.ts
var RawFaceCollection_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





class RawFaceCollection extends Array {
    static Create(element, context, placeHolder) {
        var retVal = new RawFaceCollection();
        element
            .querySelectorAll("face")
            .forEach((x) => retVal.push(new RawFace(x, context, placeHolder)));
        return retVal;
    }
    processAsync(source, context, reservedKeys) {
        return RawFaceCollection_awaiter(this, void 0, void 0, function* () {
            var facesTask = this.map((x) => RawFaceCollection_awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                var rowType = yield this.GetRowTypeAsync(x.RowType);
                var levels = (_c = (_b = (yield ((_a = x.Level) === null || _a === void 0 ? void 0 : _a.getValueAsync()))) === null || _b === void 0 ? void 0 : _b.split("|")) !== null && _c !== void 0 ? _c : null;
                var filter = yield ((_d = x.Filter) === null || _d === void 0 ? void 0 : _d.getValueAsync());
                var relatedRows = Util/* default.IsNullOrEmpty */.Z.IsNullOrEmpty(filter)
                    ? source.rows
                    : yield $bc.util.source.filterAsync(source, filter, context);
                const templateParser = new ContentTemplate(context, x.Template, reservedKeys);
                return {
                    RowType: rowType,
                    Levels: levels,
                    RelatedRows: relatedRows,
                    template: templateParser,
                };
            }));
            var faces = yield Promise.all(facesTask);
            return new FaceCollection(...faces);
        });
    }
    GetRowTypeAsync(token) {
        return RawFaceCollection_awaiter(this, void 0, void 0, function* () {
            var retVal = src_enum/* FaceRowType.NotSet */.A$.NotSet;
            var value = yield (token === null || token === void 0 ? void 0 : token.getValueAsync());
            if (value) {
                var list = Object.getOwnPropertyNames(src_enum/* FaceRowType */.A$).filter((x) => Util/* default.isEqual */.Z.isEqual(x, value));
                retVal = list.length == 1 ? src_enum/* FaceRowType */.A$[list[0]] : src_enum/* FaceRowType.NotSet */.A$.NotSet;
            }
            return retVal;
        });
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/RenderParam.ts
var RenderParam_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class RenderParam {
    constructor(source, renderResultRepository, renderResultFactory, groupName) {
        this.source = source;
        this.renderResultRepository = renderResultRepository;
        this.factory = renderResultFactory;
        this.groupName = groupName;
        this._renderedCount = 0;
    }
    get rowType() {
        return this._renderedCount % 2 == 0 ? src_enum/* FaceRowType.Even */.A$.Even : src_enum/* FaceRowType.Odd */.A$.Odd;
    }
    getRenderedResultAsync(data) {
        var _a;
        return RenderParam_awaiter(this, void 0, void 0, function* () {
            const dataKey = this.getKeyValue(data);
            const newVersion = this.source.getVersion(data);
            let savedResult = (_a = this.renderResultRepository) === null || _a === void 0 ? void 0 : _a.get(dataKey, this.groupName);
            if (savedResult) {
                if (newVersion !== savedResult.version) {
                    savedResult = null;
                }
            }
            return [dataKey, newVersion, savedResult];
        });
    }
    getKeyValue(data) {
        return this.source.keyFieldName
            ? Reflect.get(data, this.source.keyFieldName)
            : data;
    }
    setLevel(levels) {
        this.Levels = levels;
    }
    setRendered() {
        this._renderedCount++;
    }
    setIgnored() {
        this._renderedCount--;
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/RenderableComponent.ts
var RenderableComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};








class RenderableComponent extends SourceBaseComponent {
    constructor(element, context, container, reservedKeys) {
        super(element, context);
        this.container = container;
        this.reservedKeys = reservedKeys;
    }
    renderSourceAsync(source) {
        return RenderableComponent_awaiter(this, void 0, void 0, function* () {
            let renderResult;
            if (source.rows) {
                var rawFaces = RawFaceCollection.Create(this.node, this.context, this.reservedKeys ? this.reservedKeys[0] : null);
                var faces = yield rawFaces.processAsync(source, this.context, this.reservedKeys);
                const newRenderResultList = yield this.renderDataPartAsync(source, faces);
                this.renderResultRepository = newRenderResultList.repository;
                renderResult = newRenderResultList.result;
            }
            return yield this.createContentAsync(renderResult);
        });
    }
    createContentAsync(renderResult) {
        var _a, _b;
        return RenderableComponent_awaiter(this, void 0, void 0, function* () {
            const doc = new DocumentFragment();
            if ((renderResult === null || renderResult === void 0 ? void 0 : renderResult.length) > 0) {
                const rawLayout = (_a = this.node
                    .querySelector("layout")) === null || _a === void 0 ? void 0 : _a.GetXMLTemplateToken(this.context);
                let layoutTemplate = yield (rawLayout === null || rawLayout === void 0 ? void 0 : rawLayout.getValueAsync());
                if (layoutTemplate) {
                    const key = Date.now().toString(36);
                    layoutTemplate = Util/* default.ReplaceEx */.Z.ReplaceEx(layoutTemplate, "@child", `<basis-core-template-child-tag id="${key}"></basis-core-template-child-tag>`);
                    this.appendTemplateToDoc(layoutTemplate, doc);
                    const childContainer = doc.querySelector(`basis-core-template-child-tag#${key}`);
                    if (!childContainer) {
                        this.context.logger.logWarning("@child place holder not found in layout template");
                    }
                    else {
                        const range = new Range();
                        range.selectNode(childContainer);
                        range.deleteContents();
                        renderResult.forEach((element) => element.AppendTo(range));
                        range.detach();
                    }
                }
                else {
                    renderResult.forEach((element) => element.AppendTo(doc));
                }
            }
            else {
                var rawElseLayout = (_b = this.node
                    .querySelector("else-layout")) === null || _b === void 0 ? void 0 : _b.GetXMLTemplateToken(this.context);
                const result = yield (rawElseLayout === null || rawElseLayout === void 0 ? void 0 : rawElseLayout.getValueAsync());
                if (result) {
                    this.appendTemplateToDoc(result, doc);
                }
            }
            return yield this.setContentAsync(doc);
        });
    }
    renderDataPartAsync(dataSource, faces) {
        return RenderableComponent_awaiter(this, void 0, void 0, function* () {
            const param = new RenderParam(dataSource, this.renderResultRepository, (key, ver, doc) => new FaceRenderResult(key, ver, doc));
            const newRenderResultList = new FaceRenderResultRepository();
            const renderResult = new Array();
            for (const row of dataSource.rows) {
                const rowRenderResult = yield faces.renderAsync(param, row);
                if (rowRenderResult) {
                    newRenderResultList.set(rowRenderResult.key, rowRenderResult);
                    renderResult.push(rowRenderResult);
                }
            }
            return new RenderDataPartResult(renderResult, newRenderResultList);
        });
    }
    appendTemplateToDoc(template, doc) {
        const tmpResult = $bc.util.toHTMLElement(template);
        if (tmpResult.nodeName !== "parsererror") {
            Array.from(tmpResult.childNodes).forEach((node) => doc.appendChild(node));
        }
        else {
            doc.appendChild(tmpResult);
        }
    }
    setContentAsync(doc) {
        return RenderableComponent_awaiter(this, void 0, void 0, function* () {
            const generatedNodes = Array.from(doc.childNodes);
            this.setContent(doc, false);
            const collection = this.container.resolve(ComponentCollection/* default */.Z);
            yield collection.processNodesAsync(generatedNodes);
            return generatedNodes;
        });
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/ListComponent.ts
var ListComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ListComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ListComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ListComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




let ListComponent = class ListComponent extends RenderableComponent {
    constructor(element, context, container) {
        super(element, context, container);
    }
    createContentAsync(renderResults) {
        const _super = Object.create(null, {
            createContentAsync: { get: () => super.createContentAsync }
        });
        var _a, _b, _c, _d, _e, _f;
        return ListComponent_awaiter(this, void 0, void 0, function* () {
            let retVal = null;
            const dividerTagElement = this.node.querySelector("divider");
            if (dividerTagElement && (renderResults === null || renderResults === void 0 ? void 0 : renderResults.length) > 0) {
                const dividerTemplate = yield ((_a = dividerTagElement === null || dividerTagElement === void 0 ? void 0 : dividerTagElement.GetTemplateToken(this.context)) === null || _a === void 0 ? void 0 : _a.getValueAsync());
                const cellCount = yield ((_b = dividerTagElement === null || dividerTagElement === void 0 ? void 0 : dividerTagElement.GetIntegerToken("rowcount", this.context)) === null || _b === void 0 ? void 0 : _b.getValueAsync());
                const incompleteTemplateStr = yield ((_d = (_c = this.node
                    .querySelector("incomplete")) === null || _c === void 0 ? void 0 : _c.GetXMLTemplateToken(this.context)) === null || _d === void 0 ? void 0 : _d.getValueAsync());
                const incompleteTemplate = incompleteTemplateStr
                    ? $bc.util.toHTMLElement(incompleteTemplateStr)
                    : document.createElement("div");
                let contentTemplate = "";
                const key = Date.now().toString(36);
                let index = cellCount;
                renderResults.forEach((_) => {
                    contentTemplate += `<basis-core-template-list-item-tag data-type="${key}"></basis-core-template-list-item-tag>`;
                    index--;
                    if (index == 0) {
                        contentTemplate += dividerTemplate;
                        index = cellCount;
                    }
                });
                while (index > 0 && index < cellCount) {
                    contentTemplate += `<basis-core-template-list-item-tag data-type="${key}"></basis-core-template-list-item-tag>`;
                    const incompleteRenderResult = new FaceRenderResult(null, 0, incompleteTemplate.cloneNode(true));
                    renderResults.push(incompleteRenderResult);
                    index--;
                }
                let doc;
                let layoutTemplate = yield ((_f = (_e = this.node
                    .querySelector("layout")) === null || _e === void 0 ? void 0 : _e.GetXMLTemplateToken(this.context)) === null || _f === void 0 ? void 0 : _f.getValueAsync());
                if (layoutTemplate) {
                    layoutTemplate = Util/* default.ReplaceEx */.Z.ReplaceEx(layoutTemplate, "@child", contentTemplate);
                    doc = new DocumentFragment();
                    Array.from($bc.util.toNode(layoutTemplate).firstChild.childNodes).forEach((node) => doc.appendChild(node));
                }
                else {
                    doc = $bc.util.toNode(contentTemplate);
                }
                const items = Array.from(doc.querySelectorAll(`basis-core-template-list-item-tag[data-type="${key}"]`));
                index = 0;
                renderResults.forEach((result) => {
                    const range = new Range();
                    range.selectNode(items[index++]);
                    range.deleteContents();
                    result.AppendTo(range);
                    range.detach();
                });
                retVal = this.setContentAsync(doc);
            }
            else {
                retVal = _super.createContentAsync.call(this, renderResults);
            }
            return yield retVal;
        });
    }
};
ListComponent = ListComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    ListComponent_param(0, (0,esm5/* inject */.f3)("element")),
    ListComponent_param(1, (0,esm5/* inject */.f3)("context")),
    ListComponent_param(2, (0,esm5/* inject */.f3)("container")),
    ListComponent_metadata("design:paramtypes", [Element, Object, Object])
], ListComponent);
/* harmony default export */ const renderable_ListComponent = (ListComponent);

;// CONCATENATED MODULE: ./src/component/renderable/PrintComponent.ts
var PrintComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrintComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrintComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


let PrintComponent = class PrintComponent extends RenderableComponent {
    constructor(element, context, container) {
        super(element, context, container);
    }
};
PrintComponent = PrintComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    PrintComponent_param(0, (0,esm5/* inject */.f3)("element")),
    PrintComponent_param(1, (0,esm5/* inject */.f3)("context")),
    PrintComponent_param(2, (0,esm5/* inject */.f3)("container")),
    PrintComponent_metadata("design:paramtypes", [Element, Object, Object])
], PrintComponent);
/* harmony default export */ const renderable_PrintComponent = (PrintComponent);

;// CONCATENATED MODULE: ./src/data/DataUtil.ts
class DataUtil {
    static ApplySimpleFilter(data, columnName, columnValue) {
        var retVal;
        if (typeof columnValue === "string" && columnValue.isEqual("null")) {
            retVal = data.filter((x) => x[columnName] === null);
        }
        else {
            retVal = data.filter((x) => x[columnName] == columnValue);
        }
        return retVal;
    }
    static addRowNumber(data) {
        var index = 1;
        data.forEach((row) => {
            row.rownumber = index++;
        });
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/base/TreeFaceRenderResult.ts

class TreeFaceRenderResult extends FaceRenderResult {
    constructor(key, version, element) {
        super(key, version, element);
        this.contentNodes = null;
        const childContainer = element.querySelector('basis-core-template-tag[data-type="child"]');
        if (childContainer) {
            this.contentRange = new Range();
            this.contentRange.selectNode(childContainer);
            this.contentRange.deleteContents();
        }
    }
    setContent(content) {
        var _a, _b, _c;
        if (this.contentRange) {
            const oldContentNodes = this.contentNodes;
            if ((oldContentNodes === null || oldContentNodes === void 0 ? void 0 : oldContentNodes.length) > 0) {
                this.contentRange.detach();
                this.contentRange = new Range();
                this.contentRange.setStartBefore(oldContentNodes[0]);
                this.contentRange.setEndAfter(oldContentNodes[oldContentNodes.length - 1]);
                (_a = this.contentRange) === null || _a === void 0 ? void 0 : _a.deleteContents();
            }
            if (content) {
                this.contentNodes = [...content.childNodes];
                (_b = this.contentRange) === null || _b === void 0 ? void 0 : _b.insertNode(content);
            }
            else {
                (_c = this.contentRange) === null || _c === void 0 ? void 0 : _c.deleteContents();
                this.contentNodes = null;
            }
        }
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/TreeComponent.ts
var TreeComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TreeComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TreeComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TreeComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







let TreeComponent = class TreeComponent extends RenderableComponent {
    constructor(element, context, container) {
        super(element, context, container, ["child"]);
    }
    FaceRenderResultFactory(key, version, doc) {
        return new TreeFaceRenderResult(key, version, doc);
    }
    renderDataPartAsync(dataSource, faces) {
        return TreeComponent_awaiter(this, void 0, void 0, function* () {
            const tempGeneratedNodeList = new FaceRenderResultRepository();
            if (dataSource.rows.length != 0) {
                var foreignKey = yield this.getAttributeValueAsync("parentidcol", "parentid");
                var principalKey = yield this.getAttributeValueAsync("idcol", "id");
                var nullValue = yield this.getAttributeValueAsync("nullvalue", "0");
                var rootRecords = DataUtil.ApplySimpleFilter(dataSource.rows, foreignKey, nullValue);
                if (rootRecords.length == 0) {
                    throw new Error(`Tree command has no root record in data member '${dataSource.id}' with '${nullValue}' value in '${foreignKey}' column that set in NullValue attribute.`);
                }
                var rootRenderParam = new RenderParam(dataSource, this.renderResultRepository, (key, ver, doc) => new TreeFaceRenderResult(key, ver, doc));
                var renderResultList = new Array();
                for (const row of rootRecords) {
                    const renderResult = yield this.renderLevelAsync(dataSource, rootRenderParam, 1, faces, principalKey, foreignKey, tempGeneratedNodeList, row);
                    renderResultList.push(renderResult);
                }
                return new RenderDataPartResult(renderResultList, tempGeneratedNodeList);
            }
        });
    }
    renderLevelAsync(dataSource, parentRenderParam, level, faces, principalKey, foreignKey, tempGeneratedNodeList, data) {
        return TreeComponent_awaiter(this, void 0, void 0, function* () {
            var childRenderResult = $bc.util.toNode(" ");
            const childRows = DataUtil.ApplySimpleFilter(dataSource.rows, foreignKey, data[principalKey]);
            parentRenderParam.setLevel(childRows.length != 0 ? [`${level}`] : [`${level}`, "end"]);
            const renderResult = yield faces.renderAsync(parentRenderParam, data);
            if (renderResult) {
                tempGeneratedNodeList.set(renderResult.key, renderResult);
                renderResult.setContent(null);
                if (childRows.length != 0) {
                    var newLevel = level + 1;
                    const childRenderParam = new RenderParam(dataSource, this.renderResultRepository, (key, ver, doc) => new TreeFaceRenderResult(key, ver, doc));
                    for (const row of childRows) {
                        const childResult = yield this.renderLevelAsync(dataSource, childRenderParam, newLevel, faces, principalKey, foreignKey, tempGeneratedNodeList, row);
                        childResult.AppendTo(childRenderResult);
                    }
                }
                renderResult.setContent(childRenderResult);
            }
            return renderResult;
        });
    }
};
TreeComponent = TreeComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    TreeComponent_param(0, (0,esm5/* inject */.f3)("element")),
    TreeComponent_param(1, (0,esm5/* inject */.f3)("context")),
    TreeComponent_param(2, (0,esm5/* inject */.f3)("container")),
    TreeComponent_metadata("design:paramtypes", [Element, Object, Object])
], TreeComponent);
/* harmony default export */ const renderable_TreeComponent = (TreeComponent);

// EXTERNAL MODULE: ./src/token/TokenUtil.ts + 11 modules
var TokenUtil = __webpack_require__(157);
;// CONCATENATED MODULE: ./src/component/renderable/ViewComponent.ts
var ViewComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ViewComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ViewComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ViewComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};








let ViewComponent = class ViewComponent extends RenderableComponent {
    constructor(element, context, container) {
        super(element, context, container, ["child"]);
    }
    renderDataPartAsync(dataSource, faces) {
        return ViewComponent_awaiter(this, void 0, void 0, function* () {
            const newRenderResultList = new FaceRenderResultRepository();
            if (dataSource.rows.length != 0) {
                const token = this.getAttributeToken("groupcol");
                const groupColumn = (yield TokenUtil/* default.GetValueOrSystemDefaultAsync */.Z.GetValueOrSystemDefaultAsync(token, this.context, "ViewCommand.GroupColumn")).toLowerCase();
                const groupList = dataSource.rows
                    .map((x) => x[groupColumn])
                    .filter((x, i, arr) => arr.indexOf(x) === i);
                const rootRenderParam = new RenderParam(dataSource, this.renderResultRepository, (key, ver, doc) => new TreeFaceRenderResult(key, ver, doc), "root");
                rootRenderParam.setLevel(["1"]);
                var renderResultList = new Array();
                for (const group of groupList) {
                    const childItems = DataUtil.ApplySimpleFilter(dataSource.rows, groupColumn, group);
                    const data = childItems[0];
                    const level1Result = yield faces.renderAsync(rootRenderParam, data);
                    if (level1Result) {
                        newRenderResultList.set(level1Result.key, level1Result, "root");
                        level1Result.setContent(null);
                        const childRenderParam = new RenderParam(dataSource, this.renderResultRepository, (key, ver, doc) => new TreeFaceRenderResult(key, ver, doc));
                        childRenderParam.setLevel(["2"]);
                        var childRenderResult = $bc.util.toNode(" ");
                        for (const row of childItems) {
                            const renderResult = yield faces.renderAsync(childRenderParam, row);
                            newRenderResultList.set(renderResult.key, renderResult);
                            renderResult.AppendTo(childRenderResult);
                        }
                        level1Result.setContent(childRenderResult);
                        renderResultList.push(level1Result);
                    }
                }
            }
            return new RenderDataPartResult(renderResultList, newRenderResultList);
        });
    }
};
ViewComponent = ViewComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    ViewComponent_param(0, (0,esm5/* inject */.f3)("element")),
    ViewComponent_param(1, (0,esm5/* inject */.f3)("context")),
    ViewComponent_param(2, (0,esm5/* inject */.f3)("container")),
    ViewComponent_metadata("design:paramtypes", [Element, Object, Object])
], ViewComponent);
/* harmony default export */ const renderable_ViewComponent = (ViewComponent);

// EXTERNAL MODULE: ./src/data/Data.ts
var Data = __webpack_require__(231);
;// CONCATENATED MODULE: ./src/component/source/SourceComponent.ts


class SourceComponent extends CommandComponent/* default */.Z {
    constructor(element, context) {
        super(element, context);
        this.priority = src_enum/* Priority.normal */.UL.normal;
    }
}

;// CONCATENATED MODULE: ./src/component/source/APIComponent.ts
var APIComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var APIComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var APIComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var APIComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




let APIComponent = class APIComponent extends SourceComponent {
    constructor(element, context) {
        super(element, context);
        this.urlToken = this.getAttributeToken("url");
        this.methodToken = this.getAttributeToken("method");
        this.bodyToken = this.getAttributeToken("body");
        this.nameToken = this.getAttributeToken("name");
        this.contentType = this.getAttributeToken("Content-Type");
    }
    runAsync() {
        var _a, _b, _c, _d, _e, _f;
        return APIComponent_awaiter(this, void 0, void 0, function* () {
            const method = (_b = (yield ((_a = this.methodToken) === null || _a === void 0 ? void 0 : _a.getValueAsync()))) === null || _b === void 0 ? void 0 : _b.toUpperCase();
            const url = yield ((_c = this.urlToken) === null || _c === void 0 ? void 0 : _c.getValueAsync());
            let response;
            const body = yield ((_d = this.bodyToken) === null || _d === void 0 ? void 0 : _d.getValueAsync());
            const init = {
                method: method,
                body: body,
            };
            const contentType = this.contentType
                ? yield this.contentType.getValueAsync()
                : "application/json";
            if (contentType && contentType.length > 0) {
                init.headers = {
                    "Content-Type": contentType,
                };
            }
            const request = new Request(url, init);
            if (this.onProcessingAsync) {
                const args = this.createCallbackArgument({
                    request: request,
                });
                yield this.onProcessingAsync(args);
                if (args.response) {
                    response = yield args.response;
                }
            }
            if (!response) {
                response = yield fetch(request);
            }
            let dataList;
            if (this.onProcessedAsync) {
                const args = this.createCallbackArgument({
                    request: request,
                    response: response,
                });
                yield this.onProcessedAsync(args);
                dataList = args.results;
            }
            else {
                const json = yield response.json();
                if (json === null || json === void 0 ? void 0 : json.sources) {
                    dataList = json === null || json === void 0 ? void 0 : json.sources.map((x) => new Data/* default */.Z(x.options.tableName, x.data, x.options));
                }
                else {
                    const name = (_f = (yield ((_e = this.nameToken) === null || _e === void 0 ? void 0 : _e.getValueAsync()))) !== null && _f !== void 0 ? _f : "cms.api";
                    dataList = [new Data/* default */.Z(name, json)];
                }
            }
            dataList === null || dataList === void 0 ? void 0 : dataList.forEach((data) => {
                const source = new Source/* default */.Z(data.id, data.rows, data.options);
                this.context.setSource(source);
            });
        });
    }
};
APIComponent = APIComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    APIComponent_param(0, (0,esm5/* inject */.f3)("element")),
    APIComponent_param(1, (0,esm5/* inject */.f3)("context")),
    APIComponent_metadata("design:paramtypes", [Element, Object])
], APIComponent);
/* harmony default export */ const source_APIComponent = (APIComponent);

// EXTERNAL MODULE: ./src/component/source/CallbackComponent.ts
var CallbackComponent = __webpack_require__(242);
;// CONCATENATED MODULE: ./src/component/source/base/Member.ts
var Member_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class Member {
    constructor(element, context) {
        this.context = context;
        this.element = element;
        this.name = element.getAttribute("name");
        this.previewToken = element.GetBooleanToken("preview", context);
        this.sortToken = element.GetStringToken("sort", context);
        this.postSqlToken = element.GetStringToken("postsql", context);
        this.rawContentToken = element.textContent.ToStringToken(context);
    }
    addDataSourceAsync(data, sourceId, options) {
        var _a, _b, _c;
        return Member_awaiter(this, void 0, void 0, function* () {
            var postSqlTask = (_a = this.postSqlToken) === null || _a === void 0 ? void 0 : _a.getValueAsync();
            var sortTask = (_b = this.sortToken) === null || _b === void 0 ? void 0 : _b.getValueAsync();
            var previewTask = (_c = this.previewToken) === null || _c === void 0 ? void 0 : _c.getValueAsync();
            const id = `${sourceId}.${this.name}`.toLowerCase();
            const preview = yield previewTask;
            const sort = yield sortTask;
            const postSql = yield postSqlTask;
            var lib;
            if (postSql) {
                if (!Util/* default.HasValue */.Z.HasValue(lib)) {
                    lib = yield this.context.getOrLoadDbLibAsync();
                }
                data = lib(Util/* default.ReplaceEx */.Z.ReplaceEx(postSql, `\\[${id}\\]`, "?"), [data]);
            }
            if (sort) {
                if (!Util/* default.HasValue */.Z.HasValue(lib)) {
                    lib = yield this.context.getOrLoadDbLibAsync();
                }
                data = lib(`SELECT * FROM ? order by ${sort}`, [data]);
            }
            DataUtil.addRowNumber(data);
            const source = new Source/* default */.Z(id, data, options);
            this.context.setSource(source, preview);
        });
    }
}

;// CONCATENATED MODULE: ./src/component/source/base/DbSourceMember.ts

class DbSourceMember extends Member {
    constructor(element, context) {
        super(element, context);
    }
}

// EXTERNAL MODULE: ./src/exception/ClientException.ts
var ClientException = __webpack_require__(479);
// EXTERNAL MODULE: ./src/options/connection-options/StreamPromise.ts
var StreamPromise = __webpack_require__(314);
;// CONCATENATED MODULE: ./src/component/source/MemberBaseSourceComponent.ts
var MemberBaseSourceComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class MemberBaseSourceComponent extends SourceComponent {
    constructor(element, context) {
        super(element, context);
        this.allowMultiProcess = true;
        this.members = [...this.node.querySelectorAll("member")];
    }
    initializeAsync() {
        const _super = Object.create(null, {
            initializeAsync: { get: () => super.initializeAsync }
        });
        return MemberBaseSourceComponent_awaiter(this, void 0, void 0, function* () {
            yield _super.initializeAsync.call(this);
            this.id = yield this.getAttributeValueAsync("name");
        });
    }
    runAsync() {
        return MemberBaseSourceComponent_awaiter(this, void 0, void 0, function* () {
            this.oldConnectionName = null;
            if (this.members.length > 0) {
                yield this.loadDataAsync();
            }
        });
    }
    processLoadedDataSet(dataList) {
        if (!this.disposed) {
            const memberObjList = this.members.map((memberElement) => this.convertToMemberObject(memberElement));
            if (memberObjList.length != dataList.length) {
                throw new Error(`Command '${this.id}' has ${memberObjList.length} member(s) but ${dataList.length} result(s) returned from source!`);
            }
            memberObjList.forEach((member, index) => MemberBaseSourceComponent_awaiter(this, void 0, void 0, function* () {
                const source = dataList[index];
                yield member.addDataSourceAsync(source.rows, this.id, source.options);
            }));
        }
        return !this.disposed;
    }
    loadDataAsync() {
        return MemberBaseSourceComponent_awaiter(this, void 0, void 0, function* () {
            const connectionName = yield this.getAttributeValueAsync("source");
            if (this.oldConnectionName) {
                if (this.oldConnectionName !== connectionName) {
                    throw new ClientException/* default */.Z(`Source Attribute Can't Change in Existing Context. Valid Connection Is '${this.oldConnectionName}'`);
                }
            }
            else {
                this.oldConnectionName = connectionName;
            }
            const command = this.node.outerHTML.ToStringToken(this.context);
            const params = {
                command: yield command.getValueAsync(),
                dmnid: this.context.options.getDefault("dmnid"),
            };
            const promiseObj = this.context.loadDataAsync(this.id, connectionName, params, this.processLoadedDataSet.bind(this));
            if (!(promiseObj instanceof StreamPromise/* default */.Z)) {
                yield promiseObj;
            }
        });
    }
}

;// CONCATENATED MODULE: ./src/component/source/DbSourceComponent.ts
var DbSourceComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DbSourceComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DbSourceComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



let DbSourceComponent = class DbSourceComponent extends MemberBaseSourceComponent {
    constructor(element, context) {
        super(element, context);
    }
    convertToMemberObject(element) {
        return new DbSourceMember(element, this.context);
    }
};
DbSourceComponent = DbSourceComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    DbSourceComponent_param(0, (0,esm5/* inject */.f3)("element")),
    DbSourceComponent_param(1, (0,esm5/* inject */.f3)("context")),
    DbSourceComponent_metadata("design:paramtypes", [Element, Object])
], DbSourceComponent);
/* harmony default export */ const source_DbSourceComponent = (DbSourceComponent);

;// CONCATENATED MODULE: ./src/component/user-define-component/UserDefineComponent.ts
var UserDefineComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserDefineComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserDefineComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserDefineComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



let UserDefineComponent = class UserDefineComponent extends CommandComponent/* default */.Z {
    constructor(element, context, container) {
        super(element, context);
        this.container = container;
    }
    initializeAsync() {
        const _super = Object.create(null, {
            initializeAsync: { get: () => super.initializeAsync }
        });
        return UserDefineComponent_awaiter(this, void 0, void 0, function* () {
            yield _super.initializeAsync.call(this);
            const lib = this.core.slice(this.core.indexOf(".") + 1);
            const manager = yield $bc.util.getComponentAsync(this.context, lib);
            this.manager = Reflect.construct(manager, [this]);
            if (this.manager.initializeAsync) {
                yield this.manager.initializeAsync();
            }
        });
    }
    runAsync(source) {
        return this.manager.runAsync
            ? this.manager.runAsync(source)
            : Promise.resolve();
    }
    toNode(rawHtml) {
        return $bc.util.toNode(rawHtml);
    }
    toHTMLElement(rawXml) {
        return $bc.util.toHTMLElement(rawXml);
    }
    setContent(newContent) {
        this.range.setContent(newContent);
    }
    getDefault(key, defaultValue) {
        return this.context.options.getDefault(key, defaultValue);
    }
    getSetting(key, defaultValue) {
        return this.context.options.getSetting(key, defaultValue);
    }
    setSource(sourceId, data, options, preview) {
        this.context.setAsSource(sourceId, data, options, preview);
    }
    tryToGetSource(sourceId) {
        return this.context.tryToGetSource(sourceId);
    }
    waitToGetSourceAsync(sourceId) {
        return this.context.waitToGetSourceAsync(sourceId);
    }
    processNodesAsync(nodes) {
        return UserDefineComponent_awaiter(this, void 0, void 0, function* () {
            const newCollection = this.container.resolve(ComponentCollection/* default */.Z);
            if (!this.collections) {
                this.collections = new Array();
            }
            this.collections.push(newCollection);
            yield newCollection.processNodesAsync(nodes);
            return newCollection;
        });
    }
    disposeAsync() {
        const _super = Object.create(null, {
            disposeAsync: { get: () => super.disposeAsync }
        });
        var _a;
        return UserDefineComponent_awaiter(this, void 0, void 0, function* () {
            const tasks = (_a = this.collections) === null || _a === void 0 ? void 0 : _a.map((collection) => collection.disposeAsync());
            yield Promise.all(tasks);
            return _super.disposeAsync.call(this);
        });
    }
    storeAsGlobal(data, name, prefix, postfix) {
        return $bc.util.storeAsGlobal(data, name, prefix, postfix);
    }
    getRandomName(prefix, postfix) {
        return $bc.util.getRandomName(prefix, postfix);
    }
    format(pattern, ...params) {
        return $bc.util.format(pattern, params);
    }
};
UserDefineComponent = UserDefineComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    UserDefineComponent_param(0, (0,esm5/* inject */.f3)("element")),
    UserDefineComponent_param(1, (0,esm5/* inject */.f3)("context")),
    UserDefineComponent_param(2, (0,esm5/* inject */.f3)("container")),
    UserDefineComponent_metadata("design:paramtypes", [Element, Object, Object])
], UserDefineComponent);
/* harmony default export */ const user_define_component_UserDefineComponent = (UserDefineComponent);

// EXTERNAL MODULE: ./src/context/Context.ts
var Context = __webpack_require__(294);
;// CONCATENATED MODULE: ./src/context/LocalContext.ts
var LocalContext_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LocalContext_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LocalContext_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



let LocalContext = class LocalContext extends Context/* default */.Z {
    constructor(repository, owner, options) {
        super(repository, options, owner.logger);
        this.owner = owner;
        this.handler = this.owner.onDataSourceSet.Add(this.setSourceFromOwner.bind(this));
    }
    dispose() {
        this.owner.onDataSourceSet.Remove(this.handler);
    }
    getOrLoadDbLibAsync() {
        return this.owner.getOrLoadDbLibAsync();
    }
    getOrLoadObjectAsync(object, url) {
        return this.getOrLoadObjectAsync(object, url);
    }
    loadPageAsync(pageName, parameters, method) {
        return this.owner.loadPageAsync(pageName, parameters, method);
    }
    loadDataAsync(sourceId, connectionName, parameters, onDataReceived) {
        return this.owner.loadDataAsync(sourceId, connectionName, parameters, onDataReceived);
    }
    tryToGetSource(sourceId) {
        var _a;
        return ((_a = super.tryToGetSource(sourceId)) !== null && _a !== void 0 ? _a : this.owner.tryToGetSource(sourceId));
    }
};
LocalContext = LocalContext_decorate([
    (0,esm5/* injectable */.b2)(),
    LocalContext_param(0, (0,esm5/* inject */.f3)("IContextRepository")),
    LocalContext_param(1, (0,esm5/* inject */.f3)("OwnerContext")),
    LocalContext_param(2, (0,esm5/* inject */.f3)("HostOptions")),
    LocalContext_metadata("design:paramtypes", [Object, Context/* default */.Z,
        HostOptions/* HostOptions */.G])
], LocalContext);
/* harmony default export */ const context_LocalContext = (LocalContext);

;// CONCATENATED MODULE: ./src/logger/ConsoleLogger.ts
var ConsoleLogger_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let ConsoleLogger = class ConsoleLogger {
    logSource(source) {
        console.log(source);
        console.table(source === null || source === void 0 ? void 0 : source.rows);
    }
    logError(message, exception) {
        console.error(message, exception);
    }
    logInformation(message, ...optionalParams) {
        if (optionalParams && optionalParams.length > 0) {
            console.info(message, optionalParams);
        }
        else {
            console.info(message);
        }
    }
    logWarning(message) {
        console.warn(message);
    }
};
ConsoleLogger = ConsoleLogger_decorate([
    (0,esm5/* singleton */.ri)()
], ConsoleLogger);
/* harmony default export */ const logger_ConsoleLogger = (ConsoleLogger);

// EXTERNAL MODULE: ./src/event/EventManager.ts
var EventManager = __webpack_require__(919);
;// CONCATENATED MODULE: ./src/repository/Repository.ts
var Repository_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Repository_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Repository_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



let Repository = class Repository {
    constructor(logger) {
        this.repository = new Map();
        this.eventManager = new Map();
        this.resolves = new Map();
        this.logger = logger;
    }
    tryToGet(sourceId) {
        return this.repository.get(sourceId === null || sourceId === void 0 ? void 0 : sourceId.toLowerCase());
    }
    setSourceFromOwner(source) {
        var _a;
        if (this.repository.has(source.id)) {
            this.repository.delete(source.id);
        }
        (_a = this.eventManager.get(source.id)) === null || _a === void 0 ? void 0 : _a.Trigger(source);
        this.logger.logInformation(`${source.id} Added from owner context...`);
    }
    setSourceEx(newSource) {
        const oldSource = this.repository.get(newSource.id);
        if (newSource.mergeType == src_enum/* MergeType.replace */.dx.replace) {
            if (oldSource) {
                oldSource.replace(newSource);
            }
            else {
                this.repository.set(newSource.id, newSource);
            }
        }
        else if (newSource.mergeType == src_enum/* MergeType.append */.dx.append) {
            if (oldSource) {
                //update or insert
                if (newSource.keyFieldName && oldSource.keyFieldName) {
                    newSource.rows.forEach((row) => {
                        const newRowKey = Reflect.get(row, newSource.keyFieldName);
                        const newRowStatus = newSource.statusFieldName
                            ? Reflect.get(row, newSource.statusFieldName)
                            : src_enum/* DataStatus.added */.rq.added;
                        if (newRowStatus == src_enum/* DataStatus.added */.rq.added) {
                            oldSource.addRow(row);
                        }
                        else {
                            const oldRowIndex = oldSource.rows.findIndex((x) => Reflect.get(x, oldSource.keyFieldName) == newRowKey);
                            if (oldRowIndex !== -1) {
                                if (newRowStatus == src_enum/* DataStatus.deleted */.rq.deleted) {
                                    oldSource.removeRowFormIndex(oldRowIndex);
                                }
                                else if (newRowStatus == src_enum/* DataStatus.edited */.rq.edited) {
                                    oldSource.replaceRowFromIndex(oldRowIndex, row);
                                }
                            }
                        }
                    });
                }
                else {
                    oldSource.addRows(newSource.rows);
                }
            }
            else {
                this.repository.set(newSource.id, newSource);
            }
        }
        return oldSource !== null && oldSource !== void 0 ? oldSource : newSource;
    }
    setSource(source, preview) {
        var _a;
        const resultSource = this.setSourceEx(source);
        if (preview) {
            this.logger.logSource(source);
        }
        (_a = this.eventManager.get(resultSource.id)) === null || _a === void 0 ? void 0 : _a.Trigger(resultSource);
        this.logger.logInformation(`${resultSource.id} ${source === resultSource ? "Added" : "Updated"}...`);
        return resultSource;
    }
    addHandler(sourceId, handler) {
        const key = sourceId === null || sourceId === void 0 ? void 0 : sourceId.toLowerCase();
        let handlers = this.eventManager.get(key);
        if (!handlers) {
            handlers = new EventManager/* default */.Z();
            this.eventManager.set(key, handlers);
        }
        const addedHandler = handlers.Add(handler);
        if (addedHandler) {
            this.logger.logInformation(`handler Added for ${key}...`);
        }
    }
    removeHandler(sourceId, handler) {
        const key = sourceId === null || sourceId === void 0 ? void 0 : sourceId.toLowerCase();
        let handlers = this.eventManager.get(key);
        if (handlers) {
            const removedHandler = handlers.Remove(handler);
            if (removedHandler) {
                this.logger.logInformation(`handler removed for ${key}...`);
            }
        }
    }
    waitToGetAsync(sourceId) {
        return new Promise((resolve) => {
            sourceId = sourceId === null || sourceId === void 0 ? void 0 : sourceId.toLowerCase();
            this.logger.logInformation(`wait for ${sourceId}`);
            let handler = this.resolves.get(sourceId);
            if (!handler) {
                handler = new EventManager/* default */.Z();
                this.resolves.set(sourceId, handler);
            }
            handler.Add(resolve);
        });
    }
};
Repository = Repository_decorate([
    (0,esm5/* injectable */.b2)(),
    Repository_param(0, (0,esm5/* inject */.f3)("ILogger")),
    Repository_metadata("design:paramtypes", [Object])
], Repository);
/* harmony default export */ const repository_Repository = (Repository);

;// CONCATENATED MODULE: ./src/component/renderable/schema-list/SchemaFace.ts
var SchemaFace_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class SchemaFaceCollection {
    constructor(element, context) {
        this._faces = Array.from(element.querySelectorAll("face")).map((x) => new SchemaFace(x, context));
    }
    getValueAsync(data) {
        return SchemaFace_awaiter(this, void 0, void 0, function* () {
            let retVal = null;
            for (const item of data) {
                for (const face of this._faces) {
                    const result = yield face.tryGetValueAsync(item);
                    if (result) {
                        retVal += result;
                        break;
                    }
                }
            }
            return retVal;
        });
    }
}
class SchemaFace {
    constructor(element, context) {
        var _a;
        this._schemaIdList = (_a = element.getAttribute("schemaIds")) === null || _a === void 0 ? void 0 : _a.split(" ");
        const template = element.getTemplate();
        this._template = new ContentTemplate(context, template, null);
    }
    tryGetValueAsync(data) {
        return !this._schemaIdList ||
            this._schemaIdList.indexOf(data.schemaId) != -1
            ? this._template.getValueAsync(data)
            : null;
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/schema-list/SourceMaker.ts
var SourceMaker_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class SourceMaker {
    static makeAsync(answers, schemaUrl) {
        return SourceMaker_awaiter(this, void 0, void 0, function* () {
            const retVal = new Array();
            const url = Util/* default.formatUrl */.Z.formatUrl(schemaUrl, null, {
                id: answers.schemaId,
                ver: answers.schemaVersion,
                lid: answers.lid,
            });
            const response = yield Util/* default.getDataAsync */.Z.getDataAsync(url);
            const schema = response.sources[0].data[0];
            schema.questions.forEach((question) => {
                const answer = answers === null || answers === void 0 ? void 0 : answers.properties.find((x) => x.prpId == question.prpId);
                const item = {
                    schemaId: null,
                    prpId: question.prpId,
                    typeId: question.typeId,
                    title: question.title,
                    answers: answer.answers.map((x) => x.parts.map((x) => x.values.map((x) => x.value))),
                };
                retVal.push(item);
            });
            return retVal;
        });
    }
}

;// CONCATENATED MODULE: ./src/component/renderable/schema-list/SchemaListComponent.ts
var SchemaListComponent_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SchemaListComponent_metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SchemaListComponent_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SchemaListComponent_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




let SchemaListComponent = class SchemaListComponent extends SourceBaseComponent {
    constructor(element, context) {
        super(element, context);
    }
    initializeAsync() {
        const _super = Object.create(null, {
            initializeAsync: { get: () => super.initializeAsync }
        });
        return SchemaListComponent_awaiter(this, void 0, void 0, function* () {
            yield _super.initializeAsync.call(this);
            this.urlToken = this.getAttributeToken("schemaUrl");
            this._faces = new SchemaFaceCollection(this.node, this.context);
            console.log(this._faces);
        });
    }
    renderSourceAsync(dataSource) {
        return SchemaListComponent_awaiter(this, void 0, void 0, function* () {
            if (dataSource) {
                const answers = dataSource.rows;
                answers.forEach(this.renderAnswerAsync.bind(this));
            }
        });
    }
    renderAnswerAsync(answer) {
        var _a;
        return SchemaListComponent_awaiter(this, void 0, void 0, function* () {
            const urlStr = yield ((_a = this.urlToken) === null || _a === void 0 ? void 0 : _a.getValueAsync());
            const source = yield SourceMaker.makeAsync(answer, urlStr);
            console.log(source);
            source.forEach((item) => {
                const div = document.createElement("div");
                div.appendChild(document.createTextNode(item.title));
                this.setContent(div, true);
            });
            this._faces;
        });
    }
};
SchemaListComponent = SchemaListComponent_decorate([
    (0,esm5/* injectable */.b2)(),
    SchemaListComponent_param(0, (0,esm5/* inject */.f3)("element")),
    SchemaListComponent_param(1, (0,esm5/* inject */.f3)("context")),
    SchemaListComponent_metadata("design:paramtypes", [Element, Object])
], SchemaListComponent);


;// CONCATENATED MODULE: ./src/tsyringe.config.ts
//https://github.com/microsoft/tsyringe#example-with-interfaces























esm5/* container.register */.nC.register("IBasisCore", { useToken: src_BasisCore });
esm5/* container.register */.nC.register("ILogger", { useToken: logger_ConsoleLogger });
esm5/* container.register */.nC.register("IContextRepository", { useToken: repository_Repository });
esm5/* container.register */.nC.register("ILocalContext", { useToken: context_LocalContext });
esm5/* container.register */.nC.register("print", { useToken: renderable_PrintComponent });
esm5/* container.register */.nC.register("tree", { useToken: renderable_TreeComponent });
esm5/* container.register */.nC.register("view", { useToken: renderable_ViewComponent });
esm5/* container.register */.nC.register("list", { useToken: renderable_ListComponent });
esm5/* container.register */.nC.register("list", { useToken: renderable_ListComponent });
esm5/* container.register */.nC.register("schemalist", { useToken: SchemaListComponent });
esm5/* container.register */.nC.register("cookie", { useToken: management_CookieComponent });
esm5/* container.register */.nC.register("call", { useToken: collection_CallComponent });
esm5/* container.register */.nC.register("group", { useToken: GroupComponent/* default */.Z });
esm5/* container.register */.nC.register("repeater", { useToken: collection_RepeaterComponent });
esm5/* container.register */.nC.register("callback", { useToken: CallbackComponent/* default */.Z });
esm5/* container.register */.nC.register("dbsource", { useToken: source_DbSourceComponent });
esm5/* container.register */.nC.register("input", { useToken: html_element_HTMLInputComponent });
esm5/* container.register */.nC.register("select", { useToken: html_element_HTMLSelectComponent });
esm5/* container.register */.nC.register("form", { useToken: html_element_HTMLFormComponent });
esm5/* container.register */.nC.register("unknown-html", { useToken: html_element_HTMLIUnknownComponent });
esm5/* container.register */.nC.register("api", { useToken: source_APIComponent });
esm5/* container.register */.nC.register("component", { useToken: user_define_component_UserDefineComponent });

// EXTERNAL MODULE: ./src/extension/StringExtensions.ts
var StringExtensions = __webpack_require__(570);
;// CONCATENATED MODULE: ./src/extension/ElementExtensions.ts

Object.defineProperty(Element.prototype, "GetObjectToken", {
    value: function GetObjectToken(attributeName, context) {
        var retVal;
        var tmp = this.getAttribute(attributeName);
        if (tmp) {
            retVal = tmp.ToObjectToken(context);
        }
        return retVal;
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(Element.prototype, "GetStringToken", {
    value: function GetStringToken(attributeName, context) {
        var retVal;
        var tmp = this.getAttribute(attributeName);
        if (tmp) {
            retVal = tmp.ToStringToken(context);
        }
        return retVal;
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(Element.prototype, "GetIntegerToken", {
    value: function GetIntegerToken(attributeName, context) {
        var retVal;
        var tmp = this.getAttribute(attributeName);
        if (tmp) {
            retVal = tmp.ToIntegerToken(context);
        }
        return retVal;
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(Element.prototype, "GetBooleanToken", {
    value: function GetBooleanToken(attributeName, context) {
        var retVal;
        var tmp = this.getAttribute(attributeName);
        if (tmp) {
            retVal = tmp.ToBooleanToken(context);
        }
        return retVal;
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(Element.prototype, "GetTemplateToken", {
    value: function GetTemplateToken(context) {
        var retVal;
        if (this.children.length == 1 &&
            Util/* default.isEqual */.Z.isEqual(this.children[0].nodeName, "script") &&
            Util/* default.isEqual */.Z.isEqual(this.children[0].getAttribute("type"), "text/template")) {
            retVal = this.textContent.ToStringToken(context);
        }
        else {
            retVal = this.innerHTML.ToStringToken(context);
        }
        return retVal;
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(Element.prototype, "getTemplate", {
    value: function getTemplate() {
        var retVal;
        if (this.children.length == 1 &&
            Util/* default.isEqual */.Z.isEqual(this.children[0].nodeName, "script") &&
            Util/* default.isEqual */.Z.isEqual(this.children[0].getAttribute("type"), "text/template")) {
            retVal = this.textContent;
        }
        else {
            retVal = this.innerHTML;
        }
        return retVal;
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(Element.prototype, "GetXMLTemplateToken", {
    value: function GetXMLTemplateToken(context) {
        var retVal;
        if (this.children.length == 1 &&
            Util/* default.isEqual */.Z.isEqual(this.children[0].nodeName, "script") &&
            Util/* default.isEqual */.Z.isEqual(this.children[0].getAttribute("type"), "text/template")) {
            retVal = this.children[0].outerHTML.ToStringToken(context);
        }
        else {
            retVal =
                `<basis-core-template-tag>${this.innerHTML}</basis-core-template-tag>`.ToStringToken(context);
        }
        return retVal;
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(Element.prototype, "getXMLTemplate", {
    value: function getXMLTemplate() {
        var retVal;
        if (this.children.length == 1 &&
            Util/* default.isEqual */.Z.isEqual(this.children[0].nodeName, "script") &&
            Util/* default.isEqual */.Z.isEqual(this.children[0].getAttribute("type"), "text/template")) {
            retVal = this.children[0].outerHTML;
        }
        else {
            retVal = `<basis-core-template-tag>${this.innerHTML}</basis-core-template-tag>`;
        }
        return retVal;
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(Element.prototype, "isBasisCore", {
    value: function isBasisCore() {
        try {
            return (this.nodeType == Node.ELEMENT_NODE &&
                this.nodeName == "BASIS" &&
                Util/* default.isEqual */.Z.isEqual(this.getAttribute("run"), "atclient"));
        }
        catch (_a) {
            return false;
        }
    },
    writable: true,
    configurable: true,
});
Object.defineProperty(Element.prototype, "isBasisTag", {
    value: function isBasisTag() {
        try {
            return (this.nodeType == Node.ELEMENT_NODE && this.hasAttribute("bc-triggers"));
        }
        catch (_a) {
            return false;
        }
    },
    writable: true,
    configurable: true,
});

;// CONCATENATED MODULE: ./src/repository/LocalDataBase.ts
var LocalDataBase_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class LocalDataBase {
    constructor(databaseName, getSchemas) {
        this._getSchemas = getSchemas;
        this._dataBaseName = databaseName;
    }
    dropAsync() {
        return LocalDataBase_awaiter(this, void 0, void 0, function* () {
            var affected = yield this.executeAsync(`DROP localStorage DATABASE ${this._dataBaseName}`);
            this._db = null;
            return affected == 1;
        });
    }
    executeAsync(sql, params) {
        return LocalDataBase_awaiter(this, void 0, void 0, function* () {
            if (!this._db) {
                yield this.InitializeAsync();
            }
            return yield new Promise((resolve) => this._db.exec(sql, params, (x) => resolve(x)));
        });
    }
    executeAsTableAsync(sql, params) {
        return LocalDataBase_awaiter(this, void 0, void 0, function* () {
            var data = yield this.executeAsync(sql, params);
            var cols;
            if (data.length > 0) {
                cols = Object.getOwnPropertyNames(data[0]);
            }
            else {
                cols = [];
            }
            var rows = [];
            data.forEach((row) => rows.push(cols.map((col) => row[col])));
            var retVal = [cols, ...rows];
            return retVal;
        });
    }
    InitializeAsync() {
        return LocalDataBase_awaiter(this, void 0, void 0, function* () {
            if (!this._db) {
                var lib = alasql;
                var create = lib.exec(`CREATE localStorage DATABASE IF NOT EXISTS ${this._dataBaseName}`);
                lib.exec(`ATTACH localStorage DATABASE ${this._dataBaseName}`);
                this._db = lib.databases[this._dataBaseName];
                if (create == 1) {
                    for (let [tblName, schema] of this._getSchemas().entries()) {
                        var tmp = Object.getOwnPropertyNames(schema).map((columnName) => `${columnName} ${schema[columnName]}`);
                        var cols = tmp.join(",");
                        yield this.executeAsync(`CREATE TABLE IF NOT EXISTS ${tblName} (${cols})`);
                    }
                }
            }
        });
    }
}

// EXTERNAL MODULE: ./src/wrapper/UtilWrapper.ts
var UtilWrapper = __webpack_require__(835);
;// CONCATENATED MODULE: ./src/wrapper/BCWrapper.ts



class BCWrapper {
    constructor() {
        this.elementList = null;
        this.hostSetting = null;
        this._basiscore = null;
        this.manager = new EventManager/* default */.Z();
    }
    get basiscore() {
        return this._basiscore;
    }
    addFragment(param) {
        if (this._basiscore) {
            throw new ClientException/* default */.Z("Can't add fragment for already builded bc object.");
        }
        else {
            if (!this.elementList) {
                this.elementList = new Array();
            }
            if (typeof param === "string") {
                const newElements = document.querySelectorAll(param);
                if (newElements.length === 0) {
                    console.warn(`Selector '${param}' don't refer to any element(s).`);
                }
                else {
                    this.elementList.push(...newElements);
                }
            }
            else if (param instanceof Element) {
                this.elementList.push(param);
            }
            else {
                throw new ClientException/* default */.Z("Invalid selector");
            }
            return this;
        }
    }
    setOptions(options) {
        if (this._basiscore) {
            throw new ClientException/* default */.Z("Can't set option for already builded bc object.");
        }
        this.hostSetting = options;
        return this;
    }
    run() {
        var _a, _b;
        if (((_a = this.elementList) === null || _a === void 0 ? void 0 : _a.length) == 0) {
            throw new ClientException/* default */.Z("No element(s) selected for start rendering!");
        }
        if (!this._basiscore) {
            const childContainer = esm5/* container.createChildContainer */.nC.createChildContainer();
            childContainer.register("IHostOptions", {
                useValue: (_b = this.hostSetting) !== null && _b !== void 0 ? _b : {},
            });
            if (!this.elementList) {
                this.addFragment(document.documentElement);
            }
            childContainer.register("root.nodes", {
                useValue: this.elementList,
            });
            childContainer.register("container", { useValue: childContainer });
            this._basiscore = childContainer.resolve("IBasisCore");
            this.manager.Trigger(this._basiscore);
        }
        return this;
    }
    setSource(sourceId, data, options) {
        if (!this._basiscore) {
            this.run();
        }
        else {
            this._basiscore.setSource(sourceId, data, options);
        }
        return this;
    }
}

;// CONCATENATED MODULE: ./src/wrapper/BCWrapperFactory.ts


class BCWrapperFactory {
    constructor() {
        this.all = new Array();
        this.util = new UtilWrapper/* default */.Z();
    }
    get global() {
        var _a;
        return (_a = this._global) !== null && _a !== void 0 ? _a : (this._global = this.new());
    }
    addFragment(param) {
        return this.global.addFragment(param);
    }
    setOptions(options) {
        return this.global.setOptions(options);
    }
    run() {
        return this.global.run();
    }
    setSource(sourceId, data, options) {
        return this.run().setSource(sourceId, data, options);
    }
    new() {
        var retVal = new BCWrapper();
        this.all.push(retVal);
        return retVal;
    }
}

;// CONCATENATED MODULE: ./src/index.ts







console.log(`%cWelcome To BasisCore Ecosystem%c
follow us on https://BasisCore.com/
version:2.4.3`, " background: yellow;color: #0078C1; font-size: 2rem; font-family: Arial; font-weight: bolder", "color: #0078C1; font-size: 1rem; font-family: Arial;");
const src_$bc = new BCWrapperFactory();
window.LocalDataBase = LocalDataBase;
__webpack_require__.g.$bc = src_$bc;
window.MergeType = src_enum/* MergeType */.dx;
const loadListener = (_) => {
    window.removeEventListener("load", loadListener);
    if (src_$bc.all.length == 0 && HostOptions/* HostOptions.defaultSettings.autoRender */.G.defaultSettings.autoRender) {
        src_$bc.run();
    }
};
window.addEventListener("load", loadListener);

})();

/******/ })()
;
//# sourceMappingURL=basiscore.js.map