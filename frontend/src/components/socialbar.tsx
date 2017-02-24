import * as React from 'react';
import { StaggeredMotion, Motion, spring } from 'react-motion';
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

    return (
      <div style={styles.root}>
        <StaggeredMotion
          defaultStyles={
            resume.social.map(v => ({ x: shrink ? 1 : 0 }))
          }
          styles={
            ss =>
              ss.map((_, i) =>
                (i === 0) ? { x: spring(shrink ? 1 : 0, { stiffness: 240, damping: (i + 1) * 32 }) } :
                  { x: spring(ss[i - 1]['x'], { stiffness: 240, damping: (i + 1) * 32 }) }
              )}>
          {ss => <div>
            {social.map(
              ({ name: type, url }, key) =>
                <a key={key}
                  href={url}
                  style={{ ...styles.icon, opacity: ss[key].x }}>
                  <Icon type={type} />
                </a>
            )}
          </div>
          }
        </StaggeredMotion>
        <a style={styles.icon} onClick={this.toggleShrink}>
          <svg viewBox="0 0 16 16"
            style={styles.more.root}>
            <Motion
              defaultStyle={{ y: shrink ? 0 : 6 }}
              style={{ y: spring(shrink ? 0 : 6) }}>
              {({ y }) => <line style={styles.more.line} x1="8" y1={8 - y} x2="8" y2={8 + y} />}
            </Motion>
            <line style={styles.more.line} x1="2" y1="8" x2="14" y2="8" />
          </svg>
        </a>

      </div>
    );
  }

}

type SocialBarProps = {

}

type SocialBarState = {
  shrink: boolean
}

const styles = {
  root: {
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: window && (innerWidth / innerHeight > 1) ? 'flex-end' : 'inherit',
    overflowX: 'scroll',
    overflowY: 'hidden'
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

