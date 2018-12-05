"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.object.set-prototype-of");

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDnd = require("react-dnd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Item =
/*#__PURE__*/
function (_Component) {
  _inherits(Item, _Component);

  function Item() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Item);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Item)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleHover", function () {
      var _this$props = _this.props,
          hoverIndex = _this$props.index,
          maxDepth = _this$props.maxDepth,
          isClosestDragging = _this$props.isClosestDragging,
          onMove = _this$props.onMove,
          dropTargetMonitor = _this$props.dropTargetMonitor;

      if (!isClosestDragging) {
        var dragItem = dropTargetMonitor.getItem();
        var dragIndex = dragItem.index;

        if (maxDepth !== 0 || dragIndex !== hoverIndex) {
          // Determine mouse position
          var initialOffset = dropTargetMonitor.getDifferenceFromInitialOffset(); // Time to actually perform the action

          var dragNewIndex = onMove(dragIndex, hoverIndex, initialOffset.x); // Note: we're mutating the monitor item here!
          // Generally it's better to avoid mutations,
          // but it's good here for the sake of performance
          // to avoid expensive index searches.

          if (dragNewIndex !== null) {
            var item = dropTargetMonitor.getItem();
            item.index = dragNewIndex;
          }
        }
      }

      _this.reqAnimationFrameId = window.requestAnimationFrame(_this.handleHover);
    });

    return _this;
  }

  _createClass(Item, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var isOver = this.props.isOver;

      if (nextProps.isOver !== isOver) {
        if (nextProps.isOver) {
          this.reqAnimationFrameId = window.requestAnimationFrame(this.handleHover);
        } else {
          window.cancelAnimationFrame(this.reqAnimationFrameId);
          this.reqAnimationFrameId = null;
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.reqAnimationFrameId) {
        window.cancelAnimationFrame(this.reqAnimationFrameId);
        this.reqAnimationFrameId = null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          Renderer = _this$props2.renderer,
          onDragStart = _this$props2.onDragStart,
          onDragEnd = _this$props2.onDragEnd,
          onMove = _this$props2.onMove,
          onDrop = _this$props2.onDrop,
          dropTargetMonitor = _this$props2.dropTargetMonitor,
          isOver = _this$props2.isOver,
          props = _objectWithoutProperties(_this$props2, ["renderer", "onDragStart", "onDragEnd", "onMove", "onDrop", "dropTargetMonitor", "isOver"]);

      return _react.default.createElement(Renderer, props);
    }
  }]);

  return Item;
}(_react.Component);

_defineProperty(Item, "propTypes", {
  renderer: _propTypes.default.func.isRequired,
  onDragStart: _propTypes.default.func.isRequired,
  onDragEnd: _propTypes.default.func.isRequired,
  onMove: _propTypes.default.func.isRequired,
  onDrop: _propTypes.default.func.isRequired,
  isOver: _propTypes.default.bool.isRequired,
  dropTargetMonitor: _propTypes.default.shape({
    getItem: _propTypes.default.func.isRequired,
    getDifferenceFromInitialOffset: _propTypes.default.func.isRequired
  }).isRequired
});

var itemTarget = {
  drop: function drop(props, monitor) {
    if (!monitor.didDrop()) {
      var dragItem = monitor.getItem();
      var dragIndex = dragItem.index;
      var dropIndex = props.index;
      props.onDrop(dragIndex, dropIndex);
    }
  }
};

var dropCollect = function dropCollect(connect, monitor) {
  return {
    dropTargetMonitor: monitor,
    isOver: monitor.isOver(),
    connectDropTarget: connect.dropTarget()
  };
};

var itemSource = {
  beginDrag: function beginDrag(props) {
    var index = props.index,
        id = props.id;
    props.onDragStart(index);
    return {
      index: index,
      originalIndex: index,
      id: id
    };
  },
  endDrag: function endDrag(props, monitor) {
    var index = props.index;
    var didDrop = monitor.didDrop();
    props.onDragEnd(index, didDrop);
  }
};

var dragCollect = function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
};

var _default = (0, _reactDnd.DropTarget)(function (props) {
  return props.__dndType;
}, itemTarget, dropCollect)((0, _reactDnd.DragSource)(function (props) {
  return props.__dndType;
}, itemSource, dragCollect)(Item));

exports.default = _default;
//# sourceMappingURL=Item.js.map