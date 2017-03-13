import * as React from 'react';
import {Icon} from 'alain-xyz';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 240px)',
    width: '100vw'
  }
}

export default class Album extends React.Component<any, any> {
  render() {
    return (
      <div style={styles.root}>
      </div>
    )
  }
}
