import * as React from 'react';
import { Icon } from 'alain-xyz';
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

    let { title, description, cover, publishDate, meta, publishDate, tags, data } = this.props.config;

    let date = new Date(publishDate);
    return (
      <div ref={r => this.root = r} style={styles.root}>
        <figure style={{ ...styles.figure, backgroundImage: `linear-gradient(rgba(33,37,43,0) 65vh, rgba(33,37,43,1)), url(${cover})` }}/>
        <section style={styles.section}>
          <div style={{padding: '.5em'}}>
            <h1 style={{ color: '#fff' }}>{title}</h1>
            <p>{description}</p>
            <p style={{ fontSize: '.75em', color: 'rgba(255,255,255,0.8)' }}>
              <Icon type='date' style={{ marginRight: '.5em' }} />
              {date.toLocaleDateString()} @ {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}
              <Icon type='eye' style={{ margin: '0 .5em' }} />
              1421 Views
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
    width: '100vw',
    height: '100vh',
    position: 'relative',
    zIndex: 1,
    left: -340,
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
    alignItems: 'center',
    //justifyContent: 'center'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    transform: 'translate(0, -16em)',
    position: 'relative',
    zIndex: 10
  }
}