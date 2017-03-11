import * as React from 'react';
import { Link } from 'react-router-dom';

/**
 * A Menu composed of nested <ul> components.
 */
export class NestedMenu extends React.Component<any, any> {

  static defaultProps = {
    structure: {
      about: 'about',
      portfolio: {
        //buisnesses: '?tag=businesses',
        research: '?tag=research',
        //courses: '?tag=courses',
        //books: '?tag=books',
        apps: '?tag=apps',
        libraries: '?tag=libraries',
        //podcast: '?tag=podcast',
        //art: '?tag=art',
        //music: '?tag=music'
      },
      blog: 'blog'
    },
    root: '',
    style: {},
    liStyles: {}
  }

  render() {
    let {
      structure,
      root,
      style,
      location
    } = this.props;

    let {
      pathname,
      search
    } = location;

    let capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
      <ul style={{ ...styles.root, ...style }}>
        {Object.keys(structure).map(
          (v, k) => {
            let obj = structure[v];

            let isObj = typeof obj === 'object';

            let to = root + '/' + (isObj ? v : structure[v]);

            let p = {

              style: {
                ...styles.link,
                backgroundColor: (pathname + search) === to
                  ? 'rgba(78, 160, 232, 0.74)'
                  : 'rgba(23, 26, 30, 0.11)',
                borderLeft: (pathname + search) === to
                  ? 'rgba(78, 160, 232, 1) .5em solid'
                  : 'rgba(78, 160, 232, 0.33) .2em solid'
              },

              to,

              children: capitalize(v)
            };

            let link = <Link {...p} />;

            return (
              <li key={k}>
                {
                  isObj
                    ? link
                    : null}
                {isObj
                  ? <NestedMenu
                    location={location} root={root + '/' + v}
                    style={{ paddingLeft: '1em' }}
                    structure={obj} />
                  : link}
              </li>)
          })}
      </ul>
    );
  }
}

const styles = {
  root: {
    fontSize: '.875rem',
    fontWeight: 200
  },
  link: {
    display: 'block',
    padding: '.75em 0 .75em .5em',
    margin: '.2em',
    background: 'rgba(23,26,30,0.11)',
    transition: 'border-left .3s, background-color .3s'
  }
}