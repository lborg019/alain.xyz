import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Icon } from './icon';
import { tabletQuery, mobileQuery } from '../store';

export class Slideshow extends React.Component<any, any> {
  state = {
    index: 0,
    prevIndex: -1,
    slides: [...slideshow]
  }

  intervalHandle: any;

  componentWillMount() {
    this.intervalHandle = setInterval(this.incrementSlides, 6300);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
  }

  incrementSlides = (inc = 1) =>
    this.setState(({ index, slides }) => {
      let i = (index + inc) % slides.length;
      while (i < 0) i += slides.length;
      return {
        index: i
      }
    })

  render() {

    let { slides, index, prevIndex } = this.state;

    return (
      <div style={styles.root}>
        {slides.map((v, i) => {

          let {
            image,
            title,
            description,
            keywords,
            permalink
            } = v;

          let opacity = i === index ? 1 : 0;

          let z = i === index
            ? 2
            : i === prevIndex
              ? 1
              : 0;

          let responsive = tabletQuery
            ? {}
            : {
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 20 + z,
              opacity,
            }

          return (
            <a style={{
              ...styles.link,
              ...responsive
            }}
              href={permalink}
              key={i}>
              <figure style={{
                ...styles.figure,
                backgroundImage: `linear-gradient(rgba(33,37,43,0), rgba(33,37,43,1)), url(${image})`,
                left: tabletQuery ? 0 : -350,
                height: tabletQuery ? ( i > 0 ? '192px' : '320px') : '100vh'
              }}>
                <div style={{textAlign: 'center', padding: '1em'}}>
                  
                  <h1 style={{
                    ...styles.h1,
                    fontSize: tabletQuery ? '1.5rem' : undefined
                  }}><Icon type={keywords[0]} /> {title}</h1>
                  <p style={styles.p}>{description}</p>
                </div>
              </figure>
            </a>
          );

        })}
      </div>
    );
  }
}

const slideshow = [
  {
    image: 'assets/brand/hadley-attractor.png',
    title: 'Coronal',
    description: 'An ES2017 WebGL2 Rendering Library',
    keywords: ['library'],
    permalink: 'https://github.com/hyperfuse/coronal'
  },
  {
    image: 'assets/brand/realtime-celestial-rendering.png',
    title: 'Celestial Rendering for 3D Navigation',
    description: 'Realtime Stary Skies for PBR Environments with Animated Radiance Maps',
    keywords: ['research'],
    permalink: 'https://alain.xyz/research/realtime-celestial-rendering'
  },
  {
    image: 'assets/brand/website-screenshot.jpg',
    title: 'The Making of Alain.xyz',
    description: 'Design overview of the decisions in making this website.',
    keywords: ['blog'],
    permalink: 'https://alain.xyz/blog/the-making-of-alain-xyz'
  }
]

const styles = {
  root: {
    width: '100%',
    height: '100%'
  },
  link: {
    width: '100%',
    height: '100%',
    transition: 'opacity 0.3s ease-out'
  },
  figure: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    position: 'relative',
    zIndex: 1,
    left: -350,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  h1: {
    textTransform: 'uppercase',
    fontWeight: 200,
    letterSpacing: '.25em',
    maxWidth: 1024
  },
  p: {
    textAlign: 'center',
    lineHeight: '1.5em',
    paddingTop: '.5em'
  }
}