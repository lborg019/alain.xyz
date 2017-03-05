import * as React from 'react';
import { Link } from 'react-router-dom';

/**
 * A Menu composed of nested <ul> components.
 */
export class NestedMenu extends React.Component<any, any> {

  static defaultProps = {
    structure: {
      about: '',
      portfolio: {
        research: '',
        apps: '',
        libraries: ''
      },
      blog: ''
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
      pathname = '/'
    } = this.props;

    let capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
      <ul style={{ ...styles.root, ...style }}>
        {Object.keys(structure).map(
          (v, k) => {

            let p = {
              style: {
                ...styles.link,
                backgroundColor: pathname === (root + '/' + v)
                  ? 'rgba(78, 160, 232, 0.74)'
                  : 'rgba(23,26,30,0.11)',
                borderLeft: pathname === (root + '/' + v)
                  ? 'rgba(78, 160, 232, 1) .5em solid'
                  : 'rgba(78, 160, 232, 0.33) .2em solid'
              },
              to: `${root + '/' + v}`,
              children: capitalize(v)
            };

            let link = <Link {...p} />;

            let isObj = typeof structure[v] === 'object';

            return (
              <li key={k} style={styles.li}>
                {
                  isObj
                    ? link
                    : null}
                {isObj
                  ? <NestedMenu
                    pathname={pathname} root={root + '/' + v}
                    style={{ paddingLeft: '1em' }}
                    structure={structure[v]} />
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
  li: {


  },
  link: {
    display: 'block',
    padding: '.75em 0 .75em .5em',
    margin: '.2em',
    background: 'rgba(23,26,30,0.11)',
    transition: 'border-left .3s, background-color .3s'
  }
}