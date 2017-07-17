import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, grid } from '../components';
import { fetchSubapp } from '../store/actions';
import { mobileQuery, tabletQuery } from '../store'
import { timeSince } from '../utils';

const BlogPost = ({ image, title, description, permalink, datePublished, dateModified, keywords, style = {} }) => {

  let published = new Date(datePublished);
  let publishedStr = published.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });

  let updated = new Date(dateModified);

  // Get Time elapsed string
  let updatedStr = timeSince(updated);

  return (
    <Link to={permalink} style={{ ...styles.blogPost }}>
      <h2 style={{ color: '#fff', padding: '1em 0.5em 0.5em 0.5em' }}>{title}</h2>
      <p style={{ fontSize: '.75em', color: 'rgba(255,255,255,0.8)', padding: '0em 2em' }}>
        <Icon type='date' style={{ marginRight: '.5em' }} />
        {published.toLocaleDateString()} @ {publishedStr} {updatedStr ? `| Updated ${updatedStr} ago` : null}
      </p>
      <div style={{ padding: `1.5em ${tabletQuery ? '0' : '3em'}` }}>
        <img src={image} style={{
          width: '100%',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.36)'
        }}>
        </img>
      </div>
      <p style={{ lineHeight: '1.25em', color: '#fff', padding: '1em 0.5em 2em 0.5em', borderBottom: '2px solid #171a1e', fontWeight: 200 }}>{description}</p>
    </Link>
  );
}

@(connect(
  ({ portfolio }) => ({
    portfolio
  }),
  dispatch => ({
    fetchSubapp: bindActionCreators(fetchSubapp, dispatch)
  })
) as any)
export class Blog extends React.Component<any, any> {

  componentWillMount() {
    this.props.fetchSubapp({
      permalink: '/blog/*'
    });

  }

  render() {

    let { portfolio } = this.props;
    let blog = portfolio.filter((post) => post.permalink.slice(0, 5) === '/blog');

    return (
      <div style={styles.root as any}>
        <div style={{ maxWidth: 1280, padding: !tabletQuery ? '1.5em' : '' }}>
          {blog.map((post, i) => <BlogPost key={i} {...post} />)}
        </div>
      </div>
    );
  }
}

const styles = {
  root: {
    width: '100%',
    display: 'flex',
    userSelect: 'none',
    flexDirection: 'column',
    color: '#fff'
  },
  blogPost: {
    display: 'flex',
    flexDirection: 'column',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}