import * as React from 'react';
import { Icon } from '../components/icon';

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

const resume = {
  social: [
    {
      name: "twitter",
      url: "https://twitter.com/alainxyz"
    },
    {
      name: "linkedin",
      url: "https://linkedin.com/in/alaingalvan"
    },
    {
      name: "deviantart",
      url: "https:///alaingalvan.deviantart.com"
    },
    {
      name: "github",
      url: "https://github.com/alaingalvan"
    },
    {
      name: "codepen",
      url: "https://codepen.io/alaingalvan"
    },
    {
      name: "soundcloud",
      url: "http://soundcloud.com/alaingalvan"
    }
  ],
  experience: [{
    position: "Graduate Graphics Research Assistant",
    company: "Florida International University",
    cover: "",
    startTime: new Date('06/06/2013'),
    endTime: new Date('06/06/2013'),
    description: "I'm responsible for creating an Unreal Engine 4 research project adding a procedurally generated skybox system and Windows 8 multitouch support. This project was further developed into a gesture elicitation experiment system, as well as a paper published to a conference. In addition, I serve as a Teacher's Assistant for Web Application Development creating assignments/exams/grading, and give workshops on Khronos Standards (OpenGL, OpenCL, WebGL, WebCL), Unreal Engine 4, HTML5 and Node.js."
  }],
  awards: [
    {
      award: "MLH SudoHacks 1st Place",
      company: "Stetson University",
      date: new Date('04/01/2016'),
      place: 1,
      description: "Me and my team won 1st place for making an RESTful api abstraction layer on top of PeopleSoft with the addition of analytics and a modern frontend."
    },
    {
      award: "MLH UHack 3rd Place",
      company: "University of Miami",
      date: new Date('04/01/2016'),
      place: 3,
      description: "Me and my team won 3rd place for a web application that trains beginners to read music by plugging in their piano and playing in real time. "
    },
    {
      award: "Codepen.io Frontpage",
      company: "CodePen.io",
      date: new Date('03/01/2016'),
      place: 0,
      description: "Front paged for a React Component that would later become the navigation component in my website."
    },
    {
      award: "Newgrounds Frontpage",
      company: "Newgrounds",
      date: new Date('05/01/2014'),
      place: 0,
      description: "Awarded for a concept screenshot of a pixel art RPG. Received over 16K views."
    }
  ],
  volunteer: [
    {
      position: "Worship Leader",
      company: "Prinston Church of the Nazarene",
      startTime: new Date('09/01/2014'),
      endTime: null,
      description: "I serve as a worshiper playing electric and acoustic guitar, in addition to serving as the backup pianist or bassist. "
    },
    {
      position: "Speaker",
      company: "Miami Game Developer Meetup",
      startTime: new Date('09/01/2015'),
      endTime: null,
      description: "I've taught in numerous meetups with topics related to game development, including Zbrush Modeling, Pixel Art Design, Game Maker Programming, and Making Art for Games."
    },
    {
      position: "Worship Leader",
      company: "The Way Church of Miami",
      startTime: new Date('07/01/2010'),
      endTime: new Date('11/01/2013'),
      description: "I served as a worship leader, performing every service on Piano, Guitar, or Violin. In addition, I educated new worshipers, and served as a technical director for the church's computer systems."
    }
  ]
}

export class About extends React.Component<any, any> {
  render() {
    return (
      <div style={styles.root}>
        <section style={{ ...styles.section, flexDirection: (innerWidth < 640) ? 'column' : 'row' }}>
          <img style={styles.img} src="assets/brand/alaingalvan.jpg" alt="Alain Galvan Photo" />
          <div style={styles.article}>
            <h1>Hi there!</h1>
            <p>My name is Alain, I work @<a href="http://openhid.com">FIU</a> as a Graphics Research Assistant, working on tools to make artists, musicians, and devs lives easier.</p>
            <div>
              {
                resume.social.map((e, i) => <a key={i} href={e.url}><Icon style={styles.svg} type={e.name} /></a>)
              }
            </div>
            <div style={{ padding: '16px 0' }}>
              <a href="assets/brand/alain-galvan-resume.pdf" style={{ ...styles.button, backgroundColor: '#3093b0' }} className="btn">Resume</a>
              <a style={styles.button} className="btn" href="mailto:hi@alain.xyz">Email</a>
            </div>
          </div>
        </section>
      </div>
    )
  }
}