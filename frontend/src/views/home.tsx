import * as React from 'react';

import {Hero} from '../components/hero';
import {RouteTransition, presets} from '../components/react-router-transition';


export class Home extends React.Component<any, any> {
  render() {
    return (
      <div style={{ width: '100vw', height: '100vh'}}>
        <Hero shrink={null != this.props.children}/>
        <div style={{ position: 'relative' }}>
        {
          (innerWidth > 640) ?
            <RouteTransition pathname={this.props.location.pathname} {...presets.slideUp}>
              {this.props.children}
            </RouteTransition> :
            this.props.children
        }
        </div>
      </div>
    )
  }
}

export default Home;
