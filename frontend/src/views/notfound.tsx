import * as React from 'react';
import { Link } from 'react-router-dom';

export class NotFound extends React.Component<any, any> {
  render() {
    let i = Math.floor(Math.random() * stuff.length);
    let { phrase, name, url, img } = stuff[i];
    return (
      <div style={{
        ...styles.root,
        backgroundImage: `url(${img})`
        }}>
        <h1>{ phrase }</h1>
        <p>Doesn't look like that page exists.</p>
        <Link className="btn" style={styles.link} to="/">Go Home</Link>
        <p style={styles.source}> Img Source: <a href={url} >{ name }</a> </p>
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
    flexDirection: 'column',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'soft-light',
    backgroundColor: '#202429'
  },
  source: {
    position: 'absolute',
    right: '1em',
    bottom: '.25em',
    fontSize: '.75em',
    color: 'rgba(255,255,255,.75)'
  },
  link: {
    padding: '1em',
    margin: '.5em',
    backgroundColor: '#4ea0e8'
  }
}

const stuff = [
  {
    phrase: '🍩 D\'oh!',
    name: 'Salty Donut',
    url: 'https://saltydonut.com/',
    img: 'https://scontent.cdninstagram.com/t51.2885-15/e35/16583529_182609438889344_4841201472928481280_n.jpg'
  },
    {
    phrase: '👺 404\'d!',
    name: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Wrestling_mask',
    img: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Lucha_libre_m%C3%A1scaras.JPG'
  }
]