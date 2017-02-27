import * as React from 'react';
import { Icon } from './icon';
import resume from '../store/resume';

/**
 * All social media featured in Alain.xyz
 */
export class SocialBar extends React.Component<SocialBarProps, SocialBarState> {

  state = {
    shrink: true
  }

  toggleShrink = () =>
    this.setState(({ shrink }) => ({ shrink: !shrink }))

  render() {

    let { shrink } = this.state;
    let { social } = resume;

    if (shrink)
      social = social.slice(0, 3);

    let mediaQuery = window && innerWidth < 480;

    let mq = mediaQuery
      ? {
        bottom: 0,
        justifyContent: 'inherit'
      }
      : {
        top: 0,
        justifyContent: 'flex-end'
      }

    return (
      <div style={{ ...styles.root, ...mq, ...this.props.style }}>
        {social.map(
          ({ name, url }, key) =>
            <a key={key}
              href={url}
              style={styles.icon}>
              <Icon type={name} />
            </a>
        )}
        <a style={styles.icon} onClick={this.toggleShrink}>
          <svg viewBox="0 0 16 16"
            style={styles.more.root}>
            <line style={{
              ...styles.more.line,
              transform: `rotateZ(${shrink ? 0 : 90}deg)`,
              transformOrigin: '50% 50%',
              transition: 'transform .5s ease-out'
            }} x1="8" y1="2" x2="8" y2="14" />
            <line style={styles.more.line} x1="2" y1="8" x2="14" y2="8" />
          </svg>
        </a>

      </div>
    );
  }

}

type SocialBarProps = {
  style?: any
}

type SocialBarState = {
  shrink: boolean
}

const styles = {
  root: {
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    overflowX: 'hidden',
    overflowY: 'hidden',
    padding: '.5em 1em',
    position: 'fixed',
    zIndex: 30
  },
  icon: {
    paddingRight: '1em'
  },
  more: {
    root: {
      width: 16,
      height: 16,
      verticalAlign: 'middle'
    },
    line: {
      stroke: 'currentcolor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeMiterlimit: 10
    }
  }
}

