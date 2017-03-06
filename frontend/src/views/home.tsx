import * as React from 'react';
import { SideBar } from '../components';

export class Home extends React.Component<any, any> {

  render() {

    let {
      location: {
        pathname = '/'
      },
      children
    } = this.props;

    let mediaQuery = window && innerWidth < 1024;

    return (
      <div style={styles.root}>
        {mediaQuery ? <div style={{
          background: 'rgb(23,26,30)',
          width: '100vw',
          height: 'calc(48px + 4em)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10
        }} /> : null}
        <SideBar pathname={pathname} />
        <div style={{
          ...styles.mainPage,
          width: mediaQuery ? '100vw' : 'calc(100vw - 350px)',
          transform: `translate(${mediaQuery ? 0 : 350}px, ${mediaQuery ? 112 : 0}px)`
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
