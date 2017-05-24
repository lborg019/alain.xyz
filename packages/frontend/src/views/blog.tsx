import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, grid } from '../components';
import { fetchSubapp } from '../store/actions';
import { mobileQuery } from '../store'
import { timeSince } from '../utils';

const BlogPost = ({ image, title, description, permalink, datePublished, dateModified, keywords, style = {} }) => {

  let published = new Date(datePublished);
  let publishedStr = published.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });

  let updated = new Date(dateModified);
  
  // Get Time elapsed string
  let updatedStr = timeSince(updated);

  return (
    <Link to={permalink} style={{ ...styles.blogPost, ...style, backgroundImage: `url('${image}')` }}>
      <section style={{
        backgroundImage: 'linear-gradient(rgba(33, 37, 43, 0), rgba(33, 37, 43, .5) 40%, rgb(33, 37, 43))', 
        width: '100%', 
        padding: '1.5em'
        }}>
        <h2 style={{ color: '#fff'}}>{title}</h2>
        <p style={{ fontSize: '.75em', color: 'rgba(255,255,255,0.8)'}}>
          <Icon type='date' style={{marginRight: '.5em'}}/>
          {published.toLocaleDateString()} @ {publishedStr} {updatedStr ? `| Updated ${updatedStr} ago` : null}
          </p>
        <p style={{lineHeight: '1.25em', color: '#fff'}}>{description}</p>
      </section>
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

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.title = 'Alain Galvan | Blog';
      scrollTo(0,0);
    }
  
  }

  render() {

    let { portfolio } = this.props;
    let blog = portfolio.filter((post) => post.permalink.slice(0, 5) === '/blog');
    let [first, ...rest] = blog;

    return grid(BlogPost, blog);
  }
}

const styles = {
  blogPost: {
    display: 'flex',
    height: 280,
    alignItems: 'flex-end',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}