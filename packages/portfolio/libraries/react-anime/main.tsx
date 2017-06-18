import * as React from 'react';
import Anime from 'react-anime';

export default class ReactAnime extends React.Component<any, any> {
  render() {

    let { title, description, image, meta, datePublished, keywords, data } = this.props.config;

    let mapRender = arr =>
      arr.map(({
        type,
        props
      }, i) => React.createElement(type, { ...props, key: i }));

    return (
      <div style={{ width: '100%', height: '100%', userSelect: 'none', cursor: 'default' }}>
        <svg style={styles.article} viewBox="0 0 280 144">
          <LineAnime delay={(_, i) => 120 * i}>
            {mapRender([...components.line.react, ...components.line.anime])}
          </LineAnime>
        </svg>
        <p style={{ padding: '1.5em', textAlign: 'center', maxWidth: 960 }}><a href="http://npm.im/react-anime"><img alt="Npm Package" src="https://img.shields.io/npm/v/react-anime.svg?style=flat-square" /></a>
          <a href="https://opensource.org/licenses/MIT"><img src="http://img.shields.io/:license-mit-blue.svg?style=flat-square" /></a>
          <a href="https://travis-ci.org/hyperfuse/react-anime"><img alt="Unit Tests" src="https://img.shields.io/travis/hyperfuse/react-anime.svg?style=flat-square" /></a>
          <a href="https://codecov.io/gh/hyperfuse/react-anime"><img alt="Coverage Tests" src="https://img.shields.io/codecov/c/github/hyperfuse/react-anime.svg?style=flat-square" /></a>
          <a href="https://david-dm.org/hyperfuse/react-anime?path=packages/react-anime"><img alt="Dependency Status" src="https://david-dm.org/hyperfuse/react-anime.svg?path=packages/react-anime&amp;style=flat-square" /></a>
          <a href="https://david-dm.org/hyperfuse/react-anime?path=packages/react-anime#info=devDependencies"><img alt="devDependency Status" src="https://david-dm.org/hyperfuse/react-anime/dev-status.svg?path=packages/react-anime&amp;style=flat-square" /></a>
          <a href="https://gitter.im/react-anime/Lobby?utm_source=badge&amp;utm_medium=badge&amp;utm_campaign=pr-badge&amp;utm_content=badge"><img alt="Join the chat at https://gitter.im/react-anime/Lobby" src="https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square" /></a></p>
        <article style={styles.article} dangerouslySetInnerHTML={{ __html: data }} />
      </div>
    );
  }
}

class LineAnime extends React.Component<any, any> {
  render() {
    let props = {
      easing: 'easeOutQuad',
      duration: 1500,
      strokeDashoffset: el => {
        var pathLength = 0;
        if (el.getTotalLength) {
          pathLength = el.getTotalLength();
          el.setAttribute('stroke-dasharray', pathLength);
        }
        return [pathLength, 0];
      },
      ...this.props
    };
    return <Anime {...props} />;
  }
}

const styles = {
  article: {
    width: '100%',
    maxWidth: 960,
    padding: '1.5em'
  },
  letters: { display: 'block' },
  line: {
    red: {
      fill: 'none',
      stroke: '#F60051',
      strokeWidth: 14,
      strokeMiterlimit: 10
    },
    green: {
      fill: 'none',
      stroke: '#27F986',
      strokeWidth: 14,
      strokeMiterlimit: 10
    },
    blue: {
      fill: 'none',
      stroke: '#587DF9',
      strokeWidth: 14,
      strokeMiterlimit: 10
    },
    circle: {
      fill: '#27F986'
    }
  },
  solid: {
    red: {
      fill: 'none',
      strokeWidth: 1,
      strokeMiterlimit: 10,
      stroke: '#f60051'
    },
    green: {
      fill: 'none',
      strokeWidth: 1,
      strokeMiterlimit: 10,
      stroke: '#27f986'
    },
    blue: {
      fill: 'none',
      strokeWidth: 1,
      strokeMiterlimit: 10,
      stroke: '#587df9'
    }
  }
};

// Logo SVG Components
const components = {
  // Thick 13px lines
  line: {
    react: [
      {
        type: 'line',
        props: {
          style: styles.line.green,
          x1: '214.25',
          y1: '38',
          x2: '258.25',
          y2: '38'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.red,
          d: 'M68.25,45c0-11.598-9.402-21-21-21s-21,9.402-21,21v28'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.green,
          d: 'M258.25,66c-11.598,0-21-9.402-21-21V15'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.red,
          d: 'M75.25,66c-11.598,0-21-9.402-21-21'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.blue,
          d: 'M145.25,66c-11.598,0-21-9.402-21-21s9.402-21,21-21s21,9.402,21,21v28'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.green,
          d: 'M103.25,66c-11.598,0-21-9.402-21-21s9.402-21,21-21s21,9.402,21,21v7h-21'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.red,
          d: 'M214.25,24h-27c-11.598,0-21,9.402-21,21s9.402,21,21,21h27'
        }
      }
    ],
    anime: [
      {
        type: 'path',
        props: {
          style: styles.line.blue,
          d: 'M47.3,122c-11.6,0-21-9.4-21-21s9.4-21,21-21s21,9.4,21,21v28'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.red,
          d: 'M68.3,129V73'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.red,
          d: 'M68.3,129v-28c0.3-11.6,9.4-21,21-21s21,9.4,21,21v28'
        }
      },
      { type: 'path', props: { style: styles.line.blue, d: 'M124.3,129V73' } },
      {
        type: 'path',
        props: {
          style: styles.line.blue,
          d: 'M124.3,129v-28c0.3-11.6,9.4-21,21-21s21,9.4,21,21v28'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.red,
          d: 'M166.3,129v-28c0.4-11.6,9.4-21,21-21s21,9.4,21,21v28'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.green,
          d: 'M229.3,122c-11.6,0-21-9.4-21-21s9.4-21,21-21s21,9.4,21,21v7h-21'
        }
      },
      {
        type: 'path',
        props: {
          style: styles.line.green,
          d: 'M110.25,94v7c0,11.598,9.402,21,21,21'
        }
      }
    ],
    circle: {
      type: 'ellipse',
      props: {
        style: styles.line.circle,
        cx: '110.25',
        cy: '80',
        rx: '7',
        ry: '7'
      }
    }
  }
};