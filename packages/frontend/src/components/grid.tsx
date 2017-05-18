import * as React from 'react';
import { Link } from 'react-router-dom';
import { mobileQuery } from '../store';

export function grid(GridComponent, items: Object[]) {

  let [first, ...rest] = items;

  return (
    <div style={styles.root as any}>
      <div style={{ ...styles.article, padding: 0 } as any}>
        {first ? <GridComponent style={{ height: 480, width: '100%' }} {...first} /> : null}
        {
          rest.map((post, key) => <GridComponent style={{ width: mobileQuery ? '100%' : '50%' }} key={key} {...post} />)
        }
      </div>
    </div>);
}


const styles = {
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    flexDirection: 'column',
    color: '#fff'
  },
  rss: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '1em'
  },
  article: {
    display: 'flex',
    flex: '0 1 auto',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1280
  },
  blogPost: {
    display: 'flex',
    height: 280,
    alignItems: 'flex-end',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}