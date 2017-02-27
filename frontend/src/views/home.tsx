import * as React from 'react';
import { SideBar, SocialBar } from '../components';
import { RouteTransition, presets } from '../components/react-router-transition';

export class Home extends React.Component<any, any> {

  render() {

    let {
      location: {
        pathname = '/'
      },
      children
    } = this.props;

    let mediaQuery = window && innerWidth > 440;

    return (
      <div style={styles.root}>
        <SocialBar />
        <SideBar pathname={pathname} />
        <div style={{
          ...styles.mainPage, 
          width: mediaQuery ? 'calc(100vw - 440px)' : '100vw',
          transform: `translateX(${mediaQuery ? 440 : 0}px)`
          }}>
          {children}
        </div>
      </div>
    )
  }
}

const styles = {
  root: {
    width: '100vw',
    height: '100vh'
  },
  mainPage: {
    height: '100vh',
    position: 'relative',
    transition: 'transform 0.3s ease-out'
  }
}
