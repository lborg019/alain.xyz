import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSubapp } from '../store/actions';

import Anime from 'react-anime';

const styles = {
  articleContainer: {
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  article: {
    width: '100vw',
    maxWidth: 960,
    padding: 16
  },
  blogPost: {
    display: 'flex',
    height: 320,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '1.5em',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}

const BlogPost = ({cover, title, description, permalink}) =>
  <Link to={permalink} style={{...styles.blogPost, backgroundImage: `url('${cover}')` }}>
    <section style={{ textAlign: 'right' }}>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  </Link>;


@connect(
  (store) => ({
    portfolio: store.portfolio
  }),
  (dispatch) => ({
    fetchSubapp:  bindActionCreators(fetchSubapp, dispatch)
  })
)
export class Blog extends React.Component<any, any> {

  componentWillMount() {
    this.props.fetchSubapp({
      permalink: '/blog/*'
    });
  }

  render() {
    return (
      <div style={styles.articleContainer}>
      <div style={styles.article}>
          {
            this.props.portfolio
              .filter((post) => post.permalink.slice(0, 5) === '/blog')
              .map((post, key) => <BlogPost key={key} {...post} />)
          }
        </div>
      </div>);
  }
}
