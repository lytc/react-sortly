"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.from");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/web.dom.iterable");

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

var _reactDnd = require("react-dnd");

var _utils = require("./utils");

var _Item = _interopRequireDefault(require("./Item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_TYPE = 'REACT_SORTLY';
var reduceOffset = 0;

var noop = function noop() {};

var Sortly =
/*#__PURE__*/
function (_Component) {
  _inherits(Sortly, _Component);

  function Sortly() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Sortly);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Sortly)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      items: _this.props.items,
      draggingDescendants: {}
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleDragStart", function (dragIndex) {
      _this.props.onDragStart(dragIndex); // Don't allow to drop to it descendants


      var items = _this.state.items;
      _this.originalItems = items;
      var descendants = (0, _utils.findDescendants)(items, dragIndex);

      if (descendants.length > 0) {
        var draggingDescendants = {};
        descendants.forEach(function (_ref) {
          var id = _ref.id;
          draggingDescendants[id] = true;
        });

        _this.setState({
          draggingDescendants: draggingDescendants
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleDragEnd", function (dragIndex, didDrop) {
      var _this$props = _this.props,
          cancelOnDropOutside = _this$props.cancelOnDropOutside,
          ondDragEnd = _this$props.ondDragEnd,
          monitor = _this$props.monitor;
      ondDragEnd(dragIndex, didDrop);
      reduceOffset = 0;

      _this.setState({
        draggingDescendants: {}
      });

      if (cancelOnDropOutside) {
        if (!monitor.didDrop()) {
          // restore
          _this.setState({
            items: _this.originalItems
          });

          _this.originalItems = null;
        } else {
          _this.change();
        }
      } else {
        _this.change();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleMove", function (dragIndex, hoverIndex, offsetX) {
      var items = _this.state.items;
      var updateFn;
      var newIndex;

      if (dragIndex === hoverIndex) {
        var _this$props2 = _this.props,
            threshold = _this$props2.threshold,
            maxDepth = _this$props2.maxDepth; // Check that if it move horizontally

        if (Math.abs(offsetX + reduceOffset) < threshold) {
          return null;
        } // Move to the right, meaning decrease horizontal level
        // It now is a child of it previous sibling


        if (offsetX > 0) {
          // maxDepth check
          if (maxDepth < Infinity && [items[dragIndex]].concat(_toConsumableArray((0, _utils.findDescendants)(items, dragIndex))).some(function (_ref2) {
            var path = _ref2.path;
            return path.length >= maxDepth;
          })) {
            return null;
          }

          updateFn = (0, _utils.decreaseTreeItem)(items, dragIndex);

          if (!updateFn) {
            return null;
          }

          reduceOffset -= threshold;
        } else {
          // Move to the left, meaning increase horizontal level
          updateFn = (0, _utils.increaseTreeItem)(items, dragIndex);

          if (!updateFn) {
            return null;
          }

          reduceOffset += threshold;
        }

        newIndex = hoverIndex;
      } else {
        var result = (0, _utils.moveTreeItem)(items, dragIndex, hoverIndex);
        updateFn = result.updateFn; // eslint-disable-line prefer-destructuring

        newIndex = result.newIndex; // eslint-disable-line prefer-destructuring
      }

      var newState = (0, _immutabilityHelper.default)(_this.state, {
        items: updateFn
      });

      if (_this.props.onMove) {
        var _result = _this.props.onMove(newState.items, dragIndex, newIndex);

        if (!_result) {
          return null;
        }

        if (_result !== true) {
          newState.items = _result;
        }
      }

      _this.setState(newState);

      return newIndex;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleEnter", function () {});

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleLeave", function () {
      var _this$props3 = _this.props,
          cancelOnDragOutside = _this$props3.cancelOnDragOutside,
          monitor = _this$props3.monitor;

      if (cancelOnDragOutside && !monitor.didDrop()) {
        var dragData = monitor.getItem();
        dragData.index = dragData.originalIndex;

        _this.setState({
          items: _this.originalItems
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleDrop", function (dragIndex, dropIndex) {
      _this.props.onDrop(dragIndex, dropIndex);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "change", function () {
      _this.props.onChange(_this.state.items);
    });

    return _this;
  }

  _createClass(Sortly, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.items !== this.props.items) {
        this.setState({
          items: nextProps.items
        });
      }

      if (nextProps.isOver !== this.props.isOver) {
        if (nextProps.isOver) {
          this.handleEnter();
        } else {
          this.handleLeave();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props4 = this.props,
          type = _this$props4.type,
          Comp = _this$props4.component,
          itemRenderer = _this$props4.itemRenderer,
          connectDropTarget = _this$props4.connectDropTarget;
      var _this$state = this.state,
          items = _this$state.items,
          draggingDescendants = _this$state.draggingDescendants;
      return connectDropTarget(_react.default.createElement(Comp, null, items.map(function (item, index) {
        return _react.default.createElement(_Item.default, _extends({}, item, {
          key: item.id,
          __dndType: type,
          index: index,
          renderer: itemRenderer,
          isClosestDragging: draggingDescendants[item.id] === true,
          onDragStart: _this2.handleDragStart,
          onDragEnd: _this2.handleDragEnd,
          onMove: _this2.handleMove,
          onDrop: _this2.handleDrop
        }));
      })));
    }
  }]);

  return Sortly;
}(_react.Component);

_defineProperty(Sortly, "propTypes", {
  type: _propTypes.default.string.isRequired,
  component: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
  items: _propTypes.default.arrayOf(_propTypes.default.shape({
    path: _propTypes.default.array.isRequired
  })).isRequired,
  itemRenderer: _propTypes.default.func.isRequired,
  threshold: _propTypes.default.number,
  maxDepth: _propTypes.default.number,
  cancelOnDragOutside: _propTypes.default.bool,
  cancelOnDropOutside: _propTypes.default.bool,
  onMove: _propTypes.default.func,
  onDragStart: _propTypes.default.func,
  ondDragEnd: _propTypes.default.func,
  onDrop: _propTypes.default.func,
  monitor: _propTypes.default.shape({
    getItem: _propTypes.default.func.isRequired
  }).isRequired,
  isOver: _propTypes.default.bool.isRequired,
  connectDropTarget: _propTypes.default.func.isRequired,
  onChange: _propTypes.default.func.isRequired
});

_defineProperty(Sortly, "defaultProps", {
  component: 'div',
  threshold: 20,
  maxDepth: Infinity,
  cancelOnDragOutside: false,
  cancelOnDropOutside: false,
  onMove: null,
  onDragStart: noop,
  ondDragEnd: noop,
  onDrop: noop
});

var spec = {};

var collect = function collect(connect, monitor) {
  return {
    monitor: monitor,
    isOver: monitor.isOver(),
    connectDropTarget: connect.dropTarget()
  };
};

var WithDropTarget = (0, _reactDnd.DropTarget)(function (props) {
  return props.type;
}, spec, collect)(Sortly);
WithDropTarget.defaultProps = {
  type: DEFAULT_TYPE
};
var _default = WithDropTarget;
exports.default = _default;
//# sourceMappingURL=Sortly.js.map