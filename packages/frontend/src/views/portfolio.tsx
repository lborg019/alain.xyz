import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Icon } from '../components';
import { fetchSubapp, mobileQuery } from '../store';

@connect(
  ({ portfolio }) => ({ portfolio }),
  dispatch => ({
    fetchSubapp: bindActionCreators(fetchSubapp, dispatch)
  })
)
export class Portfolio extends React.Component<Props, any> {

  static defaultProps = {
    location: {
      pathname: 'portfolio'
    }
  }

  state = {
    category: ''
  }

  componentWillMount() {
    let category = this.props.location.pathname;
    category = category.substr(1, category.length);
    this.setState(() => ({ category }));

    this.props.fetchSubapp({ tags: [category] });
  }

  render() {
    let { category } = this.state;
    let { portfolio } = this.props;
    let blog = portfolio.filter((post) => post.tags.indexOf(category) !== -1);
    let [first, ...rest] = blog;
    let a = [];

    return (
      <div style={styles.root}>
        <div style={{...styles.article, padding: 0}}>
          {first ? <Post style={{ height: 480, width: '100%' }} {...first} /> : null}
          {
            rest.map((post, key) => <Post style={{ width:  mobileQuery ? '100%' : '50%' }} key={key} {...post} />)
          }
        </div>
      </div>);


  }
}

const Post = ({ cover, title, description, permalink, publishDate, tags, style = {} }) => {

  let date = new Date(publishDate);

  return (
    <Link to={permalink} style={{ ...style, backgroundImage: `url('${cover}')` }}>
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

const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  article: {

  }
}

type Props = {
  location: {
    pathname: string
  },
  fetchSubapp: typeof fetchSubapp,
  portfolio: any[]
}