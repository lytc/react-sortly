"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convert = convert;
exports.buildTree = buildTree;
exports.flatten = flatten;
exports.findDescendants = findDescendants;
exports.increaseTreeItem = increaseTreeItem;
exports.decreaseTreeItem = decreaseTreeItem;
exports.moveTreeItem = moveTreeItem;
exports.add = add;
exports.insert = insert;
exports.remove = remove;

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.from");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.array.find");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.sort");

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Convert the raw item list to the Sortly item list
 * @param {Array} items The raw item list
 * @param {Number|String} parentId The parentId value
 * @param {Array} path The parent path
 * @return {Array}
 */
function convert(items, parentId) {
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var result = items.filter(function (item) {
    if (parentId === undefined) {
      return !item.parentId;
    }

    return item.parentId === parentId;
  }).sort(function (a, b) {
    return a.index - b.index;
  }).map(function (item) {
    var index = item.index,
        parent = item.parentId,
        data = _objectWithoutProperties(item, ["index", "parentId"]);

    return _objectSpread({}, data, {
      path: _toConsumableArray(path)
    });
  });

  _toConsumableArray(result).forEach(function (item) {
    var children = convert(items, item.id, _toConsumableArray(path).concat([item.id]));
    result.splice.apply(result, [result.indexOf(item) + 1, 0].concat(_toConsumableArray(children)));
  });

  return result;
}
/**
 * Convert the Sortly item list to the tree struct
 * @param {Array} items The Sortly item list
 * @return {Array}
 */


function buildTree(items) {
  var buildItem = function buildItem(item) {
    var path = item.path,
        data = _objectWithoutProperties(item, ["path"]);

    return _objectSpread({}, data, {
      children: items.filter(function (child) {
        return child.path[child.path.length - 1] === item.id;
      }).map(function (child) {
        return buildItem(child);
      })
    });
  };

  var tree = items.filter(function (item) {
    return item.path.length === 0;
  }).map(function (item) {
    return buildItem(item);
  });
  return tree;
}
/**
 * Convert the Sortly item list to the raw item list
 * Useful when you want to convert the item list to store into database
 * @param {Array} items The Sortly item list
 * @param {String} parentIdPropName The parent id property name. Default to "parentId"
 * @param {String} indexPropName The index property name. Default to "index"
 * @return {Array}
 */


function flatten(items) {
  var parentIdPropName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'parentId';
  var indexPropName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'index';
  var indexSeq = {};
  return items.map(function (item) {
    var _objectSpread2;

    var path = item.path,
        data = _objectWithoutProperties(item, ["path"]);

    var pathAsString = path.join('.');

    if (indexSeq[pathAsString] === undefined) {
      indexSeq[pathAsString] = 0;
    } else {
      indexSeq[pathAsString] += 1;
    }

    return _objectSpread({}, data, (_objectSpread2 = {}, _defineProperty(_objectSpread2, parentIdPropName, _toConsumableArray(path).pop() || 0), _defineProperty(_objectSpread2, indexPropName, indexSeq[pathAsString]), _objectSpread2));
  });
}
/**
 * Find item descendants
 * @param {Array} items The item list
 * @param {Number} index The item position
 * @return {Array.<{path: Array.<number|string>}>}
 */


function findDescendants(items, index) {
  var id = items[index].id;
  return items.filter(function (_ref) {
    var path = _ref.path;
    return path.indexOf(id) !== -1;
  });
}
/**
 * Increase the tree item to 1 level depth
 * @param {Array} items The item list
 * @param {Number} itemIndex The position of the item to increase
 * @return {null|Object}
 */


function increaseTreeItem(items, itemIndex) {
  var updateFn = {};
  var item = items[itemIndex];
  var id = item.id; // Don't allow to increase if it's root

  if (item.path.length === 0) {
    return null;
  } // Can't increase if it have next siblings


  var nextSiblingItem = items.find(function (siblingItem, index) {
    return index > itemIndex && siblingItem.path.join('.') === item.path.join('.');
  });

  if (nextSiblingItem) {
    return null;
  } // It should have the path same as it parent


  var newPath = item.path.slice(0, -1); // update drag item path

  updateFn[itemIndex] = {
    path: {
      $set: newPath
    }
  }; // also needs to update it descendants path

  var descendants = findDescendants(items, itemIndex);
  descendants.forEach(function (descendantItem) {
    updateFn[items.indexOf(descendantItem)] = {
      path: {
        $splice: [[0, descendantItem.path.indexOf(id)].concat(_toConsumableArray(newPath))]
      }
    };
  });
  return updateFn;
}
/**
 * Decrease the tree item to 1 level depth
 * @param {Array} items The item list
 * @param {Number} itemIndex The position of the item to decrease
 * @return {null|Object}
 */


function decreaseTreeItem(items, itemIndex) {
  var updateFn = {};
  var item = items[itemIndex];
  var id = item.id; // Can't decrease if it don't have prev sibling

  var prevSiblingItem = items.filter(function (siblingItem, index) {
    return index < itemIndex && siblingItem.path.join('.') === item.path.join('.');
  }).pop();

  if (!prevSiblingItem) {
    return null;
  }

  var newPath = _toConsumableArray(prevSiblingItem.path).concat([prevSiblingItem.id]); // update drag item path


  updateFn[itemIndex] = {
    path: {
      $set: newPath
    }
  }; // also needs to update it descendants path

  var descendants = findDescendants(items, itemIndex);
  descendants.forEach(function (descendantItem) {
    updateFn[items.indexOf(descendantItem)] = {
      path: {
        $splice: [[0, descendantItem.path.indexOf(id)].concat(_toConsumableArray(newPath))]
      }
    };
  });
  return updateFn;
}
/**
 * Move an item to a new position
 * @param {Array} items The item list
 * @param {Number} sourceIndex The current position of the item to move
 * @param {Number} targetIndex The new position of the item to move
 * @return {{updateFn: {}, newIndex: number}}
 */


function moveTreeItem(items, sourceIndex, targetIndex) {
  var sourceItem = items[sourceIndex];
  var targetItem = items[targetIndex];
  var _sourceItem = sourceItem,
      dragId = _sourceItem.id;
  var descendants = findDescendants(items, sourceIndex);
  var updateFn = {}; // update drag item path

  var newPath = _toConsumableArray(targetItem.path);

  sourceItem = (0, _immutabilityHelper.default)(sourceItem, {
    path: {
      $set: newPath
    }
  }); // update descendants path

  descendants = descendants.map(function (descendantItem) {
    return (0, _immutabilityHelper.default)(descendantItem, {
      path: {
        $set: (0, _immutabilityHelper.default)(descendantItem.path, {
          $splice: [[0, descendantItem.path.indexOf(dragId)].concat(_toConsumableArray(newPath))]
        })
      }
    });
  });
  var newIndex = targetIndex; // move up

  if (sourceIndex > targetIndex) {
    updateFn.$splice = [// remove it and descendants from the list
    [sourceIndex, 1 + descendants.length], // insert drag item and it descendants to the new position
    [targetIndex, 0, sourceItem].concat(_toConsumableArray(descendants))];
  } else {
    // move down
    var hoverDescendants = findDescendants(items, targetIndex);
    newIndex = targetIndex + hoverDescendants.length - descendants.length;
    updateFn.$splice = [// remove it and descendants from the list
    [sourceIndex, 1 + descendants.length], // insert drag item and it descendants to the new position
    [newIndex, 0, sourceItem].concat(_toConsumableArray(descendants))];
  }

  return {
    updateFn: updateFn,
    newIndex: newIndex
  };
}
/**
 * Add a new item to the bottom of the list
 * @param {Array} items The item list
 * @param {Object} itemData The item data
 * @return {Array}
 */


function add(items, itemData) {
  var item = _objectSpread({}, itemData, {
    path: []
  });

  return (0, _immutabilityHelper.default)(items, {
    $push: [item]
  });
}
/**
 * Insert a new item to the list
 * @param {Array} items The item list
 * @param {Number} targetIndex The position to insert into
 * @param {Object} itemData The item data
 * @return {Array}
 */


function insert(items, targetIndex, itemData) {
  var currentItemAtIndex = items[targetIndex];
  var currentItemDescendants = findDescendants(items, targetIndex);

  var path = _toConsumableArray(currentItemAtIndex.path);

  var newItem = _objectSpread({}, itemData, {
    path: path
  });

  return (0, _immutabilityHelper.default)(items, {
    $splice: [[targetIndex + currentItemDescendants.length + 1, 0, newItem]]
  });
}
/**
 * Remove an item and it descendants from the list
 * @param {Array} items The item list
 * @param {Number} index The item index
 * @return {Array}
 */


function remove(items, index) {
  var descendants = findDescendants(items, index);
  return (0, _immutabilityHelper.default)(items, {
    $splice: [[index, 1 + descendants.length]]
  });
}
//# sourceMappingURL=utils.js.map