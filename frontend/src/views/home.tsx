import * as React from 'react';

import { Hero, SocialBar } from '../components';
import { RouteTransition, presets } from '../components/react-router-transition';

export function Home({ location, children }) {
  return (
    <div style={styles.root}>
      <Hero shrink={location.pathname !== '/'} />
      <Sidebar/>
      <SocialBar/>
      <div style={styles.mainPage}>
        {
          (innerWidth > 640) ?
            <RouteTransition pathname={this.props.location.pathname} {...presets.slideUp}>
              {children}
            </RouteTransition> :
            children
        }
      </div>
    </div>
  )
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
