import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon, grid, fetchSubapp, setSubapp } from 'main';

@(connect(
  ({ portfolio }) => ({ portfolio }),
  dispatch => ({
    fetchSubapp: bindActionCreators(fetchSubapp, dispatch),
    setSubapp: bindActionCreators(setSubapp, dispatch)
  })
) as any)
export default class Research extends React.Component<any, any> {

  componentWillMount() {
    let {
      permalink,
      data
    } = this.props.config;

    this.props.fetchSubapp({ permalink: '/research/*'});
  }


  componentDidMount() {
    if (window) {
      window.scrollTo(0, 0);
      document.title = this.props.config.title;
    }
  }

  render() {

    let {
      config,
      portfolio = []
    } = this.props;

    if (!config)
      return null;

    // union the 2 sets.

    let featuredPortfolio = portfolio.filter(post => post.permalink.slice(0, 10) === '/research/');

    return grid(PublicationCell, featuredPortfolio);
  }
}

const PublicationCell = ({ image, title, icon, description, permalink, datePublished, dateModified, keywords, style = {} }) => {

  let published = new Date(datePublished);
  let publishedStr = published.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });

  let updated = new Date(dateModified);

  return (
    <Link to={permalink} style={{ ...styles.blogPost, ...style, backgroundImage: `url('${image}')` }}>
      <section style={{
        backgroundImage: 'linear-gradient(rgba(33, 37, 43, 0), rgba(33, 37, 43, .5) 40%, rgb(33, 37, 43))',
        width: '100%',
        padding: '1.5em',
        display: 'flex',
        alignItems: 'flex-end'
      }}>
      <img alt='Paper preview' style={{ height: '240px' }} src={icon}/>
        <div style={{ paddingLeft: '1.5em' }}>
          <h2 style={{ color: '#fff' }}><Icon type={keywords[0]}/>{title}</h2>
          <p style={{ fontSize: '.75em', color: 'rgba(255,255,255,0.8)' }}>
            <Icon type='date' style={{ marginRight: '.5em' }} />
            {published.toLocaleDateString()} @ {publishedStr}
          </p>
          <p style={{ lineHeight: '1.25em', color: '#fff' }}>{description}</p>
        </div>
      </section>
    </Link>
  );
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