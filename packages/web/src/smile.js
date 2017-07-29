import React, {Component} from 'react'

class Logo extends Component {

  static defaultProps = {
    color: '#999',
  };

  render () {
    const {color} = this.props;

    return (
      <div style={{paddingTop: 12, marginRight: 10}}>
        <div style={{
              position: 'relative',
              boxSizing: 'border-box',
              width: 32,
              lineHeight: `${28}px`,
              textAlign: 'center',
              height: 32,
              color: `${color}`,
              borderRadius: 8,
              border: `1px solid ${color}`
            }}>
          <span style={{
            fontSize: 16,
            fontWeight: 'bold'
          }}>:</span>
          <div style={{
                fontSize: 16,
                position: 'absolute',
                top: 0,
                right: 0,
                boxSizing: 'border-box',
                width: '100%',
                height: '100%',
                paddingLeft: '57%'
              }}>)</div>
        </div>
      </div>
    )
  }

}

export default Logo