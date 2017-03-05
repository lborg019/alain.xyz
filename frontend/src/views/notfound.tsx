import * as React from 'react';
import { Link } from 'react-router-dom';

export class NotFound extends React.Component<any, any> {
  render() {
    return (
      <div style={styles.root}>
        <h1 style={styles.h1}>{
          phrases[Math.floor(Math.random() * phrases.length)]
        }</h1>
        <p>Doesn't look like that page exists.</p>
        <Link className="btn" style={styles.link} to="/">Go Home</Link>
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
    backgroundColor: '#4ea0e8'
  }
}

const phrases = [
  '🔬 Wubalubadubdub!',
  '👺 404\'d!',
  '🍩 D\'oh!'
]