import * as React from 'react';
import { Link } from 'react-router-dom';

export class Portfolio extends React.Component<any, any> {
  render() {
    return (
      <div style={styles.root}>
        <h1 style={styles.h1}>Portfolio</h1>
      </div>
    )
  }
}

const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  h1: {
  },
  link: {
    padding: '1em',
    margin: '.5em',
    background: '#2a7c94',
    borderRadius: '.2em'
  }
}