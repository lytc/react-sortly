import "core-js/modules/es7.symbol.async-iterator";
import "core-js/modules/es6.symbol";
import "core-js/modules/es6.object.assign";
import "core-js/modules/es6.object.set-prototype-of";
import "core-js/modules/web.dom.iterable";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DropTarget } from 'react-dnd';
import { decreaseTreeItem, increaseTreeItem, moveTreeItem, findDescendants } from './utils';
import Item from './Item';
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
      var descendants = findDescendants(items, dragIndex);

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
        var threshold = _this.props.threshold; // Check that if it move horizontally

        if (Math.abs(offsetX + reduceOffset) < threshold) {
          return null;
        } // Move to the right, meaning decrease horizontal level
        // It now is a child of it previous sibling


        if (offsetX > 0) {
          updateFn = decreaseTreeItem(items, dragIndex);

          if (!updateFn) {
            return null;
          }

          reduceOffset -= threshold;
        } else {
          // Move to the left, meaning increase horizontal level
          updateFn = increaseTreeItem(items, dragIndex);

          if (!updateFn) {
            return null;
          }

          reduceOffset += threshold;
        }

        newIndex = hoverIndex;
      } else {
        var result = moveTreeItem(items, dragIndex, hoverIndex);
        updateFn = result.updateFn; // eslint-disable-line prefer-destructuring

        newIndex = result.newIndex; // eslint-disable-line prefer-destructuring
      }

      var newState = update(_this.state, {
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
      var _this$props2 = _this.props,
          cancelOnDragOutside = _this$props2.cancelOnDragOutside,
          monitor = _this$props2.monitor;

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

      var _this$props3 = this.props,
          type = _this$props3.type,
          Comp = _this$props3.component,
          itemRenderer = _this$props3.itemRenderer,
          connectDropTarget = _this$props3.connectDropTarget;
      var _this$state = this.state,
          items = _this$state.items,
          draggingDescendants = _this$state.draggingDescendants;
      return connectDropTarget(React.createElement(Comp, null, items.map(function (item, index) {
        return React.createElement(Item, _extends({}, item, {
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
}(Component);

_defineProperty(Sortly, "propTypes", {
  type: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  items: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.array.isRequired
  })).isRequired,
  itemRenderer: PropTypes.func.isRequired,
  threshold: PropTypes.number,
  maxDepth: PropTypes.number,
  cancelOnDragOutside: PropTypes.bool,
  cancelOnDropOutside: PropTypes.bool,
  onMove: PropTypes.func,
  onDragStart: PropTypes.func,
  ondDragEnd: PropTypes.func,
  onDrop: PropTypes.func,
  monitor: PropTypes.shape({
    getItem: PropTypes.func.isRequired
  }).isRequired,
  isOver: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
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

var WithDropTarget = DropTarget(function (props) {
  return props.type;
}, spec, collect)(Sortly);
WithDropTarget.defaultProps = {
  type: DEFAULT_TYPE
};
export default WithDropTarget;
//# sourceMappingURL=Sortly.js.map