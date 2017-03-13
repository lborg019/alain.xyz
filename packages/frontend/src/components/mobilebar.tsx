import * as React from 'react';
import { LogoIcon } from './logoicon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleSidebar, mobileQuery, tabletQuery } from '../store';

@connect(
  ({ fullscreen, showSidebar }) => ({ fullscreen, showSidebar }),
  dispatch => ({
    toggleSidebar: bindActionCreators(toggleSidebar, dispatch)
  })
)
export class MobileBar extends React.Component<any, any> {
  render() {
    let { fullscreen, showSidebar, toggleSidebar } = this.props;
    return (
      <div style={styles.root} >
        <a style={styles.menu} onClick={toggleSidebar} >
          <svg viewBox="0 0 52 52">
            <line style={styles.line} x1="15" y1="26" x2="37" y2="26" />
            <line style={styles.line} x1="15" y1="26" x2="37" y2="26" />
            <line style={styles.line} x1="15" y1="33" x2="37" y2="33" />
            <line style={styles.line} x1="15" y1="19" x2="37" y2="19" />
          </svg>
        </a>
        <LogoIcon style={{ height: 48, transform: 'translateY(1em)' }} />
        <a style={styles.rss} href='' />
      </div>
    )
  }
}

const styles = {
  root: {
    background: 'rgb(23,26,30)',
    display: 'flex',
    height: 52,
    justifyContent: 'space-between',
    left: 0,
    position: 'fixed',
    top: 0,
    visibility: tabletQuery ? 'visible' : 'hidden',
    width: '100vw',
    zIndex: 10
  },
  menu: {
    width: 52,
    backgroundColor: 'rgba(78, 160, 232, 0.74)'
  },
  line: {
    fill: 'none',
    stroke: '#fff',
    strokeWidth: 2,
    strokeMiterlimit: 10
  }
  logo: {
    height: 48,
    transform: 'translateY(1em)'
  },
  rss: {
    width: 52
  }
}