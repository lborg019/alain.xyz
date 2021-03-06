import * as React from 'react';
import { Icon } from 'main';

export default class BlogPost extends React.Component<any, any> {

  private root = null;

  componentDidMount() {
    if (window && this.root) {
      window.scrollTo(0, 0);
      document.title = this.props.config.title;
    }
  }

  render() {

    if (!this.props.config)
      return null;

    let { title, description, image, meta, datePublished, keywords, data } = this.props.config;

    let date = new Date(datePublished);
    return (
      <div ref={r => this.root = r} style={styles.root}>
        <figure style={{
          ...styles.figure,
          backgroundImage: `linear-gradient(rgba(33,37,43,0) ${ window && innerWidth < 1024 ? '15vh' : '45vh' }, rgba(33,37,43,1)), url(${image})`
        }} />
        <section style={{
          ...styles.section,
              transform: `translate(0, -${window && innerWidth < 1024 ? 65 : 40}vh)`
          }}>
          <div style={{ padding: '0.5em 1.5em' }}>
            <h1 style={{ color: '#fff' }}>{title}</h1>
            <p>{description}</p>
            <p style={{ fontSize: '.75em', color: 'rgba(255,255,255,0.8)' }}>
              <Icon type='date' style={{ marginRight: '.5em' }} />
              {date.toLocaleDateString()} @ {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}
            </p>
          </div>
          <div style={styles.articleContainer}>
            <article style={styles.article} dangerouslySetInnerHTML={{ __html: data }} />
          </div>
        </section>
      </div>
    );
  }
}

const styles = {
  root: {
    width: '100%'
  },
  figure: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    position: 'relative',
    zIndex: 1,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  figcaption: {
    padding: 16,
    maxWidth: 960,
    textAlign: 'center'
  },
  article: {
    width: '100%',
    maxWidth: 960,
    padding: '1.5em'
  },
  articleContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    transform: 'translate(0, -40vh)',
    position: 'relative',
    zIndex: 10
  }
}