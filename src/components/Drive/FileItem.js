import filesize from "filesize"
import React, {Component} from "react"
import {StyleSheet, css} from "aphrodite/no-important"
import Button from 'react-sea/lib/Button'
import {Link} from "react-router-dom"

class FileItem extends Component {

  state = {
    selectState: 0, // 0未选中  2选中
    mouseOver: false
  };

  onMouseOver = () => {
    this.setState({
      mouseOver: true
    })
  };

  onMouseOut = () => {
    this.setState({
      mouseOver: false
    })
  };

  deleteFile = (e) => {
    const {deleteFile, item} = this.props;
    deleteFile(item);
    e.stopPropagation();
    e.preventDefault();
  };

  _toggleSelect = (state) => {
    const selectState = state || (this.state.selectState == 2?0:2);
    this.setState({
      selectState,
    });

    this.props.onToggleSelect(selectState, this.props.item);
  };

  toggleSelect = (e) => {
    this._toggleSelect();
    e.stopPropagation();
    e.preventDefault();
  };

  select = () => {
    if (this.state.selectState != 2) this._toggleSelect(2)
  };

  render() {
    const {index, item, hrefPrefix, pathname} = this.props;
    const {mouseOver, selectState} = this.state;

    return (
      <div
        onClick={this.select}
        className={css(styles.fileItem, mouseOver && styles.fileItem_hover, selectState == 2 && styles.fileItem_selected)}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}>
        {/*<div className={css(styles.index)}>{index + 1}</div>*/}
        <div className={css(styles.index)} onClick={this.toggleSelect}>
          {selectState == 2?1:0}
        </div>
        <div className={css(styles.name)}>
          <Link
            className={css(styles.name__text)}
            to={`${hrefPrefix}/file${pathname=="/"?'':pathname}/${item.name}`}>{item.name}</Link>
          <div>
            <Button style={{width: 60, transition: 'none'}} size="small" type="secondary" onClick={this.deleteFile}>删除</Button>
            <Button style={{width: 60, transition: 'none'}} size="small" type="secondary" >重命名</Button>
          </div>
        </div>
        <div className={css(styles.size)}>
          {filesize(item.stat.size)}
        </div>
        <div className={css(styles.options, mouseOver && styles.options_show)}>

        </div>
      </div>
    )
  }
}


const styles = StyleSheet.create({

  fileItem: {
    borderBottom: '1px solid #E8E8E4',
    padding: '5px 10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    transition: 'all .15s ease',
    lineHeight: '30px'
  },

  fileItem_hover: {
    backgroundColor: '#EEE',
  },

  fileItem_selected: {
    backgroundColor: '#DDD',
    borderBottom: '1px solid #D2D2D2',
  },

  index: {
    width: 40
  },
  name: {
    flex: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#1077ff',
    display: 'flex',
    justifyContent: 'space-between'
  },
  name__text: {
    color: '#1077ff',
    textDecoration: 'none',
    fontSize: 15,
    letterSpacing: 1
  },
  size: {
    flex: 1,
    color: '#a5a5a5',
    fontSize: 12
  },
  options: {
    flex: 1,
    display: 'flex',
    visibility: 'hidden'
  },
  options_show: {
    visibility: 'visible'

  },


});

export default FileItem