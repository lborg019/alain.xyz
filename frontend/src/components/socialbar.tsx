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

    let iconProps = {
      size: 12
    }
    return (
      <div style={{ ...styles.root, ...this.props.style }}>
        {social.map(
          ({ name, url }, key) =>
            <a key={key}
              href={url}
              style={styles.icon}>
              <Icon type={name} {...iconProps} />
            </a>
        )}
        <a onClick={this.toggleShrink}>
          <svg viewBox='0 0 12 12'
            style={styles.more.root}>
            <line style={{
              ...styles.more.line,
              transform: `rotateZ(${shrink ? 0 : 90}deg)`,
              transformOrigin: '50% 50%',
              transition: 'transform .5s ease-out'
            }} x1='6' y1='1.5' x2='6' y2='10.5' />
            <line style={styles.more.line} x1='1.5' y1='6' x2='10.5' y2='6' />
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
    width: 'calc(100% - 5em)',
    display: 'flex',
    alignItems: 'center',
    overflowX: '-moz-scrollbars-none, scroll',
    overflowY: 'hidden',
    paddingRight: '2em',
    zIndex: 30
  },
  icon: {
    paddingRight: '1em'
  },
  more: {
    root: {
      width: 12,
      height: 12,
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

