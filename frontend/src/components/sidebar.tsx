import * as React from 'react';
import { Link } from 'react-router-dom';
import { SocialBar } from './socialbar';
import { LogoIcon } from './logoicon';
import { NestedMenu } from './nestedmenu';
import { Icon } from './icon';
import { mobileQuery, tabletQuery } from '../store';
/**
 * Sidebar Menu
 */
export class SideBar extends React.Component<SideBarProps, SideBarState> {

  state = {
    open: false
  }

  private mouseListener;

  toggleMenu = () =>
    this.setState(({ open }) => ({ open: !open }))

  render() {
    let { pathname } = this.props;

    let scale = mobileQuery
      ? innerWidth / 350
      : 1;

    let left = tabletQuery
      ? this.state.open ? 0 : -350
      : 0;

    return (
      <div
        style={{
          ...styles.root,
          transform: `translateX(${left}px)`,
          padding: tabletQuery ? '2em' : '8em 2em',
          background: tabletQuery ? 'rgb(23,26,30)' : 'rgba(23,26,30,0.22)'
        }}>
        <div
          style={{
            ...styles.title,
            transform: `scale(${scale}) translate(${-left}px,0px)`,
            zIndex: 10000
          }}>
          <a
            onClick={this.toggleMenu}
            style={{ height: 48 }}>
            <LogoIcon style={styles.img} />
          </a>
          <Link style={styles.logotype} to='/'>
            <h1 style={styles.h1}>Alain Galván</h1>
            <h3 style={styles.h3}>Graphics Researcher @ FIU</h3>
          </Link>
        </div>
        <NestedMenu pathname={this.props.pathname} />
        <SocialBar style={{ position: 'absolute', bottom: '1.75em' }} />
        <p style={styles.footer}>© {year} Alain Galvan | Made with <a href="https://github.com/alaingalvan/alain.xyz"><Icon type="love" size={12} style={{ fill: 'rgba(236, 82, 82, 0.75)' }} /></a> in Miami, Florida
        </p>

      </div>
    );
  }
}

type SideBarProps = {
  pathname: string
};

type SideBarState = {
  open: boolean
};

const styles = {
  root: {
    cursor: 'default',
    height: '100vh',
    overflowX: 'visible',
    overflowY: '-moz-scrollbars-none, scroll',
    padding: '8em 2em',
    userSelect: 'none',
    width: 350,
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 10,
    background: 'rgba(23,26,30,0.11)',
    transition: 'transform 0.3s ease-out'
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
    padding: '0 0 1.5em 0',
    transition: 'transform 0.3s ease-out'
  },
  logotype: {
    paddingLeft: '1.2em',
    color: '#fff'
  },
  img: {
    height: 48,
    width: 48
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: 'rgba(255,255,255,.5)',
    fontSize: '.75em'
  }
};

const year = new Date().getFullYear();