import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from '../components';
import { fetchSubapp } from '../store/actions';

const BlogPost = ({ cover, title, description, permalink, publishDate, tags, style = {} }) => {

  let date = new Date(publishDate);

  return (
    <Link to={permalink} style={{ ...styles.blogPost, ...style, backgroundImage: `url('${cover}')` }}>
      <section style={{
        backgroundImage: 'linear-gradient(rgba(33, 37, 43, 0), rgba(33, 37, 43, .5) 40%, rgb(33, 37, 43))', 
        width: '100%', 
        padding: '1.5em'
        }}>
        <h2 style={{ color: '#fff'}}>{title}</h2>
        <p style={{ fontSize: '.75em', color: 'rgba(255,255,255,0.8)'}}>
          <Icon type='date' style={{marginRight: '.5em'}}/>
          {date.toLocaleDateString()} @ {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}
          </p>
        <p style={{lineHeight: '1.25em', color: '#fff'}}>{description}</p>
      </section>
    </Link>
  );
}

@connect(
  ({ portfolio }) => ({
    portfolio
  }),
  dispatch => ({
    fetchSubapp: bindActionCreators(fetchSubapp, dispatch)
  })
)
export class Blog extends React.Component<any, any> {

  componentWillMount() {
    this.props.fetchSubapp({
      permalink: '/blog/*'
    });
  }

  render() {

    let { portfolio } = this.props;
    let blog = portfolio.filter((post) => post.permalink.slice(0, 5) === '/blog');
    let [first, ...rest] = blog;
    let mediaQuery = window && innerWidth < 768;

    return (
      <div style={styles.root}>
        <div style={{...styles.article, padding: window && innerWidth < 768 ? '0' :  '1.5em'}}>
          <a href='/blog/rss.xml' style={styles.rss}><Icon type="rss" /></a>
          {first ? <BlogPost style={{ height: 480, width: '100%' }} {...first} /> : null}
          {
            rest.map((post, key) => <BlogPost style={{ width:  mediaQuery ? '100%' : '50%' }} key={key} {...post} />)
          }
        </div>
      </div>);
  }
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
    padding: '2em 1em 1em'
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
    backgroundPosition: 'center',
    //margin: '2%',
    //borderRadius: '.5em'
  }
}