import React from 'react'
import {StyleSheet, css} from 'aphrodite'

const Separator = ({ className = css(styles.separator) }) => <div className={className} />;

const styles = StyleSheet.create({
  separator: {
    borderRight: '1px solid #EEE'
  }
})

export default Separator
