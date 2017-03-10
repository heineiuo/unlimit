import React, {Component} from "react"
import {Link} from "react-router"
import MdArrowUpward from "react-sea/lib/Icons/arrow-upward"
import MdArrowDownward from "react-sea/lib/Icons/arrow-downward"
import Button from "react-sea/lib/Button"
import {StyleSheet, css} from "aphrodite"
import LocationDetail from "./LocationDetail"

class LocationItem extends Component {
  static defaultProps = {
    onChange: () => {}
  };

  state = {
    selectState: 0,
    mouseOver: false,
    showDetail: false,
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

  toggleDetail = () => {
    this.setState({
      showDetail: !this.state.showDetail
    });
  };

  handleDetailChange = (changePart) => {
    this.props.onChange({
      location: this.props.location,
      changePart
    })
  };

  editLocationSortUp = (e) => {
    this.editLocationSort(e, -1)
  };

  editLocationSortDown = (e) => {
    this.editLocationSort(e, 1)
  };

  editLocationSort = (e, diff) => {
    const {location, editLocationSort} = this.props;
    editLocationSort(location, location.sort + diff);
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const {location, locationLength} = this.props;
    const {showDetail, mouseOver} = this.state;
    return (
      <div
        className={css(styles.locationItem, mouseOver && styles.item_hover, showDetail && styles.item_opened)}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}>
        <div className={css(styles.item)} onClick={this.toggleDetail}>
          <div style={{width: 100}}>{location.sort}</div>
          <div style={{flex: 1}}><code>{location.pathname}</code></div>
          <div style={{flex: 1}}><code>{location.type}</code></div>
          <div className={css(styles.item__sort)}>
            <Button
              type="secondary"
              size="small"
              className={css(styles.arrow && location.sort == 1 && styles.arrow_disabled)}
              onClick={this.editLocationSortUp}>
              上移
            </Button>
            <Button
              type="secondary"
              size="small"
              className={css(styles.arrow && location.sort == locationLength && styles.arrow_disabled)}
              onClick={this.editLocationSortDown}>
              下移
            </Button>
          </div>
        </div>
        <div className={css(styles.detail)}>
          <LocationDetail
            {...location}
            isOpen={showDetail}
            onChange={this.handleDetailChange}
          />
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    transition: 'all .2s ease',
    padding: '5px 10px'
  },

  item_hover: {
    backgroundColor: '#F0F0F0',
  },
  item_opened: {
    backgroundColor: '#FAFAFA',
  },

  item__sort: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff'
  },

  arrow: {
    backgroundColor: '#EEE'
  },
  arrow_disabled: {
    backgroundColor: '#FFF'
  },

  detail: {
    paddingLeft: '40px'
  }
});

export default LocationItem