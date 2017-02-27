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
    root: ''
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
              style: { color: pathname === (root + '/' + v) ? '#639dcc' : '#fff' },
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
                  ? <NestedMenu pathname={pathname} root={root + '/' + v} structure={structure[v]} />
                  : link}
              </li>)
          })}
      </ul>
    );
  }
}

const styles = {
  root: {
    paddingLeft: '1em',
    fontSize: '1.1rem'
  },
  li: {
    padding: '1.5em 0 0 0'
  }
}