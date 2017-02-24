import * as React from 'react';
import { Hero, SocialBar } from '../components';
import { RouteTransition, presets } from '../components/react-router-transition';

export class Home extends React.Component<any, any> {
  render() {

    let {
      location: {
        pathname = '/'
      },
      children
    } = this.props;

    return (
      <div style={styles.root}>
        <SocialBar />
        <div style={styles.mainPage}>
          {
            (innerWidth > 640) ?
              <RouteTransition pathname={pathname} {...presets.slideUp}>
                {children}
              </RouteTransition> :
              children
          }
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
    position: 'relative'
  }
}
