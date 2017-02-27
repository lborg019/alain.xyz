import * as React from 'react';

export default class BlogPost extends React.Component<any, any> {

  private root = null;

  componentDidMount() {
    if (window && this.root) {
      window.scrollTo(0, 0);
    } 
  }

  render() {

    if (!this.props.config)
      return null;

    let {title, description, cover, publishDate, meta, tags, data} = this.props.config;
    return (
      <div ref={r => this.root = r} style={styles.root}>
        <figure style={{ ...styles.figure, backgroundImage: `linear-gradient(rgba(33,37,43,0) 80vh, rgba(33,37,43,1)), url(${cover})` }}>
          <figcaption style={styles.figcaption}>
            <h1>{title}</h1>
            <p>{description}</p>
          </figcaption>
        </figure>
        <section style={styles.section}>
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
    left: -440,
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
    padding: 16
  },
  articleContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    display: 'flex',
    transform: 'translate(0, -120px)',
    position: 'relative',
    zIndex: 10
  }
}