import * as React from 'react';
import { Motion, StaggeredMotion, spring } from 'react-motion';
import { Link } from 'react-router-dom';

const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0))',
    zIndex: 100,
    position: 'relative'
  },
  img: {
    width: 96
  },
  span: {
    borderBottom: '1px inset #fff',
    width: 24
  },
  a: {
    padding: 16
  }
}

/**
 * The Header/Hero for Alain.xyz
 */
export class Hero extends React.Component<any, any> {

  static defaultProps = { shrink: false };

  render() {
    return (innerWidth > 640) ? (
      <Motion
        defaultStyle={{
          height: window.innerHeight,
          opacity: 0
        }}

        style={{
          height: spring((this.props.shrink) ? 120 : window.innerHeight),
          opacity: spring(1, { stiffness: 20, damping: 4 })
        }}>
        {
          (iStyle) =>
            <StaggeredMotion
              defaultStyles={[
                { x: 48 },
                { x: 32 },
                { x: 16 }
              ]}
              styles={(pStyles: any) =>
                pStyles.map((_, i) =>
                  (i === 0) ? { x: spring(0, { stiffness: 240, damping: (i + 1) * 32 }) } :
                    { x: spring(pStyles[i - 1]['x'], { stiffness: 240, damping: (i + 1) * 32 }) })}>
              {
                (sStyles) =>
                  <nav style={{ ...styles.root, ...iStyle }}>
                    <span style={{ ...styles.span, transform: `translateX(${-sStyles[2].x}px)` }} />

                    <Link style={{ ...styles.a, transform: `translateX(${-sStyles[0].x}px)` }} to='/blog'>Blog</Link>
                    <Link to='/'>
                      <img style={styles.img} src="/assets/brand/ag-logo.svg" alt="Logo" />
                    </Link>
                    <Link style={{ ...styles.a, transform: `translateX(${sStyles[0].x}px)` }} to='/about'>About</Link>

                    <span style={{ ...styles.span, transform: `translateX(${sStyles[2].x}px)` }} />
                  </nav>
              }
            </StaggeredMotion>
        }
      </Motion>
    ) :
      (<nav style={{
        ...styles.root,
        height: (this.props.shrink) ? 120 : innerHeight,
      }}>
        <span style={styles.span} />

        <Link style={styles.a} to='https://alain.xyz/blog/'>Blog</Link>
        <Link to='/'>
          <img style={styles.img} src="/assets/brand/ag-logo.svg" alt="Logo" />
        </Link>
        <Link style={styles.a} to='/about'>About</Link>

        <span style={styles.span} />
      </nav>)
  }
}
