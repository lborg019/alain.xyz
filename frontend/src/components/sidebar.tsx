import * as React from 'react';
import { Link } from 'react-router-dom';
import { SocialBar } from './socialbar';
import { LogoIcon } from './logoicon';
import { NestedMenu } from './nestedmenu';

/**
 * Sidebar Menu
 */
export class SideBar extends React.Component<SideBarProps, SideBarState> {

  state = {
    shrink: false
  }

  render() {
    let mediaQuery = window && innerWidth < 360;
    let scale = mediaQuery
      ? innerWidth / 360
      : 1;

    return (
      <div style={styles.root}>
        <div style={{ ...styles.title, transform: `scale(${scale})` }}>
          <Link to="/" style={{ height: 48 }}>
            <LogoIcon style={styles.img} />
          </Link>
          <div style={styles.logotype}>
            <h1 style={styles.h1}>Alain Galván</h1>
            <h3 style={styles.h3}>Graphics Researcher @ FIU</h3>
          </div>
        </div>
        <NestedMenu pathname={this.props.pathname} />
      </div>
    );
  }

}



type SideBarProps = {
  pathname: string
};

type SideBarState = {
  shrink: boolean
};

const styles = {
  root: {
    cursor: 'default',
    height: '100vh',
    overflowX: 'hidden',
    overflowY: '-moz-scrollbars-none, scroll',
    padding: '8em 2em',
    userSelect: 'none',
    width: 340,
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 10,
    background: 'rgba(23,26,30,0.11)'
  },
  h1: {
    textTransform: 'uppercase',
    fontSize: '3.3em'
  },
  h3: {
    fontSize: '1.44em'
  },
  title: {
    fontSize: '.6rem',
    letterSpacing: '.2em',
    lineHeight: '2.5em',
    display: 'flex',
    alignItems: 'center',
    transformOrigin: '0 50%',
    padding: '0 0 1.5em 0'
  },
  logotype: {
    paddingLeft: '1.2em'
  },
  img: {
    height: 48,
    width: 48
  }
};