import * as React from 'react';
import { MobileBar, SideBar } from '../components';
import { tabletQuery } from '../store';

export class Home extends React.Component<any, any> {

  render() {

    let {
      location,
      children
    } = this.props;

    return (
      <div style={styles.root}>
        <MobileBar />
        <SideBar location={location} />
        <div style={{
          ...styles.mainPage,
          width: tabletQuery ? '100vw' : 'calc(100vw - 350px)',
          transform: `translate(${tabletQuery ? 0 : 350}px, ${tabletQuery ? 52 : 0}px)`
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
