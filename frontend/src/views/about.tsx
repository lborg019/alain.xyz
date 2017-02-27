import * as React from 'react';
import { Icon } from '../components/icon';
import resume from './resume';

export class About extends React.Component<any, any> {
  render() {
    return (
      <div>
        <section >
          <img style={styles.img} src="assets/brand/alaingalvan.jpg" alt="A photo of Alain Galvan. :)" />
          <div >
            <h1>Hi there! <span style={{fontSize: '1.5em'}}>✌</span></h1>
            <p>My name is Alain,  and I'm a Graduate Graphics Research Assistant <a href="http://fiu.edu/">@FIU</a>'s <a href="http://OpenHID.com">@OpenHID</a> Lab, where my research focuses on low level graphics programming, HCI, WebGL, Vulkan.</p>
            <p>I'm also a Speaker @ <a href="https://www.meetup.com/MakeGamesMiami/">The Miami Game Development Meetup</a> and Guitarist @ Princeton Church.</p>
            <div style={{ padding: '16px 0' }}>
              <a href="assets/brand/alain-galvan-resume.pdf" style={{ ...styles.button, backgroundColor: '#3093b0' }} className="btn">Resume</a>
              <a href="mailto:hi@alain.xyz"><Icon type="email"/></a>
              <a href=""><Icon type="twitter"/></a>
            </div>
          </div>
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
    minHeight: 'calc(100vh - 240px)',
    width: '100vw'
  },
  section: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 720
  },
  img: {
    width: 192,
    height: 192,
    borderRadius: '100%',
    margin: 16,
    border: '1px solid rgb(255, 255, 255)',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)'
  },
  article: {
    padding: '4px 16px'
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