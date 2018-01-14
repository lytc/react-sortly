/* eslint-disable jsx-a11y/no-autofocus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { remove } from 'react-sortly';

import style from './ItemRenderer.scss';

export default class ItemRenderer extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    path: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
    active: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isClosestDragging: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onReturn: PropTypes.func.isRequired,
  }

  state = { name: this.props.name }

  handleChangeName = (e) => {
    this.setState({ name: e.target.value }, () => this.change());
  }

  change = debounce(() => {
    const { index, onChange } = this.props;
    const { name } = this.state;
    onChange(index, { name });
  }, 300);

  handleClickRemove = () => {
    const { index, onRemove } = this.props;
    onRemove(index);
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const { index, onReturn } = this.props;
      onReturn(index);
    }
  }

  render() {
    const {
      connectDragSource, connectDragPreview, connectDropTarget,
      isDragging, isClosestDragging, active, path,
    } = this.props;
    const { name } = this.state;
    const className = classNames(style.container, { [style.mute]: isDragging || isClosestDragging });
    const dragHandle = connectDragSource(
      <button className={style.dragHandle} type="button"><i className="fa fa-reorder" /></button>,
    );

    const styles = { paddingLeft: path.length * 20 };

    return connectDropTarget(connectDragPreview(
      <div className={className} style={styles}>
        <div className={style.body}>
          {dragHandle}
          <input
            type="text"
            value={name}
            autoFocus={active}
            className={style.nameInput}
            onChange={this.handleChangeName}
            onKeyDown={this.handleKeyDown}
          />
          <button type="button" className={style.removeBtn} onClick={this.handleClickRemove}>
            <i className="fa fa-remove" />
          </button>
        </div>
      </div>,
    ));
  }
}

