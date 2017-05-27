import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SocialBar } from './socialbar';
import { LogoIcon } from '../logoicon';
import { NestedMenu } from './nestedmenu';
import { Icon } from '../icon';
import { toggleSidebar, mobileQuery, tabletQuery } from '../../store';

/**
 * Sidebar Menu
 */
@connect(
  ({ fullscreen, showSidebar }) => ({ fullscreen, showSidebar }),
  dispatch => ({
    toggleSidebar: bindActionCreators(toggleSidebar, dispatch)
  })
)
export class SideBar extends React.Component<any, any> {

  render() {
    let { location, fullscreen, showSidebar, toggleSidebar } = this.props;

    let left = tabletQuery
      ? showSidebar ? 0 : 350
      : 0;

    left = fullscreen ? 350 : left;

    return (
      <div
        style={{
          ...styles.root,
          transform: `translateX(-${left}px)`,
          padding: tabletQuery ? '2em' : '8em 2em',
          background: 'rgb(23,26,30)'
        }}>
        <a style={{ display: tabletQuery ? 'block' : 'none'}} onClick={toggleSidebar}>
          <svg viewBox="0 0 64 64" style={{width: 48, paddingBottom: '1em'}}>
          <line style={{fill: 'none', stroke:'currentcolor', strokeWidth: 1, strokeMiterlimit:10}} x1="20" y1="44" x2="44" y2="20"/>
          <line style={{fill: 'none', stroke:'currentcolor', strokeWidth: 1, strokeMiterlimit:10}} x1="44" y1="44" x2="20" y2="20"/>
          </svg>
          </a>
        <div style={styles.title}>
          <LogoIcon style={styles.img} />
          <Link style={styles.logotype} to='/'>
            <h1 style={styles.h1}>Alain Galván</h1>
            <h3 style={styles.h3}>Graphics Researcher @ FIU</h3>
          </Link>
        </div>
        <NestedMenu location={location} />
        <SocialBar style={{ position: 'absolute', bottom: '1.75em' }} />
        <p style={styles.footer}>© {year} Alain Galvan | Made with <a href='https://github.com/alaingalvan/alain.xyz'><Icon type='love' size={12} style={{ fill: 'rgba(236, 82, 82, 0.75)' }} /></a> in Miami, Florida
        </p>
        <div style={{...styles.overlay, opacity: 1 - (left / 350), display: showSidebar ? 'block' : 'none'}} onClick={toggleSidebar}/>
      </div>
    );
  }

}

type SideBarProps = {
  location: any
};

const styles: any = {
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
    zIndex: 100000,
    background: 'rgba(23,26,30,0.22)',
    transform: 'translateX(0px)',
    transition: 'transform 0.3s ease-out'
  },
  overlay: {
    position: 'fixed',
    zIndex: 10,
    width: '100vw',
    height: '100vh',
    left: 350,
    top: 0
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