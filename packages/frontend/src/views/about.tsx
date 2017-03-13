import * as React from 'react';
import { Icon } from '../components/icon';

export class About extends React.Component<any, any> {

  componentWillMount() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.title = 'Alain Galvan | About';
      scrollTo(0, 0);
    }
  }


  render() {
    return (
      <div style={styles.root}>
        <section style={styles.section}>
          <img style={styles.img} src='assets/brand/alaingalvan.jpg' alt='A photo of Alain Galvan. :)' />
          <article style={styles.article}>
            <h1 style={styles.h1}>Hi there! <span style={{ fontSize: '1.5em' }}>✌</span></h1>
            <p>My name is Alain (pronounced <em>Alan</em> ), a graduate (MSc) student / graphics research assistant <a href='http://fiu.edu/'>@FIU</a>'s <a href='http://OpenHID.com'>@OpenHID</a> Lab, a Human Computer Interaction lab part of the <a href='http://hpdrc.fiu.edu'>High Performance Database Research Center</a> where my research focuses on low level graphics programming.</p>
            <p>I'm also a Speaker @ <a href='https://www.meetup.com/MakeGamesMiami/'>The Miami Game Development Meetup</a> and Guitarist @ Princeton Church.</p>
            <div style={{ padding: '16px 0' }}>
              <a href='assets/brand/alain-galvan-resume.pdf'
                style={{ backgroundColor: '#3093b0' }}
                className='btn' >
                Résumé
              </a>
              <a href='mailto:hi@alain.xyz'
                style={{ backgroundColor: '#6945bf' }}
                className='btn' >
                Email
              </a>
            </div>
          </article>
        </section>
      </div>
    )
  }
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    width: '100%'
  },
  section: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 720,
    flexDirection: 'column',
    padding: '.5em'
  },
  img: {
    width: 256,
    height: 256,
    borderRadius: '100%',
    margin: 16,
    border: '1px solid rgb(255, 255, 255)',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)'
  },
  h1: {
    padding: '0.2em 0'
  },
  article: {
    padding: '.25em 1em 1em'
  },
  p: {
    padding: '8px 0'
  },
  button: {
    backgroundColor: '#3676d1',
    margin: '8px 4px',
    padding: '12px 24px',
  },
  svg: {
    padding: 8,
    boxSizing: 'content-box'
  }
}